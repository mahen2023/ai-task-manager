# Project Name

## Overview

This project is a full-stack application with a React-Vite frontend, a Laravel backend, and a MySQL database.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Deployment Guides](#deployment-guides)
- [API Documentation](#api-documentation)

## Setup Instructions

### Prerequisites

- Node.js
- npm or yarn
- PHP
- Composer
- MySQL

### Frontend Setup

1. Navigate to the `server/client` directory:
   ```sh
   cd server/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `server/client` directory and add the following:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

### Backend Setup

1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   composer install
   ```
3. Create a `.env` file in the `server` directory and configure your database settings:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   ```
4. Generate an application key:
   ```sh
   php artisan key:generate
   ```
5. Run database migrations:
   ```sh
   php artisan migrate
   ```
6. Start the Laravel development server:
   ```sh
   php artisan serve
   ```

## Deployment Guides

### Frontend Deployment

1. Build the frontend:
   ```sh
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web server.

### Backend Deployment

1. Set up your production environment variables in the `.env` file.
2. Run database migrations:
   ```sh
   php artisan migrate --force
   ```
3. Deploy the Laravel application to your web server.

## API Documentation

### Authentication

- **Login**

  - **Endpoint:** `/api/auth/login`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "jwt_token",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
    ```

- **Register**

  - **Endpoint:** `/api/auth/register`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "user@example.com",
      "password": "password"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "jwt_token",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
    ```

- **Get Current User**
  - **Endpoint:** `/api/auth/me`
  - **Method:** GET
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
    ```

### Tasks

- **Get Tasks**

  - **Endpoint:** `/api/tasks`
  - **Method:** GET
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "title": "Task 1",
        "description": "Description for task 1"
      },
      ...
    ]
    ```

- **Create Task**

  - **Endpoint:** `/api/tasks`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "title": "New Task",
      "description": "Description for new task"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "title": "New Task",
      "description": "Description for new task"
    }
    ```

- **Update Task**

  - **Endpoint:** `/api/tasks/{id}`
  - **Method:** PATCH
  - **Request Body:**
    ```json
    {
      "title": "Updated Task",
      "description": "Updated description for task"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "title": "Updated Task",
      "description": "Updated description for task"
    }
    ```

- **Delete Task**
  - **Endpoint:** `/api/tasks/{id}`
  - **Method:** DELETE

### Users

- **Get Users**

  - **Endpoint:** `/api/users`
  - **Method:** GET
  - **Response:**
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
      },
      ...
    ]
    ```

- **Create User**

  - **Endpoint:** `/api/users`
  - **Method:** POST
  - **Request Body:**
    ```json
    {
      "name": "New User",
      "email": "newuser@example.com",
      "password": "password"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "New User",
      "email": "newuser@example.com"
    }
    ```

- **Update User**

  - **Endpoint:** `/api/users/{id}`
  - **Method:** PATCH
  - **Request Body:**
    ```json
    {
      "name": "Updated User",
      "email": "updateduser@example.com"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "name": "Updated User",
      "email": "updateduser@example.com"
    }
    ```

- **Delete User**
  - **Endpoint:** `/api/users/{id}`
  - **Method:** DELETE
