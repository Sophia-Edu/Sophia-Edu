# Learning Management System (LMS) API

A comprehensive, production-ready Learning Management System built with Flask, designed to facilitate online education through course management, user profiles, and interactive learning experiences.

## 🎯 Overview

This LMS platform provides a complete backend solution for educational institutions, online course providers, and e-learning platforms. The system supports multiple user roles (students, instructors, and administrators), course creation and management, enrollment tracking, and rich media content delivery.

## ✨ Key Features

### User Management
- **Multi-role Authentication**: Support for students, instructors, and administrators
- **JWT-based Security**: Secure token-based authentication with refresh token support
- **Comprehensive User Profiles**: Including education history, work experience, licenses/certifications
- **Password Management**: Secure password reset and change functionality
- **Account Status Control**: Account activation, deactivation, and reactivation

### Course Management
- **Flexible Course Creation**: Support for single or batch course creation
- **Rich Media Support**: Integration with Cloudinary for images, videos, and documents
- **Module System**: Organize courses into structured modules with ordered content
- **Course Categories**: Tag and organize courses by subject matter
- **Search & Filtering**: Advanced search with pagination, price ranges, and category filters
- **Enrollment Tracking**: Monitor student enrollments and course popularity

### Content Organization
- **Modular Architecture**: Courses can be organized into reusable module templates
- **Multiple Data Entries**: Support for lessons, resources, and media within modules
- **Ordered Content**: Maintain structured learning paths with ordered modules and courses
- **Additional Resources**: Attach supplementary materials to courses and modules

### Social Features
- **Course Following**: Users can follow courses and subjects of interest
- **User Posts**: Social feed functionality for community engagement
- **Notifications**: Real-time notification system for user updates
- **Profile Customization**: Profile images, cover photos, and bio information

### Administrative Features
- **Admin Dashboard**: Dedicated admin authentication and management endpoints
- **Instructor Management**: Separate instructor roles with course creation privileges
- **Category Management**: Create and manage course categories
- **Content Moderation**: Control over course publication status (published, draft, archived)

## 🏗️ Architecture: Single-File System

### Why Single-File Architecture?

This application is intentionally designed as a **single-file Flask application** (`app.py`), and while it is fully prepared to transition to a Blueprint-based modular architecture, the current monolithic structure offers several compelling advantages for this use case:

#### **1. Simplicity and Clarity**
- **Immediate Understanding**: The entire application logic resides in one file, making it exceptionally easy for developers to understand the complete system architecture at a glance
- **Reduced Cognitive Load**: No need to navigate multiple files, modules, or directories to trace request flows or understand data relationships
- **Faster Onboarding**: New developers can become productive quickly without learning complex project structures

#### **2. Development Velocity**
- **Rapid Prototyping**: Changes can be implemented and tested immediately without managing imports across multiple files
- **Simplified Debugging**: Stack traces point to a single file, making error identification and resolution straightforward
- **Quick Iterations**: Feature additions and modifications require minimal file navigation and context switching

#### **3. Deployment Advantages**
- **Single Point of Deployment**: One file to deploy, reducing deployment complexity and potential configuration errors
- **Minimal Dependencies**: Fewer moving parts mean fewer opportunities for deployment issues
- **Container-Friendly**: Simplified Docker containerization with a single application entry point
- **Reduced Build Time**: No complex build processes or module bundling required

#### **4. Maintenance Benefits**
- **Unified Codebase**: All business logic, models, and routes are co-located, making refactoring and updates more straightforward
- **Consistent Patterns**: Easier to maintain coding standards and patterns when everything is in one place
- **Version Control Simplicity**: Changes are tracked in a single file, making code reviews and diffs more manageable

#### **5. Performance Considerations**
- **Reduced Import Overhead**: No circular import issues or complex module loading
- **Faster Startup Time**: Single file loads faster than multiple module imports
- **Optimized for Small to Medium Scale**: Perfect for applications that don't require microservices architecture

### When to Consider Blueprints

The application is **Blueprint-ready** and can be refactored when:
- The codebase exceeds 5,000+ lines and becomes difficult to navigate
- Multiple teams need to work on different features simultaneously
- Microservices architecture becomes necessary for scaling
- Feature-based code organization becomes a priority

### Current Status

**The application is production-ready in its current form** and has been architected with best practices including:
- Clear separation of concerns through function organization
- Comprehensive error handling
- Security best practices (JWT, password hashing, input validation)
- RESTful API design principles
- Scalable database models with proper relationships

The single-file approach represents a **pragmatic engineering decision** that prioritizes developer experience, deployment simplicity, and maintainability for the current scale and requirements of the application.

## 🛠️ Technology Stack

### Core Framework
- **Flask 3.0.3**: Modern Python web framework
- **SQLAlchemy 2.0.29**: Powerful ORM for database operations
- **Flask-SQLAlchemy 3.1.1**: Flask integration for SQLAlchemy

### Authentication & Security
- **Flask-JWT-Extended 4.6.0**: JWT token management
- **Werkzeug 3.0.2**: Password hashing and security utilities
- **PyJWT 2.8.0**: JSON Web Token implementation

### Database
- **SQLite**: Lightweight, file-based database (production-ready for small to medium applications)
- **Flask-Migrate 4.0.5**: Database migration support

### Media Management
- **Cloudinary 1.41.0**: Cloud-based media storage and delivery
- **Pillow 10.4.0**: Image processing capabilities

### API & Communication
- **Flask-CORS 4.0.1**: Cross-Origin Resource Sharing support
- **Flask-SocketIO 5.3.6**: Real-time bidirectional communication
- **OpenAI 1.44.1**: AI integration capabilities

### Email & Notifications
- **Flask-Mail 0.10.0**: Email sending functionality
- **SendGrid 6.11.0**: Email delivery service integration

### Utilities
- **python-dotenv 1.0.1**: Environment variable management
- **python-dateutil 2.9.0**: Advanced date/time handling
- **requests 2.32.3**: HTTP library for external API calls

## 📋 Prerequisites

- Python 3.12 or higher
- pip (Python package manager)
- Virtual environment (recommended)
- Cloudinary account (for media storage)
- OpenAI API key (for AI features)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Database
SQLALCHEMY_DATABASE_URI=sqlite:///database.db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Email Configuration (Optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
```

### 6. Initialize Database
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### 7. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /refresh
Authorization: Bearer <refresh_token>
```

### Course Endpoints

#### Create Course
```http
POST /courses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "titles": ["Introduction to Python"],
  "course_name": "Python Basics",
  "content": "Learn Python programming from scratch",
  "price": 49.99,
  "categories": ["Programming", "Python"],
  "brief": "A comprehensive introduction to Python",
  "course_type": "video"
}
```

#### Get All Courses
```http
GET /courses?page=1&per_page=10&category=Programming&price_min=0&price_max=100
```

#### Get Single Course
```http
GET /courses/<course_id>
```

#### Update Course
```http
PUT /courses/<course_id>
Authorization: Bearer <access_token>
```

#### Delete Course
```http
DELETE /courses/<course_id>
Authorization: Bearer <access_token>
```

#### Enroll in Course
```http
POST /courses/<course_id>/enroll
Authorization: Bearer <access_token>
```

### Module Endpoints

#### Create Module
```http
POST /modules
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Module 1: Basics",
  "description": "Introduction to fundamentals",
  "order": 1,
  "data_entries": [
    {
      "title": "Lesson 1",
      "content": "Lesson content here",
      "order": 1
    }
  ]
}
```

#### Get All Modules
```http
GET /modules?page=1&per_page=10
```

### User Profile Endpoints

#### Get Current User Profile
```http
GET /profile/me
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "bio": "Software developer and educator",
  "phone_number": "+1234567890"
}
```

#### Upload Cover Photo
```http
POST /upload_cover_photo
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

cover_photo: <file>
```

### Search Endpoint

#### Global Search
```http
GET /search?q=python&type=courses&page=1&per_page=10
```

## 🗄️ Database Schema

### Core Models

- **User**: User accounts with authentication and profile information
- **Admin**: Administrative users with elevated privileges
- **Instructor**: Instructor accounts with course creation rights
- **Course**: Course information including content, pricing, and media
- **Module**: Organizational units for grouping course content
- **ModuleData**: Individual lessons/content within modules
- **CourseCategory**: Categorization system for courses
- **Subject**: Subject areas for user interests
- **Enrollment**: User-course enrollment relationships
- **Location**: User location information
- **Education**: User education history
- **WorkExperience**: User work history
- **LicenseCertification**: User certifications and licenses
- **Notification**: User notification system
- **PasswordResetToken**: Secure password reset functionality
- **UserPost**: Social feed posts
- **Role**: Role-based access control

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Werkzeug password hashing
- **Token Expiration**: Configurable access and refresh token lifetimes
- **Role-Based Access Control**: Admin, instructor, and user roles
- **Secure File Uploads**: Validation and sanitization of uploaded files
- **CORS Protection**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in environment variables

## 📁 Project Structure

```
.
├── app.py                          # Main application file (all routes, models, logic)
├── wsgi.py                         # WSGI entry point for production
├── requirements.txt                # Python dependencies
├── Pipfile                         # Pipenv configuration
├── .env                            # Environment variables (not in repo)
├── .gitignore                      # Git ignore rules
├── instance/
│   └── database.db                 # SQLite database file
├── static/
│   └── uploads/                    # Static file uploads
│       ├── courses/                # Course images
│       ├── course_videos/          # Course videos
│       ├── documents/              # Document uploads
│       └── modules/                # Module media
├── uploads/                        # Additional upload directories
│   ├── documents/                  # User documents
│   ├── profile_images/             # User profile images
│   ├── peer_reviews/               # Peer review files
│   └── user_posts/                 # User post media
└── venv/                           # Virtual environment (not in repo)
```

## 🚢 Deployment

### Production Deployment with Gunicorn

```bash
gunicorn --bind 0.0.0.0:8000 wsgi:app
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
```

Build and run:

```bash
docker build -t lms-api .
docker run -p 5000:5000 --env-file .env lms-api
```

### Environment-Specific Configuration

For production, ensure:
- Set `FLASK_ENV=production`
- Use a strong `SECRET_KEY` and `JWT_SECRET_KEY`
- Configure proper database (PostgreSQL recommended for production)
- Set up proper logging
- Enable HTTPS
- Configure CORS appropriately

## 🧪 Testing

The application is designed for easy testing. Example test structure:

```python
import unittest
from app import app, db

class TestAPI(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_register(self):
        response = self.client.post('/register', json={
            'full_name': 'Test User',
            'email': 'test@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        })
        self.assertEqual(response.status_code, 201)
```

## 📈 Scalability Considerations

While the single-file architecture is optimal for current needs, the application can scale through:

1. **Database Migration**: Move from SQLite to PostgreSQL or MySQL
2. **Caching Layer**: Implement Redis for session management and caching
3. **Load Balancing**: Deploy multiple instances behind a load balancer
4. **CDN Integration**: Leverage Cloudinary's CDN for media delivery
5. **Microservices**: Refactor into Blueprint-based modules when needed
6. **Message Queues**: Add Celery for background task processing

## 🤝 Contributing

This is a production application. For contributions:

1. Maintain the single-file architecture unless refactoring is explicitly required
2. Follow existing code patterns and conventions
3. Ensure all new features include proper error handling
4. Test thoroughly before submitting changes
5. Update this README with any new features or endpoints

## 📄 License

[Specify your license here]

## 👥 Authors

[Your name/organization]

## 📞 Support

For issues, questions, or contributions, please [contact information or issue tracker].

---

**Note**: This application is production-ready and actively maintained. The single-file architecture is a deliberate design choice optimized for simplicity, maintainability, and deployment efficiency. The codebase is fully prepared for Blueprint-based refactoring should future requirements necessitate a modular architecture.
