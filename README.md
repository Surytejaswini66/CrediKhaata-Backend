# CrediKhaata-Backend

## Project Description

CrediKhaata is a backend service that allows shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts. Built with Node.js, Express, and MongoDB, this application provides RESTful API endpoints to perform CRUD operations on customers and loans, track repayments, and offer bonus features like SMS/WhatsApp reminders, PDF receipt generation, and webhooks for repayment notifications.

## Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens).
- **Customer Management**: CRUD operations for customer profiles with validation.
- **Loan Management**: Create, view, and manage loans, including tracking repayments.
- **Repayment Tracking**: Record and update repayments, handling partial payments.
- **Overdue Alerts**: Identify and return overdue loans based on the due date.
- **Bonus Features**:
  - **SMS/WhatsApp Reminder API**: Mock API integration for sending SMS/WhatsApp reminders.
  - **PDF Receipt Generation**: Generate PDF receipts for loan repayments.
  - **Webhook Endpoint**: Create webhooks to notify external systems when repayments are recorded.

## Setup and Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/CrediKhaata-Backend.git
   cd CrediKhaata-Backend
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed. Then, install all necessary dependencies:

   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```text
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

   - Replace `your_mongodb_connection_string` with your MongoDB Atlas or local MongoDB URI.
   - Replace `your_jwt_secret` with a secure secret for JWT token generation.

4. **Run the Application**:
   Start the server with the following command:

   ```bash
   npm start
   ```

   By default, the application will run on `http://localhost:5000`.

## API Endpoints

### User Authentication

- **POST `/register`**: Register a new user (shopkeeper).
- **POST `/login`**: Login and receive a JWT token.

### Customer Management

- **POST `/customers`**: Create a new customer.
- **GET `/customers`**: Get a list of all customers for the logged-in user.
- **GET `/customers/:id`**: Get details of a specific customer.
- **PUT `/customers/:id`**: Update customer details.
- **DELETE `/customers/:id`**: Delete a customer.

### Loan Management

- **POST `/loans`**: Create a new loan for a customer.
- **GET `/loans`**: Get all active loans for the logged-in user.
- **GET `/loans/:id`**: Get details of a specific loan.
- **PUT `/loans/:id`**: Update loan details.
- **DELETE `/loans/:id`**: Delete a loan.

### Repayment Tracking

- **POST `/repayments`**: Record a repayment for a specific loan.
- **GET `/repayments/:loanId`**: Get all repayments for a specific loan.

### Loan Summary & Overdue Alerts

- **GET `/summary`**: Get the total loaned, total collected, overdue amount, and average repayment time.
- **GET `/overdue`**: Get a list of all customers with overdue loans.

### Webhook Endpoint

- **POST `/webhook/repayment`**: Webhook endpoint that notifies external systems when a repayment is recorded.

## Bonus Features

### SMS/WhatsApp Reminder API

This feature is mocked and logs messages to the console. For real implementation, integrate a third-party SMS or WhatsApp API (like Twilio or Sinch).

- **Functionality**: Send SMS/WhatsApp reminders about upcoming or overdue payments.

### PDF Receipt Generation

Generate a PDF receipt for repayments using the `pdfkit` library. The receipt includes loan ID, customer name, repayment amount, and date.

### Webhook Notifications

Set up a webhook to notify external systems whenever a repayment is recorded in the system.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store data (using Mongoose ODM).
- **JWT**: For secure user authentication and authorization.
- **Bcryptjs**: For password hashing.
- **Moment.js**: For handling date operations and overdue loan detection.
- **PDFKit**: For generating PDF receipts.
- **dotenv**: For loading environment variables from `.env` file.

## Deployment

This application can be deployed on platforms such as:

- **Heroku**
- **AWS**
- **Google Cloud**
- **DigitalOcean**

To deploy:

1. Create an account on the platform of your choice.
2. Push the code to a Git repository (e.g., GitHub).
3. Follow the platform’s instructions to deploy a Node.js app.
4. Set the necessary environment variables (MONGO_URI, JWT_SECRET) on the deployment platform.

## Contributing

If you would like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request with your changes.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Disclaimer**: This is a mock version of the SMS/WhatsApp reminder and receipt generation feature. Integration with third-party APIs (like Twilio or Sinch) for real-world implementation is recommended.

## Motivation

This project was developed as part of an assignment to understand backend architecture, RESTful API design, authentication, and real-world data handling. It also allowed me to explore how loans and credit tracking work in a small business context.
