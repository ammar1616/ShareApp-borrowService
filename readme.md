# Borrows Service

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Testing](#testing)
8. [Contributing](#contributing)

## Overview

Borrows Service is a Node.js backend application designed to manage borrowing transactions in a sharing economy application. It facilitates the process of borrowing items between users and ensures smooth handling of borrowing requests. The application utilizes Firebase for data storage and authentication.

## Features

1. **Borrow Request Management:**
   - Allow users to create, retrieve, and update borrow requests.
   - Handle validation of borrow request data for completeness and accuracy.

2. **Item Lending Management:**
   - Provide endpoints to fetch items that a user has borrowed and lent out.
   - Track the status and details of items borrowed and lent.

3. **Escrow Transaction Integration:**
   - Integrate with a payment service for managing escrow transactions during borrowing.
   - Ensure secure and reliable financial transactions during the borrowing process.

4. **Middleware Architecture:**
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
   git clone https://github.com/ammar1616/ShareApp-borrowsService
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

To make use of the functionalities provided by **Borrows Service**, follow the instructions below:

### 1. Borrow Requests:

- **Create Borrow Request:**
  - Use the `/` endpoint with a POST request, providing details like `itemId`, `startDate`, `endDate`, and optional `conditionBefore`.
  - Example:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"itemId": "123456", "startDate": "2024-03-15", "endDate": "2024-03-20", "conditionBefore": "Good condition"}' http://localhost:5000/borrow-service/
    ```

- **Get Borrowed Items:**
  - Retrieve items borrowed by the user by making a GET request to the `/borrowed` endpoint.
  - Example:
    ```bash
    curl -X GET -H "x-auth-token: [your_token_here]" http://localhost:5000/borrow-service/borrowed
    ```

- **Get Lent Items:**
  - Retrieve items lent out by the user by making a GET request to the `/lent` endpoint.
  - Example:
    ```bash
    curl -X GET -H "x-auth-token: [your_token_here]" http://localhost:5000/borrow-service/lent
    ```

- **Update Borrow Request:**
  - Use the `/:id` endpoint with a PATCH request, providing the borrow request ID and the desired changes.
  - Example:
    ```bash
    curl -X PATCH -H "x-auth-token: [your_token_here]" -H "Content-Type: application/json" -d '{"status": "active"}' http://localhost:5000/borrow-service/123456
    ```

### 2. Escrow Transactions:

- **Create Escrow Transaction:**
  - Use the `/escrowTransaction` endpoint with a POST request to initiate an escrow transaction during borrowing.
  - Example:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"requestId": "123456", "lenderId": "user1", "borrowerId": "user2", "amount": 50}' http://localhost:5000/payment-service/escrowTransaction/
    ```

## Testing

To run tests, execute the following command:

```bash
npm test
