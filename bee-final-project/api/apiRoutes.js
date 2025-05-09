// api/apiRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword, role } = req.body;
    const redirectTo = req.query.redirect || '';
    
    // Validate input
    if (!username || !password || !confirmPassword || !role) {
      return res.render('register', { error: 'All fields are required', redirect: redirectTo });
    }
    
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match', redirect: redirectTo });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists', redirect: redirectTo });
    }
    
    // Create new user
    const newUser = new User({
      username,
      password, // Will be hashed by pre-save hook in the model
      role
    });
    
    await newUser.save();
    console.log(`New user registered: ${username} with role ${role}`);
    
    // Show success message and redirect to login page with redirect parameter preserved
    return res.render('register-success', { 
      username: username, 
      role: role,
      redirect: redirectTo,
      message: 'Registration successful! Please proceed to login with your credentials.' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.render('register', { error: 'Registration failed. Please try again.', redirect: req.query.redirect || '' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const redirectTo = req.query.redirect || '';
    const doctorName = req.query.doctorName || '';
    const doctorId = req.query.doctorId || '';
    const department = req.query.department || '';
    
    // Validate input
    if (!username || !password || !role) {
      return res.render('login', { 
        error: 'All fields are required',
        redirect: redirectTo,
        doctorName: doctorName
      });
    }
    
    // Find user by username and role
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.render('login', { 
        error: 'Account not found. Please register before attempting to login.',
        redirect: redirectTo,
        doctorName: doctorName
      });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { 
        error: 'Invalid password. Please try again.',
        redirect: redirectTo,
        doctorName: doctorName
      });
    }
    
    console.log(`User ${username} with role ${role} logged in successfully`);
    
    // Set cookies for authentication
    res.cookie('userId', user._id.toString(), { maxAge: 86400000 }); // 24 hours
    res.cookie('username', user.username, { maxAge: 86400000 });
    res.cookie('userRole', user.role, { maxAge: 86400000 });
    
    // Check if there's a redirect parameter to return to booking
    if (redirectTo === 'book') {
      // If we have doctor information, include it in the redirect
      if (doctorName) {
        let bookingUrl = '/book?';
        
        // Add doctor parameters we have to the query string
        if (doctorName) bookingUrl += `doctorName=${encodeURIComponent(doctorName)}&`;
        if (doctorId) bookingUrl += `doctorId=${encodeURIComponent(doctorId)}&`;
        if (department) bookingUrl += `department=${encodeURIComponent(department)}&`;
        
        // Remove trailing & if present
        if (bookingUrl.endsWith('&')) {
          bookingUrl = bookingUrl.slice(0, -1);
        }
        
        console.log('Redirecting to booking with doctor info:', bookingUrl);
        return res.redirect(bookingUrl);
      }
      
      return res.redirect('/book');
    }
    
    // Redirect based on role with username in query param
    if (role === 'admin') {
      return res.redirect(`/admin-dashboard?username=${encodeURIComponent(username)}`);
    } else if (role === 'patient') {
      return res.redirect(`/patient-dashboard?username=${encodeURIComponent(username)}`);
    } else if (role === 'doctor') {
      return res.redirect(`/doctor-dashboard?username=${encodeURIComponent(username)}`);
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { 
      error: 'Login failed. Please try again.',
      redirect: req.query.redirect || '',
      doctorName: req.query.doctorName || ''
    });
  }
});

module.exports = router;
