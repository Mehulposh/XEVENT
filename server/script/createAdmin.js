require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user');

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'crio.do.test@example.com' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'crio.do.test@example.com',
      password: '12345678',
      role: 'Admin',
      isVerified: true,
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password: 12345678');
    console.log('Role:', adminUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();