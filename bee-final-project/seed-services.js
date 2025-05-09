const mongoose = require('mongoose');
const Service = require('./models/service');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/healthscape')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Service data
const services = [
  {
    title: 'Oncology',
    description: 'Comprehensive cancer care and treatment with advanced technology.',
    icon: 'fas fa-x-ray',
    link: '/oncology'
  },
  {
    title: 'Cardiology',
    description: 'Expert heart care including diagnostics and treatments.',
    icon: 'fas fa-heart',
    link: '/cardiology'
  },
  {
    title: 'Neurology',
    description: 'Treatment for disorders of the brain and nervous system.',
    icon: 'fas fa-brain',
    link: '/neurology'
  },
  {
    title: 'Orthopedics',
    description: 'Care for bones, joints, and injuries with surgical options.',
    icon: 'fas fa-bone',
    link: '/orthopedics'
  },
  {
    title: 'Pediatrics',
    description: 'Healthcare for children from birth through adolescence.',
    icon: 'fas fa-baby',
    link: '/pediatrics'
  },
  {
    title: 'Gynecology',
    description: 'Comprehensive care for women\'s reproductive health.',
    icon: 'fas fa-female',
    link: '/gynecology'
  },
  {
    title: 'Pathology',
    description: 'Laboratory services and accurate test results.',
    icon: 'fas fa-vials',
    link: '/pathology'
  },
  {
    title: 'Radiology',
    description: 'Imaging services including X-rays, MRI, and CT scans.',
    icon: 'fas fa-x-ray',
    link: '/radiology'
  },
  {
    title: 'General Medicine',
    description: 'Holistic treatment for all general medical needs.',
    icon: 'fas fa-user-nurse',
    link: '/generalmed'
  },
  {
    title: 'Pulmonology',
    description: 'Care for respiratory and lung conditions.',
    icon: 'fas fa-lungs',
    link: '/pulmonology'
  },
  {
    title: 'Genetics',
    description: 'Genetic testing and counseling for inherited conditions.',
    icon: 'fas fa-dna',
    link: '/genetics'
  },
  {
    title: 'Ophthalmology',
    description: 'Vision care including eye exams and surgeries.',
    icon: 'fas fa-eye',
    link: '/ophthalmology'
  }
];

// Insert services into the database
const seedDB = async () => {
  try {
    // First, clear the existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Insert new services
    await Service.insertMany(services);
    console.log('Added 12 services to the database');
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDB();