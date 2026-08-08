# Library Management System

A production-quality Spring Boot REST API for managing books, members, and borrow records in a library.

## Tech Stack

- **Java 17**
- **Spring Boot 3.4.1**
- **Spring Web** — REST controllers
- **Spring Data JPA** — database access
- **Spring Validation** — bean validation on DTOs
- **MySQL 8** — relational database
- **Maven** — build tool
- **Lombok** — boilerplate reduction

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+

## MySQL Setup

### Option 1 — Let the App Create the Schema (Recommended)

1. Start MySQL and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS library_db;
   ```
2. The app uses `spring.jpa.hibernate.ddl-auto=update`, so tables are created automatically on first run.

### Option 2 — Run the SQL Script

```bash
mysql -u root -p < database/library_schema.sql
```

This creates the `library_db` database, all tables, and inserts sample data.

## Configuration

Database credentials are configured in `src/main/resources/application.properties` with sensible defaults:

```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```

Override via environment variables if needed:

```bash
export DB_USERNAME=myuser
export DB_PASSWORD=mypassword
```

## Run the Application

```bash
mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

## Build & Verify

```bash
mvn compile    # verify compilation
mvn test       # run unit tests
mvn package    # build executable JAR
```

## API Endpoints

### Books

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/books` | Add a new book |
| GET | `/api/books` | Get all books (paginated: `?page=0&size=10&sort=title,asc`) |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/books/search?author=` | Search books by author |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |

#### Sample — Add Book
```json
POST /api/books
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Software Engineering",
  "availableCopies": 5
}
```

#### Sample — Response
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Software Engineering",
  "availableCopies": 5
}
```

### Members

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/members` | Add a new member |
| GET | `/api/members` | Get all members |
| PUT | `/api/members/{id}` | Update a member |
| DELETE | `/api/members/{id}` | Delete a member |

#### Sample — Add Member
```json
POST /api/members
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "9876543210"
}
```

### Borrow

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/borrow` | Borrow a book |
| PUT | `/api/borrow/return/{id}` | Return a borrowed book |
| GET | `/api/borrow/active` | View all active borrows |
| GET | `/api/borrow/history/{memberId}` | View borrow history for a member |

#### Sample — Borrow a Book
```json
POST /api/borrow
{
  "memberId": 1,
  "bookId": 1
}
```

#### Sample — Borrow Response
```json
{
  "id": 1,
  "memberId": 1,
  "memberName": "Alice Johnson",
  "bookId": 1,
  "bookTitle": "Clean Code",
  "issueDate": "2026-08-06",
  "returnDate": null
}
```

## Error Handling

All errors return a consistent JSON body:

```json
{
  "timestamp": "2026-08-06T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Book not found with id: 99",
  "path": "/api/books/99"
}
```

| Exception | HTTP Status |
|-----------|-------------|
| `BookNotFoundException` | 404 |
| `MemberNotFoundException` | 404 |
| `BookNotAvailableException` | 409 |
| Duplicate phone number | 409 |
| Validation errors | 400 |

## Project Structure

```
src/main/java/com/library/librarymanagement/
├── controller/        # REST controllers
├── service/           # Service interfaces + impl/
├── repository/        # Spring Data JPA repositories
├── entity/            # JPA entities
├── dto/               # Request & Response DTOs
├── exception/         # Custom exceptions + GlobalExceptionHandler
└── config/            # Reserved for future configuration
```

## Postman Collection

Import `postman/Library-Management.postman_collection.json` into Postman. Set the `baseUrl` variable to `http://localhost:8080`.
