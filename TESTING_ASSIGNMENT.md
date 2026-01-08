# Software Testing Assignment - Cinema Booking System

**Môn:** Software Testing
**Nhóm:** 3 người
**Nội dung:** White-box Testing (9 functions) + Black-box Testing (90 test cases)

---

## 📋 Phân công công việc

### Người 1: Authentication & User Management
- **White-box:** 3 functions
- **Black-box:** 30 test cases

### Người 2: Booking & Showtime Management
- **White-box:** 3 functions
- **Black-box:** 30 test cases

### Người 3: Movies, Reviews & Admin
- **White-box:** 3 functions
- **Black-box:** 30 test cases

---

## 🔬 PHẦN 1: WHITE-BOX TESTING (9 Functions)

### 👤 Người 1 - Authentication & User Management

#### 1. authService.register() - `server/src/services/auth.service.js:9-34`
**Độ phức tạp:** Medium
**Cyclomatic Complexity:** ~4

**Paths cần test:**
- Path 1: Email đã tồn tại → throw ConflictError
- Path 2: Email chưa tồn tại → tạo user thành công
- Path 3: Lowercase và trim email
- Path 4: Hash password và tạo JWT token

**Decision Points:**
- `if (existingUser)` - line 12

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Path coverage: Tất cả paths

---

#### 2. authService.login() - `server/src/services/auth.service.js:36-59`
**Độ phức tạp:** Medium
**Cyclomatic Complexity:** ~5

**Paths cần test:**
- Path 1: User không tồn tại → throw UnauthorizedError
- Path 2: Password sai → throw UnauthorizedError
- Path 3: Credentials đúng → return user + token
- Path 4: Email được lowercase và trim

**Decision Points:**
- `if (!user)` - line 42
- `if (!isValidPassword)` - line 48

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Condition coverage: password comparison

---

#### 3. authService.updateProfile() - `server/src/services/auth.service.js:74-103`
**Độ phức tạp:** Medium
**Cyclomatic Complexity:** ~6

**Paths cần test:**
- Path 1: User không tồn tại → throw NotFoundError
- Path 2: Update fullName only
- Path 3: Update password only
- Path 4: Update cả hai
- Path 5: Không update gì (updateData empty)

**Decision Points:**
- `if (!existingUser)` - line 80
- `if (fullName !== undefined)` - line 87
- `if (password !== undefined)` - line 91

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: All branches
- Multiple condition coverage

---

### 🎫 Người 2 - Booking & Showtime Management

#### 4. bookingsService.createBooking() - `server/src/services/bookings.service.js:7-75`
**Độ phức tạp:** High ⭐
**Cyclomatic Complexity:** ~10

**Paths cần test:**
- Path 1: Showtime không tồn tại → throw NotFoundError
- Path 2: Showtime trong quá khứ → throw BadRequestError
- Path 3: Ghế đã được đặt → throw ConflictError
- Path 4: Ghế không hợp lệ (vượt quá rows/seatsPerRow) → throw BadRequestError
- Path 5: Tất cả validation pass → tạo booking thành công
- Path 6: Multiple seats validation
- Path 7: Calculate totalPrice

**Decision Points:**
- `if (!showtime)` - line 21
- `if (new Date(showtime.startTime) < new Date())` - line 26
- `if (conflictSeats.length > 0)` - line 35
- `if (invalidSeats.length > 0)` - line 48

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Loop testing: seats.filter() loops
- Boundary testing: seat numbers, row indices

---

#### 5. bookingsService.cancelBooking() - `server/src/services/bookings.service.js:94-106`
**Độ phức tạp:** Medium-High
**Cyclomatic Complexity:** ~7

**Paths cần test:**
- Path 1: Booking không tồn tại → throw NotFoundError
- Path 2: Không phải booking của user → throw ForbiddenError
- Path 3: Booking đã bị cancel → throw BadRequestError
- Path 4: Showtime đã qua → throw BadRequestError
- Path 5: Cancel thành công

**Decision Points:**
- `if (!booking)` - line 79
- `if (booking.userId !== userId)` - line 84
- `if (booking.status === 'CANCELLED')` - line 89
- `if (new Date(booking.showtime.startTime) < new Date())` - line 94

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: All branches
- Authorization logic testing

---

#### 6. showtimesService.getShowtimeById() - `server/src/services/showtimes.service.js:6-46`
**Độ phức tạp:** Medium
**Cyclomatic Complexity:** ~5

**Paths cần test:**
- Path 1: Showtime không tồn tại → throw NotFoundError
- Path 2: Showtime có bookings → calculate seats
- Path 3: Showtime không có bookings → availableSeats = totalSeats
- Path 4: Parse JSON seats từ bookings

**Decision Points:**
- `if (!showtime)` - line 23
- flatMap logic - line 28

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Calculation logic: totalSeats, bookedSeatsCount, availableSeats

---

### 🎬 Người 3 - Movies, Reviews & Admin

#### 7. moviesService.getAllMovies() - `server/src/services/movies.service.js:6-79`
**Độ phức tạp:** High ⭐
**Cyclomatic Complexity:** ~12

**Paths cần test:**
- Path 1: No filters → return all movies
- Path 2: Search by title/description
- Path 3: Filter by genre
- Path 4: Sort by title-asc
- Path 5: Sort by title-desc
- Path 6: Sort by release-newest
- Path 7: Sort by release-oldest
- Path 8: Sort by rating-highest
- Path 9: Sort by rating-lowest
- Path 10: Combined filters + sort

**Decision Points:**
- `if (search)` - line 9
- `if (genre)` - line 16
- Multiple if-else for sortBy - lines 21-31
- Rating calculation logic - lines 58-69
- Post-query sorting - lines 72-76

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: All branches
- Multiple condition coverage
- Loop testing: map operations

---

#### 8. moviesService.getTrendingMovies() - `server/src/services/movies.service.js:145-199`
**Độ phức tạp:** Medium-High
**Cyclomatic Complexity:** ~6

**Paths cần test:**
- Path 1: No movies → return empty array
- Path 2: Movies with no bookings → bookingCount = 0
- Path 3: Movies with bookings → calculate bookingCount
- Path 4: Limit < total movies
- Path 5: Limit > total movies
- Path 6: Sort by bookingCount descending

**Decision Points:**
- reduce() for bookingCount - line 173
- Rating calculation - line 178
- Sort and slice - lines 196-198

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Calculation logic testing
- Sorting algorithm verification

---

#### 9. adminService.getRevenue() - `server/src/services/admin.service.js:10-41`
**Độ phức tạp:** Medium
**Cyclomatic Complexity:** ~5

**Paths cần test:**
- Path 1: No bookings → totalRevenue = 0
- Path 2: Bookings exist → calculate totalRevenue
- Path 3: Group by movie logic
- Path 4: Multiple bookings per movie
- Path 5: Object.values() conversion

**Decision Points:**
- reduce() for totalRevenue - line 16
- forEach for grouping - line 21
- `if (!revenueByMovie[movieTitle])` - line 23

**Coverage Goals:**
- Statement coverage: 100%
- Branch coverage: 100%
- Grouping logic testing
- Aggregation verification

---

## 🎯 PHẦN 2: BLACK-BOX TESTING (90 Test Cases)

### 👤 Người 1 - Authentication & User Management (30 TCs)

#### Module: User Registration (10 TCs)

**API Endpoint:** `POST /api/auth/register`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| REG-001 | Valid registration | email="test@example.com", password="123456", fullName="Test User" | Status 201, user + token | Valid | - |
| REG-002 | Empty email | email="", password="123456", fullName="Test" | Status 400, "Email is required" | Invalid | - |
| REG-003 | Invalid email format | email="invalid", password="123456", fullName="Test" | Status 400, "Invalid email format" | Invalid | - |
| REG-004 | Duplicate email | email="existing@example.com" (already exists) | Status 409, "Email already registered" | Invalid | - |
| REG-005 | Empty password | email="test@example.com", password="", fullName="Test" | Status 400, "Password is required" | Invalid | - |
| REG-006 | Empty fullName | email="test@example.com", password="123456", fullName="" | Status 400, "Full name is required" | Invalid | - |
| REG-007 | Email with spaces | email=" test@example.com ", password="123456", fullName="Test" | Status 201, email trimmed | Boundary | - |
| REG-008 | Long fullName (100 chars) | fullName with 100+ characters | ⚠️ Status 201, success (BUG: should reject) | Boundary | **BUG-1** |
| REG-009 | Password with only spaces | email="test@example.com", password="     " (5 spaces), fullName="Test" | ⚠️ Status 201, user created (BUG: should reject) | Invalid | **BUG-2** |
| REG-010 | SQL injection attempt | email="test'; DROP TABLE users--" | Status 400, "Invalid email format" | Security | - |

---

#### Module: User Login (10 TCs)

**API Endpoint:** `POST /api/auth/login`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| LOG-001 | Valid login | email="test@example.com", password="123456" | Status 200, user + token | Valid | - |
| LOG-002 | Empty email | email="", password="123456" | Status 400, "Email is required" | Invalid | - |
| LOG-003 | Invalid email format | email="invalid", password="123456" | Status 400, "Invalid email format" | Invalid | - |
| LOG-004 | Non-existent email | email="nonexist@example.com", password="123456" | Status 401, "Invalid credentials" | Invalid | - |
| LOG-005 | Wrong password | email="test@example.com", password="wrong" | Status 401, "Invalid credentials" | Invalid | - |
| LOG-006 | Empty password | email="test@example.com", password="" | Status 400, "Password is required" | Invalid | - |
| LOG-007 | Case insensitive email | email="TEST@EXAMPLE.COM" (registered as lowercase) | Status 200, login successful | Boundary | - |
| LOG-008 | Email with spaces | email=" test@example.com " | Status 200, login successful | Boundary | - |
| LOG-009 | Password with spaces | email="test@example.com", password="  123  " (with spaces) | Status 400, "Password is required" | Invalid | - |
| LOG-010 | XSS in password | password="<script>alert('xss')</script>" | Status 401, "Invalid credentials" | Security | - |

---

#### Module: Profile Management (10 TCs)

**API Endpoint:** `PUT /api/auth/profile`, `GET /api/auth/me`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| PRO-001 | Get profile | GET /api/auth/me with valid token | Status 200, user data | Valid | - |
| PRO-002 | Get profile no auth | GET /api/auth/me without token | Status 401, "Unauthorized" | Invalid | - |
| PRO-003 | Update fullName | fullName="New Name" | Status 200, name updated | Valid | - |
| PRO-004 | Update password | password="newpass123" | Status 200, password updated | Valid | - |
| PRO-005 | Update both fields | fullName="New", password="new123" | Status 200, both updated | Valid | - |
| PRO-006 | Empty fullName update | fullName="" | Status 400, "Full name cannot be empty" | Invalid | - |
| PRO-007 | Update with invalid token | Invalid JWT token | Status 401, "Unauthorized" | Invalid | - |
| PRO-008 | Update fullName only | password=undefined | Status 200, only name changed | Boundary | - |
| PRO-009 | Update nothing | Both fields undefined | Status 200, no changes | Boundary | - |
| PRO-010 | Very long fullName (100 chars) | fullName with 100+ characters | ⚠️ Status 200, updated (BUG: should reject) | Boundary | **BUG-3** |

---

### 🎫 Người 2 - Booking & Showtime Management (30 TCs)

#### Module: Create Booking (15 TCs)

**API Endpoint:** `POST /api/bookings`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| BOK-001 | Valid booking | showtimeId="valid", seats=["A1", "A2"] | Status 201, booking created | Valid | - |
| BOK-002 | Invalid showtime ID | showtimeId="nonexistent", seats=["A1"] | Status 404, "Showtime not found" | Invalid | - |
| BOK-003 | Empty seats array | showtimeId="valid", seats=[] | Status 400, "At least one seat required" | Invalid | - |
| BOK-004 | Invalid seat format | seats=["ABC", "123"] | Status 400, "Invalid seat format" | Invalid | - |
| BOK-005 | Seat already booked | seats=["A1"] (A1 already booked) | Status 409, "Seats already booked" | Invalid | - |
| BOK-006 | Duplicate seats | seats=["A1", "A1"] | ⚠️ Status 200 (BUG: accepts duplicates) | Invalid | **BUG-4** |
| BOK-007 | Seats out of bounds | seats=["Z99"] (room only has 10 rows) | Status 400, "Invalid seats for room" | Invalid | - |
| BOK-008 | Past showtime | showtimeId with startTime < now | Status 400, "Cannot book past showtimes" | Invalid | - |
| BOK-009 | Book maximum seats | seats=[all 120 available seats] | Status 201, booking created | Boundary | - |
| BOK-010 | Book single seat | seats=["A1"] | Status 201, booking created | Boundary | - |
| BOK-011 | Lowercase seat | seats=["a1"] | Status 400, "Invalid seat format" | Boundary | - |
| BOK-012 | Seat number zero | seats=["A0", "B0"] | ⚠️ Status 201, booking created (BUG: should reject) | Invalid | **BUG-6** |
| BOK-013 | No authentication | POST without auth token | Status 401, "Unauthorized" | Invalid | - |
| BOK-014 | Partially booked seats | seats=["A1", "A2"] where A1 is booked | Status 409, "Seats already booked: A1" | Invalid | - |
| BOK-015 | Special char in seat | seats=["A@1"] | Status 400, "Invalid seat format" | Invalid | - |

---

#### Module: Cancel Booking (8 TCs)

**API Endpoint:** `DELETE /api/bookings/:id`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| CAN-001 | Cancel own booking | bookingId="user's booking" | Status 200, "Booking cancelled successfully" | Valid | - |
| CAN-002 | Cancel non-existent | bookingId="nonexistent" | Status 404, "Booking not found" | Invalid | - |
| CAN-003 | Cancel other's booking | bookingId="another user's booking" | Status 403, "You can only cancel your own bookings" | Invalid | - |
| CAN-004 | Cancel already cancelled | bookingId="already cancelled" | ⚠️ Status 200, "Booking cancelled successfully" (BUG: should be 400) | Invalid | **BUG-5** |
| CAN-005 | Cancel past booking | bookingId with past showtime | Status 400, "Cannot cancel bookings for past showtimes" | Invalid | - |
| CAN-006 | No authentication | DELETE without token | Status 401, "Unauthorized" | Invalid | - |
| CAN-007 | Invalid booking ID format | bookingId="invalid-format" | Status 404, "Booking not found" | Invalid | - |
| CAN-008 | Cancel immediately after booking | Cancel right after creation | Status 200, "Booking cancelled successfully" | Valid | - |

---

#### Module: View Bookings & Showtimes (7 TCs)

**API Endpoint:** `GET /api/bookings`, `GET /api/showtimes/:id`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| VIE-001 | Get user bookings | GET /api/bookings with auth | Status 200, list of bookings sorted by createdAt desc | Valid | - |
| VIE-002 | Get bookings no auth | GET without token | Status 401, "Unauthorized" | Invalid | - |
| VIE-003 | Get empty bookings | User with no bookings | Status 200, empty array [] | Boundary | - |
| VIE-004 | Get showtime details | GET /api/showtimes/:id | Status 200, showtime + seat info | Valid | - |
| VIE-005 | Get invalid showtime | GET /api/showtimes/nonexistent | Status 404 or Error "Showtime not found" | Invalid | - |
| VIE-006 | Verify seat availability | GET showtime with bookings (e.g., 50/120) | Status 200, correct availableSeats = 70 | Valid | - |
| VIE-007 | Bookings sorted by date | Check order in response | Newest first (createdAt desc) | Valid | - |

---

### 🎬 Người 3 - Movies, Reviews & Admin (30 TCs)

#### Module: Movies Management (12 TCs)

**API Endpoint:** `GET /api/movies`, `GET /api/movies/:id`, `GET /api/movies/trending`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| MOV-001 | Get all movies | GET /api/movies | Status 200, array of movies with ratings | Valid | - |
| MOV-002 | Search by title | search="Spider" | Status 200, matching movies | Valid | - |
| MOV-003 | Filter by genre | genre="Action" | Status 200, Action movies only | Valid | - |
| MOV-004 | Sort by title asc | sortBy="title-asc" | Status 200, alphabetical A-Z order | Valid | - |
| MOV-005 | Sort by rating highest | sortBy="rating-highest" | Status 200, highest rating first | Valid | - |
| MOV-006 | Combined filter + sort | genre="Action", sortBy="rating-highest" | Status 200, filtered + sorted correctly | Valid | - |
| MOV-007 | Search no results | search="xyz123nonexistent" | Status 200, empty array [] | Boundary | - |
| MOV-008 | Get movie by ID | GET /api/movies/:id | Status 200, movie details with showtimes | Valid | - |
| MOV-009 | Get non-existent movie | GET /api/movies/invalid-id | Status 404 or Error "Movie not found" | Invalid | - |
| MOV-010 | Get trending movies | GET /api/movies/trending | Status 200, sorted by bookingCount desc | Valid | - |
| MOV-011 | Trending with limit | GET /api/movies/trending?limit=5 | Status 200, max 5 movies returned | Boundary | - |
| MOV-012 | Movie with no showtimes | GET movie that has no future showtimes | Status 200, showtimes: [] | Boundary | - |

---

#### Module: Reviews Management (10 TCs)

**API Endpoint:** `POST /api/reviews`, `GET /api/reviews/movie/:movieId`

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| REV-001 | Create valid review | movieId="valid", rating=5, comment="Great!" | Status 201, review created | Valid | - |
| REV-002 | Rating = 1 (min) | rating=1, comment="Bad" | Status 201, review created | Boundary | - |
| REV-003 | Rating = 5 (max) | rating=5, comment="Excellent" | Status 201, review created | Boundary | - |
| REV-004 | Rating > 5 | rating=6, comment="Test" | ⚠️ Status 200 (BUG: accepts rating > 5) | Invalid | **BUG-7** |
| REV-005 | Rating < 1 | rating=0, comment="Test" | ⚠️ Status 200 (BUG: accepts rating < 1) | Invalid | **BUG-8** |
| REV-006 | Non-numeric rating | rating="five", comment="Test" | Status 400, "Rating must be a number" | Invalid | - |
| REV-007 | No authentication | POST without token | Status 401, "Unauthorized" | Invalid | - |
| REV-008 | Update existing review | POST again with same movieId | Status 200, review updated (upsert) | Valid | - |
| REV-009 | Empty comment | comment="" or undefined | Status 201, review created | Boundary | - |
| REV-010 | Get movie reviews | GET /api/reviews/movie/:id | Status 200, list of reviews sorted by createdAt | Valid | - |

---

#### Module: Admin Operations (8 TCs)

**API Endpoint:** `GET /api/admin/revenue`, `POST /api/admin/movies`, etc.

| TC ID | Test Case | Input | Expected Output | Type | Bug ID |
|-------|-----------|-------|----------------|------|--------|
| ADM-001 | Get revenue report | GET /api/admin/revenue with admin token | Status 200, revenue data with totalRevenue and byMovie | Valid | - |
| ADM-002 | Revenue without auth | GET without admin token | Status 401, "Unauthorized" | Invalid | - |
| ADM-003 | Revenue with member token | GET with MEMBER role token | Status 403, "Forbidden" | Invalid | - |
| ADM-004 | Create movie (admin) | POST /api/admin/movies with valid data | Status 201, movie created | Valid | - |
| ADM-005 | Create movie (non-admin) | POST with MEMBER token | Status 403, "Forbidden" | Invalid | - |
| ADM-006 | Get all showtimes | GET /api/admin/showtimes with admin token | Status 200, all showtimes sorted by startTime | Valid | - |
| ADM-007 | Delete movie | DELETE /api/admin/movies/:id with admin token | Status 200, movie deleted | Valid | - |
| ADM-008 | Create movie without title | POST /api/admin/movies with title="", description="Test", genre="Action" | ⚠️ Status 201, movie created (BUG: should reject) | Invalid | **BUG-9** |

---

## 📊 Tổng kết

### White-box Testing:
- **Tổng:** 9 functions
- **Người 1:** 3 functions (auth.register, auth.login, auth.updateProfile)
- **Người 2:** 3 functions (bookings.createBooking, bookings.cancelBooking, showtimes.getShowtimeById)
- **Người 3:** 3 functions (movies.getAllMovies, movies.getTrendingMovies, admin.getRevenue)

### Black-box Testing:
- **Tổng:** 90 test cases
- **Expected PASS:** 81-82 (~90%)
- **Expected FAIL:** 8-9 (~10%)

**Breakdown by Person:**
- **Người 1:** 30 TCs → 27-28 PASS, 2-3 FAIL (Bugs: BUG-1, BUG-2, BUG-3)
- **Người 2:** 30 TCs → 27 PASS, 3 FAIL (Bugs: BUG-4, BUG-5, BUG-6)
- **Người 3:** 30 TCs → 27 PASS, 3 FAIL (Bugs: BUG-7, BUG-8, BUG-9)

### Known Bugs:
- **BUG-1** (REG-008): No max length validation for registration fullName (>100 chars)
- **BUG-2** (REG-009): Password with only spaces accepted in registration (no trim validation)
- **BUG-3** (PRO-010): No max length validation for profile update fullName (>500 chars)
- **BUG-4** (BOK-006): Accepts duplicate seats in booking request
- **BUG-5** (CAN-004): Allows cancelling already cancelled bookings (no status check)
- **BUG-6** (BOK-012): Accepts seat number = 0 (A0, B0 invalid but accepted)
- **BUG-7** (REV-004): Accepts rating > 5
- **BUG-8** (REV-005): Accepts rating < 1
- **BUG-9** (ADM-008): Create movie without title validation (title="" accepted)

📝 **See KNOWN_BUGS.md for detailed bug descriptions and fixes.**

### Coverage Goals:
- **Statement Coverage:** ≥ 80%
- **Branch Coverage:** ≥ 75%
- **Path Coverage:** Major paths covered
- **Expected Pass Rate:** ~90% (realistic for initial testing phase)

---

## 🛠️ Tools Recommended

### White-box Testing:
- **Jest** - Unit testing framework
- **Istanbul/nyc** - Code coverage
- **Jest coverage report** - Visual coverage

### Black-box Testing:
- **Postman/Thunder Client** - API testing
- **Supertest** - Integration testing
- **Newman** - CLI runner for Postman

### Documentation:
- Test execution screenshots
- Coverage reports
- Bug reports (if any)
- Test case status (Pass/Fail/Block)

---

## 📝 Deliverables

Mỗi người cần nộp:
1. **White-box test code** (3 functions với Jest)
   - Unit tests cho 3 functions
   - Coverage report (≥80% statement, ≥75% branch)
   - Screenshots of test execution

2. **Black-box test results** (30 test cases với screenshots)
   - Test execution document (Excel/Google Sheets)
   - All 30 test cases with PASS/FAIL status
   - Screenshots for each test case
   - **Expected: ~27 PASS, ~3 FAIL**

3. **Bug reports** (3 bugs per person)
   - Bug ID, Title, Description
   - Steps to reproduce
   - Expected vs Actual behavior
   - Severity & Priority
   - Suggested fix
   - Screenshots demonstrating the bug

4. **Summary report**
   - Test execution summary
   - Pass rate (~90%)
   - Bugs found (3 per person)
   - Recommendations

5. **Documentation**
   - Test plan
   - Test case document
   - Bug report document
   - Coverage reports

---

## 🎯 Expected Results Summary

| Metric | Value |
|--------|-------|
| Total Test Cases | 90 |
| Expected PASS | 81-82 (~90%) |
| Expected FAIL | 8-9 (~10%) |
| Bugs to Find | 9 total (3 per person) |
| Pass Rate | ~90% |

**This is a realistic pass rate for initial testing phase!**

---

## 📚 Supporting Documents

- **TESTING_ASSIGNMENT.md** - This file (test cases list)
- **KNOWN_BUGS.md** - Detailed bug descriptions (9 bugs)
- **EXPECTED_TEST_RESULTS.md** - Expected outcomes per test case
- **VALIDATION_SUMMARY.md** - Code validation summary

Good luck! 🚀
