const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { Recipe } = require('./models/Recipe');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkMongoDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodie_db';
  console.log(`Connecting to: ${uri}`);
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const adminDb = mongoose.connection.db.admin();
  const dbs = await adminDb.listDatabases();
  console.log('\n--- DATABASES IN THIS MONGODB INSTANCE ---');
  dbs.databases.forEach(d => console.log(`• ${d.name} (${(d.sizeOnDisk / 1024).toFixed(1)} KB)`));

  const collections = await db.listCollections().toArray();
  console.log(`\n--- COLLECTIONS IN DATABASE "${mongoose.connection.name}" ---`);
  collections.forEach(c => console.log(`• ${c.name}`));

  const allRecipes = await Recipe.find().populate('author', 'name email').sort({ createdAt: -1 });
  console.log(`\n--- TOTAL RECIPES FOUND IN "${mongoose.connection.name}.recipes": ${allRecipes.length} ---`);
  allRecipes.forEach((r, idx) => {
    console.log(`${idx + 1}. "${r.title}" (Category: ${r.category}, Author: ${r.author?.name || 'Unknown'}, Created: ${r.createdAt})`);
  });

  const allUsers = await User.find().select('name email createdAt');
  console.log(`\n--- TOTAL USERS FOUND IN "${mongoose.connection.name}.users": ${allUsers.length} ---`);
  allUsers.forEach((u, idx) => {
    console.log(`${idx + 1}. ${u.name} <${u.email}>`);
  });

  process.exit(0);
}

checkMongoDB().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
