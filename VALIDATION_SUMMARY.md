# Code Validation Summary - Testing Assignment

## ✅ Completed Updates

Đã thêm validation vào code để **hầu hết test cases PASS**, nhưng **cố tình bỏ qua một số validation** để có **3 test cases FAIL cho mỗi người**.

---

## 📝 Files đã Update

### 👤 Người 1 - Authentication Module

**File updated:**
- ✅ `server/src/services/auth.service.js`

**Validations ADDED:**
1. ✅ Empty email check (REG-002, LOG-002)
2. ✅ Email format validation with regex (REG-003, LOG-003)
3. ✅ Empty password check (REG-005, LOG-006)
4. ✅ Empty fullName check (REG-006)
5. ✅ Duplicate email check - already existed (REG-004)
6. ✅ Empty fullName update check (PRO-006)

**Validations INTENTIONALLY OMITTED (Bugs):**
1. ❌ Max length for fullName in registration (>100 chars) → **REG-008 FAIL**
2. ❌ Rate limiting for login attempts → **LOG-009 PASS** (security issue noted)
3. ❌ Max length for fullName in profile update (>500 chars) → **PRO-010 FAIL**

**Result:** 27-28 PASS, 2-3 FAIL (~90% pass rate)

---

### 🎫 Người 2 - Booking & Showtime Module

**Files updated:**
- ✅ `server/src/services/bookings.service.js`
- ✅ `server/src/services/showtimes.service.js`

**Validations ADDED:**
1. ✅ Empty seats array check (BOK-003)
2. ✅ Seat format validation with regex `/^[A-Z]\d+$/` (BOK-004, BOK-011, BOK-015)
3. ✅ Seat conflict check - already existed (BOK-005, BOK-014)
4. ✅ Seat bounds validation - already existed (BOK-007, BOK-012)
5. ✅ Past showtime check - already existed (BOK-008, CAN-005)
6. ✅ Booking status checks - already existed (CAN-004)

**Validations/Logic INTENTIONALLY OMITTED (Bugs):**
1. ❌ Duplicate seats within request array → **BOK-006 FAIL**
2. ❌ Transaction handling for cancellation → **CAN-008 PASS** (race condition issue)
3. ❌ **INTENTIONAL ERROR:** Off-by-one in seat calculation (`+1`) → **VIE-006 FAIL**

**Result:** 27 PASS, 3 FAIL (90% pass rate)

---

### 🎬 Người 3 - Movies, Reviews & Admin Module

**Files updated:**
- ✅ `server/src/services/reviews.service.js`
- ✅ `server/src/services/admin.service.js`

**Validations ADDED:**
1. ✅ Rating type check (must be number) → REV-006 PASS
2. ✅ Movie exists check before creating review
3. ✅ Various admin authorization checks - already existed

**Validations INTENTIONALLY OMITTED (Bugs):**
1. ❌ Rating range validation (must be 1-5) → **REV-004 FAIL** (rating > 5)
2. ❌ Rating range validation (must be 1-5) → **REV-005 FAIL** (rating < 1)
3. ❌ **INTENTIONAL ERROR:** Removed status filter in revenue → **ADM-008 FAIL**

**Result:** 27 PASS, 3 FAIL (90% pass rate)

---

## 🎯 Overall Test Results

| Module | Total TCs | Expected PASS | Expected FAIL | Pass Rate |
|--------|-----------|---------------|---------------|-----------|
| Authentication | 30 | 27-28 | 2-3 | 90% |
| Booking | 30 | 27 | 3 | 90% |
| Movies/Reviews/Admin | 30 | 27 | 3 | 90% |
| **TOTAL** | **90** | **81-82** | **8-9** | **~90%** |

---

## 📦 Next Steps

### 1. Copy Updated Code to Person Folders

Bạn cần copy các files đã update vào folders của 3 người:

```bash
# Người 1
cp server/src/services/auth.service.js server_thu/src/services/auth.service.js

# Người 2
cp server/src/services/bookings.service.js server_tu/src/services/bookings.service.js
cp server/src/services/showtimes.service.js server_tu/src/services/showtimes.service.js

# Người 3
cp server/src/services/reviews.service.js server_nguoi3/src/services/reviews.service.js
cp server/src/services/admin.service.js server_nguoi3/src/services/admin.service.js
```

### 2. Re-create ZIP files

```bash
cd "/Users/romuncle/Software Testing/Project-SOTE"

# Remove old zips
rm -f nguoi1_auth.zip nguoi2_booking.zip nguoi3_movies.zip

# Create new zips with updated code
zip -r nguoi1_auth_v2.zip server_thu/ client_thu/ -x "*/node_modules/*" "*/dist/*"
zip -r nguoi2_booking_v2.zip server_tu/ client_tu/ -x "*/node_modules/*" "*/dist/*"
zip -r nguoi3_movies_v2.zip server_nguoi3/ client_nguoi3/ -x "*/node_modules/*" "*/dist/*"
```

### 3. Include Documentation Files

Mỗi người nên nhận:
- Code folder (server + client)
- `TESTING_ASSIGNMENT.md` - Danh sách test cases
- `KNOWN_BUGS.md` - Danh sách 9 bugs chi tiết
- `EXPECTED_TEST_RESULTS.md` - Kết quả expected cho mỗi test case

---

## 🐛 Bug Summary

### Critical Bugs (2):
- **BUG 6:** Off-by-one error in seat availability
- **BUG 9:** Revenue includes cancelled bookings

### High Bugs (4):
- **BUG 4:** Duplicate seats not checked
- **BUG 7, 8:** Rating range not validated

### Medium Bugs (2):
- **BUG 1, 3:** No max length validation

### Low Bugs (1):
- **BUG 2:** No rate limiting (security feature)

---

## ✅ Validation Coverage

### What Works (81-82 test cases):

**Authentication:**
- ✅ Email/password required checks
- ✅ Email format validation
- ✅ Duplicate email prevention
- ✅ Case-insensitive email
- ✅ Empty field validation
- ✅ Authorization checks

**Booking:**
- ✅ Seat format validation (uppercase + number)
- ✅ Seat conflict detection
- ✅ Seat bounds checking
- ✅ Past showtime prevention
- ✅ Authorization checks
- ✅ Booking status validation

**Movies/Reviews/Admin:**
- ✅ Rating type validation (must be number)
- ✅ Search and filter
- ✅ Movie existence checks
- ✅ Authorization for admin operations
- ✅ Review creation and retrieval

### What Doesn't Work (8-9 test cases):

**Authentication:**
- ❌ No max length (100) for registration fullName
- ⚠️ No rate limiting (security gap)
- ❌ No max length (500) for profile update fullName

**Booking:**
- ❌ No duplicate seats check in single request
- ⚠️ No transaction handling (race condition)
- ❌ Seat availability off-by-one error

**Movies/Reviews/Admin:**
- ❌ Rating can be > 5
- ❌ Rating can be < 1
- ❌ Revenue includes cancelled bookings

---

## 💡 Why 90% Pass Rate?

Đây là tỷ lệ realistic cho software testing:

1. **Real-world scenario:** Không phải software nào cũng perfect ngay lần đầu
2. **Demonstrates testing value:** Tìm ra 10% bugs shows testing effectiveness
3. **Learning opportunity:** Học cách document và report bugs
4. **Realistic expectations:** Production code thường có 5-15% bug rate after initial dev

---

## 📝 Testing Process

### For Each Person:

1. **Setup Environment**
   - Install dependencies
   - Setup database
   - Seed test data

2. **Run Black-box Tests (30 tests)**
   - Follow test cases in TESTING_ASSIGNMENT.md
   - Document each result (PASS/FAIL)
   - Take screenshots

3. **Document Bugs (3 bugs)**
   - Use KNOWN_BUGS.md as reference
   - Write detailed bug reports
   - Include reproduction steps

4. **Write White-box Tests (3 functions)**
   - Use Jest for unit testing
   - Achieve ≥80% statement coverage
   - Test all branches and paths

5. **Compile Deliverables**
   - Test execution report
   - Bug reports
   - Coverage reports
   - Summary document

---

## 🚀 Ready to Test!

Tất cả code đã được update với validation đầy đủ + 9 bugs cố tình để testing.

Mỗi người sẽ:
- ✅ Test 30 test cases
- ❌ Tìm ra 3 bugs trong module của mình
- 📝 Document thoroughly
- 🎯 Achieve ~90% pass rate

Good luck! 🎉
