const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const restaurantItems = [
  {
    name: 'Classic Chicken Biryani',
    price: 320,
    category: 'Restaurant Specialties',
    description: 'Hyderabadi style aromatic biryani with tender chicken pieces and long grain basmati rice.',
    image: '/src/assets/products/biryani.png'
  },
  {
    name: 'Paneer Butter Masala',
    price: 280,
    category: 'Restaurant Specialties',
    description: 'Rich, creamy and spicy cottage cheese cubes in an onion-tomato based gravy.',
    image: '/src/assets/products/paneer.png'
  },
  {
    name: 'Veg Hakka Noodles',
    price: 220,
    category: 'Restaurant Specialties',
    description: 'Stir-fried noodles with crisp vegetables and traditional Chinese seasonings.',
    image: '/src/assets/products/noodles.png'
  }
];

const seedRestaurant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
    
    await Product.insertMany(restaurantItems);
    console.log('Restaurant items added successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedRestaurant();
