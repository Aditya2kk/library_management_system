# Library Management System — Design Spec

**Date:** 2026-08-04  
**Stack:** Java 17, Spring Boot 3.4.x, Spring Web, Spring Data JPA, Spring Validation, MySQL, Maven, Lombok  
**Base package:** `com.library.librarymanagement`

---

## Architecture

Standard layered monolith: Controller → Service interface → Service impl → Repository → Entity.  
DTOs mapped manually (no MapStruct). Constructor injection throughout (no `@Autowired` on fields).

---

## Package Layout

```
src/main/java/com/library/librarymanagement/
├── entity/
│   ├── Book.java
│   ├── Member.java
│   └── BorrowRecord.java
├── dto/
│   ├── BookRequest.java
│   ├── BookResponse.java
│   ├── MemberRequest.java
│   ├── MemberResponse.java
│   ├── BorrowRequest.java
│   ├── BorrowResponse.java
│   └── ErrorResponse.java
├── repository/
│   ├── BookRepository.java
│   ├── MemberRepository.java
│   └── BorrowRecordRepository.java
├── service/
│   ├── BookService.java          (interface)
│   ├── BookServiceImpl.java
│   ├── MemberService.java        (interface)
│   ├── MemberServiceImpl.java
│   ├── BorrowService.java        (interface)
│   └── BorrowServiceImpl.java
├── controller/
│   ├── BookController.java
│   ├── MemberController.java
│   └── BorrowController.java
├── exception/
│   ├── BookNotFoundException.java
│   ├── MemberNotFoundException.java
│   ├── BookNotAvailableException.java
│   └── GlobalExceptionHandler.java
└── config/
    (reserved — no config classes needed for this scope)
```

---

## Data Model

### Book
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| title | String | `@NotBlank` |
| author | String | — |
| category | String | — |
| availableCopies | int | `@Min(0)` |

### Member
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| name | String | — |
| email | String | `@Email @NotBlank` |
| phone | String | `@NotBlank`, unique at DB level |

### BorrowRecord
| Field | Type | Constraints |
|-------|------|-------------|
| id | Long | PK, auto-generated |
| member | Member | `@ManyToOne @JoinColumn` |
| book | Book | `@ManyToOne @JoinColumn` |
| issueDate | LocalDate | set to today on borrow |
| returnDate | LocalDate | nullable; null = active borrow |

---

## REST Endpoints

### Books
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/books` | Add book |
| GET | `/api/books` | Get all books (paginated via `Pageable`) |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/books/search?author=` | Search books by author |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |

### Members
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/members` | Add member |
| GET | `/api/members` | Get all members |
| PUT | `/api/members/{id}` | Update member |
| DELETE | `/api/members/{id}` | Delete member |

### Borrow
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/borrow` | Borrow a book |
| PUT | `/api/borrow/return/{id}` | Return a book |
| GET | `/api/borrow/active` | View all active borrows (returnDate == null) |
| GET | `/api/borrow/history/{memberId}` | View borrow history for a member |

---

## Business Logic

### Borrow
1. Validate member exists (throw `MemberNotFoundException` if not)
2. Validate book exists (throw `BookNotFoundException` if not)
3. If `book.availableCopies <= 0` throw `BookNotAvailableException`
4. Save `BorrowRecord` with `issueDate = LocalDate.now()`
5. Decrement `book.availableCopies`

### Return
1. Find `BorrowRecord` by ID (throw `BookNotFoundException` if not found — or a dedicated exception)
2. Set `returnDate = LocalDate.now()`
3. Increment `book.availableCopies`

---

## Validation

| DTO | Field | Rules |
|-----|-------|-------|
| BookRequest | title | `@NotBlank` |
| BookRequest | availableCopies | `@Min(0)` |
| MemberRequest | email | `@Email @NotBlank` |
| MemberRequest | phone | `@NotBlank` |

---

## Exception Handling

All exceptions return a consistent JSON body:
```json
{
  "timestamp": "...",
  "status": 404,
  "error": "Not Found",
  "message": "Book not found with id: 5",
  "path": "/api/books/5"
}
```

| Exception | HTTP Status |
|-----------|-------------|
| `BookNotFoundException` | 404 |
| `MemberNotFoundException` | 404 |
| `BookNotAvailableException` | 409 |
| `DataIntegrityViolationException` (duplicate phone) | 409 |
| `MethodArgumentNotValidException` | 400 (with field-level messages) |

---

## Configuration (`application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

---

## SQL Script (`database/library_schema.sql`)

- Optional manual setup/reference script (app auto-creates schema via JPA on first run)
- Idempotent: `CREATE DATABASE IF NOT EXISTS library_db` + `DROP TABLE IF EXISTS` before creates
- Hand-authored to match exactly what Hibernate generates (same table names, column names, types, FK columns, unique constraint on phone)
- README covers both options: "let the app create it" vs "run the script first"

---

## Deliverables

1. Complete compiling Maven project (verified with `mvn compile`)
2. `database/library_schema.sql` — idempotent schema + sample INSERTs
3. `postman/Library-Management.postman_collection.json` — all endpoints, `{{baseUrl}}` variable
4. `README.md` — overview, prerequisites, MySQL setup (two options), run instructions, endpoint table
5. `.gitignore` — Maven/Java standard
