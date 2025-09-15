# Kairo - Personal Cloud Storage Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/a1e7e4d8-7b9c-4b3f-8c38-230058b8f2d1/deploy-status)](https://velvety-rabanadas-400b48.netlify.app)

Kairo is a full-stack personal cloud storage application built from the ground up to provide users with a secure and intuitive platform for managing their files. It features a modern, clean interface and a robust security model to ensure complete data isolation between users.

### 🔴 **Live Demo:** [https://velvety-rabanadas-400b48.netlify.app](https://velvety-rabanadas-400b48.netlify.app)


---

## Core Features

-   **Secure User Authentication:** Full sign-up and login functionality managed by Supabase Auth.
-   **Private & Public File Storage:** Users can choose to upload files to a private space (only accessible to them) or a public space (downloadable by any user).
-   **Advanced File Management:** A clean, table-based UI to view file details like name, type, size, and upload date.
-   **Real-time Search:** Instantly filter public or private files by name.
-   **User Actions:** Securely delete owned files and download any public file.
-   **Robust Security Model:** Utilizes Supabase's Row Level Security (RLS) and Storage Policies to enforce strict data access rules at the backend level, making it impossible for one user to access another's private data.

---

## Technology Stack

The project is built on a modern Jamstack architecture, decoupling the frontend from the backend services.

#### **Frontend**
-   **React.js:** A JavaScript library for building user interfaces.
-   **Vite:** A fast, modern build tool for frontend development.
-   **React Router:** For client-side routing and navigation.

#### **Backend (BaaS)**
-   **Supabase:** An open-source Firebase alternative providing a complete backend solution.
    -   **PostgreSQL Database:** To store file metadata and user information.
    -   **Supabase Auth:** For user authentication and management.
    -   **Supabase Storage:** To store the actual file objects securely.

#### **Deployment & Version Control**
-   **Netlify:** For continuous deployment and hosting of the frontend.
-   **Git & GitHub:** For version control and source code management.

---

## Local Development Setup

To clone and run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AgnilaJain/kairo-app.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd kairo-app
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your environment variables:**
    -   Create a new file in the root of the project named `.env.local`.
    -   Add your Supabase project URL and Public Anon Key to this file:
        ```
        VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
    -   You can find these keys in your Supabase project dashboard under `Project Settings > API`.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

This project was built as a comprehensive demonstration of full-stack development principles, from initial design and secure backend configuration to a live, production-ready deployment.
