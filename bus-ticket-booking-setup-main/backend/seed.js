import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Admin user data
const adminUser = {
  name: 'Admin',
  email: 'admin@busbook.com',
  password: 'admin123',
  phone: '9999999999',
  role: 'admin'
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: adminUser.email });
    if (!adminExists) {
      await User.create(adminUser);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@busbook.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
