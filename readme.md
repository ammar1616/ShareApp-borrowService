# ShareApp-BorrowService

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
    - [Create Borrow Request](#create-borrow-request)
    - [Update Borrow Request](#update-borrow-request)
    - [Get Borrowed Items](#get-borrowed-items)
    - [Get Lent Items](#get-lent-items)
7. [Testing](#testing)
8. [Contributing](#contributing)


## Overview

The Borrow Service is a Node.js backend application designed to manage borrowing transactions in a sharing economy application. It facilitates the process of borrowing items between users and ensures smooth handling of borrowing requests. The application utilizes Firebase for data storage and authentication.


## Features

1. **Borrow Request Management:**
   - Allow users to create, retrieve, and update borrow requests.
   - Handle validation of borrow request data for completeness and accuracy.

2. **Item Lending Management:**
   - Provide endpoints to fetch items that a user has borrowed and lent out.
   - Track the status and details of items borrowed and lent.

3. **Middleware Architecture:**
   - Implement middleware functions for authentication and error handling.
   - Secure user routes with JWT token authentication.


## Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Firebase credentials file (`share-7b17f-firebase-adminsdk-vh7sw-9738641bea.json`)
- [Other dependencies, tools, or services]


## Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ammar1616/ShareApp-BorrowService.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the `.env.example` file to `.env`.
   - Update the `.env` file with your configuration details.

4. **Run the Application:**
   ```bash
   npm start
   ```


## Project Structure

The project follows a modular structure:

- **controllers:** Handle business logic for different routes.
- **middlewares:** Custom middleware functions, including authentication and error handling.
- **validations:** Data validation using Joi.
- **routes:** Define API routes for managing borrow requests and item lending.
- **startup:** Initialization scripts for Firebase and route setup.


## Usage

### Create Borrow Request

- **Description:** Creates a new borrow request for an item.
- **Method:** POST
- **Endpoint:** `/borrow-service/`
- **Headers:**
  - `Content-Type`: application/json
  - `x-auth-token`: [your_token_here]
- **Request Body:**
  ```json
  {
    "itemId": "123456",
    "startDate": "2024-03-15",
    "endDate": "2024-03-20",
    "conditionBefore": "Good condition"
  }
  ```
- **Example:**
  ```bash
  curl -X POST \
    -H "Content-Type: application/json" \
    -H "x-auth-token: [your_token_here]" \
    -d '{"itemId": "123456", "startDate": "2024-03-15", "endDate": "2024-03-20", "conditionBefore": "Good condition"}' \
    http://localhost:5000/borrow-service/
  ```
- **Response:**  
  - **Status Code:** 200 OK
  - **Body:** 
    ```json
    {
      "message": "Borrow request created successfully!"
    }
    ```
- **Notes:** 
  - This endpoint requires a valid authentication token (`x-auth-token` header).

### Update Borrow Request

- **Description:** Updates an existing borrow request.
- **Method:** PATCH
- **Endpoint:** `/borrow-service/:id`
- **Headers:**
  - `Content-Type`: application/json
  - `x-auth-token`: [your_token_here]
- **Request Body:** Include the fields to be updated (e.g., `status`).
- **Example:**
  ```bash
  curl -X PATCH \
    -H "Content-Type: application/json" \
    -H "x-auth-token: [your_token_here]" \
    -d '{"status": "active"}' \
    http://localhost:5000/borrow-service/123456
  ```
- **Response:**  
  - **Status Code:** 200 OK
  - **Body:** 
    ```json
    {
      "message": "Borrow request updated successfully!"
    }
    ```
- **Notes:** 
  - This endpoint requires a valid authentication token (`x-auth-token` header).

### Get Borrowed Items

- **Description:** Retrieves items borrowed by the authenticated user.
- **Method:** GET
- **Endpoint:** `/borrow-service/borrowed`
- **Headers:**
  - `x-auth-token`: [your_token_here]
- **Example:**
  ```bash
  curl -X GET \
    -H "x-auth-token: [your_token_here]" \
    http://localhost:5000/borrow-service/borrowed
  ```
- **Response:**  
  - **Status Code:** 200 OK
  - **Body:** 
    ```json
    {
      "borrowedItems": [...]
    }
    ```
- **Notes:** 
  - This endpoint requires a valid authentication token (`x-auth-token` header).

### Get Lent Items

- **Description:** Retrieves items lent out by the authenticated user.
- **Method:** GET
- **Endpoint:** `/borrow-service/lent`
- **Headers:**
  - `x-auth-token`: [your_token_here]
- **Example:**
  ```bash
  curl -X GET \
    -H "x-auth-token: [your_token_here]" \
    http://localhost:5000/borrow-service/lent
  ```
- **Response:**  
  - **Status Code:** 200 OK
  - **Body:** 
    ```json
    {
      "lentItems": [...]
    }
    ```
- **Notes:** 
  - This endpoint requires a valid authentication token (`x-auth-token` header).


## Testing

To run tests, execute the following command:

```bash
npm test
```

The testing strategy includes unit tests for individual components, ensuring robustness and reliability.


## Contributing

We welcome contributions! Follow these guidelines to contribute to the project:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit.
4. Submit a pull request.

Thanks for Your Interest!
