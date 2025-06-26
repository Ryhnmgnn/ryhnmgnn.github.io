# Online Shop with Cross-Device Account Access

This is an online shop application that allows users to access their accounts from any device (mobile phone, laptop, or PC).

## Features

- Cross-device account access
- User registration and login
- Profile management
- Shopping cart synchronization
- Responsive design for all devices

## Setup Instructions

1. Install Node.js on your computer if you haven't already
2. Clone this repository
3. Open a terminal in the project directory
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open `index.html` in your web browser

## How to Use

1. Register an account on any device
2. Log in using your credentials on any device
3. Your profile and shopping cart will be synchronized across all devices
4. Changes made on one device will be reflected on all other devices

## Technical Details

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Data Storage: In-memory (can be replaced with a database in production)
- Cross-device synchronization through REST API

## Security Notes

- In a production environment, you should:
  - Use HTTPS
  - Hash passwords
  - Implement proper session management
  - Use a real database
  - Add input validation
  - Implement rate limiting 