const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true,
        enum: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pathology', 
               'Radiology', 'General Medicine', 'Pulmonology', 'Genetics', 
               'Gynecology', 'Ophthalmology', 'Pediatrics']
    },
    image: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    appointmentCount: {
        type: Number,
        default: 0
    },
    bio: String,
    availableSlots: {
        type: [String],
        default: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5']
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);