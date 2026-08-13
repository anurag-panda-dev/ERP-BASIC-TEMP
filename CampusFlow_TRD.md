# Technical Requirements Document (TRD): CampusFlow

## 1. System Architecture Overview
CampusFlow is a standard monolithic, three-tier web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js). 

For long-term stability and simplicity, we are avoiding microservices. A modular monolith approach ensures that as the system grows (e.g., adding Library or Fee modules), code remains organized without the operational overhead of managing distributed systems.

*   **Client Tier:** React Single Page Application (SPA).
*   **Application Tier:** Node.js/Express RESTful API server.
*   **Data Tier:** MongoDB (NoSQL) database.

## 2. Frontend Responsibilities
The frontend will be built using **React (via Vite for fast build tooling)**.

*   **State Management:** Context API for global state (User Session, Role, theme preferences). React Query (TanStack Query) for asynchronous data fetching, caching, and state synchronization with the backend. *Rationale: Avoids the boilerplate of Redux and handles server-state caching perfectly for dashboards.*
*   **Routing:** React Router DOM (v6+). Protected routes based on JWT and user roles (`/student/*`, `/faculty/*`, `/admin/*`).
*   **UI/UX:** Tailwind CSS for fast, utility-first styling. Radix UI or shadcn/ui for accessible, unstyled component primitives (modals, dropdowns) to ensure a polished look without heavy library lock-in.
*   **Risk Detector Logic:** The simple rule-based logic (e.g., < 60% = Red) will be evaluated by the backend API and returned as a status flag. The frontend is solely responsible for rendering the color-coded indicators, keeping business logic off the client.

## 3. Backend Responsibilities
The backend will be a **Node.js application using the Express framework**.

*   **API Design:** Strictly RESTful, JSON-based APIs.
*   **Architecture Pattern:** Controller-Service-Model architecture. 
    *   *Routes* define HTTP endpoints.
    *   *Controllers* parse requests and format responses.
    *   *Services* contain the core business logic (e.g., calculating risk scores, validating attendance constraints).
    *   *Models* interact with the database.
*   **Validation:** Zod for robust runtime schema validation of incoming requests to prevent malformed data from reaching the database.
*   **Error Handling:** A centralized error-handling middleware that catches exceptions and formats standard JSON error responses (e.g., `{ error: "Not Found", status: 404 }`).

## 4. Database Schema Proposal (MongoDB)
Using **Mongoose** as the ODM (Object Data Modeling) library for schema validation at the database level.

### `User` Collection
*   `_id`: ObjectId
*   `userId`: String (Unique index, e.g., 'STU-001')
*   `name`: String (Required)
*   `email`: String (Unique index, Required)
*   `password`: String (Hashed via bcrypt)
*   `role`: Enum ['admin', 'faculty', 'student']
*   `department`: ObjectId (Ref: 'Department')
*   `semester`: Number (Required if role=student)
*   `isActive`: Boolean (Default: true - soft delete mechanism)

### `Subject` Collection
*   `_id`: ObjectId
*   `subjectCode`: String (Unique index)
*   `name`: String
*   `department`: ObjectId (Ref: 'Department')
*   `semester`: Number
*   `assignedFaculty`: ObjectId (Ref: 'User', role='faculty')

### `Attendance` Collection
*   `_id`: ObjectId
*   `subject`: ObjectId (Ref: 'Subject', Indexed)
*   `date`: Date (Indexed)
*   `records`: Array of sub-documents:
    *   `student`: ObjectId (Ref: 'User')
    *   `status`: Enum ['Present', 'Absent']

### `Assessment` (Marks) Collection
*   `_id`: ObjectId
*   `subject`: ObjectId (Ref: 'Subject', Indexed)
*   `title`: String (e.g., "Midterm 1")
*   `maxMarks`: Number
*   `records`: Array of sub-documents:
    *   `student`: ObjectId (Ref: 'User')
    *   `marksObtained`: Number

### `Notice` Collection
*   `_id`: ObjectId
*   `title`: String
*   `content`: String
*   `author`: ObjectId (Ref: 'User')
*   `audience`: Enum ['global', 'class']
*   `targetSubject`: ObjectId (Ref: 'Subject', optional)
*   `createdAt`: Date (Default: Date.now, Indexed)

*Optimization Note: Added indexing on `subject` and `date` in Attendance, and `subject` in Assessments to ensure fast dashboard aggregation queries.*

## 5. API Structure (RESTful)

### Auth
*   `POST /api/auth/login` - Authenticate user, returns JWT and basic profile.
*   `GET /api/auth/me` - Validate JWT and return current user details.

### Users (Admin Only)
*   `GET /api/users` - List users (supports query filters for role/dept).
*   `POST /api/users` - Create user.
*   `PUT /api/users/:id` - Update user details/role.
*   `DELETE /api/users/:id` - Soft delete user (sets isActive = false).

### Subjects (Admin/Faculty)
*   `GET /api/subjects` - List subjects (Admin sees all, Faculty sees assigned).
*   `POST /api/subjects` - Create subject (Admin only).
*   `PUT /api/subjects/:id` - Update subject/assign faculty.

### Academic (Attendance & Marks)
*   `GET /api/attendance?subjectId=X&date=Y` - Fetch attendance records.
*   `POST /api/attendance` - Submit/update daily attendance (Faculty only).
*   `GET /api/assessments?subjectId=X` - Fetch assessments and marks.
*   `POST /api/assessments` - Create a new assessment and upload marks (Faculty only).

### Dashboards (Aggregations)
*   `GET /api/dashboard/student/:id` - Aggregated endpoint returning attendance %, all marks, and Risk Detector status for the current semester to minimize frontend network requests.

### Notices
*   `GET /api/notices` - Get feed of applicable notices (Global + enrolled subjects).
*   `POST /api/notices` - Create a notice (Admin/Faculty).

## 6. Authentication Strategy
*   **Mechanism:** JSON Web Tokens (JWT).
*   **Flow:** 
    1. Client posts credentials.
    2. Server validates, signs a JWT (containing user `_id` and `role`), and sends it back to the client.
    3. The client stores the JWT in `localStorage` or memory, and sends it in the `Authorization: Bearer <token>` header for subsequent requests.
*   **Security:** Passwords hashed using `bcrypt` (salt rounds: 10).
*   **Authorization:** Middleware function `requireRole(['admin', 'faculty'])` applied to specific Express routes to enforce RBAC (Role-Based Access Control) at the endpoint level.

## 7. Third-Party Dependencies

### Frontend (React/Vite)
*   `axios`: HTTP client with interceptors for easy token injection.
*   `react-router-dom`: SPA Routing.
*   `@tanstack/react-query`: Data fetching, caching, and state synchronization.
*   `tailwindcss`: CSS styling system.
*   `lucide-react`: Lightweight SVG icons.
*   `recharts`: For visualizing attendance/marks trends on the dashboard.

### Backend (Node.js)
*   `express`: Web framework.
*   `mongoose`: MongoDB ODM.
*   `jsonwebtoken`: JWT generation/verification.
*   `bcryptjs`: Password hashing.
*   `zod`: Request payload validation.
*   `dotenv`: Environment variable management.
*   `cors`: Cross-Origin Resource Sharing.
*   `morgan`: HTTP request logging.

## 8. Scalability & Stability Considerations
While not targeted for massive cloud scale initially, these practices ensure long-term stability and prevent "spaghetti code":

1.  **Pagination First:** APIs returning lists (Users, Notices, Attendance logs) must implement pagination (e.g., `?page=1&limit=20`) from day one to prevent out-of-memory crashes as the database grows.
2.  **Database Indexing:** The MongoDB schema explicitly requires indexing on frequent query fields (`userId`, `email`, `subject`, `date`) to maintain fast read operations for dashboards.
3.  **Modular Controllers:** Keeping Express routing separate from business logic (Services) means if we ever need to swap frameworks or write unit tests for the core logic, it remains untangled from HTTP req/res objects.
4.  **Stateless Backend:** The Node.js server relies on JWTs rather than server-side sessions. This means the backend is completely stateless and can easily be horizontally scaled (running multiple instances) without session affinity issues.
5.  **Strict Environment Config:** Clean separation of configuration (`.env`) for local and production environments, ensuring hardcoded secrets or database URIs never leak into the codebase.
