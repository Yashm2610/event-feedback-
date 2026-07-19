# Sysslan IT Solutions - Event Feedback Management System

A full-stack web application designed for Sysslan IT Solutions to manage events and collect participant feedback. 

## 🚀 Features

- **Event Listing**: View upcoming and past events hosted by Sysslan IT.
- **Feedback Collection**: Participants can easily submit feedback for specific events.
- **Responsive Design**: Modern and clean user interface accessible on all devices.
- **Backend API**: Robust REST API built with Node.js and Express to handle feedback submissions securely.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with `mysql2` package)
- **Other Tools**: `dotenv` for environment variables, `cors` for cross-origin requests.

## ⚙️ Setup and Installation

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone https://github.com/Yashm2610/event-feedback-.git
cd event-feedback-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your MySQL database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_management_system
DB_PORT=3306
```

### 4. Run the Server
```bash
node server.js
```
The server will start and automatically create the necessary `feedback` table in your database if it doesn't already exist.

### 5. Access the Application
Open your web browser and navigate to:
`http://localhost:3000`

## 📂 Project Structure

- `/frontend` - Contains all static files (HTML, CSS, JS) for the user interface.
- `server.js` - The main entry point for the backend Node.js server.
- `.env` - Environment configuration file (ignored in git).

## 📝 License

This project is licensed under the ISC License.
