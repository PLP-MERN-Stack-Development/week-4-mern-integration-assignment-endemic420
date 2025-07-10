const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/category');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

(async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});

    // Seed admin user
    await User.create({
      name: 'AdminDennoh',
      email: 'karanjadennis17@gmail.com',
      password: await bcrypt.hash('Dennoh254', 10),
      role: "admin",
    });

    // Seed categories
    await Category.insertMany([
      { name: 'Technology' },
      { name: 'Lifestyle' },
      { name: 'Programming'},
    ]);

    console.log('Admin user and categories seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
})();