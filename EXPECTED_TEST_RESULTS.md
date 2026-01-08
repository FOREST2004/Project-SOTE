# Expected Test Results - Software Testing Assignment

## 📊 Test Execution Summary

**Total Test Cases:** 90
**Expected PASS:** 81-82 (~90%)
**Expected FAIL:** 8-9 (~10%)

**This is realistic for initial testing phase** - finding 10% bugs is expected in software testing.

---

## 👤 NGƯỜI 1 - Authentication & User Management

### Test Results Overview:
- **Total:** 30 test cases
- **Expected PASS:** 27-28 ✅
- **Expected FAIL:** 2-3 ❌
- **Pass Rate:** ~90%

### ❌ Test Cases that will FAIL:

#### 1. REG-008: Long fullName (100 characters)
```
Input: fullName with 100 characters
Expected: Status 400, "Full name too long"
Actual: Status 201, user created successfully
Reason: No max length validation in auth.service.js
Bug Reference: BUG 1 in KNOWN_BUGS.md
```

#### 2. LOG-009: Multiple login attempts (Performance Test)
```
Input: Login 5 times consecutively
Expected: All succeed (no throttling yet)
Actual: All succeed
Result: PASS (but security vulnerability noted)
Bug Reference: BUG 2 (Feature not implemented)
```
**Note:** This technically PASSES functionally, but represents a security gap.

#### 3. PRO-010: Very long fullName update (500 characters)
```
Input: fullName with 500 characters
Expected: Status 400, "Full name too long"
Actual: Status 200, profile updated
Reason: No max length validation in updateProfile
Bug Reference: BUG 3 in KNOWN_BUGS.md
```

### ✅ Test Cases that will PASS (27 cases):
All other authentication test cases have proper validation:
- Empty field validation (REG-002, REG-005, REG-006, LOG-002, LOG-006)
- Email format validation (REG-003, LOG-003)
- Duplicate email check (REG-004)
- Invalid credentials (LOG-004, LOG-005)
- Authorization checks (PRO-002, PRO-007)
- Case insensitive email (LOG-007)
- Empty fullName update (PRO-006) - correctly rejects
- Etc.

---

## 🎫 NGƯỜI 2 - Booking & Showtime Management

### Test Results Overview:
- **Total:** 30 test cases
- **Expected PASS:** 27 ✅
- **Expected FAIL:** 3 ❌
- **Pass Rate:** 90%

### ❌ Test Cases that will FAIL:

#### 1. BOK-006: Duplicate seats in request
```
Input: seats=["A1", "A1"]
Expected: Status 400, "Duplicate seats"
Actual: Status 201, booking created (charges incorrectly)
Reason: No duplicate check in booking creation
Bug Reference: BUG 4 in KNOWN_BUGS.md
```

#### 2. CAN-008: Cancel immediately after booking (Performance)
```
Input: Create booking, then immediately cancel
Expected: Status 200, cancelled successfully
Actual: Status 200 (but potential race condition)
Result: PASS functionally, but has concurrency issue
Bug Reference: BUG 5 (Race condition)
```
**Note:** Functionally PASSES, but has performance/concurrency issue.

#### 3. VIE-006: Verify seat availability calculation
```
Input: Showtime with some bookings
Expected: availableSeats = totalSeats - booked
Actual: availableSeats = totalSeats - booked + 1 (off by one)
Reason: Calculation error in showtimes.service.js
Bug Reference: BUG 6 in KNOWN_BUGS.md
```

**Example failure:**
- Room: 10 rows × 12 seats = 120 total
- Booked: 50 seats
- Expected available: 70
- **Actual available: 71** ❌

### ✅ Test Cases that will PASS (27 cases):
All other booking test cases have proper validation:
- Empty seats validation (BOK-003)
- Seat format validation (BOK-004, BOK-011, BOK-015)
- Seat conflict check (BOK-005, BOK-014)
- Seat bounds validation (BOK-007, BOK-012)
- Past showtime check (BOK-008, CAN-005)
- Authorization checks (BOK-013, CAN-003, CAN-006)
- Status validation (CAN-004)
- Etc.

---

## 🎬 NGƯỜI 3 - Movies, Reviews & Admin

### Test Results Overview:
- **Total:** 30 test cases
- **Expected PASS:** 27 ✅
- **Expected FAIL:** 3 ❌
- **Pass Rate:** 90%

### ❌ Test Cases that will FAIL:

#### 1. REV-004: Rating greater than 5
```
Input: rating=6
Expected: Status 400, "Rating must be 1-5"
Actual: Status 201, review created with rating=6
Reason: No range validation in reviews.service.js
Bug Reference: BUG 7 in KNOWN_BUGS.md
```

#### 2. REV-005: Rating less than 1
```
Input: rating=0
Expected: Status 400, "Rating must be 1-5"
Actual: Status 201, review created with rating=0
Reason: No range validation in reviews.service.js
Bug Reference: BUG 8 in KNOWN_BUGS.md
```

#### 3. ADM-008: Revenue calculation verification
```
Input: Check total revenue (with some cancelled bookings)
Expected: Revenue = sum of CONFIRMED bookings only
Actual: Revenue = sum of ALL bookings (including CANCELLED)
Reason: Missing status filter in admin.service.js
Bug Reference: BUG 9 in KNOWN_BUGS.md
```

**Example failure:**
- 10 CONFIRMED bookings × $100 = $1,000
- 5 CANCELLED bookings × $100 = $500
- Expected revenue: **$1,000**
- **Actual revenue: $1,500** ❌

### ✅ Test Cases that will PASS (27 cases):
All other movies/reviews/admin test cases work correctly:
- Search and filter (MOV-001 to MOV-007)
- Movie by ID (MOV-008, MOV-009)
- Trending movies (MOV-010, MOV-011)
- Rating type validation (REV-006) - correctly checks for number
- Rating boundary valid cases (REV-002, REV-003)
- Review creation (REV-001)
- Authorization checks (REV-007, ADM-002, ADM-003, ADM-005)
- Admin operations (ADM-001, ADM-004, ADM-006, ADM-007)
- Etc.

---

## 📝 Test Execution Instructions

### For Each Test Case:

1. **Setup:** Ensure database is seeded with test data
2. **Execute:** Run the test case with specified input
3. **Verify:** Check actual output against expected output
4. **Document:**
   - ✅ If PASS: Screenshot + note
   - ❌ If FAIL: Screenshot + detailed bug report

### Expected Documentation:

#### For Passing Tests:
```
TC-ID: REG-001
Status: ✅ PASS
Screenshot: reg-001-pass.png
Note: User registered successfully, token returned
```

#### For Failing Tests:
```
TC-ID: REG-008
Status: ❌ FAIL
Screenshot: reg-008-fail.png
Expected: Status 400, "Full name too long"
Actual: Status 201, user created
Bug ID: BUG-1
Severity: Medium
Notes: No max length validation for fullName field
```

---

## 🎯 Deliverables Per Person

Each person should submit:

1. **Test Execution Report (Excel/Google Sheets)**
   - All 30 test cases with status (PASS/FAIL)
   - Screenshots for each test
   - Actual vs Expected results

2. **Bug Reports (3 bugs per person)**
   - Bug ID, Title, Description
   - Steps to reproduce
   - Expected vs Actual
   - Severity, Priority
   - Suggested fix

3. **White-box Test Code (Jest)**
   - 3 functions with unit tests
   - Coverage report (≥80% statement, ≥75% branch)
   - Test all paths and branches

4. **Summary Document**
   - Pass rate: ~90%
   - Total bugs found: 3
   - Recommendations for fixes

---

## 🔍 Verification Checklist

### Before Submitting:

- [ ] All 30 test cases executed and documented
- [ ] 3 failing test cases identified and documented
- [ ] Bug reports written for all failures
- [ ] Screenshots captured for all tests
- [ ] White-box tests written and passing
- [ ] Coverage report generated
- [ ] Summary document completed

---

## 💡 Testing Tips

1. **Follow Test Cases Exactly:** Use the exact input specified in TESTING_ASSIGNMENT.md
2. **Document Everything:** Screenshots are evidence of testing
3. **Be Systematic:** Test in order, don't skip cases
4. **Note Edge Cases:** Boundary conditions are important
5. **Verify Fixes:** If you fix a bug, re-run the test to verify

---

## 🚀 Expected Timeline

- **Week 1:** Setup environment, run all black-box tests
- **Week 2:** Write white-box tests, generate coverage
- **Week 3:** Document bugs, write bug reports
- **Week 4:** Compile deliverables, prepare presentation

---

## ⚠️ Important Notes

1. **These bugs are intentional** for testing assignment purposes
2. **Do NOT fix bugs** until after testing is complete and documented
3. **90% pass rate is realistic** - real-world projects have similar rates
4. **Document thoroughly** - testing documentation is as important as testing itself

Good luck with your testing assignment! 🎯
