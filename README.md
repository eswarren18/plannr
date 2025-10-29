# Plannr

## Overview

Plannr is a web app for event planning that supports group creation, role-based access, recurring events, RSVPs with custom surveys, polls, file sharing, and calendar sync. Includes engagement tools like reminders, event feeds, and post-event photo sharing.

## Getting Started

Follow these steps to set up and run The Pharmacy Farm locally.

1. **Clone the Repository**

   ```sh
   git clone <your-repo-url>
   cd plannr
   ```

2. **Configure Environment Variables**

   - In the project root, create a `.env` file.
   - Add the following (replace with your values):
     ```
     POSTGRES_USER=your_user
     POSTGRES_PASSWORD=your_password
     POSTGRES_DB=your_db
     POSTGRES_PORT=5432
     DATABASE_URL=postgresql://your_user:your_password@db:5432/your_db
     JWT_SECRET_KEY=your_jwt_secret
     ```

3. **Build and Run the Application**

   - Ensure Docker Desktop is running.
   - Run the following in the terminal.

   ```sh
   docker compose build
   docker compose up
   ```

4. **Access the API**
   - Once running, visit: [http://localhost:9000/docs](http://localhost:9000/docs) for the FastAPI interactive docs.

<br>

## Developers

**Eric Warren**
[LinkedIn](https://www.linkedin.com/in/ericswarren/) | [GitHub](https://github.com/eswarren18)

<br>
