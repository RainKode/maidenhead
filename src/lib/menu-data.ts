/**
 * Menu data — categories with dishes. Placeholder dish names common to a
 * Maidenhead-style Indian menu; swap with the client's PDF when received.
 */

export type Dish = {
  name: string;
  description?: string;
  price: string;
  dietary?: ("V" | "VG" | "GF" | "Spicy")[];
};

export type MenuCategory = {
  slug: string;
  title: string;
  blurb: string;
  image: keyof typeof IMAGE_KEYS;
  dishes: Dish[];
};

// Image keys mapped to dishoom-images placeholders.
export const IMAGE_KEYS = {
  starters: "comfortGrills",
  tandoor: "lambRack",
  curries: "comfortLarge",
  biryani: "recipeBiryani",
  vegetarian: "recipeBroccoli",
  breads: "recipeChaat",
  desserts: "recipeChutney",
  drinks: "comfortChai",
  buffet: "mango",
  kids: "recipePotatoes",
} as const;

export const menu: MenuCategory[] = [
  {
    slug: "starters",
    title: "Starters",
    blurb: "Crisp bites and small plates to begin — perfect with a cold drink.",
    image: "starters",
    dishes: [
      { name: "Onion Bhaji", description: "Crisp spiced onion fritters with mint chutney.", price: "£5.50", dietary: ["VG"] },
      { name: "Vegetable Samosa", description: "Pastry parcels with spiced potato and peas.", price: "£5.50", dietary: ["V"] },
      { name: "Chicken Tikka", description: "Marinated overnight, chargrilled in the tandoor.", price: "£7.50", dietary: ["GF"] },
      { name: "Sheek Kebab", description: "Spiced minced lamb, smoked over charcoal.", price: "£7.95", dietary: ["GF"] },
      { name: "Tandoori King Prawns", description: "Tiger prawns in a yoghurt and chilli marinade.", price: "£9.95", dietary: ["GF", "Spicy"] },
      { name: "Paneer Tikka", description: "Cottage cheese, peppers, onions, smoky char.", price: "£7.50", dietary: ["V", "GF"] },
    ],
  },
  {
    slug: "tandoor",
    title: "From the Tandoor",
    blurb: "Charcoal-blistered grills, served sizzling with onion and lemon.",
    image: "tandoor",
    dishes: [
      { name: "Tandoori Mixed Grill", description: "Tikka, sheek, lamb chop and tandoori wings.", price: "£18.95", dietary: ["GF"] },
      { name: "Lamb Chops", description: "Marinated overnight, blushingly pink in the middle.", price: "£16.95", dietary: ["GF"] },
      { name: "Tandoori Chicken (half)", description: "On the bone, classic crimson marinade.", price: "£12.50", dietary: ["GF"] },
      { name: "Hariyali Chicken", description: "Coriander, mint, green chilli — fresh and fragrant.", price: "£13.50", dietary: ["GF"] },
    ],
  },
  {
    slug: "curries",
    title: "Curries",
    blurb: "Slow-cooked, layered, properly seasoned. The heart of our kitchen.",
    image: "curries",
    dishes: [
      { name: "Maidenhead Spice (House Curry)", description: "Our house special — fragrant, layered, mid-strength.", price: "£13.95", dietary: ["Spicy"] },
      { name: "Chicken Tikka Masala", description: "Chargrilled chicken in a rich tomato cream sauce.", price: "£12.95" },
      { name: "Lamb Rogan Josh", description: "Slow-cooked Kashmiri-style with deep spice.", price: "£13.95" },
      { name: "Chicken Madras", description: "Robust, southern-style, with a quiet kick.", price: "£12.50", dietary: ["Spicy"] },
      { name: "Lamb Vindaloo", description: "For the brave — vinegar, chilli, fire.", price: "£13.95", dietary: ["Spicy"] },
      { name: "King Prawn Bhuna", description: "Thick, dry-fried with onion and pepper.", price: "£15.95" },
    ],
  },
  {
    slug: "biryani",
    title: "Biryani",
    blurb: "Long-grain basmati layered with spiced meat or vegetables, sealed and steamed.",
    image: "biryani",
    dishes: [
      { name: "Chicken Tikka Biryani", description: "Chargrilled chicken, fragrant rice, served with raita.", price: "£14.50" },
      { name: "Lamb Biryani", description: "Slow-cooked lamb, saffron, fried onion, raita on the side.", price: "£15.50" },
      { name: "Vegetable Biryani", description: "Seasonal vegetables, cardamom, cashews.", price: "£12.95", dietary: ["V"] },
      { name: "King Prawn Biryani", description: "Tiger prawns, ginger, fresh coriander.", price: "£17.50" },
    ],
  },
  {
    slug: "vegetarian",
    title: "Vegetarian",
    blurb: "Genuine vegetarian cooking — never an afterthought.",
    image: "vegetarian",
    dishes: [
      { name: "Paneer Makhani", description: "Cottage cheese in a buttery tomato sauce.", price: "£11.95", dietary: ["V"] },
      { name: "Saag Paneer", description: "Spinach, paneer, cumin, garlic.", price: "£11.95", dietary: ["V"] },
      { name: "Tarka Daal", description: "Yellow lentils, cumin and garlic tempering.", price: "£8.95", dietary: ["VG", "GF"] },
      { name: "Aloo Gobi", description: "Potato and cauliflower with turmeric and ginger.", price: "£9.95", dietary: ["VG", "GF"] },
      { name: "Chana Masala", description: "Chickpeas in a tangy tomato gravy.", price: "£9.50", dietary: ["VG", "GF"] },
      { name: "Bombay Aloo", description: "Spiced new potatoes, mustard seed, curry leaf.", price: "£8.50", dietary: ["VG", "GF"] },
    ],
  },
  {
    slug: "breads",
    title: "Breads & Rice",
    blurb: "Fresh from the tandoor or the pan — order plenty, share generously.",
    image: "breads",
    dishes: [
      { name: "Plain Naan", price: "£3.50", dietary: ["V"] },
      { name: "Garlic Naan", price: "£3.95", dietary: ["V"] },
      { name: "Peshwari Naan", description: "Almond, coconut, sultana.", price: "£4.50", dietary: ["V"] },
      { name: "Chapati", price: "£2.50", dietary: ["V"] },
      { name: "Pilau Rice", price: "£3.95", dietary: ["V", "GF"] },
      { name: "Mushroom Rice", price: "£4.50", dietary: ["V", "GF"] },
    ],
  },
  {
    slug: "desserts",
    title: "Desserts",
    blurb: "A small, gentle finish.",
    image: "desserts",
    dishes: [
      { name: "Gulab Jamun", description: "Warm milk dumplings in cardamom syrup.", price: "£5.50", dietary: ["V"] },
      { name: "Pistachio Kulfi", description: "Hand-churned Indian ice-cream.", price: "£5.50", dietary: ["V", "GF"] },
      { name: "Mango Kulfi", price: "£5.50", dietary: ["V", "GF"] },
      { name: "Rasmalai", description: "Soft cheese dumplings in saffron milk.", price: "£5.95", dietary: ["V"] },
    ],
  },
  {
    slug: "drinks",
    title: "Drinks",
    blurb: "Soft, hot, or properly cold.",
    image: "drinks",
    dishes: [
      { name: "Mango Lassi", price: "£3.95", dietary: ["V", "GF"] },
      { name: "Salted Lassi", price: "£3.50", dietary: ["V", "GF"] },
      { name: "Masala Chai", price: "£2.95", dietary: ["V"] },
      { name: "Cobra Lager", price: "£4.95" },
      { name: "House Red / White (175ml)", price: "£5.95" },
    ],
  },
  {
    slug: "buffet",
    title: "Sunday Buffet",
    blurb: "12.00pm – 3.00pm. Adult £19.95 · Child (under 10) £12.95.",
    image: "buffet",
    dishes: [
      { name: "Rotating selection", description: "Two starters, four mains, rice, breads, salads and dessert. Different every Sunday.", price: "Inclusive" },
    ],
  },
  {
    slug: "kids",
    title: "For Children",
    blurb: "Mild, friendly, and properly portioned.",
    image: "kids",
    dishes: [
      { name: "Chicken Korma & Rice", price: "£8.50" },
      { name: "Mini Naan & Dip", price: "£4.50", dietary: ["V"] },
      { name: "Plain Pasta with Butter", price: "£6.50", dietary: ["V"] },
    ],
  },
];

export const dietaryKey = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten-free option",
  Spicy: "Spicy",
} as const;
