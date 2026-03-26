const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const promoteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found. Please register first.');
      process.exit(1);
    }
    
    user.role = 'admin';
    await user.save();
    
    console.log(`Successfully promoted ${email} to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Usage: node promoteAdmin.js <email>');
  process.exit(1);
}

promoteUser(email);
