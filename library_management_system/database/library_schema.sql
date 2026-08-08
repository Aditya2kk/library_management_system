-- Library Management System — Schema Script
-- Idempotent: safe to run multiple times

CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- Drop tables in reverse FK order
DROP TABLE IF EXISTS borrow_records;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS books;

-- Books table
CREATE TABLE books (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    author VARCHAR(255),
    category VARCHAR(255),
    available_copies INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Members table
CREATE TABLE members (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_members_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Borrow records table
CREATE TABLE borrow_records (
    id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    issue_date DATE,
    return_date DATE,
    PRIMARY KEY (id),
    CONSTRAINT fk_borrow_member FOREIGN KEY (member_id) REFERENCES members (id),
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES books (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================
-- Sample data
-- =====================

INSERT INTO books (title, author, category, available_copies) VALUES
('Clean Code', 'Robert C. Martin', 'Software Engineering', 5),
('Effective Java', 'Joshua Bloch', 'Java', 3),
('Design Patterns', 'Gang of Four', 'Software Engineering', 2),
('The Pragmatic Programmer', 'Andrew Hunt', 'Software Engineering', 4),
('Head First Java', 'Kathy Sierra', 'Java', 6);

INSERT INTO members (name, email, phone) VALUES
('Alice Johnson', 'alice@example.com', '9876543210'),
('Bob Smith', 'bob@example.com', '9876543211'),
('Charlie Brown', 'charlie@example.com', '9876543212');

INSERT INTO borrow_records (member_id, book_id, issue_date, return_date) VALUES
(1, 1, '2026-08-01', NULL),
(2, 3, '2026-07-28', '2026-08-03'),
(1, 2, '2026-08-04', NULL);
