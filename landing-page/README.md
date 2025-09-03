# Sophia Landing Page

## Overview

This is the landing page for the Sophia Educational Platform - an ambitious education technology and career development platform. It serves as the entry point and informational website for users before they access the main application. The landing page provides essential information about Sophia, its mission, features, and navigation to the main application.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: SCSS, Tailwind CSS
- **UI Components**: Ant Design
- **Routing**: React Router v6
- **Build Tool**: Vite

## Project Structure

```
landing-page/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── assets/             # Images, icons, and other static assets
│   │   ├── check_badge.svg
│   │   ├── checked_badge.svg
│   │   ├── computer_lady.svg
│   │   ├── facebook_icon.svg
│   │   ├── google_icon.svg
│   │   ├── index.ts
│   │   ├── insta_Icon.svg
│   │   ├── location_icon.svg
│   │   ├── logo.svg
│   │   ├── logo2.svg
│   │   ├── mail_icon.svg
│   │   ├── man_woman.svg
│   │   ├── office_woman.svg
│   │   ├── react.svg
│   │   ├── student.svg
│   │   ├── two_woman.svg
│   │   ├── woman_on_call.png
│   │   ├── woman.svg
│   │   ├── x_icon.svg
│   │   └── youtube_icon.svg
│   ├── components/          # Reusable UI components
│   │   ├── index.ts
│   │   ├── scrollTop.tsx
│   │   ├── scrollToTop.tsx
│   │   ├── accordion/
│   │   │   ├── accordion.styles.scss
│   │   │   └── accordion.tsx
│   │   ├── button/
│   │   │   ├── button.styles.scss
│   │   │   └── button.tsx
│   │   ├── footer/
│   │   │   ├── footer.styles.scss
│   │   │   └── footer.tsx
│   │   └── navbar/
│   │       ├── navbar.styles.scss
│   │       └── navbar.tsx
│   ├── constants/           # Application constants
│   │   └── index.ts
│   ├── pages/               # Page components
│   │   ├── 404.tsx          # Not found page
│   │   ├── index.ts
│   │   ├── About/           # About page
│   │   │   ├── Aboutpage.styles.scss
│   │   │   └── Aboutpage.tsx
│   │   ├── Contact/         # Contact page
│   │   ├── Home/            # Home page
│   │   │   ├── Homepage.styles.scss
│   │   │   └── HomePage.tsx
│   │   ├── Privacy/         # Privacy policy page
│   │   ├── SetPassword/     # Password reset page
│   │   └── Terms/           # Terms of service page
│   ├── App.scss             # Main application styles
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global CSS
│   ├── main.tsx             # Application entry point
│   ├── routes.tsx           # Routing configuration
│   └── vite-env.d.ts        # TypeScript definitions for Vite
├── index.html               # HTML entry point
├── netlify.toml             # Netlify deployment configuration
├── package.json             # Project dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # Node-specific TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## Key Features

### Pages

The landing page includes several key pages:

1. **Home Page**: Introduction to Sophia with a call-to-action for registration
2. **About Page**: Detailed information about Sophia's mission, vision, and background
3. **Privacy Policy Page**: Legal information about privacy policies
4. **Terms of Use Page**: Legal terms and conditions for using the platform
5. **Contact Page**: Information on how to contact Sophia
6. **Set Password Page**: Password reset functionality

### Components

The application uses several reusable components:

1. **Navbar**: Navigation header with logo and login button
2. **Footer**: Footer with links to important pages and signup call-to-action
3. **Button**: Customizable button component
4. **Accordion**: Collapsible content component used for displaying categorized information

### Integration with Main App

The landing page integrates with the main application through external links:
- Login button redirects to the main app login page
- Sign Up buttons redirect to the main app registration page

### Responsive Design

The landing page is fully responsive and works on various screen sizes, implemented with:
- Ant Design's responsive grid system
- Tailwind CSS responsive utilities
- Custom SCSS for specific responsive behaviors

## Educational Content Categories

The landing page showcases Sophia's educational content organized into several categories:

1. **Applied Sciences**:
   - Agriculture, Architecture, Business, Education, Engineering, and more

2. **Formal Sciences**:
   - Computer Science, Mathematics

3. **Humanities**:
   - Performing Arts, Visual Arts, History, Languages, Philosophy, and more

4. **Natural Sciences**:
   - Biology, Chemistry, Earth Science, Astronomy, Physics

5. **Social Sciences**:
   - Anthropology, Economics, Geography, Political Science, Psychology, and more

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd sophia_edu_tech/landing-page
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

## Deployment

The landing page is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration for deployment.

## License

[Add license information here]

## Contact

Folajimi Aluko
