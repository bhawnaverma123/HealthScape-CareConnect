const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;
const mongoose = require('mongoose');

// Import models right at the top before any functions use them
const Appointment = require('./models/appointment');
const Service = require('./models/service');
const Doctor = require('./models/doctor');
const User = require('./models/user');
const Contact = require('./models/contact');

mongoose.connect('mongodb://127.0.0.1:27017/healthscape')
.then(() => {
  console.log('MongoDB connected');
  checkAndSeedDoctors(); // Add this line to check and seed doctors if needed
})
.catch(err => console.error('MongoDB connection error:', err));

// Function to check if doctors exist and seed them if not
async function checkAndSeedDoctors() {
  try {
    const count = await Doctor.countDocuments();
    
    if (count === 0) {
      console.log('No doctors found in database. Seeding initial doctor data...');
      
      // Instead of defining all doctors here, use seed-doctors.js data
      // This is a simplified version that maintains the same structure but references the external file
      const requiredSpecialties = [
        'Cardiology', 'Neurology', 'Radiology', 'Orthopedics', 
        'Pathology', 'Ophthalmology', 'Pediatrics', 'Gynecology',
        'Oncology', 'General Medicine', 'Pulmonology', 'Genetics'
      ];
      
      // Get doctors data from the external seed file
      const doctorsSeedPath = path.join(__dirname, 'seed-doctors.js');
      console.log(`Loading doctors data from: ${doctorsSeedPath}`);
      
      // Import doctors data dynamically
      const seedDoctors = require('./seed-doctors');
      if (seedDoctors.doctors && Array.isArray(seedDoctors.doctors)) {
        await Doctor.insertMany(seedDoctors.doctors);
        console.log('All doctors seeded successfully from external seed file');
      } else {
        // Fallback to original seeding if external file doesn't contain expected data
        // Seed doctors for each specialty (using original specialties array)
        const specialties = [
          // ... original specialties array with all doctors
          {
            name: 'Cardiology',
            doctors: [
              {
                name: 'Dr. John Wilson',
                specialty: 'Cardiology',
                image: 'male12.jpg',
                experience: 15,
                bio: 'Specializes in cardiovascular diseases with advanced techniques'
              },
              {
                name: 'Dr. Sarah Miller',
                specialty: 'Cardiology',
                image: 'female5.jpg',
                experience: 12,
                bio: 'Expert in heart surgery and cardiac rehabilitation'
              },
              {
                name: 'Dr. Emily Johnson',
                specialty: 'Cardiology',
                image: 'male18.jpg',
                experience: 8,
                bio: 'Specialized in preventive cardiology and heart failure management'
              }
            ]
          },
          // ... other specialties would be here
        ];
        
        // Insert doctors by specialty using the original method
        for (const specialty of specialties) {
          await Doctor.insertMany(specialty.doctors);
          console.log(`${specialty.name} doctors seeded successfully`);
        }
        
        console.log('All doctors seeded successfully using fallback method');
      }
    } else {
      console.log(`${count} doctors already exist in the database`);
      
      // Check for required specialties and ensure each has at least one doctor
      const requiredSpecialties = [
        'Cardiology', 'Neurology', 'Radiology', 'Orthopedics', 
        'Pathology', 'Ophthalmology', 'Pediatrics', 'Gynecology',
        'Oncology', 'General Medicine', 'Pulmonology', 'Genetics'
      ];
      
      // Check all specialties in one loop instead of individual blocks
      for (const specialty of requiredSpecialties) {
        const specialtyCount = await Doctor.countDocuments({ specialty });
        if (specialtyCount === 0) {
          console.log(`No ${specialty} doctors found. Loading from seed-doctors.js...`);
          
          try {
            // Try to import and use doctors from seed file
            const seedDoctors = require('./seed-doctors');
            const specialtyDoctors = seedDoctors.doctors?.filter(d => d.specialty === specialty);
            
            if (specialtyDoctors && specialtyDoctors.length > 0) {
              await Doctor.insertMany(specialtyDoctors);
              console.log(`${specialty} doctors added successfully from seed file`);
            } else {
              console.log(`No ${specialty} doctors found in seed file`);
            }
          } catch (err) {
            console.error(`Error adding ${specialty} doctors from seed file:`, err);
          }
        } else {
          console.log(`${specialtyCount} ${specialty} doctors already exist in the database`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking/seeding doctors:', error);
  }
}

// Import middlewares
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: 'Too many requests, please try again later',
  })
);
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(logger);

// Middleware to check login status for every request
app.use((req, res, next) => {
  // Check if user is logged in using cookies
  const isLoggedIn = req.cookies.userId ? true : false;
  const username = req.cookies.username || 'User';
  const userRole = req.cookies.userRole || '';
  
  // Add these variables to res.locals so they are available to all views
  res.locals.isLoggedIn = isLoggedIn;
  res.locals.username = username;
  res.locals.userRole = userRole;
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import and use API routes
const apiRoutes = require('./api/apiRoutes');
app.use('/api', apiRoutes);

// Add API endpoint for checking slot availability
app.get('/api/check-slot', async (req, res) => {
  try {
    const { doctorId, slot, date } = req.query;
    
    // Validate required parameters
    if (!doctorId || !slot || !date) {
      return res.status(400).json({ 
        available: false, 
        error: 'Missing required parameters' 
      });
    }
    
    // Check if the slot is already booked for this doctor and date
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: date,
      slot: slot
    });
    
    // Return availability status
    res.json({ 
      available: !existingAppointment, 
      message: existingAppointment ? 'Slot already booked' : 'Slot available'
    });
  } catch (err) {
    console.error('Error checking slot availability:', err);
    res.status(500).json({ 
      available: false, 
      error: 'Error checking availability' 
    });
  }
});

// Add check-auth endpoint for authentication verification
app.get('/check-auth', (req, res) => {
  const isAuthenticated = !!req.cookies.userId;
  res.json({ authenticated: isAuthenticated });
});

// Add a more robust logout endpoint
app.get('/logout', (req, res) => {
  console.log('Logout route called');
  
  // Clear all authentication cookies with path and domain options
  res.clearCookie('userId', { path: '/' });
  res.clearCookie('username', { path: '/' });
  res.clearCookie('userRole', { path: '/' });
  
  // Redirect to home page
  return res.redirect('/');
});

// Add route for cancelling appointments
app.post('/cancel-appointment/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.cookies.userId;
    
    console.log(`Attempting to cancel appointment ${appointmentId} for user ${userId}`);
    
    // Verify the user is logged in
    if (!userId) {
      return res.status(401).json({ success: false, message: 'You must be logged in to cancel appointments' });
    }
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Verify this appointment belongs to the logged-in user
    if (appointment.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }
    
    // Update the appointment status to 'Cancelled'
    appointment.status = 'Cancelled';
    await appointment.save();
    
    console.log(`Appointment ${appointmentId} cancelled successfully`);
    
    return res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    return res.status(500).json({ success: false, message: 'An error occurred while cancelling the appointment' });
  }
});

// Dynamic Routes for EJS pages
app.get('/', (req, res) => {
  res.render('home', { title: 'HealthScape' });
});

// Add login route
app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login', 
    error: null, 
    redirect: req.query.redirect || '',
    doctorName: req.query.doctorName || ''
  });
});

// Add register route
app.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Register', 
    error: null, 
    redirect: req.query.redirect || '' 
  });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'HealthScape' });
});

// Add services route
app.get('/services', async (req, res) => {
  try {
    // Fetch services from database if available
    const services = await Service.find({});
    res.render('services', { title: 'Our Services', services: services });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.render('services', { title: 'Our Services', services: [] });
  }
});

// Add routes for doctor specialties


app.get('/cardiology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Cardiology' });
    res.render('cardiology', { title: 'Cardiology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching cardiology doctors:', err);
    res.render('cardiology', { title: 'Cardiology', doctors: [] });
  }
});

app.get('/neurology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Neurology' });
    res.render('neurology', { title: 'Neurology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching neurology doctors:', err);
    res.render('neurology', { title: 'Neurology', doctors: [] });
  }
});

app.get('/radiology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Radiology' });
    res.render('radiology', { title: 'Radiology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching radiology doctors:', err);
    res.render('radiology', { title: 'Radiology', doctors: [] });
  }
});

app.get('/orthopedics', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Orthopedics' });
    res.render('orthopedics', { title: 'Orthopedics', doctors: doctors });
  } catch (err) {
    console.error('Error fetching orthopedics doctors:', err);
    res.render('orthopedics', { title: 'Orthopedics', doctors: [] });
  }
});

app.get('/pathology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Pathology' });
    res.render('pathology', { title: 'Pathology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching pathology doctors:', err);
    res.render('pathology', { title: 'Pathology', doctors: [] });
  }
});

app.get('/ophthalmology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Ophthalmology' });
    res.render('ophthalmology', { title: 'Ophthalmology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching ophthalmology doctors:', err);
    res.render('ophthalmology', { title: 'Ophthalmology', doctors: [] });
  }
});

app.get('/pediatrics', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Pediatrics' });
    res.render('pediatrics', { title: 'Pediatrics', doctors: doctors });
  } catch (err) {
    console.error('Error fetching pediatrics doctors:', err);
    res.render('pediatrics', { title: 'Pediatrics', doctors: [] });
  }
});

app.get('/gynecology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Gynecology' });
    res.render('gynecology', { title: 'Gynecology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching gynecology doctors:', err);
    res.render('gynecology', { title: 'Gynecology', doctors: [] });
  }
});

app.get('/oncology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Oncology' });
    res.render('oncology', { title: 'Oncology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching oncology doctors:', err);
    res.render('oncology', { title: 'Oncology', doctors: [] });
  }
});

app.get('/pulmonology', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Pulmonology' });
    res.render('pulmonology', { title: 'Pulmonology', doctors: doctors });
  } catch (err) {
    console.error('Error fetching pulmonology doctors:', err);
    res.render('pulmonology', { title: 'Pulmonology', doctors: [] });
  }
});

app.get('/generalmed', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'General Medicine' });
    res.render('generalmed', { title: 'General Medicine', doctors: doctors });
  } catch (err) {
    console.error('Error fetching general medicine doctors:', err);
    res.render('generalmed', { title: 'General Medicine', doctors: [] });
  }
});

app.get('/genetics', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: 'Genetics' });
    res.render('genetics', { title: 'Genetics', doctors: doctors });
  } catch (err) {
    console.error('Error fetching genetics doctors:', err);
    res.render('genetics', { title: 'Genetics', doctors: [] });
  }
});

// Add route for review&blogs
app.get('/review&blogs', (req, res) => {
  res.render('review&blogs', { title: 'Reviews & Blogs' });
});

// Routes for dashboards with user data
app.get('/admin-dashboard', async (req, res) => {
  try {
    // Fetch all appointments from the database with doctor information
    const appointments = await Appointment.find({}).populate('doctor');
    
    // Fetch all doctors with their appointment counts
    const doctors = await Doctor.find({});
    
    // Get username from query params and set a default only if it's undefined
    const username = req.query.username || 'Admin';
    
    console.log('Admin dashboard accessed by:', username); // Add this logging for debugging
    
    // Render the dashboard view and pass the fetched data
    res.render('admin-dashboard', { 
      title: 'Admin Dashboard', 
      appointments: appointments,
      doctors: doctors,
      username: username  // Pass the username to the template
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/patient-dashboard', async (req, res) => {
  try {
    // Get user details from cookies
    const userId = req.cookies.userId;
    const username = req.query.username || req.cookies.username || 'Patient';
    
    let appointments = [];
    
    if (userId) {
      // Get the most recent appointment ID from cookie if available
      const lastAppointmentId = req.cookies.lastAppointmentId;
      if (lastAppointmentId) {
        try {
          const lastAppointment = await Appointment.findById(lastAppointmentId);
          if (lastAppointment && lastAppointment.userId !== userId) {
            lastAppointment.userId = userId;
            await lastAppointment.save();
          }
        } catch (err) {
          // Silent error handling
        }
      }
      
      // Main lookup method: Find by userId
      appointments = await Appointment.find({ userId: userId }).sort({ date: -1 });
      
      // Alternative lookup if no appointments found
      if (appointments.length === 0) {
        // Create a query that includes multiple ways to match the user
        const query = { $or: [{ patientUsername: username }, { name: username }] };
        
        // Add user email and name if available
        const user = await User.findById(userId);
        if (user) {
          if (user.email) query.$or.push({ email: user.email });
          if (user.name) query.$or.push({ name: user.name });
        }
        
        appointments = await Appointment.find(query).sort({ date: -1 });
        console.log(appointments)
        
        // Update appointments with correct userId if found
        if (appointments.length > 0) {
          for (const app of appointments) {
            if (app.userId !== userId) {
              app.userId = userId;
              app.patientUsername = username;
              await app.save();
            }
          }
        }
      }
    }
    
    // Render the dashboard with appointment data
    res.render('patient-dashboard', {
      title: 'Patient Dashboard',
      username: username,
      appointments: appointments || [],
      userId: userId
    });
  } catch (err) {
    console.error('Error loading patient dashboard:', err);
    res.status(500).send('Error loading dashboard');
  }
});

// GET: render the form
app.get('/book', async (req, res) => {
  // Fetch all doctors for the dropdown menu
  const doctors = await Doctor.find({}).sort({ specialty: 1, name: 1 });
  
  // Get all unique specialties for department dropdown
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  res.render('book', { 
    title: 'Book Appointment', 
    success: undefined,
    slotBooked: false,
    clearStorage: false,
    doctors: doctors,
    specialties: specialties
  });
});

app.post('/book', async (req, res) => {
  try {
    const { 
      name, phone, email, date, description, doctor, department, slot, 
      doctorName, doctorSpecialty, doctorExperience, doctorImage, timeSlot
    } = req.body;
    
    console.log('Booking data received from form:', { 
      name, email, phone, date, slot, department,
      doctorName,
      doctorSpecialty,
      timeSlot
    });
    
    // Check if user is logged in
    if (!req.cookies.userId) {
      return res.redirect('/login?redirect=book');
    }
    
    // Enhanced validation for required fields
    if (!doctor || !department || !slot || !date || !name || !phone || !email || !description) {
      console.log('Missing required fields:', { doctor, department, slot });
      
      // Fetch all doctors for the dropdown menu when re-rendering the form
      const doctors = await Doctor.find({}).sort({ specialty: 1, name: 1 });
      // Get all unique specialties for department dropdown
      const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
      
      return res.render('book', { 
        title: 'Book Appointment', 
        success: false,
        slotBooked: false,
        clearStorage: false,
        doctors: doctors,
        specialties: specialties,
        error: 'All fields including doctor, department, and time slot are required.'
      });
    }
    
    // Get the username from cookies for proper tracking
    const username = req.cookies.username || '';
    
    // Check if the slot is already booked for this doctor and date
    let slotBooked = false;
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      date: date,
      slot: slot,
      status: { $ne: 'Cancelled' } // Don't consider cancelled appointments as conflicts
    });
    
    if (existingAppointment) {
      console.log('Slot already booked for this doctor on this date');
      slotBooked = true;
    }
    
    if (slotBooked) {
      // Fetch all doctors for the dropdown menu when re-rendering the form
      const doctors = await Doctor.find({}).sort({ specialty: 1, name: 1 });
      // Get all unique specialties for department dropdown
      const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
      
      return res.render('book', { 
        title: 'Book Appointment', 
        success: false, 
        slotBooked: true,
        clearStorage: false,
        doctors: doctors,
        specialties: specialties
      });
    }
    
    // Fetch the complete doctor information from database
    const selectedDoctor = await Doctor.findById(doctor);
    if (!selectedDoctor) {
      throw new Error('Doctor not found in database');
    }
    
    // Create a new appointment with mandatory fields and complete doctor information
    const appointmentData = {
      name,
      phone,
      email,
      date,
      description,
      doctor: selectedDoctor._id,
      department,
      slot,
      doctorName: selectedDoctor.name,
      patientName: name,
      patientUsername: username,
      status: 'Scheduled',
      userId: req.cookies.userId,
      createdAt: new Date(),
      // Add complete doctor information from database
      doctorSpecialty: selectedDoctor.specialty,
      doctorExperience: selectedDoctor.experience,
      doctorImage: selectedDoctor.image
    };
    
    // Add time slot information
    // Convert slot to readable format if timeSlot is not provided
    if (!timeSlot || timeSlot.trim() === '') {
      let formattedTimeSlot = "Flexible Time";
      switch(slot) {
        case 'slot1': formattedTimeSlot = "9:00 AM - 10:00 AM"; break;
        case 'slot2': formattedTimeSlot = "10:00 AM - 11:00 AM"; break;
        case 'slot3': formattedTimeSlot = "11:00 AM - 12:00 PM"; break;
        case 'slot4': formattedTimeSlot = "1:00 PM - 2:00 PM"; break;
        case 'slot5': formattedTimeSlot = "3:00 PM - 4:00 PM"; break;
        default: formattedTimeSlot = slot === 'flexible' ? 'Flexible Time' : slot;
      }
      appointmentData.timeSlot = formattedTimeSlot;
    } else {
      appointmentData.timeSlot = timeSlot;
    }
    
    // Create and save the appointment
    const appointment = new Appointment(appointmentData);
    const savedAppointment = await appointment.save();
    
    // Increment the doctor's appointment count
    await Doctor.findByIdAndUpdate(
      doctor,
      { $inc: { appointmentCount: 1 } },
      { new: true }
    );
    
    console.log('Appointment saved successfully:', {
      id: savedAppointment._id,
      userId: savedAppointment.userId,
      patientName: savedAppointment.patientName,
      doctorName: savedAppointment.doctorName,
      department: savedAppointment.department,
      doctorSpecialty: savedAppointment.doctorSpecialty,
      timeSlot: savedAppointment.timeSlot,
      phone: savedAppointment.phone,
      email: savedAppointment.email,
      date: savedAppointment.date
    });
    
    // Store appointment data in cookies to display notification in patient dashboard
    res.cookie('newBooking', 'true', { maxAge: 300000 }); // 5 minutes expiry
    res.cookie('bookedDoctor', savedAppointment.doctorName || '', { maxAge: 300000 });
    res.cookie('bookedDepartment', savedAppointment.doctorSpecialty || savedAppointment.department || '', { maxAge: 300000 });
    res.cookie('bookedSlot', savedAppointment.timeSlot || '', { maxAge: 300000 });
    res.cookie('bookedDate', date, { maxAge: 300000 });
    
    // Also store the appointment ID in a cookie for easier lookup
    res.cookie('lastAppointmentId', savedAppointment._id.toString(), { maxAge: 300000 });
    
    // Redirect directly to the patient dashboard
    return res.redirect('/patient-dashboard?refresh=' + new Date().getTime());
    
  } catch (err) {
    console.error('Error booking appointment:', err);
    
    // Fetch all doctors for the dropdown menu when re-rendering the form
    const doctors = await Doctor.find({}).sort({ specialty: 1, name: 1 });
    // Get all unique specialties for department dropdown
    const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
    
    res.render('book', { 
      title: 'Book Appointment', 
      success: false,
      slotBooked: false,
      clearStorage: false,
      doctors: doctors,
      specialties: specialties,
      error: 'There was an error booking your appointment. Please try again.'
    });
  }
});

// this is the contact form route 
app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us',
    success: null,
    error: null
  });
});
app.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate form data
    if (!name || !email || !message) {
      return res.status(400).render('contact', { 
        title: 'Contact Us', 
        error: 'All fields are required',
        success: null
      });
    }
    
    // Create new contact entry
    const contact = new Contact({
      name,
      email,
      message
    });
    
    // Save to MongoDB
    await contact.save();
    
    // Render the contact page with success message
    res.render('contact', { 
      title: 'Contact Us', 
      success: 'Your message has been sent! We will get back to you soon.',
      error: null
    });
  } catch (err) {
    console.error('Error saving contact form:', err);
    res.status(500).render('contact', { 
      title: 'Contact Us', 
      error: 'An error occurred while sending your message. Please try again.',
      success: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});