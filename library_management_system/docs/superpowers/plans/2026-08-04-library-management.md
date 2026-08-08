# Library Management System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality Spring Boot Library Management System backend with full CRUD, borrow/return logic, validation, exception handling, and all graded deliverables.

**Architecture:** Standard layered monolith — Controller → Service interface → Service impl → Repository → Entity. DTOs mapped via static factory methods. Constructor injection throughout, no `@Autowired` on fields.

**Tech Stack:** Java 17, Spring Boot 3.4.x, Spring Web, Spring Data JPA, Spring Validation, MySQL (mysql-connector-j), Maven, Lombok.

## Global Constraints

- Java version: 17 (use `java.version` property = `17`)
- Spring Boot parent version: `3.4.1`
- Base package: `com.library.librarymanagement`
- All controllers map entities to/from DTOs — never expose entities directly
- Constructor injection only — no `@Autowired` on fields
- Bean Validation annotations on request DTOs, not entities
- `spring.jpa.hibernate.ddl-auto=update` for runtime; SQL script is reference-only
- DB name: `library_db`; credentials via `${DB_USERNAME:root}` / `${DB_PASSWORD:root}`

---

### Task 1: Maven Scaffold — pom.xml + Main Class + application.properties

**Files:**
- Create: `pom.xml`
- Create: `src/main/java/com/library/librarymanagement/LibraryManagementApplication.java`
- Create: `src/main/resources/application.properties`

**Interfaces:**
- Produces: compilable Maven project that all subsequent tasks add files to

- [ ] **Step 1: Create pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.1</version>
        <relativePath/>
    </parent>
    <groupId>com.library</groupId>
    <artifactId>library-management</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>library-management</name>
    <description>Library Management System</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: Create main application class**

`src/main/java/com/library/librarymanagement/LibraryManagementApplication.java`:
```java
package com.library.librarymanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibraryManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibraryManagementApplication.class, args);
    }
}
```

- [ ] **Step 3: Create application.properties**

`src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_db
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
```

- [ ] **Step 4: Verify it compiles**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 5: Commit**

```bash
git add pom.xml src/main/java/com/library/librarymanagement/LibraryManagementApplication.java src/main/resources/application.properties
git commit -m "feat: scaffold Maven project with Spring Boot 3.4.1"
```

---

### Task 2: Entities

**Files:**
- Create: `src/main/java/com/library/librarymanagement/entity/Book.java`
- Create: `src/main/java/com/library/librarymanagement/entity/Member.java`
- Create: `src/main/java/com/library/librarymanagement/entity/BorrowRecord.java`

**Interfaces:**
- Produces: `Book`, `Member`, `BorrowRecord` JPA entities used by all repositories, DTOs, and services

- [ ] **Step 1: Create Book entity**

`src/main/java/com/library/librarymanagement/entity/Book.java`:
```java
package com.library.librarymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String category;
    private int availableCopies;
}
```

- [ ] **Step 2: Create Member entity**

`src/main/java/com/library/librarymanagement/entity/Member.java`:
```java
package com.library.librarymanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @Column(unique = true)
    private String phone;
}
```

- [ ] **Step 3: Create BorrowRecord entity**

`src/main/java/com/library/librarymanagement/entity/BorrowRecord.java`:
```java
package com.library.librarymanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "borrow_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDate issueDate;
    private LocalDate returnDate; // null = active borrow
}
```

- [ ] **Step 4: Verify compilation**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/library/librarymanagement/entity/
git commit -m "feat: add Book, Member, BorrowRecord JPA entities"
```

---

### Task 3: DTOs + Custom Exceptions

**Files:**
- Create: `src/main/java/com/library/librarymanagement/dto/BookRequest.java`
- Create: `src/main/java/com/library/librarymanagement/dto/BookResponse.java`
- Create: `src/main/java/com/library/librarymanagement/dto/MemberRequest.java`
- Create: `src/main/java/com/library/librarymanagement/dto/MemberResponse.java`
- Create: `src/main/java/com/library/librarymanagement/dto/BorrowRequest.java`
- Create: `src/main/java/com/library/librarymanagement/dto/BorrowResponse.java`
- Create: `src/main/java/com/library/librarymanagement/dto/ErrorResponse.java`
- Create: `src/main/java/com/library/librarymanagement/exception/BookNotFoundException.java`
- Create: `src/main/java/com/library/librarymanagement/exception/MemberNotFoundException.java`
- Create: `src/main/java/com/library/librarymanagement/exception/BookNotAvailableException.java`

**Interfaces:**
- Consumes: `Book`, `Member`, `BorrowRecord` entities (Task 2)
- Produces: DTOs and exceptions used by services (Task 5-7) and controllers (Task 9)

- [ ] **Step 1: Create BookRequest**

`src/main/java/com/library/librarymanagement/dto/BookRequest.java`:
```java
package com.library.librarymanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String author;
    private String category;

    @Min(value = 0, message = "Available copies must be 0 or more")
    private int availableCopies;
}
```

- [ ] **Step 2: Create BookResponse**

`src/main/java/com/library/librarymanagement/dto/BookResponse.java`:
```java
package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.Book;
import lombok.Data;

@Data
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String category;
    private int availableCopies;

    public static BookResponse from(Book book) {
        BookResponse resp = new BookResponse();
        resp.setId(book.getId());
        resp.setTitle(book.getTitle());
        resp.setAuthor(book.getAuthor());
        resp.setCategory(book.getCategory());
        resp.setAvailableCopies(book.getAvailableCopies());
        return resp;
    }
}
```

- [ ] **Step 3: Create MemberRequest**

`src/main/java/com/library/librarymanagement/dto/MemberRequest.java`:
```java
package com.library.librarymanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MemberRequest {

    private String name;

    @Email(message = "Must be a valid email address")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;
}
```

- [ ] **Step 4: Create MemberResponse**

`src/main/java/com/library/librarymanagement/dto/MemberResponse.java`:
```java
package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.Member;
import lombok.Data;

@Data
public class MemberResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;

    public static MemberResponse from(Member member) {
        MemberResponse resp = new MemberResponse();
        resp.setId(member.getId());
        resp.setName(member.getName());
        resp.setEmail(member.getEmail());
        resp.setPhone(member.getPhone());
        return resp;
    }
}
```

- [ ] **Step 5: Create BorrowRequest**

`src/main/java/com/library/librarymanagement/dto/BorrowRequest.java`:
```java
package com.library.librarymanagement.dto;

import lombok.Data;

@Data
public class BorrowRequest {
    private Long memberId;
    private Long bookId;
}
```

- [ ] **Step 6: Create BorrowResponse**

`src/main/java/com/library/librarymanagement/dto/BorrowResponse.java`:
```java
package com.library.librarymanagement.dto;

import com.library.librarymanagement.entity.BorrowRecord;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BorrowResponse {

    private Long id;
    private Long memberId;
    private String memberName;
    private Long bookId;
    private String bookTitle;
    private LocalDate issueDate;
    private LocalDate returnDate;

    public static BorrowResponse from(BorrowRecord record) {
        BorrowResponse resp = new BorrowResponse();
        resp.setId(record.getId());
        resp.setMemberId(record.getMember().getId());
        resp.setMemberName(record.getMember().getName());
        resp.setBookId(record.getBook().getId());
        resp.setBookTitle(record.getBook().getTitle());
        resp.setIssueDate(record.getIssueDate());
        resp.setReturnDate(record.getReturnDate());
        return resp;
    }
}
```

- [ ] **Step 7: Create ErrorResponse**

`src/main/java/com/library/librarymanagement/dto/ErrorResponse.java`:
```java
package com.library.librarymanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
```

- [ ] **Step 8: Create BookNotFoundException**

`src/main/java/com/library/librarymanagement/exception/BookNotFoundException.java`:
```java
package com.library.librarymanagement.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String message) {
        super(message);
    }
}
```

- [ ] **Step 9: Create MemberNotFoundException**

`src/main/java/com/library/librarymanagement/exception/MemberNotFoundException.java`:
```java
package com.library.librarymanagement.exception;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException(String message) {
        super(message);
    }
}
```

- [ ] **Step 10: Create BookNotAvailableException**

`src/main/java/com/library/librarymanagement/exception/BookNotAvailableException.java`:
```java
package com.library.librarymanagement.exception;

public class BookNotAvailableException extends RuntimeException {
    public BookNotAvailableException(String message) {
        super(message);
    }
}
```

- [ ] **Step 11: Verify compilation**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 12: Commit**

```bash
git add src/main/java/com/library/librarymanagement/dto/ src/main/java/com/library/librarymanagement/exception/
git commit -m "feat: add request/response DTOs and custom exception classes"
```

---

### Task 4: Repositories

**Files:**
- Create: `src/main/java/com/library/librarymanagement/repository/BookRepository.java`
- Create: `src/main/java/com/library/librarymanagement/repository/MemberRepository.java`
- Create: `src/main/java/com/library/librarymanagement/repository/BorrowRecordRepository.java`

**Interfaces:**
- Consumes: `Book`, `Member`, `BorrowRecord` entities (Task 2)
- Produces:
  - `BookRepository.findByAuthorContainingIgnoreCase(String author): List<Book>`
  - `BorrowRecordRepository.findByReturnDateIsNull(): List<BorrowRecord>`
  - `BorrowRecordRepository.findByMemberId(Long memberId): List<BorrowRecord>`

- [ ] **Step 1: Write failing test for BookRepository.findByAuthorContainingIgnoreCase**

`src/test/java/com/library/librarymanagement/service/BookServiceTest.java` (placeholder — full test in Task 5; add this now to drive design):
```java
// This file will be fleshed out in Task 5.
// For now, just verify the repository interface compiles correctly.
```

- [ ] **Step 2: Create BookRepository**

`src/main/java/com/library/librarymanagement/repository/BookRepository.java`:
```java
package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
```

- [ ] **Step 3: Create MemberRepository**

`src/main/java/com/library/librarymanagement/repository/MemberRepository.java`:
```java
package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
```

- [ ] **Step 4: Create BorrowRecordRepository**

`src/main/java/com/library/librarymanagement/repository/BorrowRecordRepository.java`:
```java
package com.library.librarymanagement.repository;

import com.library.librarymanagement.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByReturnDateIsNull();
    List<BorrowRecord> findByMemberId(Long memberId);
}
```

- [ ] **Step 5: Verify compilation**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/library/librarymanagement/repository/
git commit -m "feat: add JPA repositories for Book, Member, and BorrowRecord"
```

---

### Task 5: Book Service + Unit Tests

**Files:**
- Create: `src/main/java/com/library/librarymanagement/service/BookService.java`
- Create: `src/main/java/com/library/librarymanagement/service/impl/BookServiceImpl.java`
- Create: `src/test/java/com/library/librarymanagement/service/BookServiceTest.java`

**Interfaces:**
- Consumes: `BookRepository` (Task 4), `BookRequest`, `BookResponse`, `BookNotFoundException` (Task 3)
- Produces:
  - `BookService.addBook(BookRequest): BookResponse`
  - `BookService.getAllBooks(Pageable): Page<BookResponse>`
  - `BookService.getBookById(Long): BookResponse`
  - `BookService.updateBook(Long, BookRequest): BookResponse`
  - `BookService.deleteBook(Long): void`
  - `BookService.searchByAuthor(String): List<BookResponse>`

- [ ] **Step 1: Write the failing tests**

`src/test/java/com/library/librarymanagement/service/BookServiceTest.java`:
```java
package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BookRequest;
import com.library.librarymanagement.dto.BookResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.exception.BookNotFoundException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.service.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    private BookService bookService;

    @BeforeEach
    void setUp() {
        bookService = new BookServiceImpl(bookRepository);
    }

    @Test
    void addBook_shouldSaveAndReturnResponse() {
        BookRequest request = new BookRequest();
        request.setTitle("Clean Code");
        request.setAuthor("Robert Martin");
        request.setCategory("Programming");
        request.setAvailableCopies(5);

        Book saved = Book.builder().id(1L).title("Clean Code")
                .author("Robert Martin").category("Programming").availableCopies(5).build();
        when(bookRepository.save(any(Book.class))).thenReturn(saved);

        BookResponse response = bookService.addBook(request);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Clean Code");
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    void getBookById_whenNotFound_shouldThrowBookNotFoundException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(99L))
                .isInstanceOf(BookNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deleteBook_whenNotFound_shouldThrowBookNotFoundException() {
        when(bookRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> bookService.deleteBook(99L))
                .isInstanceOf(BookNotFoundException.class);
    }
}
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
mvn test -pl . -Dtest=BookServiceTest -q 2>&1 | tail -5
```
Expected: compilation error — `BookServiceImpl` does not exist yet.

- [ ] **Step 3: Create BookService interface**

`src/main/java/com/library/librarymanagement/service/BookService.java`:
```java
package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BookRequest;
import com.library.librarymanagement.dto.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BookService {
    BookResponse addBook(BookRequest request);
    Page<BookResponse> getAllBooks(Pageable pageable);
    BookResponse getBookById(Long id);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    List<BookResponse> searchByAuthor(String author);
}
```

- [ ] **Step 4: Create BookServiceImpl**

`src/main/java/com/library/librarymanagement/service/impl/BookServiceImpl.java`:
```java
package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.dto.BookRequest;
import com.library.librarymanagement.dto.BookResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.exception.BookNotFoundException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public BookServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public BookResponse addBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .availableCopies(request.getAvailableCopies())
                .build();
        return BookResponse.from(bookRepository.save(book));
    }

    @Override
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(BookResponse::from);
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return BookResponse.from(book);
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setAvailableCopies(request.getAvailableCopies());
        return BookResponse.from(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    public List<BookResponse> searchByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author)
                .stream()
                .map(BookResponse::from)
                .collect(Collectors.toList());
    }
}
```

- [ ] **Step 5: Run tests and confirm they pass**

```bash
mvn test -Dtest=BookServiceTest -q
```
Expected: `Tests run: 3, Failures: 0, Errors: 0`

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/library/librarymanagement/service/ src/test/java/com/library/librarymanagement/service/BookServiceTest.java
git commit -m "feat: add BookService with unit tests"
```

---

### Task 6: Member Service

**Files:**
- Create: `src/main/java/com/library/librarymanagement/service/MemberService.java`
- Create: `src/main/java/com/library/librarymanagement/service/impl/MemberServiceImpl.java`

**Interfaces:**
- Consumes: `MemberRepository` (Task 4), `MemberRequest`, `MemberResponse`, `MemberNotFoundException` (Task 3)
- Produces:
  - `MemberService.addMember(MemberRequest): MemberResponse`
  - `MemberService.getAllMembers(): List<MemberResponse>`
  - `MemberService.updateMember(Long, MemberRequest): MemberResponse`
  - `MemberService.deleteMember(Long): void`

- [ ] **Step 1: Create MemberService interface**

`src/main/java/com/library/librarymanagement/service/MemberService.java`:
```java
package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.MemberRequest;
import com.library.librarymanagement.dto.MemberResponse;
import java.util.List;

public interface MemberService {
    MemberResponse addMember(MemberRequest request);
    List<MemberResponse> getAllMembers();
    MemberResponse updateMember(Long id, MemberRequest request);
    void deleteMember(Long id);
}
```

- [ ] **Step 2: Create MemberServiceImpl**

`src/main/java/com/library/librarymanagement/service/impl/MemberServiceImpl.java`:
```java
package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.dto.MemberRequest;
import com.library.librarymanagement.dto.MemberResponse;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.exception.MemberNotFoundException;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.service.MemberService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public MemberResponse addMember(MemberRequest request) {
        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        return MemberResponse.from(memberRepository.save(member));
    }

    @Override
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(MemberResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with id: " + id));
        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        return MemberResponse.from(memberRepository.save(member));
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new MemberNotFoundException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }
}
```

- [ ] **Step 3: Verify compilation**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 4: Commit**

```bash
git add src/main/java/com/library/librarymanagement/service/MemberService.java src/main/java/com/library/librarymanagement/service/impl/MemberServiceImpl.java
git commit -m "feat: add MemberService"
```

---

### Task 7: Borrow Service + Unit Tests

**Files:**
- Create: `src/main/java/com/library/librarymanagement/service/BorrowService.java`
- Create: `src/main/java/com/library/librarymanagement/service/impl/BorrowServiceImpl.java`
- Create: `src/test/java/com/library/librarymanagement/service/BorrowServiceTest.java`

**Interfaces:**
- Consumes: `BorrowRecordRepository`, `BookRepository`, `MemberRepository` (Task 4); `BorrowRequest`, `BorrowResponse`, `BookNotAvailableException`, `BookNotFoundException`, `MemberNotFoundException` (Task 3)
- Produces:
  - `BorrowService.borrowBook(BorrowRequest): BorrowResponse`
  - `BorrowService.returnBook(Long): BorrowResponse`
  - `BorrowService.getActiveBorrows(): List<BorrowResponse>`
  - `BorrowService.getMemberHistory(Long): List<BorrowResponse>`

- [ ] **Step 1: Write the failing tests**

`src/test/java/com/library/librarymanagement/service/BorrowServiceTest.java`:
```java
package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.BorrowRecord;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.exception.BookNotAvailableException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowRecordRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.service.impl.BorrowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BorrowServiceTest {

    @Mock private BorrowRecordRepository borrowRecordRepository;
    @Mock private BookRepository bookRepository;
    @Mock private MemberRepository memberRepository;

    private BorrowService borrowService;

    private Member member;
    private Book book;

    @BeforeEach
    void setUp() {
        borrowService = new BorrowServiceImpl(borrowRecordRepository, bookRepository, memberRepository);
        member = Member.builder().id(1L).name("Alice").email("alice@test.com").phone("1234567890").build();
        book = Book.builder().id(1L).title("Test Book").author("Author").availableCopies(3).build();
    }

    @Test
    void borrowBook_whenNoCopiesAvailable_shouldThrowBookNotAvailableException() {
        book.setAvailableCopies(0);
        BorrowRequest request = new BorrowRequest();
        request.setMemberId(1L);
        request.setBookId(1L);

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> borrowService.borrowBook(request))
                .isInstanceOf(BookNotAvailableException.class);
    }

    @Test
    void borrowBook_shouldDecrementAvailableCopiesAndSaveRecord() {
        BorrowRequest request = new BorrowRequest();
        request.setMemberId(1L);
        request.setBookId(1L);

        BorrowRecord saved = BorrowRecord.builder()
                .id(1L).member(member).book(book).issueDate(LocalDate.now()).build();

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(borrowRecordRepository.save(any())).thenReturn(saved);

        borrowService.borrowBook(request);

        ArgumentCaptor<Book> bookCaptor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(bookCaptor.capture());
        assertThat(bookCaptor.getValue().getAvailableCopies()).isEqualTo(2);
    }

    @Test
    void returnBook_shouldSetReturnDateAndIncrementCopies() {
        BorrowRecord record = BorrowRecord.builder()
                .id(1L).member(member).book(book).issueDate(LocalDate.now().minusDays(5)).build();

        when(borrowRecordRepository.findById(1L)).thenReturn(Optional.of(record));
        when(borrowRecordRepository.save(any())).thenReturn(record);

        borrowService.returnBook(1L);

        ArgumentCaptor<Book> bookCaptor = ArgumentCaptor.forClass(Book.class);
        verify(bookRepository).save(bookCaptor.capture());
        assertThat(bookCaptor.getValue().getAvailableCopies()).isEqualTo(4);
        assertThat(record.getReturnDate()).isNotNull();
    }
}
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
mvn test -Dtest=BorrowServiceTest -q 2>&1 | tail -5
```
Expected: compilation error — `BorrowServiceImpl` does not exist yet.

- [ ] **Step 3: Create BorrowService interface**

`src/main/java/com/library/librarymanagement/service/BorrowService.java`:
```java
package com.library.librarymanagement.service;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import java.util.List;

public interface BorrowService {
    BorrowResponse borrowBook(BorrowRequest request);
    BorrowResponse returnBook(Long borrowRecordId);
    List<BorrowResponse> getActiveBorrows();
    List<BorrowResponse> getMemberHistory(Long memberId);
}
```

- [ ] **Step 4: Create BorrowServiceImpl**

`src/main/java/com/library/librarymanagement/service/impl/BorrowServiceImpl.java`:
```java
package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.entity.BorrowRecord;
import com.library.librarymanagement.entity.Member;
import com.library.librarymanagement.exception.BookNotFoundException;
import com.library.librarymanagement.exception.BookNotAvailableException;
import com.library.librarymanagement.exception.MemberNotFoundException;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowRecordRepository;
import com.library.librarymanagement.repository.MemberRepository;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public BorrowServiceImpl(BorrowRecordRepository borrowRecordRepository,
                              BookRepository bookRepository,
                              MemberRepository memberRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new MemberNotFoundException(
                        "Member not found with id: " + request.getMemberId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookNotFoundException(
                        "Book not found with id: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BookNotAvailableException(
                    "No available copies for book: " + book.getTitle());
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .member(member)
                .book(book)
                .issueDate(LocalDate.now())
                .build();

        return BorrowResponse.from(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public BorrowResponse returnBook(Long borrowRecordId) {
        BorrowRecord record = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new RuntimeException(
                        "Borrow record not found with id: " + borrowRecordId));

        record.setReturnDate(LocalDate.now());

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return BorrowResponse.from(borrowRecordRepository.save(record));
    }

    @Override
    public List<BorrowResponse> getActiveBorrows() {
        return borrowRecordRepository.findByReturnDateIsNull()
                .stream()
                .map(BorrowResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<BorrowResponse> getMemberHistory(Long memberId) {
        return borrowRecordRepository.findByMemberId(memberId)
                .stream()
                .map(BorrowResponse::from)
                .collect(Collectors.toList());
    }
}
```

- [ ] **Step 5: Run tests and confirm they pass**

```bash
mvn test -Dtest=BorrowServiceTest -q
```
Expected: `Tests run: 3, Failures: 0, Errors: 0`

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/library/librarymanagement/service/ src/test/java/com/library/librarymanagement/service/BorrowServiceTest.java
git commit -m "feat: add BorrowService with borrow/return logic and unit tests"
```

---

### Task 8: GlobalExceptionHandler

**Files:**
- Create: `src/main/java/com/library/librarymanagement/exception/GlobalExceptionHandler.java`

**Interfaces:**
- Consumes: `BookNotFoundException`, `MemberNotFoundException`, `BookNotAvailableException`, `ErrorResponse` (Task 3)
- Produces: consistent `ErrorResponse` JSON for all handled exceptions

- [ ] **Step 1: Create GlobalExceptionHandler**

`src/main/java/com/library/librarymanagement/exception/GlobalExceptionHandler.java`:
```java
package com.library.librarymanagement.exception;

import com.library.librarymanagement.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBookNotFound(
            BookNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(LocalDateTime.now(), 404, "Not Found",
                        ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleMemberNotFound(
            MemberNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(LocalDateTime.now(), 404, "Not Found",
                        ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleBookNotAvailable(
            BookNotAvailableException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorResponse(LocalDateTime.now(), 409, "Conflict",
                        ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorResponse(LocalDateTime.now(), 409, "Conflict",
                        "Duplicate value: phone number already exists",
                        request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ErrorResponse(LocalDateTime.now(), 400, "Bad Request",
                        message, request.getRequestURI()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleGenericRuntime(
            RuntimeException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(LocalDateTime.now(), 404, "Not Found",
                        ex.getMessage(), request.getRequestURI()));
    }
}
```

- [ ] **Step 2: Verify compilation**

```bash
mvn compile
```
Expected: `BUILD SUCCESS`

- [ ] **Step 3: Commit**

```bash
git add src/main/java/com/library/librarymanagement/exception/GlobalExceptionHandler.java
git commit -m "feat: add GlobalExceptionHandler with consistent error response"
```

---

### Task 9: Controllers

**Files:**
- Create: `src/main/java/com/library/librarymanagement/controller/BookController.java`
- Create: `src/main/java/com/library/librarymanagement/controller/MemberController.java`
- Create: `src/main/java/com/library/librarymanagement/controller/BorrowController.java`

**Interfaces:**
- Consumes: `BookService` (Task 5), `MemberService` (Task 6), `BorrowService` (Task 7)
- Produces: REST endpoints as listed in the design spec

- [ ] **Step 1: Create BookController**

`src/main/java/com/library/librarymanagement/controller/BookController.java`:
```java
package com.library.librarymanagement.controller;

import com.library.librarymanagement.dto.BookRequest;
import com.library.librarymanagement.dto.BookResponse;
import com.library.librarymanagement.service.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    public ResponseEntity<BookResponse> addBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addBook(request));
    }

    @GetMapping
    public ResponseEntity<Page<BookResponse>> getAllBooks(Pageable pageable) {
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchByAuthor(@RequestParam String author) {
        return ResponseEntity.ok(bookService.searchByAuthor(author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
```

- [ ] **Step 2: Create MemberController**

`src/main/java/com/library/librarymanagement/controller/MemberController.java`:
```java
package com.library.librarymanagement.controller;

import com.library.librarymanagement.dto.MemberRequest;
import com.library.librarymanagement.dto.MemberResponse;
import com.library.librarymanagement.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<MemberResponse> addMember(@Valid @RequestBody MemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.addMember(request));
    }

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberResponse> updateMember(
            @PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return ResponseEntity.ok(memberService.updateMember(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
```

- [ ] **Step 3: Create BorrowController**

`src/main/java/com/library/librarymanagement/controller/BorrowController.java`:
```java
package com.library.librarymanagement.controller;

import com.library.librarymanagement.dto.BorrowRequest;
import com.library.librarymanagement.dto.BorrowResponse;
import com.library.librarymanagement.service.BorrowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping
    public ResponseEntity<BorrowResponse> borrowBook(@RequestBody BorrowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowService.borrowBook(request));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BorrowResponse>> getActiveBorrows() {
        return ResponseEntity.ok(borrowService.getActiveBorrows());
    }

    @GetMapping("/history/{memberId}")
    public ResponseEntity<List<BorrowResponse>> getMemberHistory(@PathVariable Long memberId) {
        return ResponseEntity.ok(borrowService.getMemberHistory(memberId));
    }
}
```

- [ ] **Step 4: Run all tests + compile**

```bash
mvn test -q
```
Expected: `Tests run: 6, Failures: 0, Errors: 0` (BookServiceTest + BorrowServiceTest)

- [ ] **Step 5: Commit**

```bash
git add src/main/java/com/library/librarymanagement/controller/
git commit -m "feat: add BookController, MemberController, BorrowController"
```

---

### Task 10: SQL Schema + Postman Collection

**Files:**
- Create: `database/library_schema.sql`
- Create: `postman/Library-Management.postman_collection.json`

**Interfaces:**
- Produces: graded deliverables #2 and #3

- [ ] **Step 1: Create database/library_schema.sql**

```sql
-- Optional manual setup/reference script.
-- The application will auto-create the schema via JPA (ddl-auto=update) on first run.
-- To use manually: run this script in MySQL before starting the app.

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

DROP TABLE IF EXISTS borrow_records;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

CREATE TABLE books (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    title         VARCHAR(255) NOT NULL,
    author        VARCHAR(255),
    category      VARCHAR(255),
    available_copies INT       NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE members (
    id    BIGINT       NOT NULL AUTO_INCREMENT,
    name  VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_member_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE borrow_records (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    member_id   BIGINT NOT NULL,
    book_id     BIGINT NOT NULL,
    issue_date  DATE   NOT NULL,
    return_date DATE,
    PRIMARY KEY (id),
    CONSTRAINT fk_borrow_member FOREIGN KEY (member_id) REFERENCES members (id),
    CONSTRAINT fk_borrow_book   FOREIGN KEY (book_id)   REFERENCES books (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data
INSERT INTO books (title, author, category, available_copies) VALUES
    ('The Great Gatsby',   'F. Scott Fitzgerald', 'Fiction',     3),
    ('Clean Code',         'Robert C. Martin',    'Programming', 2),
    ('Sapiens',            'Yuval Noah Harari',   'History',     5),
    ('Effective Java',     'Joshua Bloch',        'Programming', 4),
    ('The Pragmatic Programmer', 'David Thomas',  'Programming', 1);

INSERT INTO members (name, email, phone) VALUES
    ('Alice Johnson', 'alice@example.com', '9876543210'),
    ('Bob Smith',     'bob@example.com',   '9876543211'),
    ('Carol White',   'carol@example.com', '9876543212');

INSERT INTO borrow_records (member_id, book_id, issue_date, return_date) VALUES
    (1, 1, '2026-07-01', '2026-07-15'),
    (2, 2, '2026-07-20', NULL),
    (3, 3, '2026-08-01', NULL);
```

- [ ] **Step 2: Create postman/Library-Management.postman_collection.json**

```json
{
  "info": {
    "name": "Library Management System",
    "_postman_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Books",
      "item": [
        {
          "name": "Add Book",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{baseUrl}}/api/books", "host": ["{{baseUrl}}"], "path": ["api","books"]},
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Clean Code\",\n  \"author\": \"Robert C. Martin\",\n  \"category\": \"Programming\",\n  \"availableCopies\": 5\n}"
            }
          }
        },
        {
          "name": "Get All Books (Paginated)",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/books?page=0&size=10&sort=title,asc",
              "host": ["{{baseUrl}}"],
              "path": ["api","books"],
              "query": [
                {"key": "page", "value": "0"},
                {"key": "size", "value": "10"},
                {"key": "sort", "value": "title,asc"}
              ]
            }
          }
        },
        {
          "name": "Get Book by ID",
          "request": {
            "method": "GET",
            "url": {"raw": "{{baseUrl}}/api/books/1", "host": ["{{baseUrl}}"], "path": ["api","books","1"]}
          }
        },
        {
          "name": "Search Books by Author",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/api/books/search?author=Martin",
              "host": ["{{baseUrl}}"],
              "path": ["api","books","search"],
              "query": [{"key": "author", "value": "Martin"}]
            }
          }
        },
        {
          "name": "Update Book",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{baseUrl}}/api/books/1", "host": ["{{baseUrl}}"], "path": ["api","books","1"]},
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Clean Code (Updated)\",\n  \"author\": \"Robert C. Martin\",\n  \"category\": \"Programming\",\n  \"availableCopies\": 10\n}"
            }
          }
        },
        {
          "name": "Delete Book",
          "request": {
            "method": "DELETE",
            "url": {"raw": "{{baseUrl}}/api/books/1", "host": ["{{baseUrl}}"], "path": ["api","books","1"]}
          }
        }
      ]
    },
    {
      "name": "Members",
      "item": [
        {
          "name": "Add Member",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{baseUrl}}/api/members", "host": ["{{baseUrl}}"], "path": ["api","members"]},
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Alice Johnson\",\n  \"email\": \"alice@example.com\",\n  \"phone\": \"9876543210\"\n}"
            }
          }
        },
        {
          "name": "Get All Members",
          "request": {
            "method": "GET",
            "url": {"raw": "{{baseUrl}}/api/members", "host": ["{{baseUrl}}"], "path": ["api","members"]}
          }
        },
        {
          "name": "Update Member",
          "request": {
            "method": "PUT",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{baseUrl}}/api/members/1", "host": ["{{baseUrl}}"], "path": ["api","members","1"]},
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Alice Johnson (Updated)\",\n  \"email\": \"alice.new@example.com\",\n  \"phone\": \"9876543210\"\n}"
            }
          }
        },
        {
          "name": "Delete Member",
          "request": {
            "method": "DELETE",
            "url": {"raw": "{{baseUrl}}/api/members/1", "host": ["{{baseUrl}}"], "path": ["api","members","1"]}
          }
        }
      ]
    },
    {
      "name": "Borrow",
      "item": [
        {
          "name": "Borrow Book",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "{{baseUrl}}/api/borrow", "host": ["{{baseUrl}}"], "path": ["api","borrow"]},
            "body": {
              "mode": "raw",
              "raw": "{\n  \"memberId\": 1,\n  \"bookId\": 2\n}"
            }
          }
        },
        {
          "name": "Return Book",
          "request": {
            "method": "PUT",
            "url": {"raw": "{{baseUrl}}/api/borrow/return/1", "host": ["{{baseUrl}}"], "path": ["api","borrow","return","1"]}
          }
        },
        {
          "name": "Get Active Borrows",
          "request": {
            "method": "GET",
            "url": {"raw": "{{baseUrl}}/api/borrow/active", "host": ["{{baseUrl}}"], "path": ["api","borrow","active"]}
          }
        },
        {
          "name": "Get Member Borrow History",
          "request": {
            "method": "GET",
            "url": {"raw": "{{baseUrl}}/api/borrow/history/1", "host": ["{{baseUrl}}"], "path": ["api","borrow","history","1"]}
          }
        }
      ]
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add database/ postman/
git commit -m "feat: add SQL schema and Postman collection"
```

---

### Task 11: README + .gitignore

**Files:**
- Create: `README.md`
- Create: `.gitignore`

**Interfaces:**
- Produces: graded deliverables #4 and #5

- [ ] **Step 1: Create README.md**

```markdown
# Library Management System

A Spring Boot REST API for managing a library — books, members, and borrow/return records.

## Tech Stack

- Java 17
- Spring Boot 3.4.1
- Spring Web, Spring Data JPA, Spring Validation
- MySQL 8
- Maven
- Lombok

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8 running locally

## MySQL Setup

**Option 1 — Let the app create the schema (recommended):**

1. Create the database: `CREATE DATABASE library_db;`
2. Configure credentials (see below) and run the app — Hibernate creates all tables automatically.

**Option 2 — Run the reference script:**

```bash
mysql -u root -p < database/library_schema.sql
```

This script is idempotent and includes sample data.

## Configuration

Set credentials via environment variables (defaults shown):

```bash
export DB_USERNAME=root
export DB_PASSWORD=root
```

Or edit `src/main/resources/application.properties` directly.

## Run

```bash
mvn spring-boot:run
```

App starts at `http://localhost:8080`.

## API Endpoints

### Books

| Method | Path | Description | Sample Request Body |
|--------|------|-------------|---------------------|
| POST | `/api/books` | Add a book | `{"title":"Clean Code","author":"Robert C. Martin","category":"Programming","availableCopies":5}` |
| GET | `/api/books?page=0&size=10` | Get all books (paginated) | — |
| GET | `/api/books/{id}` | Get book by ID | — |
| GET | `/api/books/search?author=Martin` | Search by author | — |
| PUT | `/api/books/{id}` | Update book | `{"title":"Updated Title","author":"Author","category":"Cat","availableCopies":3}` |
| DELETE | `/api/books/{id}` | Delete book | — |

### Members

| Method | Path | Description | Sample Request Body |
|--------|------|-------------|---------------------|
| POST | `/api/members` | Add a member | `{"name":"Alice","email":"alice@example.com","phone":"9876543210"}` |
| GET | `/api/members` | Get all members | — |
| PUT | `/api/members/{id}` | Update member | `{"name":"Alice Updated","email":"alice@example.com","phone":"9876543210"}` |
| DELETE | `/api/members/{id}` | Delete member | — |

### Borrow

| Method | Path | Description | Sample Request Body |
|--------|------|-------------|---------------------|
| POST | `/api/borrow` | Borrow a book | `{"memberId":1,"bookId":2}` |
| PUT | `/api/borrow/return/{id}` | Return a book | — |
| GET | `/api/borrow/active` | View active borrows | — |
| GET | `/api/borrow/history/{memberId}` | Member borrow history | — |

## Error Responses

All errors return:
```json
{
  "timestamp": "2026-08-04T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Book not found with id: 99",
  "path": "/api/books/99"
}
```

## Postman Collection

Import `postman/Library-Management.postman_collection.json` into Postman.  
Set the `baseUrl` variable to `http://localhost:8080`.
```

- [ ] **Step 2: Create .gitignore**

```gitignore
# Maven
target/
*.class
*.jar
*.war
*.ear
*.zip
*.tar.gz
*.rar

# IDE
.idea/
*.iml
*.iws
.classpath
.project
.settings/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Spring Boot
*.log
logs/

# Environment
.env
application-local.properties
```

- [ ] **Step 3: Commit**

```bash
git add README.md .gitignore
git commit -m "docs: add README and .gitignore"
```

---

### Task 12: Final Compile Verification + Fix Any Errors

**Files:** Any files with compile errors

- [ ] **Step 1: Run mvn compile and capture output**

```bash
mvn compile 2>&1
```
Expected: `BUILD SUCCESS`. If errors appear, fix them before proceeding.

- [ ] **Step 2: Run all unit tests**

```bash
mvn test -q
```
Expected: `Tests run: 6, Failures: 0, Errors: 0`

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any compile errors found during final verification"
```

---

## Self-Review

**Spec coverage check:**
- [x] Book CRUD (add, get all paginated, get by id, update, delete) → Tasks 5, 9
- [x] Member CRUD (add, get all, update, delete) → Tasks 6, 9
- [x] Borrow book with availableCopies check → Task 7
- [x] Return book with increment → Task 7
- [x] Active borrows view → Task 7, 9
- [x] Member borrow history → Task 7, 9
- [x] Search by author → Task 5, 9
- [x] Pagination on get-all-books → Task 5, 9
- [x] Bean validation on DTOs → Task 3
- [x] Unique phone at DB level + graceful error handling → Tasks 2 (entity), 3 (exception), 8 (handler)
- [x] BookNotFoundException, MemberNotFoundException, BookNotAvailableException → Task 3
- [x] GlobalExceptionHandler with consistent JSON → Task 8
- [x] application.properties with MySQL config + env var placeholders → Task 1
- [x] library_schema.sql (idempotent, matches Hibernate output) → Task 10
- [x] Postman collection (all 14 endpoints, {{baseUrl}}) → Task 10
- [x] README with setup + endpoint table → Task 11
- [x] .gitignore → Task 11
- [x] mvn compile verification → Task 12

**Type consistency:** All method signatures referenced in later tasks match definitions in earlier tasks. `BookResponse.from(Book)`, `MemberResponse.from(Member)`, `BorrowResponse.from(BorrowRecord)` are defined in Task 3 and used consistently across Tasks 5–9.
