CDD - Customer Driven Domain
CDD (Customer Driven Domain) is a comprehensive backend system designed to cater to customer-centric services. It focuses on managing users, handling authentication, managing account statuses, and facilitating password resets. The application is designed to be scalable, secure, and efficient for handling user data and interactions.

Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Email Service: SMTP (Gmail integration for sending reset password links)
Error Handling: Centralized error handler to capture and manage errors.
Rate Limiting: Custom rate limiter to prevent brute force attacks.
Getting Started
To get a local copy up and running, follow these simple steps:

Prerequisites
Make sure you have the following installed:

Node.js
MongoDB (if you're using a local instance)
A code editor like VSCode
Installation
Clone the repository:

git clone https://github.com/houssem-gasmi/CDD.git
Navigate to the project directory:

cd CDD
Install dependencies:

npm install
Open the .env file:

Open the `.env` file in the root directory of the project (if it doesn't exist, create one) and add the following variables:

```plaintext
MONGO_URI=<Your MongoDB URI>
PORT=5000
JWT_SECRET=<Your JWT Secret Key>
MAIL_USER=<Your Email Address>
MAIL_PASSWORD=<Your Email Password>
SMTP_HOST=smtp.gmail.com
CORS_ORIGIN=http://localhost:3000
```

- Replace `<Your MongoDB URI>` with your MongoDB connection string.
5. **Run the application:**

```bash
npm start
```

This will start the server on port `5000` (or the port you defined in your `.env` file).
