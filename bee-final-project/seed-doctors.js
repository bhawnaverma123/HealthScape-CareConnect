const mongoose = require('mongoose');
const Doctor = require('./models/doctor');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/healthscape')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Doctors data
const doctors = [
  // Cardiology
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
  },
  
  // Neurology
  {
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    image: 'male8.jpg',
    experience: 14,
    bio: 'Specialized in treating stroke and neurodegenerative disorders'
  },
  {
    name: 'Dr. Jane Smith',
    specialty: 'Neurology',
    image: 'female12.jpg',
    experience: 10,
    bio: 'Expert in neurological disorders and brain imaging'
  },
  {
    name: 'Dr. Emma Wilson',
    specialty: 'Neurology',
    image: 'female11.jpg',
    experience: 9,
    bio: 'Specializes in epilepsy and sleep disorders'
  },
  
  // Oncology
  {
    name: 'Dr. Robert Lee',
    specialty: 'Oncology',
    image: 'male10.jpg',
    experience: 17,
    bio: 'Specializes in cancer treatment and immunotherapy'
  },
  {
    name: 'Dr. Lisa Wang',
    specialty: 'Oncology',
    image: 'male11.jpg',
    experience: 10,
    bio: 'Expert in precision oncology and targeted therapies'
  },
  {
    name: 'Dr. Emily Johnson',
    specialty: 'Oncology',
    image: 'female10.jpg',
    experience: 8,
    bio: 'Specializes in breast and gynecological cancers'
  },
  
  // Orthopedics
  {
    name: 'Dr. James Peterson',
    specialty: 'Orthopedics',
    image: 'male3.jpg',
    experience: 13,
    bio: 'Specialized in joint replacement and sports medicine'
  },
  {
    name: 'Dr. Mary Johnson',
    specialty: 'Orthopedics',
    image: 'female6.jpg',
    experience: 10,
    bio: 'Expert in spinal surgery and trauma care'
  },
  {
    name: 'Dr. David Wilson',
    specialty: 'Orthopedics',
    image: 'female7.jpg',
    experience: 7,
    bio: 'Specializes in pediatric orthopedics and deformity correction'
  },
  
  // Pathology
  {
    name: 'Dr. Thomas Anderson',
    specialty: 'Pathology',
    image: 'male4.jpg',
    experience: 16,
    bio: 'Expert in anatomical and clinical pathology'
  },
  {
    name: 'Dr. Amanda Liu',
    specialty: 'Pathology',
    image: 'male6.jpg',
    experience: 10,
    bio: 'Specializes in molecular pathology and cytopathology'
  },
  {
    name: 'Dr. Rachel Kim',
    specialty: 'Pathology',
    image: 'male7.jpg',
    experience: 8,
    bio: 'Expert in hematopathology and immunohistochemistry'
  },
  
  // Radiology
  {
    name: 'Dr. William Davis',
    specialty: 'Radiology',
    image: 'male1.jpg',
    experience: 12,
    bio: 'Specializes in diagnostic imaging and interventional radiology'
  },
  {
    name: 'Dr. Susan Johnson',
    specialty: 'Radiology',
    image: 'female12.jpg',
    experience: 10,
    bio: 'Expert in MRI and CT imaging interpretation'
  },
  {
    name: 'Dr. Jennifer Adams',
    specialty: 'Radiology',
    image: 'female1.jpg',
    experience: 8,
    bio: 'Specializes in breast imaging and nuclear medicine'
  },
  
  // General Medicine
  {
    name: 'Dr. Christopher Hall',
    specialty: 'General Medicine',
    image: 'male15.jpg',
    experience: 15,
    bio: 'Expert in preventive care and chronic disease management'
  },
  {
    name: 'Dr. Rebecca Taylor',
    specialty: 'General Medicine',
    image: 'male16.jpg',
    experience: 10,
    bio: 'Specializes in family medicine and geriatric care'
  },
  {
    name: 'Dr. Elizabeth Parker',
    specialty: 'General Medicine',
    image: 'female17.jpg',
    experience: 8,
    bio: 'Focused on integrative medicine and patient education'
  },
  
  // Pulmonology
  {
    name: 'Dr. Kevin Wright',
    specialty: 'Pulmonology',
    image: 'male9.jpg',
    experience: 14,
    bio: 'Expert in respiratory disorders and interventional bronchoscopy'
  },
  {
    name: 'Dr. Sarah Bennett',
    specialty: 'Pulmonology',
    image: 'female2.jpg',
    experience: 10,
    bio: 'Specializes in sleep apnea and pulmonary hypertension'
  },
  {
    name: 'Dr. Michelle Roberts',
    specialty: 'Pulmonology',
    image: 'female3.jpg',
    experience: 8,
    bio: 'Focused on asthma, COPD, and pulmonary rehabilitation'
  },
  
  // Genetics
  {
    name: 'Dr. Daniel Morgan',
    specialty: 'Genetics',
    image: 'male2.jpg',
    experience: 16,
    bio: 'Expert in genetic counseling and rare genetic disorders'
  },
  {
    name: 'Dr. Laura Chen',
    specialty: 'Genetics',
    image: 'male13.jpg',
    experience: 10,
    bio: 'Specializes in cancer genetics and personalized medicine'
  },
  {
    name: 'Dr. Jason Kim',
    specialty: 'Genetics',
    image: 'male14.jpg',
    experience: 8,
    bio: 'Focused on pediatric genetics and developmental disorders'
  },
  
  // Gynecology
  {
    name: 'Dr. Melissa Garcia',
    specialty: 'Gynecology',
    image: 'female15.jpg',
    experience: 13,
    bio: `Expert in women's health and minimally invasive surgery`
  },
  {
    name: 'Dr. Jennifer Lopez',
    specialty: 'Gynecology',
    image: 'female14.jpg',
    experience: 10,
    bio: 'Specializes in reproductive endocrinology and infertility'
  },
  {
    name: 'Dr. Nicole Brown',
    specialty: 'Gynecology',
    image: 'female13.jpg',
    experience: 8,
    bio: 'Focused on gynecologic oncology and preventive care'
  },
  
  // Ophthalmology
  {
    name: 'Dr. Richard Wright',
    specialty: 'Ophthalmology',
    image: 'male17.jpg',
    experience: 15,
    bio: 'Expert in cataract surgery and corneal disorders'
  },
  {
    name: 'Dr. Patricia Lee',
    specialty: 'Ophthalmology',
    image: 'female9.jpg',
    experience: 10,
    bio: 'Specializes in glaucoma and retinal diseases'
  },
  {
    name: 'Dr. Jessica White',
    specialty: 'Ophthalmology',
    image: 'female8.jpg',
    experience: 9,
    bio: 'Focused on pediatric ophthalmology and strabismus'
  },
  
  // Pediatrics
  {
    name: 'Dr. Mark Johnson',
    specialty: 'Pediatrics',
    image: 'male17.jpg',
    experience: 14,
    bio: 'Expert in general pediatrics and developmental disorders'
  },
  {
    name: 'Dr. Victoria Adams',
    specialty: 'Pediatrics',
    image: 'female4.jpg',
    experience: 10,
    bio: 'Specializes in pediatric allergies and immunology'
  },
  {
    name: 'Dr. Andrew Davis',
    specialty: 'Pediatrics',
    image: 'male5.jpg',
    experience: 8,
    bio: 'Focused on neonatal care and pediatric emergencies'
  }
];

// Function to seed doctors
const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');
    
    // Insert new doctors
    const result = await Doctor.insertMany(doctors);
    console.log(`${result.length} doctors added successfully`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding doctors:', err);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDoctors();