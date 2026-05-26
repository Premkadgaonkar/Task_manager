const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

async function test() {
  await mongoose.connect('mongodb+srv://premkadgaonkar:Prem%4025.@cluster0.41pbcwi.mongodb.net/?appName=Cluster0');
  try {
    const u = new User({ name: 'test', email: 'test1234@gmail.com', password: 'password123' });
    await u.save();
    console.log('Save success');
  } catch (err) {
    console.error('Save failed:', err);
  }
  mongoose.disconnect();
}
test();
