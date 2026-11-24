const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const { Recipe } = require('../models/Recipe');
const Review = require('../models/Review');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleRecipes = [
  {
    title: 'Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    description: 'A royal, aromatic Hyderabadi classic cooked with layered basmati rice, tender spiced chicken, saffron, mint, and fried onions (dum style).',
    category: 'Non-Vegetarian',
    preparationTime: 30,
    cookingTime: 45,
    servings: 4,
    difficulty: 'Hard',
    isVegetarian: false,
    ingredients: [
      '500g Chicken (bone-in pieces)',
      '2 cups Aged Basmati Rice',
      '1 cup Greek Yogurt or Curd',
      '2 large Onions (thinly sliced and golden fried)',
      '2 tbsp Ginger-Garlic Paste',
      '1 tbsp Biryani Masala Powder',
      '1 tsp Red Chilli Powder',
      '1/2 tsp Turmeric Powder',
      '1/4 cup Fresh Mint Leaves (chopped)',
      '1/4 cup Fresh Coriander Leaves (chopped)',
      'Pinch of Saffron strands soaked in 3 tbsp warm milk',
      '3 tbsp Pure Ghee',
      'Whole spices: 2 bay leaves, 4 green cardamoms, 1 black cardamom, 4 cloves, 1 inch cinnamon stick',
      'Salt to taste'
    ],
    instructions: [
      'Marinate chicken pieces with yogurt, ginger-garlic paste, red chilli powder, turmeric, half the biryani masala, half the fried onions, mint, coriander, and salt for at least 1 hour.',
      'Rinse basmati rice until water runs clear, soak for 30 minutes, then drain.',
      'In a large pot, boil water with whole spices and salt. Add soaked rice and cook until 70% done (about 5-6 minutes). Drain completely.',
      'Heat ghee in a heavy-bottomed pot or handi. Add the marinated chicken and sear over medium-high heat for 8-10 minutes until half cooked.',
      'Layer the partially cooked basmati rice evenly over the chicken. Sprinkle saffron milk, remaining fried onions, fresh mint, and a drizzle of ghee on top.',
      'Cover tightly with a lid and seal edges with dough or foil. Cook on high for 3 minutes, then reduce to lowest heat (dum) and simmer for 25 minutes.',
      'Rest for 10 minutes before opening. Gently fluff the rice layers and serve piping hot with chilled onion raita and salan.'
    ]
  },
  {
    title: 'Chilli Chicken',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=80',
    description: 'Crispy fried chicken tossed in an intoxicating Indo-Chinese spicy soy sauce, garlic, green chilies, and crunchy bell peppers.',
    category: 'Fast Food',
    preparationTime: 20,
    cookingTime: 15,
    servings: 3,
    difficulty: 'Medium',
    isVegetarian: false,
    ingredients: [
      '400g Boneless Chicken (cut into bite-sized cubes)',
      '2 tbsp Cornflour (cornstarch)',
      '2 tbsp All-Purpose Flour (Maida)',
      '1 Egg white',
      '2 tbsp Dark Soy Sauce',
      '1.5 tbsp Chilli Sauce (Sriracha or Red Chilli paste)',
      '1 tbsp Tomato Ketchup',
      '1 tsp Vinegar',
      '6 cloves Garlic (finely minced)',
      '1 inch Ginger (finely minced)',
      '3 Green Chillies (slit lengthwise)',
      '1 Bell Pepper / Capsicum (cut into cubes)',
      '1 medium Onion (cut into square petals)',
      '1/4 cup Spring Onion greens (chopped)',
      'Oil for deep frying',
      'Salt and freshly cracked black pepper to taste'
    ],
    instructions: [
      'Season chicken cubes with salt, black pepper, 1 tsp soy sauce, egg white, all-purpose flour, and cornflour. Mix well until evenly coated.',
      'Heat oil in a wok. Deep fry chicken in batches on medium-high heat until golden brown and super crispy (around 5-6 minutes). Drain on paper towels.',
      'In a small bowl, whisk together remaining dark soy sauce, chilli sauce, tomato ketchup, vinegar, and 1 tsp cornflour dissolved in 3 tbsp water.',
      'Heat 2 tbsp oil in a wok over high heat. Add minced garlic, ginger, and slit green chillies. Sauté vigorously for 40 seconds until fragrant.',
      'Toss in diced onions and bell peppers; stir-fry on high flame for 2 minutes keeping them crunchy.',
      'Pour in the sauce mixture and let it bubble and thicken into a glossy glaze.',
      'Add the crispy fried chicken cubes and toss briskly for 1 minute until glazed entirely.',
      'Garnish generously with chopped spring onions and serve immediately with fried rice or noodles.'
    ]
  },
  {
    title: 'Chicken 65',
    image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=1000&q=80',
    description: 'Iconic South Indian spicy, deep-fried chicken starter infused with fragrant curry leaves, garlic, crushed pepper, and tangy lemon.',
    category: 'Snacks',
    preparationTime: 25,
    cookingTime: 15,
    servings: 3,
    difficulty: 'Medium',
    isVegetarian: false,
    ingredients: [
      '450g Boneless Chicken (cut into bite-sized pieces)',
      '3 tbsp Thick Plain Curd (Yogurt)',
      '2 tbsp Rice Flour (for extra crunch)',
      '2 tbsp Cornstarch',
      '1 tbsp Kashmiri Red Chilli Powder',
      '1 tsp Crushed Black Peppercorns',
      '1 tbsp Ginger-Garlic Paste',
      '1 tsp Garam Masala',
      '1 Sprig Fresh Curry Leaves (about 15-20 leaves)',
      '3 Green Chillies (slit)',
      '1 tbsp Lemon Juice',
      'Oil for deep frying',
      'Salt to taste'
    ],
    instructions: [
      'In a bowl, combine curd, ginger-garlic paste, Kashmiri red chilli powder, black pepper, garam masala, salt, and lemon juice.',
      'Add chicken pieces and coat thoroughly. Stir in rice flour and cornstarch until a light batter clings to each piece. Rest for 20 minutes.',
      'Heat oil in a deep pan. Drop chicken pieces in batches and deep fry over medium heat until cooked through and intensely crispy (6-7 minutes). Drain.',
      'In a separate small pan, heat 1 tsp oil. Sauté slit green chillies and fresh curry leaves until crisp and crackling.',
      'Toss the fried crispy chicken into the tempered curry leaves and chillies.',
      'Serve hot with lemon wedges and sliced red onions.'
    ]
  },
  {
    title: 'Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80',
    description: 'Velvety, creamy, and mildly sweet restaurant-style curry made with soft paneer cubes in a rich tomato, butter, and cashew gravy.',
    category: 'Vegetarian',
    preparationTime: 15,
    cookingTime: 25,
    servings: 4,
    difficulty: 'Easy',
    isVegetarian: true,
    ingredients: [
      '300g Fresh Paneer (cut into cubes)',
      '4 ripe Red Tomatoes (roughly chopped)',
      '1 medium Onion (roughly chopped)',
      '12 Whole Cashews (soaked in warm water for 15 mins)',
      '2 tbsp Butter + 1 tbsp Oil',
      '1 tbsp Ginger-Garlic Paste',
      '1 tsp Kashmiri Red Chilli Powder',
      '1 tsp Coriander Powder',
      '1/2 tsp Garam Masala',
      '1 tsp Kasuri Methi (crushed dried fenugreek leaves)',
      '3 tbsp Fresh Cream',
      '1 tsp Sugar or Honey (to balance acidity)',
      'Salt to taste'
    ],
    instructions: [
      'In a saucepan, simmer tomatoes, onion, soaked cashews, and 1/2 cup water for 10 minutes until soft. Cool and blend into a silk-smooth puree.',
      'Strain the tomato-cashew puree through a fine sieve for that signature velvety restaurant texture.',
      'Melt butter and oil in a pan over medium heat. Add ginger-garlic paste and sauté for 1 minute.',
      'Add Kashmiri red chilli powder and coriander powder; stir gently for 20 seconds on low flame.',
      'Pour in the strained puree and cook on medium-low flame for 8-10 minutes until butter starts separating from the edges.',
      'Add salt, sugar, garam masala, and 1/2 cup warm water to adjust gravy consistency. Simmer for 3 minutes.',
      'Gently fold in fresh paneer cubes and let them absorb the flavors for 3-4 minutes.',
      'Stir in fresh cream and crushed kasuri methi. Garnish with a swirl of cream and a knob of butter. Serve with garlic naan or basmati rice.'
    ]
  },
  {
    title: 'Veg Fried Rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80',
    description: 'Smoky, restaurant-style wok tossed jasmine or basmati rice with finely diced crisp vegetables, garlic, scallions, and light seasoning.',
    category: 'Dinner',
    preparationTime: 15,
    cookingTime: 10,
    servings: 3,
    difficulty: 'Easy',
    isVegetarian: true,
    ingredients: [
      '3 cups Cooked & Chilled Jasmine or Long-Grain Basmati Rice',
      '1/2 cup Carrots (finely diced)',
      '1/2 cup French Beans (finely chopped)',
      '1/2 cup Sweet Corn or Green Peas',
      '1/2 cup Green Bell Pepper (finely diced)',
      '1/3 cup Spring Onions (whites and greens separated)',
      '5 cloves Garlic (finely minced)',
      '1.5 tbsp Light Soy Sauce',
      '1 tsp Rice Vinegar',
      '1/2 tsp White Pepper Powder',
      '2 tbsp Sesame or Vegetable Oil',
      'Salt to taste'
    ],
    instructions: [
      'Ensure the cooked rice is thoroughly cooled (day-old refrigerated rice produces the best grains without clumping).',
      'Heat oil in a heavy wok until smoking hot.',
      'Add minced garlic and spring onion whites; stir-fry rapidly for 30 seconds on high heat.',
      'Add diced carrots and beans; stir-fry for 2 minutes until crisp-tender.',
      'Toss in bell peppers and sweet corn; flash fry for another 1 minute.',
      'Add the chilled cooked rice into the hot wok. Drizzle light soy sauce, rice vinegar, white pepper powder, and salt.',
      'Toss everything continuously on high heat for 2-3 minutes until heated through and imbued with a smoky wok aroma.',
      'Finish with chopped spring onion greens and serve hot with Manchurian or chilli sauce.'
    ]
  },
  {
    title: 'Masala Dosa',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    description: 'Golden crispy fermented rice and lentil crepe stuffed with a spiced turmeric potato filling, served with coconut chutney and tangy sambar.',
    category: 'Breakfast',
    preparationTime: 20,
    cookingTime: 20,
    servings: 4,
    difficulty: 'Medium',
    isVegetarian: true,
    ingredients: [
      '3 cups Fermented Dosa Batter (Rice and Urad Dal)',
      '4 medium Potatoes (boiled, peeled, and coarsely mashed)',
      '1 large Onion (sliced)',
      '2 Green Chillies (finely chopped)',
      '1 tsp Mustard Seeds',
      '1 tsp Urad Dal (split black gram)',
      '1 tsp Chana Dal (Bengal gram)',
      '1/2 tsp Turmeric Powder',
      '1 Sprig Curry Leaves',
      '2 tbsp Fresh Coriander (chopped)',
      'Ghee or Oil for roasting',
      'Salt to taste'
    ],
    instructions: [
      'Prepare potato masala: Heat 2 tbsp oil in a pan. Add mustard seeds, urad dal, chana dal, and curry leaves. Let them crackle.',
      'Add sliced onions and green chillies. Sauté until onions are translucent.',
      'Add turmeric powder, salt, and 1/4 cup water. Fold in mashed potatoes and mix well. Simmer for 3 minutes, then stir in fresh coriander. Keep warm.',
      'Heat a seasoned cast-iron or non-stick tawa on medium-high. Sprinkle water droplets and wipe clean with a cloth.',
      'Pour a ladleful of dosa batter in the center and spread outwards in quick circular motions to create a thin crepe.',
      'Drizzle ghee around the edges and on top. Cook until the bottom turns deep golden and crispy.',
      'Place a generous portion of the spiced potato masala in the center.',
      'Fold the dosa into a cylinder or triangle. Transfer to a platter and serve immediately with fresh coconut chutney and piping hot sambar.'
    ]
  },
  {
    title: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    description: 'Artisanal homemade Italian pizza with a blistered crispy crust, rich herbaceous tomato-basil sauce, melted mozzarella, and fresh toppings.',
    category: 'Fast Food',
    preparationTime: 30,
    cookingTime: 15,
    servings: 3,
    difficulty: 'Medium',
    isVegetarian: true,
    ingredients: [
      '1 Prepared Pizza Dough ball (fermented bread flour)',
      '1/2 cup Italian San Marzano Tomato Sauce',
      '1.5 cups Fresh Mozzarella Cheese (shredded or torn)',
      '1/4 cup Parmesan or Grana Padano (grated)',
      'Handful of Fresh Basil leaves',
      '1/2 cup Cherry Tomatoes (halved)',
      '1/4 cup Sliced Bell Peppers and Black Olives',
      '1 tbsp Extra Virgin Olive Oil',
      '1 tsp Dried Oregano and Red Chilli Flakes',
      'Coarse Cornmeal for dusting'
    ],
    instructions: [
      'Preheat oven to its highest setting (250°C / 485°F) with a pizza stone or baking sheet inside for 30 minutes.',
      'On a lightly floured surface or parchment dusted with cornmeal, stretch the pizza dough with your fingertips from center to edges, leaving a puffy rim.',
      'Spread the tomato sauce evenly over the crust, keeping the borders clean.',
      'Distribute torn mozzarella cheese, cherry tomato halves, sliced bell peppers, and olives evenly across the pizza.',
      'Drizzle extra virgin olive oil and sprinkle a pinch of dried oregano.',
      'Slide the pizza onto the screaming hot stone/baking tray. Bake for 10-12 minutes until crust is bubbly, browned, and cheese is golden and bubbling.',
      'Remove from oven, top with fresh torn basil leaves and grated parmesan. Slice and enjoy hot!'
    ]
  },
  {
    title: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=1000&q=80',
    description: 'Classic Penne all’Arrabbiata cooked al dente in a fiery garlic, San Marzano tomato, extra virgin olive oil, and crushed red pepper sauce.',
    category: 'Lunch',
    preparationTime: 10,
    cookingTime: 15,
    servings: 3,
    difficulty: 'Easy',
    isVegetarian: true,
    ingredients: [
      '300g Penne Rigate or Rigatoni Pasta',
      '1 can (400g) Whole Peeled Italian Tomatoes (crushed by hand)',
      '4 cloves Garlic (thinly sliced)',
      '1 tsp Red Pepper Chilli Flakes',
      '3 tbsp Extra Virgin Olive Oil',
      '1/4 cup Fresh Italian Basil (torn)',
      '1/3 cup Parmigiano Reggiano (freshly grated)',
      'Salt to taste'
    ],
    instructions: [
      'Bring a large pot of salted water to a rolling boil. Add penne and cook until 1 minute before al dente (about 9-10 minutes). Reserve 1/2 cup pasta cooking water.',
      'Meanwhile, heat extra virgin olive oil in a wide skillet over medium-low heat. Add sliced garlic and chilli flakes; gently toast until garlic is pale golden (do not burn).',
      'Carefully pour in the crushed tomatoes and season with salt. Simmer over medium heat for 10 minutes until sauce thickens and sweetens.',
      'Transfer the drained pasta directly into the sauce. Pour in 3-4 tablespoons of the starchy pasta water.',
      'Toss vigorously over high heat for 1-2 minutes until the glossy sauce clings tightly to every tube of penne.',
      'Remove from heat, fold in fresh basil leaves and freshly grated Parmigiano Reggiano. Serve immediately in warm pasta bowls.'
    ]
  },
  {
    title: 'Chocolate Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    description: 'Decadent, ultra-moist triple chocolate fudge cake layered with silky dark chocolate ganache and chocolate curls.',
    category: 'Desserts',
    preparationTime: 25,
    cookingTime: 35,
    servings: 8,
    difficulty: 'Medium',
    isVegetarian: true,
    ingredients: [
      '2 cups All-Purpose Flour',
      '1.75 cups Granulated Sugar',
      '3/4 cup Dutch-processed Cocoa Powder',
      '2 tsp Baking Powder',
      '1.5 tsp Baking Soda',
      '1 tsp Salt',
      '2 large Eggs (or egg substitute)',
      '1 cup Milk (or buttermilk)',
      '1/2 cup Vegetable Oil',
      '2 tsp Pure Vanilla Extract',
      '1 cup Freshly Brewed Hot Coffee (intensifies chocolate flavor)',
      'For Ganache: 200g Dark Chocolate + 200ml Heavy Cream + 2 tbsp Butter'
    ],
    instructions: [
      'Preheat oven to 175°C (350°F). Grease and line two 8-inch round cake pans with parchment paper.',
      'In a large mixing bowl, sift flour, cocoa powder, sugar, baking powder, baking soda, and salt together.',
      'Add eggs, milk, vegetable oil, and vanilla extract. Beat on medium speed for 2 minutes until smooth.',
      'Reduce speed and slowly pour in hot coffee (batter will be thin, which makes it incredibly moist).',
      'Divide batter evenly into prepared cake pans. Bake for 30-35 minutes until a toothpick inserted in center comes out clean.',
      'Cool cakes in pans for 10 minutes, then invert onto wire racks to cool completely.',
      'Make ganache: Heat cream until steaming, pour over chopped dark chocolate and butter. Let sit for 3 minutes, then whisk until glossy and smooth.',
      'Spread ganache between cake layers and generously coat the top and sides. Garnish with chocolate curls or fresh berries.'
    ]
  },
  {
    title: 'Gulab Jamun',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    description: 'Golden melt-in-mouth milk-solid dumplings soaked in rose and cardamom infused warm saffron sugar syrup.',
    category: 'Traditional Food',
    preparationTime: 20,
    cookingTime: 25,
    servings: 6,
    difficulty: 'Medium',
    isVegetarian: true,
    ingredients: [
      '1 cup Milk Powder (full fat)',
      '1/4 cup All-Purpose Flour (Maida)',
      '1/4 tsp Baking Soda',
      '2 tbsp Pure Ghee',
      '4-5 tbsp Warm Milk (for soft dough)',
      '2 cups Sugar',
      '2 cups Water',
      '4 Green Cardamom pods (crushed)',
      'Pinch of Saffron strands',
      '1 tsp Rose Water',
      'Ghee or Oil for deep frying',
      'Slivered pistachios for garnish'
    ],
    instructions: [
      'Make the syrup: In a pot, combine sugar, water, crushed cardamom, and saffron. Boil for 7-8 minutes until slightly sticky (half-string consistency). Stir in rose water and keep warm.',
      'In a mixing bowl, combine milk powder, flour, and baking soda. Rub in ghee with fingertips.',
      'Add warm milk tablespoon by tablespoon, gently bringing ingredients together into a soft, smooth dough (do not knead aggressively). Cover and rest for 5 minutes.',
      'Pinch small portions and roll gently between palms into smooth, crack-free marble-sized balls.',
      'Heat ghee or oil in a deep kadai over low-medium heat. The oil must be gently warm, not smoking.',
      'Slide the dough balls into the warm oil. They will sink and slowly rise. Gently swirl oil around them so they fry evenly to a rich deep golden-brown color (10-12 minutes).',
      'Drain fried jamuns on paper towels for 1 minute, then immediately drop them into the warm sugar syrup.',
      'Allow gulab jamuns to soak for at least 2 hours until they plump up and absorb the aromatic syrup. Serve warm garnished with slivered pistachios.'
    ]
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodie_db';
    console.log(`[SEED] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[SEED] Connected to MongoDB.');

    // Create or find default Chef author
    let chef = await User.findOne({ email: 'chef@foodie.com' });
    if (!chef) {
      chef = await User.create({
        name: 'Chef Rahul Sharma',
        email: 'chef@foodie.com',
        password: 'password123',
        profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
        bio: 'Executive Chef & Food Stylist creating culinary adventures for foodies worldwide.'
      });
      console.log('[SEED] Created default chef author: chef@foodie.com');
    }

    // Check existing recipes count
    const existingCount = await Recipe.countDocuments();
    console.log(`[SEED] Existing recipes count: ${existingCount}`);

    for (const item of sampleRecipes) {
      const exists = await Recipe.findOne({ title: item.title });
      if (!exists) {
        const recipe = await Recipe.create({
          ...item,
          author: chef._id,
          averageRating: 4.8,
          ratingsCount: 3
        });

        // Add a sample review for this recipe
        await Review.create({
          user: chef._id,
          recipe: recipe._id,
          rating: 5,
          comment: `Absolutely loved crafting this ${recipe.title}! Follow the instructions step by step for best results.`
        });

        console.log(`[SEED] Seeded recipe: ${item.title}`);
      } else {
        console.log(`[SEED] Recipe already exists: ${item.title}`);
      }
    }

    console.log('[SEED] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleRecipes };
