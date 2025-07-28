# Ethiopian Labor Platform

This project is a comprehensive platform designed to connect employers with job seekers in Ethiopia, focusing on various labor sectors. It aims to streamline the hiring process, provide a centralized hub for job opportunities, and facilitate efficient communication between parties.

### Key Features:
- **Fayda ID Integration**: Users will register with their Fayda ID, which will be verified against an external API to confirm their existence and authenticity.
- **Job Information Verification**: The platform will verify the authenticity of users' work information. Companies will verify user details, and when employees scan, it will display their job stats and skills, preventing fake information.
- **Academic Status Verification**: The platform will register graduates and automatically verify their graduation status. Students will also be registered, and their academic data, including school and country-specific details, will be refined and verified to prevent fraudulent claims.
- **Health Status Registration**: Users' health status will be registered, allowing emergency services to access their information by scanning their Fayda card.
- **Property Registration and Verification**: Users' assets, such as cars and houses, will be registered on the platform. This information will be analyzed to prevent fraudulent claims or attempts to seize property.

## Features

- **User Authentication:** Secure login and registration for both employers and workers.
- **Admin Dashboard:** Management tools for administrators to oversee users, job postings, and platform activity.
- **Employer Dashboard:** Employers can post job listings, manage applications, and view worker profiles.
- **Worker Dashboard:** Job seekers can create profiles, search for jobs, apply to positions, and track their application status.
- **Firebase Integration:** Utilizes Firebase for real-time database (Firestore), authentication, and analytics.
- **Next.js Framework:** Built with Next.js for a fast, scalable, and SEO-friendly web application.
- **Responsive UI:** A modern and responsive user interface built with Shadcn UI components.
- **Local Caching:** Implements persistent local caching for Firestore data to enhance offline capabilities and performance.

## Project Structure

- `/app`: Contains the main Next.js application pages and global styles.
- `/components`: Reusable UI components, including authentication, admin, employer, and worker specific components.
- `/lib`: Utility functions and Firebase initialization logic.
- `/public`: Static assets like images.
- `/services`: Firebase service interactions.
- `/styles`: Global CSS styles.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- Firebase Project: You need to set up a Firebase project and configure `firebaseConfig` in `lib/firebase.ts` with your project details.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ethiopian-labor-platform
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

To start the development server:

```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000`.

## Firebase Configuration

The project uses Firebase Firestore for its database. The configuration is handled in `lib/firebase.ts`. Key aspects include:

- **`initializeFirestore`**: Used for advanced Firestore configuration.
- **`persistentLocalCache`**: Enables local data caching for improved performance and offline support.
- **`persistentMultipleTabManager`**: Manages cache synchronization across multiple browser tabs.
- **`experimentalForceLongPolling: false`**: Prioritizes WebSocket connections for real-time updates, falling back to long-polling if WebSockets fail.

**Important:** For local development and testing, you might need to temporarily adjust your Firebase Firestore security rules to allow read/write access. Remember to secure them properly before deploying to production.

## Troubleshooting

- **`net::ERR_ABORTED` for Firestore Listen/channel endpoint:** This error indicates an issue with the Firestore connection. Ensure your Firebase configuration is correct and consider temporarily setting `experimentalForceLongPolling: true` in `lib/firebase.ts` for local development if WebSockets are consistently failing.
- **`ReferenceError: localStorage is not defined`:** This error typically occurs when `localStorage` is accessed on the server-side during server-side rendering (SSR). The `auth-context.tsx` file has been updated to use `useEffect` to ensure `localStorage` access only happens in the client-side environment.

## Rules and Guidelines

- **Code Style:** Adhere to the existing code style and ESLint rules.
- **Commit Messages:** Use clear and concise commit messages.
- **Branching Strategy:** Follow a feature-branch workflow (e.g., Git Flow or GitHub Flow).
- **Testing:** Write unit and integration tests for new features and bug fixes.
- **Security:** Always prioritize security best practices, especially when dealing with user data and Firebase rules.
- **Contribution:** Contributions are welcome. Please open an issue or submit a pull request.