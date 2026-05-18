const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const sampleProducts = [];
const categories = ['Electronics', 'Fashion', 'Home', 'Sports'];

for (let i = 1; i <= 30; i++) {
  sampleProducts.push({
    name: `Sample Product ${i}`,
    price: Math.floor(Math.random() * 100) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: {
      rate: (Math.random() * 4 + 1).toFixed(1),
      count: Math.floor(Math.random() * 200) + 1
    },
    stock: Math.floor(Math.random() * 50) + 5,
    description: `This is a great description for Sample Product ${i}. It is high quality and very affordable.`,
    image: 'image1.avif' // Reusing the local image for mock data
  });
}

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(sampleProducts);
    console.log('Successfully seeded 30 products');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
