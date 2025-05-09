# HealthScape Hospital Website

## Project Overview
HealthScape is a comprehensive hospital management system that allows patients to view hospital services, browse doctors by specialties, book appointments, and manage their medical history. The platform also provides an administrative dashboard for hospital staff to manage appointments and doctor information.

## Features
- **User Authentication**: Secure login and registration system for patients and administrators
- **Doctor Directory**: Browse doctors by specialties including Cardiology, Neurology, Radiology, Orthopedics, Ophthalmology, Pediatrics, Gynecology, Oncology, Pulmonology, General Medicine, and Genetics
- **Appointment Booking**: Schedule appointments with preferred doctors at convenient time slots
- **Patient Dashboard**: View and manage appointments, check medical history, and see past visits
- **Admin Dashboard**: Manage all appointments, doctor information, and patient records
- **Responsive Design**: Fully responsive interface for seamless experience across devices

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, HTML5, CSS3, JavaScript
- **Authentication**: Cookie-based authentication system
- **Security**: Helmet for HTTP security headers, Express Rate Limiter for API protection

## Project Structure/Directories
```
BEE-FINAL-PROJECT
  │── api/
  │   ├── apiRoutes.js           # API endpoint definitions
  │── config/
  │   ├── db.js                  # Database configuration
  │── middlewares/
  │   ├── logger.js              # Custom logging middleware
  │   ├── errorHandler.js        # Global error handling middleware
  │── models/
  │   ├── appointment.js         # Appointment data model
  │   ├── doctor.js              # Doctor data model
  │   ├── service.js             # Service data model
  │   ├── user.js                # User data model
  │── public/
  │   ├── css/                   # CSS stylesheets
  │   ├── js/                    # Client-side JavaScript
  │   ├── image/                 # Image assets
  │   ├── video/                 # Video assets
  │── views/
  │   ├── partials/              # Reusable EJS components
  │   ├── about.ejs              # About page template
  │   ├── admin-dashboard.ejs    # Admin dashboard template
  │   ├── book.ejs               # Appointment booking template
  │   ├── home.ejs               # Homepage template
  │   ├── login.ejs              # Login page template
  │   ├── register.ejs           # Registration page template
  │   ├── patient-dashboard.ejs  # Patient dashboard template
  │   ├── doctor.ejs             # Doctor listing page template
  │   ├── [specialty].ejs        # Various specialty pages (cardiology, neurology, etc.)
  │   ├── services.ejs           # Services page template
  │   ├── review&blogs.ejs       # Reviews and blogs page template
  │── server.js                  # Main application entry point
  │── seed-*.js                  # Database seeding scripts
  │── users.json                 # Sample user data for development
```

## Application Workflow

### User Journey
1. **Homepage**: Users land on the homepage displaying key hospital services and specialty departments
2. **Registration/Login**: New users register for an account, returning users log in
3. **Service Exploration**: Users can browse available services and specialties
4. **Doctor Selection**: Users can view doctors filtered by specialty with their experience and bio
5. **Appointment Booking**: Users select a doctor, date, and time slot to book an appointment
6. **Dashboard Access**: After booking, users can view their appointment details in the patient dashboard
7. **Appointment Management**: Users can view, track status, or cancel appointments

### Admin Journey
1. **Admin Login**: Administrators log in with admin credentials
2. **Dashboard Overview**: View all appointments, patient data, and doctor information
3. **Appointment Management**: Update appointment status (Scheduled, Confirmed, Completed, Cancelled)
4. **Doctor Management**: Add, edit, or remove doctor information
5. **Patient Records**: Access and manage patient medical records

## Database Schema

### User Model
- Username, email, password (hashed), role (patient/admin), profile information

### Doctor Model
- Name, specialty, image, experience, bio, available slots, appointment count

### Appointment Model
- Patient details, doctor reference, date, time slot, department, status, description

### Service Model
- Name, description, image, availability

## API Endpoints
- `/api/appointments`: CRUD operations for appointments
- `/api/doctors`: Retrieve doctor information
- `/api/services`: Get available services
- `/api/users`: User management endpoints
- `/api/check-slot`: Check appointment slot availability

## Security Features
- Secure password hashing
- HTTP security headers via Helmet
- Rate limiting to prevent brute-force attacks
- Input validation and sanitization
- CORS protection
- Cookie-based authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB connection
4. Run the server: `node server.js`
5. Access the application at http://localhost:8000

## Development Notes
The application includes several seed scripts for populating the database with sample data:
- `seed-doctors.js`: Add sample doctors to the database
- `seed-services.js`: Add hospital services
- Various specialty-specific seed scripts for different departments


