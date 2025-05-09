const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Patient information
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    
    // User connections
    userId: {
        type: String
    },
    patientUsername: String,
    
    // Appointment details
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    // Doctor selection
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorSpecialty: String,
    doctorExperience: Number,
    doctorImage: String,
    
    // Department/specialty
    department: {
        type: String,
        required: true
    },
    
    // Time slot information
    slot: {
        type: String,
        enum: ['flexible', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5'],
        required: true
    },
    timeSlot: String, // Human-readable time slot (e.g., "9:00 AM - 10:00 AM")
    
    // Status tracking
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // For patient info display
    patientName: String
});

module.exports = mongoose.model('Appointment', appointmentSchema);