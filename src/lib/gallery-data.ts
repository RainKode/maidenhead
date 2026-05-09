export type GalleryImage = {
  src: string;
  alt: string;
  /** controls masonry footprint */
  ratio?: "tall" | "wide" | "square";
};

export const gallery: GalleryImage[] = [
  // --- Interior & Ambience ---
  { src: "/images/ambience/IMG-20251030-WA0008.jpg", alt: "The Maidenhead Spice dining room, bar and chandeliers", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0060.jpg", alt: "Restaurant dining room viewed from the bar, Cobra-branded counter in the foreground", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0007.jpg", alt: "The full dining room lit up and ready for service", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0080.jpg", alt: "Wide view of the dining room with ornate ceiling lights", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0015.jpg", alt: "Tufted cream banquette seating with tables set for dinner", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0025.jpg", alt: "Private dining booth with striped wall panelling", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0065.jpg", alt: "Maidenhead Spice exterior — red signage and pavement flowers", ratio: "tall" },

  // --- Plated & Served Dishes ---
  { src: "/images/ambience/IMG-20251030-WA0070.jpg", alt: "Plated tandoori starter with salad, lemon and a glass of white wine", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0045.jpg", alt: "Curry in a balti dish on a warmer, served with bread and red wine", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0010.jpg", alt: "Two sizzling tandoori platters and a karahi curry, fresh from the kitchen", ratio: "tall" },

  // --- Grills & Tandoori ---
  { src: "/images/ambience/IMG-20251030-WA0055.jpg", alt: "Chargrilled chicken tikka pieces heaped in a steel serving bowl", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0040.jpg", alt: "Tandoori paneer in a foil tray, garnished with pickled onion and coriander", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0009.jpg", alt: "Golden sizzler platter with charred chicken off the tandoor", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0011.jpg", alt: "Chicken tikka in a wok, sizzling with peppers and onions", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0012.jpg", alt: "Close-up of marinated tandoori chicken, charred and fragrant", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0013.jpg", alt: "Mixed grill on a sizzler board — tikka, kebab and wings", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0014.jpg", alt: "Sheek kebab and lamb chops fresh off the charcoal grill", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0016.jpg", alt: "Tandoori king prawns with lemon and spiced onions", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0017.jpg", alt: "Chargrilled whole tandoori chicken, deep red marinade", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0018.jpg", alt: "Sizzling lamb chops plated with salad garnish", ratio: "square" },

  // --- Curries & Karahi ---
  { src: "/images/ambience/IMG-20251030-WA0030.jpg", alt: "Spiced chicken jalfrezi — peppers, onions, vivid orange sauce", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0019.jpg", alt: "Slow-cooked lamb rogan josh, deep and fragrant", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0021.jpg", alt: "Rich chicken tikka masala in a karahi", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0022.jpg", alt: "Butter chicken in a cast iron balti dish", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0023.jpg", alt: "Thick dhal tadka with cumin and ghee", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0024.jpg", alt: "King prawn bhuna — thick, dry-fried with onion", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0026.jpg", alt: "Saag paneer with fresh spinach and cottage cheese", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0027.jpg", alt: "Lamb vindaloo, rich and deeply spiced", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0028.jpg", alt: "Chana masala — chickpeas in a tangy tomato gravy", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0029.jpg", alt: "Karahi gosht served at the table", ratio: "tall" },

  // --- Starters & Snacks ---
  { src: "/images/ambience/IMG-20251030-WA0020.jpg", alt: "Freshly fried onion bhajis, golden and crisp", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0031.jpg", alt: "Vegetable samosas with mint chutney", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0032.jpg", alt: "Paneer tikka on skewers, smoky and charred", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0033.jpg", alt: "Chicken chaat with crisp wafers and tamarind", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0034.jpg", alt: "Crispy fried fish with green chutney", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0035.jpg", alt: "Seekh kebab with raita and shredded salad", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0036.jpg", alt: "Assorted starters spread across the table", ratio: "wide" },

  // --- Breads & Sides ---
  { src: "/images/ambience/IMG-20251030-WA0037.jpg", alt: "Fresh naan breads straight from the tandoor", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0038.jpg", alt: "Garlic and coriander naan, blistered and soft", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0039.jpg", alt: "Pilau rice with cardamom and saffron", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0041.jpg", alt: "Basmati rice alongside a curry for two", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0042.jpg", alt: "Freshly baked peshwari naan, sweet and fragrant", ratio: "square" },

  // --- Drinks & Desserts ---
  { src: "/images/ambience/IMG-20251030-WA0043.jpg", alt: "Mango lassi, thick and chilled", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0044.jpg", alt: "Cobra lager poured at the bar", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0046.jpg", alt: "Gulab jamun in warm syrup, soft and golden", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0047.jpg", alt: "Kulfi with pistachio and saffron", ratio: "tall" },

  // --- More Interior & People ---
  { src: "/images/ambience/IMG-20251030-WA0048.jpg", alt: "A table set for a celebration, flowers and folded napkins", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0049.jpg", alt: "Evening service — tables dressed and lit", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0050.jpg", alt: "Bar detail — spirits and wine bottles on backlit shelves", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0051.jpg", alt: "The restaurant's gold chandelier and decorative wall panels", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0052.jpg", alt: "White linen tablecloth with roses in a vase, ready for guests", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0053.jpg", alt: "Intimate corner of the dining room at dusk", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0054.jpg", alt: "The restaurant at full capacity, warm and buzzing", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0056.jpg", alt: "Outdoor pavement seating with potted topiary", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0057.jpg", alt: "Restaurant entrance lit for an evening service", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0058.jpg", alt: "Window reflection of the dining room in evening light", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0059.jpg", alt: "Crisp napkin folds and silver cutlery — table ready", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0061.jpg", alt: "The bar stocked and ready for service", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0062.jpg", alt: "Gold chandelier above the main dining room", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0063.jpg", alt: "Banquette seating nook with decorative screen behind", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0064.jpg", alt: "Round table for four set for a family dinner", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0066.jpg", alt: "Close-up of the tufted cream booth seating", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0067.jpg", alt: "Evening dining — guests enjoying a shared feast", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0068.jpg", alt: "Fresh flowers and lit candles on the table", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0069.jpg", alt: "Looking down the restaurant at a busy service", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0071.jpg", alt: "Chicken tikka plated on a sizzler with salad", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0072.jpg", alt: "Lamb karahi in a wok with peppers and fresh coriander", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0073.jpg", alt: "Duo of starters — samosa and tikka on one plate", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0074.jpg", alt: "Three curries laid out for a sharing feast", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0075.jpg", alt: "Dessert spread — gulab jamun and kulfi side by side", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0076.jpg", alt: "A glass of mango lassi on a white tablecloth", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0077.jpg", alt: "Freshly baked paratha, layered and golden", ratio: "square" },
  { src: "/images/ambience/IMG-20251030-WA0078.jpg", alt: "Spiced lamb on the bone in rich masala gravy", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0079.jpg", alt: "Chef garnishing a curry dish in the kitchen", ratio: "tall" },
  { src: "/images/ambience/IMG-20251030-WA0081.jpg", alt: "Celebratory table set for a large party", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0082.jpg", alt: "The restaurant ready for a weekend lunch service", ratio: "wide" },
  { src: "/images/ambience/IMG-20251030-WA0083.jpg", alt: "Exterior — Maidenhead Spice signage at street level", ratio: "tall" },
];

