# Library Management System

A full-stack Library Management System built with **React (Vite)** for the frontend and **Spring Boot (Java)** for the backend with **MySQL**.

---

## 📁 Repository Structure

```
.
├── library-management-frontend/   # React + Vite Frontend UI
├── library_management_system/     # Spring Boot REST API Backend
└── start_app.bat                  # One-click launcher script for Windows
```

---

## 🚀 Quick Start

### Option 1: One-Click Startup (Windows)
Run the `start_app.bat` script in the root directory to launch both the backend server and frontend development server automatically.

```cmd
start_app.bat
```

---

### Option 2: Manual Setup

#### 1. Backend Setup (`library_management_system`)
* **Prerequisites**: Java 17+, Maven 3.8+, MySQL 8.0+
* **Database Setup**:
  Create the MySQL database:
  ```sql
  CREATE DATABASE IF NOT EXISTS library_db;
  ```
* **Run Backend**:
  ```bash
  cd library_management_system
  mvn spring-boot:run
  ```
  The API will be available at `http://localhost:8080`.

#### 2. Frontend Setup (`library-management-frontend`)
* **Prerequisites**: Node.js 18+
* **Run Frontend**:
  ```bash
  cd library-management-frontend
  npm install
  npm run dev
  ```
  The app will be running at `http://localhost:5173`.

---

## ✨ Features

* **Book Management**: Add, update, search, and manage book availability.
* **Member Management**: Track active library members and registration details.
* **Borrow & Return System**: Issue books to members and process returns.
* **Dashboard Analytics**: Real-time stats on active borrows, available books, and total members.

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Lucide Icons, CSS Module Design System
* **Backend**: Java 17, Spring Boot 3.4.1, Spring Data JPA, Hibernate, Lombok
* **Database**: MySQL 8.0
