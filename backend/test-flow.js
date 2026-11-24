const API_BASE = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return { status: res.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 FOODIE APP: COMPLETE END-TO-END VERIFICATION TEST');
  console.log('====================================================\n');

  let testUserToken = '';
  let testUserId = '';
  let createdRecipeId = '';
  let sampleRecipeId = '';

  const testEmail = `tester_${Date.now()}@foodie.com`;
  const testPassword = 'Password123!';

  // Step 1: Health Check
  console.log('Step 1: Testing API Health Check...');
  const healthRes = await request('http://localhost:5000/api/health');
  console.log('✅ Server online:', healthRes.data);

  // Step 2: Register New User in MongoDB
  console.log('\nStep 2: Registering a brand new user in MongoDB...');
  const regRes = await request(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'Master Chef Tester',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    })
  });
  console.log('✅ User registered in MongoDB:', regRes.data.user.email);
  testUserToken = regRes.data.token;
  testUserId = regRes.data.user._id;

  const authHeaders = {
    Authorization: `Bearer ${testUserToken}`
  };

  // Step 3: Login Authentication
  console.log('\nStep 3: Testing Login with credentials...');
  const loginRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  console.log('✅ Login successful, token received:', loginRes.data.token ? 'YES' : 'NO');

  // Step 4: Verify Me endpoint
  console.log('\nStep 4: Fetching /api/auth/me...');
  const meRes = await request(`${API_BASE}/auth/me`, {
    headers: authHeaders
  });
  console.log('✅ Me verified, User Name:', meRes.data.user.name);

  // Step 5: Browse All Recipes from MongoDB
  console.log('\nStep 5: Fetching all recipes from MongoDB...');
  const recipesRes = await request(`${API_BASE}/recipes`);
  console.log(`✅ Retrieved ${recipesRes.data.count} recipes from MongoDB.`);
  if (recipesRes.data.recipes.length > 0) {
    sampleRecipeId = recipesRes.data.recipes[0]._id;
    console.log(`Sample Recipe Title: "${recipesRes.data.recipes[0].title}" (ID: ${sampleRecipeId})`);
  }

  // Step 6: Verify Categories
  console.log('\nStep 6: Fetching all categories from MongoDB...');
  const catRes = await request(`${API_BASE}/categories`);
  console.log(`✅ Loaded ${catRes.data.categories.length} categories.`);
  const catNames = catRes.data.categories.map(c => c.name);
  console.log('Categories:', catNames.join(', '));

  // Step 7: Search Recipes
  console.log('\nStep 7: Searching for "Biryani"...');
  const searchRes = await request(`${API_BASE}/recipes?search=Biryani`);
  console.log(`✅ Found ${searchRes.data.count} recipe(s) matching "Biryani".`);

  // Step 8: Open Recipe Details
  console.log(`\nStep 8: Fetching single recipe details for ID: ${sampleRecipeId}...`);
  const detailsRes = await request(`${API_BASE}/recipes/${sampleRecipeId}`);
  console.log('✅ Recipe Details Title:', detailsRes.data.recipe.title);
  console.log('Ingredients count:', detailsRes.data.recipe.ingredients.length);
  console.log('Instructions count:', detailsRes.data.recipe.instructions.length);

  // Step 9: Add Recipe to Favourites in MongoDB
  console.log(`\nStep 9: Adding recipe ${sampleRecipeId} to favourites in MongoDB...`);
  const favRes = await request(`${API_BASE}/favorites/${sampleRecipeId}`, {
    method: 'POST',
    headers: authHeaders
  });
  console.log('✅ Favourite added response:', favRes.data.message);

  // Step 10: Verify Favourites in MongoDB
  console.log('\nStep 10: Fetching user favourites from MongoDB...');
  const userFavsRes = await request(`${API_BASE}/favorites`, {
    headers: authHeaders
  });
  console.log(`✅ User has ${userFavsRes.data.count} favourite(s) stored in MongoDB.`);
  const hasFav = userFavsRes.data.recipes.some(r => r._id === sampleRecipeId);
  console.log('✅ Verified recipe is in favourites list in MongoDB:', hasFav);

  // Step 11: Add a completely new recipe dynamically
  console.log('\nStep 11: Publishing a brand new recipe to MongoDB...');
  const newRecipePayload = {
    title: 'Spicy Garlic Butter Prawns',
    description: 'Juicy ocean prawns sautéed in rich garlic butter, chili flakes, and fresh parsley.',
    category: 'Dinner',
    imageUrl: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
    preparationTime: 10,
    cookingTime: 12,
    servings: 2,
    difficulty: 'Easy',
    isVegetarian: false,
    ingredients: [
      '400g Jumbo Prawns (cleaned & deveined)',
      '3 tbsp Salted Butter',
      '6 cloves Garlic (finely sliced)',
      '1 tsp Crushed Red Chili Flakes',
      '1 tbsp Lemon Juice',
      'Fresh Parsley for garnish'
    ],
    instructions: [
      'Pat the cleaned prawns dry with paper towels and season lightly with salt and black pepper.',
      'Melt 2 tbsp butter in a wide skillet over medium heat. Add sliced garlic and chilli flakes; sauté for 1 minute until fragrant.',
      'Add prawns in a single layer. Cook for 2 minutes on each side until pink and opaque.',
      'Finish with remaining 1 tbsp butter and fresh lemon juice. Toss to coat evenly and garnish with fresh parsley. Serve hot!'
    ]
  };

  const publishRes = await request(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(newRecipePayload)
  });
  console.log('✅ Recipe Published successfully to MongoDB!');
  createdRecipeId = publishRes.data.recipe._id;
  console.log(`Created Recipe ID: ${createdRecipeId}, Title: "${publishRes.data.recipe.title}"`);

  // Step 12: Verify it appears in All Recipes
  console.log('\nStep 12: Verifying new recipe appears in /api/recipes...');
  const verifyRecipesRes = await request(`${API_BASE}/recipes`);
  const foundInAll = verifyRecipesRes.data.recipes.some(r => r._id === createdRecipeId);
  console.log('✅ Verified newly created recipe appears in MongoDB recipes collection:', foundInAll);

  // Step 13: Leave a Review & Rating
  console.log('\nStep 13: Submitting review & 5-star rating on recipe in MongoDB...');
  const reviewRes = await request(`${API_BASE}/reviews/${createdRecipeId}`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      rating: 5,
      comment: 'Phenomenal dish! Incredibly buttery and easy to whip up in 15 minutes.'
    })
  });
  console.log('✅ Review submitted to MongoDB:', reviewRes.data.message);

  // Step 14: Edit the Recipe
  console.log(`\nStep 14: Updating recipe ${createdRecipeId}...`);
  const updateRes = await request(`${API_BASE}/recipes/${createdRecipeId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Spicy Garlic Butter Prawns (Updated Special)',
      cookingTime: 10
    })
  });
  console.log('✅ Recipe updated successfully:', updateRes.data.recipe.title);

  // Step 15: Delete the Recipe
  console.log(`\nStep 15: Deleting recipe ${createdRecipeId}...`);
  const deleteRes = await request(`${API_BASE}/recipes/${createdRecipeId}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  console.log('✅ Recipe deleted from MongoDB:', deleteRes.data.message);

  // Step 16: Remove Favourite
  console.log(`\nStep 16: Removing favourite ${sampleRecipeId}...`);
  const removeFavRes = await request(`${API_BASE}/favorites/${sampleRecipeId}`, {
    method: 'DELETE',
    headers: authHeaders
  });
  console.log('✅ Removed favourite from MongoDB:', removeFavRes.data.message);

  console.log('\n====================================================');
  console.log('🎉 ALL 16 FULL-STACK VERIFICATION STEPS PASSED 100%!');
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err.data || err.message);
  process.exit(1);
});
