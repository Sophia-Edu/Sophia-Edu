# Sophia Educational Platform

## Overview

Sophia is a comprehensive educational technology platform built with modern web technologies. This application provides a robust system for online learning with distinct interfaces for students, instructors, and administrators. The platform facilitates course creation, enrollment, learning, and certificate generation, along with administrative features for user and content management.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: SCSS, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Ant Design, React Icons
- **HTTP Client**: Axios
- **Editor Integration**: TinyMCE
- **Payment Processing**: Stripe
- **PDF Generation**: jsPDF, html2canvas
- **Authentication**: JWT
- **Data Visualization**: Chart.js
- **Build Tool**: Vite

## Project Structure

```
main-app/
├── public/                 # Static assets
├── src/
│   ├── Api/                # API configuration and setup
│   ├── assets/             # Images, icons, and other static assets
│   ├── components/         # Reusable UI components
│   │   ├── button/         # Button components
│   │   ├── card/           # Card components
│   │   ├── certificate/    # Certificate generation components
│   │   ├── charts/         # Data visualization components
│   │   ├── checkout/       # Payment checkout components
│   │   ├── modal/          # Modal dialog components
│   │   ├── navbar/         # Navigation components
│   │   └── table/          # Table components
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   ├── ADMIN/          # Admin interface pages
│   │   ├── STUDENT/        # Student interface pages
│   │   └── TUTOR/          # Instructor interface pages
│   ├── requests/           # API request handlers
│   │   ├── admin.request.tsx
│   │   ├── auth.request.tsx
│   │   ├── client.request.tsx
│   │   ├── students.request.tsx
│   │   └── tutor.request.tsx
│   ├── routes/             # Routing configuration
│   │   ├── admin.routes.tsx
│   │   ├── all.routes.tsx
│   │   ├── instructor.routes.tsx
│   │   ├── routes.tsx
│   │   └── students.routes.tsx
│   ├── utils/              # Utility functions
│   │   ├── helperFunction.tsx
│   │   ├── storage.tsx
│   │   ├── constants/
│   │   └── hooks/
│   ├── App.tsx             # Main application component
│   ├── App.scss            # Main styles
│   ├── index.css           # Global CSS
│   ├── main.tsx            # Application entry point
│   └── store.tsx           # Zustand store configuration
├── index.html              # HTML entry point
├── netlify.toml            # Netlify deployment configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node-specific TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Key Features

### User Roles & Authentication

The application supports three distinct user roles:

1. **Students**
   - Course browsing and enrollment
   - Learning through course modules
   - Certificate generation
   - Messaging system
   - Profile management
   - Wallet functionality

2. **Instructors/Tutors**
   - Course creation and management
   - Student progress tracking
   - Wallet and earnings tracking
   - Settings management

3. **Administrators**
   - Platform overview and analytics
   - User management (students and instructors)
   - Course management
   - Blog management
   - Category management
   - Wallet management

### State Management

The application uses Zustand for state management with the following stores:

- **UserStore**: Manages user data
- **CourseStore**: Manages course data
- **AuthStore**: Handles authentication state
- **AlertStore**: Manages notification alerts
- **ModalStore**: Controls modal dialogs

### API Integration

The application communicates with a backend API using Axios, with interceptors for:
- Adding authentication tokens to requests
- Handling authentication failures
- Processing API responses

### Routing

React Router v6 is used for application routing with:
- Public routes
- Protected routes with role-based access control
- Redirect functionality for unauthorized access

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd sophia_edu_tech/main-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production
   ```bash
   npm run build
   # or
   yarn build
   ```

### Environment Setup

Ensure you have the following environment variables set up:

- Stripe publishable key (for payment processing)
- API base URL (default is "https://carlomagg675.pythonanywhere.com")

## Deployment

The application is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration for deployment.

## Additional Features

- **Responsive Design**: The application is responsive and works on various screen sizes
- **Payment Integration**: Stripe integration for handling payments
- **Rich Text Editing**: TinyMCE integration for content creation
- **Data Visualization**: Chart.js integration for analytics
- **Certificate Generation**: PDF generation for course completion certificates
- **Real-time Communication**: Socket.io for real-time messaging
- **Infinite Scrolling**: For efficient data loading
- **Video Support**: React Player for video content

## License

[Add license information here]

## Contact

Folajimi Aluko
