# Annual Sales Dashboard

An interactive web application designed to track and view annual sales metrics, performance statistics, and individual transactions for the calendar years 2022, 2023, and 2024.

This application is built with a React frontend and an Express backend server. The data presented is fetched dynamically from the server API, enabling accurate filtering based on transaction values.

---

## Features and Project Structure

### Frontend Organization
The user interface is broken down into simple, modular React components:
*   **Atoms**: Basic UI components such as buttons, standard input fields, and category badges.
*   **Molecules**: Composite parts including stats cards for key performance indicators (total sales, profit margins, order count, and average order value) and a filter group to adjust transaction minimums.
*   **Organisms**: Complex units including a chart wrapper (supporting bar, line, area, and pie visualizations) and a detailed transactions table with built-in search and sorting options.
*   **Templates**: General layout screens managing the navigation and overall page alignment.
*   **Pages**: The main dashboard page coordinates data fetching, filter updates, and state management.

### Backend API
A lightweight Express service manages the analytics data:
*   **Endpoint**: `GET /api/sales`
*   **Parameters**: `year` (2022, 2023, or 2024) and `threshold` (minimum transaction amount).
*   **Response**: Provides the aggregated metrics, monthly breakdowns, category distributions, and filtered transactions list.

---

## Getting Started Locally

### Prerequisites
*   Node.js (version 18 or higher)
*   npm (version 8 or higher)

### Setup Instructions

1.  **Install dependencies**
    Install the required packages using the terminal:
    ```bash
    npm install
    ```

2.  **Start the development server**
    Run the application in development mode:
    ```bash
    npm run dev
    ```
    Once started, open http://localhost:3000 in your browser to view the application.

3.  **Build for production**
    Compile and bundle the client-side and server-side assets into the production folder:
    ```bash
    npm run build
    ```

4.  **Run in production**
    Start the compiled server:
    ```bash
    npm start
    ```

---

## Exporting to GitHub

To save the project or push it to a personal GitHub account, follow these steps:

1.  **Export the bundle**
    Download your project files as a ZIP archive.

2.  **Initialize git repository**
    Extract the downloaded ZIP archive on your local computer, open a terminal in that directory, and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of annual sales dashboard"
    ```

3.  **Link and push**
    Create a new repository on GitHub and link it to your local project:
    ```bash
    git branch -M main
    git remote add origin https://github.com/your-username/annual-sales-dashboard.git
    git push -u origin main
    ```
