const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixPaths = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({ image: { $regex: /^\/src\/assets\/products\// } });
    console.log(`Found ${products.length} products with old paths`);

    for (const p of products) {
      const newPath = p.image.replace('/src/assets/products/', '/products/');
      p.image = newPath;
      await p.save();
      console.log(`Updated: ${p.name} -> ${newPath}`);
    }

    console.log('All paths fixed!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPaths();
