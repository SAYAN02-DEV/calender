# Calendar Application

This is a Next.js based calendar application with a rich visual interface, month-based thematic hero images, and robust event management features.

## Features and Usage Guide

### Navigating the Calendar
- Use the arrow buttons next to the month and year header to navigate strictly between previous and next months.
- The thematic image on the left dynamically changes based on the current month displayed.

### Managing Single Events
- **Add**: Click once on any date grid cell to select it. Click the small plus button that appears at the top right of the selected cell. Enter a title, pick a color, and save.
- **Edit**: Click the plus button on an existing event's date cell. This will open the event details dialog where you can change the title or color.
- **Delete**: Open the edit modal by clicking the plus button on the event's date, then click the Delete button.

### Managing Range Events (Multi-Day Events)
- **Add**: Click your starting date first, then click your ending date. The range will visually highlight. Click the plus button on either the start or end date to create a multi-day event.
- **Edit**: Click the plus button on the last date of an existing range event to edit its properties.
- **Delete**: Open the edit modal by clicking the plus button on the last date of the range event, then click the Delete button.

### Monthly Memos
- When creating or editing an event (single or range), you will be prompted to add it to the Monthly Memos.
- Monthly Memos appear in the left sidebar under the thematic image.
- Hovering over a memo in the sidebar will visually highlight the associated event dates directly on the calendar grid.

## Local Setup Instructions

Ensure you have Node.js installed before proceeding.

1. Clone or download this repository to your local machine.
2. Open your terminal and navigate to the project directory.
3. Install the dependencies by running one of the following commands:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open up your web browser and navigate to http://localhost:3000 to view and interact with the application.
