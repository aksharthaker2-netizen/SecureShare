# SecureShare

SecureShare is a full-stack file sharing platform that allows users to upload, manage, share, and track files securely through unique shareable links.

The project was built to learn and demonstrate full-stack web development concepts including authentication, authorization, file uploads, database management, analytics, and secure sharing systems.

---

## Features

### Authentication & Security

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt
- Forgot Password Functionality
- Password Reset using Secure Tokens

### File Management

- Upload Files
- View Uploaded Files
- Delete Files
- Open Files Directly
- File Storage using Multer

### File Sharing

- Generate Shareable Links
- Copy Share Link to Clipboard
- Public File Access using Unique Tokens
- Manage Active Share Links
- Revoke Existing Share Links

### Analytics Dashboard

- Total Uploaded Files
- Total File Views
- Total Downloads
- Per-file View Tracking

### User Experience

- Responsive Dashboard
- Modern Authentication Pages
- Clean File Management Interface
- Empty State Handling
- Logout Functionality

---

## Tech Stack

### Frontend

- React.js
- React Router DOM
- JavaScript (ES6+)
- CSS

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- JWT (JSON Web Tokens)
- bcrypt

### File Handling

- Multer

### Environment Management

- dotenv

---

## Project Architecture

Frontend (React)

```txt
Login
Signup
Dashboard
Forgot Password
Reset Password
Share Links
```

↓

Backend (Node.js + Express)

```txt
Authentication Routes
File Routes
Share Routes
Analytics Routes
```

↓

Database (MySQL)

```txt
users
files
shared_files
password_resets
```

---

## Database Tables

### users

Stores registered user information.

```txt
id
name
email
password
```

### files

Stores uploaded file metadata.

```txt
id
user_id
filename
upload_date
views
downloads
```

### shared_files

Stores generated share links.

```txt
id
file_id
share_token
created_at
```

### password_resets

Stores temporary reset tokens.

```txt
id
user_id
reset_token
expires_at
```

---

## Installation

### Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=secureshare

JWT_SECRET=your_secret_key
PORT=5000
```

---

## Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Token-based Password Reset
- Protected API Endpoints
- Authorization Middleware
- One-time Password Reset Tokens

---

## Key Concepts Learned

During development of SecureShare, the following concepts were implemented and practiced:

- React Components
- React State Management
- React Routing
- REST APIs
- JWT Authentication
- Middleware
- Password Hashing
- File Upload Handling
- MySQL Database Design
- SQL Queries
- Shareable Link Systems
- Analytics Tracking
- Environment Variables
- Git & GitHub Workflow

---

## Future Improvements

- Email-based Password Reset
- File Rename Functionality
- File Search
- Drag & Drop Uploads
- User Profile Page
- File Expiration Links
- Download History
- Cloud Storage Integration
- Dark Mode

---

## Screenshots

### Login Page
screenshots/login.png

### Dashboard

screenshots/dashboard.png

### Share Links Page

screenshots/Manage-Links.png

### Forgot Password Page

screenshots/Forgot-Password.png

---

## Author

Akshar Thaker

Built as a full-stack web development project to strengthen backend, frontend, database, authentication, and software engineering skills.