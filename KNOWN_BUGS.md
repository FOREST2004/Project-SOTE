# Known Bugs - Software Testing Assignment

**Purpose:** Demonstrating bug discovery and testing skills
**Total Bugs:** 9 bugs (3 per person, matching 3 failed test cases each)

---

## 👤 NGƯỜI 1 - Authentication Module (3 Bugs)

### BUG 1: No Maximum Length Validation for Registration fullName
**File:** `server/src/services/auth.service.js:29-31`
**Test Case:** REG-008
**Status:** ❌ FAIL

**Description:**
Registration does not validate maximum length for `fullName`. Users can register with extremely long names (>100 characters), which may cause:
- Database storage issues
- UI display problems
- Performance degradation

**Expected:** Should reject fullName > 100 characters with 400 error
**Actual:** Accepts any length fullName

**To Fix:**
```javascript
if (fullName.length > 100) {
  throw new BadRequestError('Full name must not exceed 100 characters');
}
```

---

### BUG 2: Password with Only Spaces Accepted in Registration
**File:** `server/src/services/auth.service.js:21-26`
**Test Case:** REG-009
**Status:** ❌ FAIL

**Description:**
Registration does not reject passwords containing only whitespace characters. A password like "     " (5 spaces) passes validation because we only check `password === ''` instead of `password.trim() === ''`.

**Impact:**
- Allows users to register with invalid passwords (only spaces)
- Users cannot login later (bcrypt hash won't match spaces)
- Poor user experience and data quality

**Expected:** Should reject password with only spaces with 400 error
**Actual:** Creates user with password="     ", Status 201

**Example:**
```
Input: email="test@example.com", password="     ", fullName="Test"
Expected: Status 400, "Password is required"
Actual: Status 201, user created ❌ (but cannot login later)
```

**To Fix:**
```javascript
if (!password || password.trim() === '') {
  throw new BadRequestError('Password is required');
}
```

---

### BUG 3: No Maximum Length Validation for Profile Update fullName
**File:** `server/src/services/auth.service.js:134-136`
**Test Case:** PRO-010
**Status:** ❌ FAIL

**Description:**
Profile update does not validate maximum length for `fullName`. Users can update their name to extremely long values (>500 characters), causing:
- Database field overflow
- UI layout breaking
- API response size issues

**Expected:** Should reject fullName > 500 characters with 400 error
**Actual:** Accepts any length fullName

**To Fix:**
```javascript
if (fullName && fullName.length > 500) {
  throw new BadRequestError('Full name must not exceed 500 characters');
}
```

---

## 🎫 NGƯỜI 2 - Booking & Showtime Module (3 Bugs)

### BUG 4: No Duplicate Seats Validation in Booking Request
**File:** `server/src/services/bookings.service.js:20-23`
**Test Case:** BOK-006
**Status:** ❌ FAIL

**Description:**
Booking creation does not check for duplicate seats within the same request. Users can submit `seats: ["A1", "A1", "A1"]`, resulting in:
- Incorrect total price calculation (charged multiple times for same seat)
- Database inconsistency
- Unfair seat allocation

**Expected:** Should reject booking with 400 error: "Duplicate seats in request"
**Actual:** Accepts duplicate seats, books only once but charges incorrectly

**To Fix:**
```javascript
const uniqueSeats = new Set(seats);
if (uniqueSeats.size !== seats.length) {
  throw new BadRequestError('Duplicate seats in request');
}
```

---

### BUG 5: No Check for Already Cancelled Booking
**File:** `server/src/services/bookings.service.js:128-131`
**Test Case:** CAN-004
**Status:** ❌ FAIL

**Description:**
Cancellation does not check if booking is already cancelled. Users can cancel the same booking multiple times, which may cause:
- Confusing audit logs
- Potential data integrity issues
- Poor user experience

**Expected:** Should reject with 400 error: "Booking is already cancelled"
**Actual:** Returns 200 success even when booking already cancelled

**Example:**
```
1st cancel: Status 200, "Booking cancelled successfully" ✓
2nd cancel: Status 200, "Booking cancelled successfully" ❌ (should be 400)
```

**To Fix:**
```javascript
if (booking.status === 'CANCELLED') {
  throw new BadRequestError('Booking is already cancelled');
}
```

---

### BUG 6: Accepts Seat Number = 0 (Invalid Seat)
**File:** `server/src/services/bookings.service.js:61-64`
**Test Case:** BOK-012
**Status:** ❌ FAIL

**Description:**
Seat validation allows seat number = 0 (e.g., A0, B0), which are invalid seats. The validation checks `seatNum < 0` instead of `seatNum < 1`, causing:
- Invalid seat bookings
- Database records seats that don't exist
- User confusion

**Expected:** Should reject seats A0, B0, etc. with 400 error
**Actual:** Accepts A0, B0 as valid seats

**Example:**
- Input: seats=["A0", "B0"]
- Expected: Status 400, "Invalid seats for this room: A0, B0"
- Actual: Status 201, booking created ❌

**To Fix:**
```javascript
// Change from: seatNum < 0
// To:
return rowIndex >= showtime.room.rows || seatNum > showtime.room.seatsPerRow || seatNum < 1;
```

---

## 🎬 NGƯỜI 3 - Movies, Reviews & Admin Module (3 Bugs)

### BUG 7: No Range Validation for Review Rating (> 5)
**File:** `server/src/services/reviews.service.js:13-15`
**Test Case:** REV-004
**Status:** ❌ FAIL

**Description:**
Review creation does not validate rating maximum value. Users can submit rating > 5 (e.g., rating=10, rating=100), causing:
- Incorrect average rating calculation
- UI star rating display errors
- Data integrity issues

**Expected:** Should reject rating > 5 with 400 error: "Rating must be between 1-5"
**Actual:** Accepts any rating value (6, 10, 100, etc.)

**To Fix:**
```javascript
if (rating < 1 || rating > 5) {
  throw new BadRequestError('Rating must be between 1 and 5');
}
```

---

### BUG 8: No Range Validation for Review Rating (< 1)
**File:** `server/src/services/reviews.service.js:13-15`
**Test Case:** REV-005
**Status:** ❌ FAIL

**Description:**
Review creation does not validate rating minimum value. Users can submit rating < 1 (e.g., rating=0, rating=-5), causing:
- Negative or zero average ratings
- UI display issues
- Business logic errors (ratings should be 1-5 stars)

**Expected:** Should reject rating < 1 with 400 error: "Rating must be between 1-5"
**Actual:** Accepts any rating value (0, -1, -100, etc.)

**To Fix:**
```javascript
if (rating < 1 || rating > 5) {
  throw new BadRequestError('Rating must be between 1 and 5');
}
```

**Note:** BUG 7 and BUG 8 share the same fix (range validation).

---

### BUG 9: No Validation for Movie Title Required
**File:** `server/src/services/admin.service.js:52-69`
**Test Case:** ADM-008
**Status:** ❌ FAIL

**Description:**
Create movie validates description and genre but "forgets" to validate title. Admin can create movies with empty title (`title=""`), causing:
- Movies without names in the system
- UI display issues
- Search and filter problems
- Poor data quality

**Expected:** Should reject with 400 error: "Title is required"
**Actual:** Creates movie successfully with empty title

**Example:**
```javascript
POST /api/admin/movies
{
  "title": "",
  "description": "A great movie",
  "genre": "Action"
}
Expected: Status 400, "Title is required"
Actual: Status 201, movie created ❌
```

**To Fix:**
```javascript
if (!movieData.title || movieData.title.trim() === '') {
  throw new BadRequestError('Title is required');
}
```

---

## 📊 Summary

### By Severity:

**High (3 bugs):**
- BUG 4: Duplicate seats booking (payment issues)
- BUG 6: Invalid seat booking (data integrity)
- BUG 7, 8: Invalid review ratings (data quality)

**Medium (4 bugs):**
- BUG 1, 3: No max length validation (potential issues)
- BUG 5: No cancelled check (poor UX)
- BUG 9: No title validation (data quality)

**Low (2 bugs):**
- BUG 2: Password spaces validation (edge case)

### By Test Result:

- **9 bugs** → Test cases FAIL ❌

### Test Case Pass/Fail Summary:

| Person | Total TCs | Pass | Fail | Pass Rate |
|--------|-----------|------|------|-----------|
| Người 1 | 30 | 27 | 3 | 90% |
| Người 2 | 30 | 27 | 3 | 90% |
| Người 3 | 30 | 27 | 3 | 90% |
| **Total** | **90** | **81** | **9** | **90%** |

---

## 🔧 Priority Fix Order:

1. **BUG 7, 8** - Review rating validation (High - data quality)
2. **BUG 4** - Duplicate seats (High - payment issues)
3. **BUG 6** - Seat number = 0 (High - data integrity)
4. **BUG 9** - Movie title required (Medium - data quality)
5. **BUG 1, 3** - Max length validation (Medium)
6. **BUG 5** - Cancelled check (Medium - UX)
7. **BUG 2** - Password spaces (Low - edge case)

---

## ✅ Testing Recommendation:

Each team member should:
1. **Run all 30 test cases** for their module
2. **Document failures** (expected: 3 failures)
3. **Capture screenshots** of failed tests
4. **Write bug reports** with reproduction steps
5. **Propose fixes** in code review

**Expected Results:**
- ~27 test cases PASS ✅
- ~3 test cases FAIL ❌
- ~90% pass rate (realistic for initial testing phase)

Good luck testing! 🚀
