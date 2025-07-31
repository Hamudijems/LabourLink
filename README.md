# SafeHire Ethiopia - Employment Platform

SafeHire Ethiopia is a comprehensive Fayda ID-verified employment platform designed to connect employers with job seekers in Ethiopia. Built with Next.js, Firebase, and integrated with Ethiopia's national ID system for maximum security and trust.

## 🚀 Quick Setup

  https://labour-link-six.vercel.app/landing
  
### 1. Create Admin User
First, create the admin user by visiting: `http://localhost:3000/create-admin`
- Email: hamudijems4@gmail.com  
- Password: ahmed123

### 2. Login as Admin
Go to: `http://localhost:3000/login` and use the credentials above.

### 3. Access Admin Dashboard
After login, you'll be redirected to: `http://localhost:3000/dashboard`

## 🔑 Key Features
- **Fayda ID Verification**: All users verified through Ethiopia's national ID system
- **Real-time Admin Dashboard**: Live user management and analytics
- **Firebase Integration**: Secure authentication and real-time database
- **User Registration**: Workers and employers can register with Fayda ID verification
- **Property Registration**: Asset registration and verification system
- **Digital Contracts**: Secure employment contract management

## 📋 Platform Features

### Admin Features
- **Real-time Dashboard**: Live system metrics and user analytics
- **User Management**: Approve, suspend, or manage user accounts
- **Fayda ID Verification**: View and verify user credentials
- **Property Management**: Oversee registered assets and properties
- **System Monitoring**: Track platform health and performance

### User Features  
- **Secure Registration**: Fayda ID-verified account creation
- **Profile Management**: Complete user profiles with skills and experience
- **Job Matching**: Connect workers with suitable employment opportunities
- **Digital Contracts**: Secure, legally-binding employment agreements
- **Property Registration**: Register and verify personal assets

### Technical Features
- **Firebase Auth**: Secure user authentication system
- **Firestore Database**: Real-time data synchronization
- **Next.js Framework**: Modern, fast, and SEO-optimized
- **Responsive Design**: Works on all devices and screen sizes
- **Real-time Updates**: Live data updates across the platform

## Project Structure

- `/app`: Contains the main Next.js application pages and global styles.
- `/components`: Reusable UI components, including authentication, admin, employer, and worker specific components.
- `/lib`: Utility functions and Firebase initialization logic.
- `/public`: Static assets like images.
- `/services`: Firebase service interactions.
- `/styles`: Global CSS styles.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- Firebase project with Authentication and Firestore enabled

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LabourLink
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Firebase:**
   - The Firebase config is already set up in `lib/firebase.ts`
   - Project ID: `newompitation-project`
   - Make sure Authentication and Firestore are enabled in your Firebase console

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Create Admin User:**
   - Visit: `http://localhost:3000/create-admin`
   - Click "Create Admin User" button
   - Use credentials: hamudijems4@gmail.com / ahmed123

6. **Access the Platform:**
   - Landing Page: `http://localhost:3000/landing`
   - Admin Login: `http://localhost:3000/login`
   - User Signup: `http://localhost:3000/signup`
   - Admin Dashboard: `http://localhost:3000/dashboard`

## 🔧 Firebase Configuration

### Current Setup
- **Project ID**: `newompitation-project`
- **Authentication**: Email/Password enabled
- **Firestore**: Real-time database with proper security rules
- **Storage Bucket**: `newompitation-project.appspot.com`

### Security Rules (Development)
For testing, use these Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Authentication Setup
- Enable Email/Password authentication in Firebase Console
- Admin user: hamudijems4@gmail.com / ahmed123
- Users can register through the signup form with Fayda ID verification

## 🔍 Platform Overview

### Admin Dashboard Features
- **User Management**: View all registered users with FIN/FAN details
- **Real-time Analytics**: Live user counts, job statistics, and system health
- **Approval System**: Approve or reject user registrations
- **Property Management**: View registered assets and properties
- **System Monitoring**: Track Firebase connection and platform status

### User Registration Flow
1. User visits `/signup`
2. Enters Fayda ID (FIN/FAN) for verification
3. System verifies credentials against Fayda API
4. User completes profile with personal information
5. Account created in Firebase Auth and Firestore
6. Admin can approve/reject from dashboard

### Test Credentials
**Admin Login:**
- Email: hamudijems4@gmail.com
- Password: ahmed123

**Test Fayda IDs:**
- FIN: 6140798523917519, FAN: 3126894653473958
- FIN: 6230247319356120 (alternative test ID)

## 🚀 Deployment

The platform is ready for deployment with:
- Vercel/Netlify for frontend hosting
- Firebase for backend services
- All authentication and database features working
- Real-time admin dashboard operational

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin-only routes
│   │   ├── dashboard/     # Main admin dashboard
│   │   ├── user-management/ # User management interface
│   │   └── layout.tsx     # Admin layout with auth protection
│   ├── (auth)/           # Authentication routes
│   │   └── login/        # Admin login page
│   ├── landing/          # Public landing page
│   ├── signup/           # User registration
│   └── create-admin/     # Admin user creation
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   └── ui/              # Shadcn UI components
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase configuration
│   ├── fayda-api.ts     # Fayda ID verification
│   └── utils.ts         # Helper functions
└── scripts/             # Setup and utility scripts
```

## 🎯 Current Status

✅ **Completed Features:**
- Firebase Authentication with real login system
- Real-time admin dashboard with user management
- User registration with Fayda ID verification
- Property registration system
- Responsive UI with modern design
- Admin user creation and management
- Real-time data synchronization

✅ **Ready for Production:**
- All core features implemented and working
- Firebase integration fully functional
- Admin panel with complete user management
- Secure authentication system
- Real-time updates and monitoring

The SafeHire Ethiopia platform is now fully operational and ready for deployment!


## 🚀 Running the Project with Docker

```bash
docker build -t labourlink .
docker run -p 3000:3000 labourlink
