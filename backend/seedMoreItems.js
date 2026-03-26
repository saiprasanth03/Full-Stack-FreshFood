const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const moreItems = [
  {
    name: 'Crispy Masala Dosa',
    price: 120,
    category: 'Restaurant Specialties',
    description: 'Crispy golden thin rice crepe filled with spiced potato mash, served with coconut chutney and sambar.',
    image: '/src/assets/products/dosa.png'
  },
  {
    name: 'Tandoori Chicken (Half)',
    price: 260,
    category: 'Restaurant Specialties',
    description: 'Chicken marinated with yogurt and spices, grilled in a traditional clay oven for a smoky flavour.',
    image: '/src/assets/products/tandoori.png'
  },
  {
    name: 'Hot Gulab Jamun (2 pcs)',
    price: 60,
    category: 'Restaurant Specialties',
    description: 'Deep-fried brown milk solids soaked in cardamom-flavoured sugar syrup. Served warm.',
    image: '/src/assets/products/gulabjamun.png'
  }
];

const seedMore = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding more items');
    
    await Product.insertMany(moreItems);
    console.log('More items added successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMore();
