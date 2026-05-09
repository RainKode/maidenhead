export type DietaryTag = "V" | "VG" | "GF" | "Hot";

export type Variant = {
  id: string;
  label: string;
  price: number;
};

export type ModifierOption = {
  id: string;
  label: string;
  priceDelta: number;
};

export type ModifierGroup = {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  min?: number;
  max?: number;
  options: ModifierOption[];
};

export type Dish = {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  variants?: Variant[];
  modifiers?: ModifierGroup[];
  dietary?: DietaryTag[];
  orderable?: boolean;
};

export type MenuCategory = {
  slug: string;
  title: string;
  blurb: string;
  dishes: Dish[];
};

const spiceLevelModifier: ModifierGroup = {
  id: "spice-level",
  label: "Spice level",
  type: "single",
  required: true,
  options: [
    { id: "mild", label: "Mild", priceDelta: 0 },
    { id: "medium", label: "Medium", priceDelta: 0 },
    { id: "hot", label: "Hot", priceDelta: 0 },
  ],
};

const curryExtrasModifier: ModifierGroup = {
  id: "extras",
  label: "Add extras",
  type: "multi",
  max: 6,
  options: [
    { id: "nan", label: "Nan", priceDelta: 3.25 },
    { id: "garlic-nan", label: "Garlic Nan", priceDelta: 3.95 },
    { id: "pilau-rice", label: "Pilau Rice", priceDelta: 3.95 },
    { id: "chips", label: "Chips", priceDelta: 3.95 },
    { id: "raitha", label: "Raitha", priceDelta: 2.95 },
    { id: "chutney-set", label: "Chutney Set", priceDelta: 2.25 },
  ],
};

const curryModifiers = [spiceLevelModifier, curryExtrasModifier];

const curryVariantSet: Variant[] = [
  { id: "chicken", label: "Chicken", price: 11.95 },
  { id: "lamb", label: "Lamb", price: 12.95 },
  { id: "prawn", label: "Prawn", price: 12.95 },
  { id: "monkfish", label: "Monkfish", price: 15.95 },
  { id: "king-prawn", label: "King Prawn", price: 17.95 },
  { id: "vegetable", label: "Vegetable", price: 10.95 },
];

export const printableMenuPages = [
  { label: "Page 1", href: "/menu/Maidenhead%20Spice%20Page%201.pdf" },
  { label: "Page 2", href: "/menu/Maidenhead%20Spice%20Page%202.pdf" },
  { label: "Page 3", href: "/menu/Maidenhead%20Spice%20Page%203.pdf" },
  { label: "Page 4", href: "/menu/Maidenhead%20Spice%20Page%204.pdf" },
  { label: "Page 5", href: "/menu/Maidenhead%20Spice%20Page%205.pdf" },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pricedDish(
  categorySlug: string,
  name: string,
  basePrice: number,
  options: Omit<Dish, "id" | "name" | "basePrice"> = {}
): Dish {
  return { id: `${categorySlug}-${slugify(name)}`, name, basePrice, ...options };
}

function variantDish(
  categorySlug: string,
  name: string,
  variants: Variant[],
  options: Omit<Dish, "id" | "name" | "variants"> = {}
): Dish {
  return { id: `${categorySlug}-${slugify(name)}`, name, variants, ...options };
}

function curryDish(name: string, description: string, dietary: DietaryTag[] = []): Dish {
  return variantDish("authentic-main-courses", name, curryVariantSet, {
    description,
    dietary,
    modifiers: curryModifiers,
  });
}

function vegetableSide(entry: string): Dish {
  const [name, description] = entry.split("|");
  return variantDish(
    "vegetable-side-dishes",
    name,
    [
      { id: "side", label: "Side", price: 5.95 },
      { id: "main", label: "Main course", price: 10.95 },
    ],
    { description, dietary: ["V"] }
  );
}

export const menu: MenuCategory[] = [
  {
    slug: "starters",
    title: "Starters",
    blurb: "Tandoori bites, crisp snacks and puree plates to open the table.",
    dishes: [
      pricedDish("starters", "Spice Special Starter", 30.95, {
        description:
          "A platter for four with chicken tikka, sheek kebab, onion bhaji, somosa and stuffed capsicum with mincemeat.",
      }),
      pricedDish("starters", "Mixed Starter", 6.95, {
        description: "Chicken tikka, sheek kebab, onion bhaji and somosa.",
      }),
      pricedDish("starters", "Tandoori Lamb Chops", 8.95, {
        description: "Lamb chops marinated with spices, herbs and yoghurt, then barbecued in the tandoori oven.",
      }),
      pricedDish("starters", "Tandoori Chicken Wings", 6.95, {
        description: "Chicken wings marinated with spices, herbs and yoghurt, then barbecued in the tandoori oven.",
      }),
      pricedDish("starters", "Tandoori Chicken", 5.95, {
        description: "One piece of chicken on the bone marinated with yoghurt, aromatic spices and herbs, then barbecued.",
      }),
      variantDish(
        "starters",
        "Tikka",
        [
          { id: "chicken", label: "Chicken", price: 5.95 },
          { id: "lamb", label: "Lamb", price: 6.95 },
          { id: "monkfish", label: "Monkfish", price: 7.95 },
        ],
        {
          description: "Diced chicken, lamb or monkfish marinated with yoghurt, aromatic spices and herbs, then barbecued.",
        }
      ),
      pricedDish("starters", "Reshmi Kebab", 6.95, {
        description: "Boneless chicken marinated with yoghurt, egg, cashew nut paste, cream and aromatic spice.",
      }),
      pricedDish("starters", "Sheek Kebab", 5.95, {
        description: "Tender minced lamb mildly seasoned with aromatic spices, herbs, garlic, ginger and egg.",
      }),
      pricedDish("starters", "King Prawn Butterfly", 9.95, {
        description: "King prawn marinated with spices and egg, then deep fried with breadcrumbs.",
      }),
      variantDish(
        "starters",
        "Bhuna Prawn on Puree",
        [
          { id: "prawn", label: "Prawn", price: 6.95 },
          { id: "king-prawn", label: "King Prawn", price: 9.95 },
        ],
        {
          description: "Prawn tossed in butter and medium hot spices with cashew nuts, served on thin crispy bread.",
        }
      ),
      variantDish(
        "starters",
        "Chat on Puree",
        [
          { id: "chicken", label: "Chicken", price: 6.95 },
          { id: "chana", label: "Chana", price: 5.95 },
          { id: "aloo", label: "Aloo", price: 5.95 },
        ],
        {
          description: "Chicken, chana or aloo seasoned with medium hot spices, cashew nuts and yoghurt on thin crispy bread.",
        }
      ),
      pricedDish("starters", "Onion Bhaji", 5.95, {
        dietary: ["V"],
        description: "Four balls of medium spicy fried onions mixed with lentils, egg and butter.",
      }),
      variantDish(
        "starters",
        "Somosa",
        [
          { id: "chicken", label: "Chicken", price: 5.95 },
          { id: "meat", label: "Meat", price: 5.95 },
          { id: "vegetable", label: "Vegetable", price: 5.95 },
        ],
        { description: "Crispy pastry filled with chicken, meat or vegetable." }
      ),
      pricedDish("starters", "Chilli Paneer", 6.95, {
        dietary: ["V"],
        description: "Indian cottage cheese cooked with spices, green chilli, naga pickle, capsicum, onion and tomato.",
      }),
    ],
  },
  {
    slug: "tandoori-dishes",
    title: "Tandoori Dishes",
    blurb: "Marinated meats, seafood and paneer barbecued in the tandoori oven.",
    dishes: [
      pricedDish("tandoori-dishes", "Mixed Grill", 17.95, {
        description: "Tandoori chicken, chicken tikka, lamb chop, sheek kebab and king prawn.",
      }),
      variantDish(
        "tandoori-dishes",
        "Tikka",
        [
          { id: "chicken", label: "Chicken", price: 11.95 },
          { id: "lamb", label: "Lamb", price: 12.95 },
          { id: "monkfish", label: "Monkfish", price: 15.95 },
        ],
        { description: "Diced chicken, lamb or monkfish marinated with yoghurt, aromatic spices and herbs." }
      ),
      pricedDish("tandoori-dishes", "Tandoori Chicken", 11.95, {
        description: "On-the-bone chicken, one leg and one breast piece, marinated and barbecued in the tandoori oven.",
      }),
      pricedDish("tandoori-dishes", "Tandoori Lamb Chops", 15.95, {
        description: "Lamb chops marinated with spices, herbs and yoghurt, then barbecued in the tandoori oven.",
      }),
      pricedDish("tandoori-dishes", "Reshmi Kebab", 12.95, {
        description: "Boneless chicken marinated with yoghurt, egg, cashew nut paste, cream and aromatic spice.",
      }),
      pricedDish("tandoori-dishes", "Sheek Kebab", 11.95, {
        description: "Tender minced lamb mildly seasoned with aromatic spices, herbs, garlic, ginger and egg.",
      }),
      pricedDish("tandoori-dishes", "Tandoori King Prawn", 17.95, {
        description: "King prawn marinated with yoghurt, mustard paste, aromatic spices and herbs.",
      }),
      variantDish(
        "tandoori-dishes",
        "Tandoori Shashlik",
        [
          { id: "chicken", label: "Chicken", price: 12.95 },
          { id: "lamb", label: "Lamb", price: 13.95 },
          { id: "monkfish", label: "Monkfish", price: 16.95 },
          { id: "king-prawn", label: "King Prawn", price: 18.95 },
          { id: "paneer", label: "Paneer", price: 12.95 },
        ],
        { description: "Barbecued with chunky tomato, onion and capsicum." }
      ),
    ],
  },
  {
    slug: "chefs-specialities",
    title: "Chef's Specialities",
    blurb: "House signatures with richer sauces, tandoori pieces and special spice blends.",
    dishes: [
      pricedDish("chefs-specialities", "Spice Special", 17.95, {
        description: "A tandoori selection cooked in special spices, cashew nuts and cream, served with sauce.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Murug Mossallam", 14.95, {
        description: "Chicken tikka cooked with aromatic spices, ginger, garlic, onion, capsicum, tomato, cashew nuts and cream.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Monkfish Special Masala", 15.95, {
        description: "Boneless monkfish cooked with aromatic spices, onion, cashew nuts, cream and herbs.",
        modifiers: curryModifiers,
      }),
      variantDish(
        "chefs-specialities",
        "Chattinad",
        [
          { id: "chicken", label: "Chicken", price: 14.95 },
          { id: "lamb", label: "Lamb", price: 14.95 },
        ],
        {
          dietary: ["Hot"],
          description: "Cooked with aromatic spices, onion, capsicum, ginger, garlic, curry leaf and crushed red chilli.",
          modifiers: curryModifiers,
        }
      ),
      pricedDish("chefs-specialities", "Mumbai Chicken", 14.95, {
        dietary: ["Hot"],
        description: "Pan-fried chicken with lemon, cornflour and egg, aromatic spices, capsicum, onion, garlic and green chilli.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Lababdar Chicken", 14.95, {
        description: "Chicken tikka with tomato, onion, cashew nuts, ginger and garlic in a creamy sauce.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Reshmi Butter Masala", 14.95, {
        description: "Tandoori chicken cooked with yoghurt, butter, herbs, spices, almonds, cashew nuts, onion, capsicum and cream.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Butter Chicken", 13.95, {
        description: "Stripped tandoori chicken with aromatic spices, cashew nuts, butter, cream and herbs.",
        modifiers: curryModifiers,
      }),
      variantDish(
        "chefs-specialities",
        "Shashlik Bhuna",
        [
          { id: "chicken", label: "Chicken", price: 13.95 },
          { id: "lamb", label: "Lamb", price: 14.95 },
          { id: "king-prawn", label: "King Prawn", price: 17.95 },
        ],
        { description: "Cooked with spices, barbecued tomato, capsicum, onions, cashew nuts and cream.", modifiers: curryModifiers }
      ),
      variantDish(
        "chefs-specialities",
        "Thawa",
        [
          { id: "chicken", label: "Chicken", price: 13.95 },
          { id: "lamb", label: "Lamb", price: 14.95 },
          { id: "king-prawn", label: "King Prawn", price: 17.95 },
        ],
        { description: "Cooked with spices, herbs, onion, capsicum and cashew nut cream.", modifiers: curryModifiers }
      ),
      variantDish(
        "chefs-specialities",
        "Chilli Masala",
        [
          { id: "chicken", label: "Chicken", price: 13.95 },
          { id: "lamb-prawn", label: "Lamb / Prawn", price: 14.95 },
          { id: "monkfish", label: "Monkfish", price: 15.95 },
          { id: "king-prawn", label: "King Prawn", price: 17.95 },
          { id: "paneer", label: "Paneer", price: 13.95 },
        ],
        { dietary: ["Hot"], description: "Cooked with spices, chilli pickle, green chillies, capsicum, onion and tomato.", modifiers: curryModifiers }
      ),
      variantDish(
        "chefs-specialities",
        "Sizzling",
        [
          { id: "chicken", label: "Chicken", price: 13.95 },
          { id: "lamb", label: "Lamb", price: 14.95 },
          { id: "monkfish", label: "Monkfish", price: 15.95 },
        ],
        { description: "Pan-fried with lemon, cornflour, egg, aromatic spices, capsicum, onion and chat masala.", modifiers: curryModifiers }
      ),
      pricedDish("chefs-specialities", "Bhindi Ghosht", 13.95, {
        description: "A fairly dry spicy dish tossed in butter, spices, capsicum, onion, tomato and cashew nuts.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Garlic Chicken", 13.95, {
        description: "Cooked with spices, onion, capsicum, tomato, cashew nuts and yoghurt in a garlic-based sauce.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Chicken Naga", 13.95, {
        dietary: ["Hot"],
        description: "Cooked with spices, onion, capsicum, tomato, cashew nuts, yoghurt and naga pickle.",
        modifiers: curryModifiers,
      }),
      pricedDish("chefs-specialities", "Paneer Butter Masala", 13.95, {
        dietary: ["V"],
        description: "Paneer fried and cooked with cashew nuts, cream and spices in a mild sauce.",
        modifiers: curryModifiers,
      }),
    ],
  },
  {
    slug: "authentic-main-courses",
    title: "Authentic Main Courses",
    blurb: "Classic curry styles with chicken, lamb, prawn, monkfish, king prawn or vegetable options.",
    dishes: [
      variantDish(
        "authentic-main-courses",
        "Masala",
        [
          { id: "chicken-tikka", label: "Chicken Tikka", price: 11.95 },
          { id: "lamb-tikka", label: "Lamb Tikka", price: 12.95 },
          { id: "monkfish-tikka", label: "Monkfish Tikka", price: 15.95 },
          { id: "king-prawn", label: "King Prawn", price: 17.95 },
          { id: "vegetable", label: "Vegetable", price: 10.95 },
        ],
        { description: "A creamy tandoori masala sauce with yoghurt, butter, herbs, almonds, cashew nuts and fresh cream.", modifiers: curryModifiers }
      ),
      curryDish("Korma", "Cooked with butter, cream, cashew nuts, cinnamon, cloves, cardamom and coconut milk."),
      curryDish("Bhuna", "Fairly dry and tossed with butter, capsicum, onion, tomato, cashew nuts, yoghurt and fresh herbs."),
      curryDish("Dhansak", "Medium spicy sauce thickened with lentils, butter and sweet and sour sauce."),
      curryDish("Sagwala", "Spinach-based medium hot curry with onion, capsicum, tomato, cashew nuts and yoghurt."),
      curryDish("Rogan Josh", "Cooked with capsicum, cashew nuts, yoghurt, onion and spices, topped with tomatoes, garlic and coriander."),
      curryDish("Dopiaza", "Cooked with spices, chunks of capsicum, onion, tomato, cashew nuts and yoghurt."),
      variantDish("authentic-main-courses", "Curry", curryVariantSet, {
        description: "Mild to medium traditional curry sauce.",
        modifiers: curryModifiers,
      }),
      curryDish("Balti", "Cooked with spices, capsicum, onion, tomato, cashew nuts, yoghurt and fresh green chilli."),
      curryDish("Korai", "Cooked with fresh onion, ginger, garlic, tomato, cashew nuts, cream and spices in an Indian wok."),
      curryDish("Pathia", "Cooked with onion, ginger, garlic, yoghurt, cashew nuts, cream and a sweet-sour tomato sauce."),
      curryDish("Achari", "Cooked with onion, ginger, garlic, yoghurt, cashew nuts, spices, tomato and lime pickle."),
      curryDish("Jalfrezi", "Cooked with spices, capsicum, onion, tomato, cashew nuts, yoghurt and fresh green chillies.", ["Hot"]),
      curryDish("Madras", "A hot curry cooked with robust spices.", ["Hot"]),
      curryDish("Vindaloo", "A very hot curry cooked with robust spices.", ["Hot"]),
    ],
  },
  {
    slug: "biryani-dishes",
    title: "Biryani Dishes",
    blurb: "Rice preparations served with mixed vegetable curry.",
    dishes: [
      pricedDish("biryani-dishes", "Spice Special Biryani", 18.95, {
        description: "Rice with chicken, lamb and king prawn, spice and egg, served with mixed vegetable curry.",
      }),
      variantDish(
        "biryani-dishes",
        "Biryani",
        [
          { id: "chicken", label: "Chicken", price: 13.95 },
          { id: "lamb", label: "Lamb", price: 14.95 },
          { id: "chicken-tikka", label: "Chicken Tikka", price: 14.95 },
          { id: "lamb-tikka", label: "Lamb Tikka", price: 15.95 },
          { id: "monkfish", label: "Monkfish", price: 17.95 },
          { id: "prawn", label: "Prawn", price: 16.95 },
          { id: "king-prawn", label: "King Prawn", price: 19.95 },
          { id: "tandoori-king-prawn", label: "Tandoori King Prawn", price: 20.95 },
          { id: "vegetable", label: "Vegetable", price: 13.95 },
        ],
        { description: "Rice cooked with your chosen filling, spices and egg, served with mixed vegetable curry." }
      ),
    ],
  },
  {
    slug: "vegetable-side-dishes",
    title: "Vegetable Side Dishes",
    blurb: "Vegetable dishes are available as sides or as main courses.",
    dishes: [
      "Mixed Vegetable|Saucy or dry",
      "Bhindi Bhaji|Okra",
      "Tarka Dall|Light and garlic lentils",
      "Sag Bhaji|Spinach",
      "Sag Aloo|Spinach and potato",
      "Bringal Bhaji|Aubergines",
      "Mushroom Bhaji",
      "Bombay Aloo",
      "Aloo Gobi|Potato and cauliflower",
      "Cauliflower Bhaji",
      "Chana Masala|Chickpeas",
      "Sag Paneer|Spinach and cheese",
    ].map(vegetableSide),
  },
  {
    slug: "rice",
    title: "Rice",
    blurb: "Basmati rice dishes for pairing with curries and grills.",
    dishes: [
      pricedDish("rice", "Boiled Rice", 3.95, { dietary: ["V", "VG"] }),
      pricedDish("rice", "Pilau Rice", 3.95, { dietary: ["V"] }),
      pricedDish("rice", "Lemon Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Mushroom Pilau Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Egg Pilau Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Vegetable Pilau Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Peas Pilau Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Onion Pilau Rice", 4.95, { dietary: ["V"] }),
      pricedDish("rice", "Special Pilau Rice", 4.95, { dietary: ["V"], description: "Egg and peas." }),
    ],
  },
  {
    slug: "bread",
    title: "Bread",
    blurb: "Fresh breads from the tandoor and pan.",
    dishes: [
      pricedDish("bread", "Nan", 3.25, { dietary: ["V"] }),
      pricedDish("bread", "Paratha", 3.95, { dietary: ["V"] }),
      pricedDish("bread", "Peshwari Nan", 3.95, { dietary: ["V"], description: "Stuffed with coconut, almond and sultanas." }),
      pricedDish("bread", "Tandoori Roti", 3.25, { dietary: ["V", "VG"], description: "Unleavened whole wheat thin bread." }),
      pricedDish("bread", "Garlic Nan", 3.95, { dietary: ["V"], description: "With crushed garlic on top." }),
      pricedDish("bread", "Cheese Nan", 3.95, { dietary: ["V"], description: "Stuffed with cheese." }),
      pricedDish("bread", "Keema Nan", 3.95, { description: "Stuffed with mincemeat." }),
      pricedDish("bread", "Stuffed Paratha", 4.95, { dietary: ["V"], description: "With vegetable." }),
    ],
  },
  {
    slug: "sundries",
    title: "Sundries",
    blurb: "Sauces, chutneys, salads, poppadoms and chips.",
    dishes: [
      pricedDish("sundries", "Masala Sauce", 4.95, { dietary: ["V"] }),
      pricedDish("sundries", "Korma Sauce", 4.95, { dietary: ["V"] }),
      pricedDish("sundries", "Dhansak Sauce", 4.95, { dietary: ["V"] }),
      pricedDish("sundries", "Madras Sauce", 4.95, { dietary: ["V", "Hot"] }),
      pricedDish("sundries", "Bhuna Sauce", 4.95, { dietary: ["V"] }),
      pricedDish("sundries", "Vindaloo Sauce", 4.95, { dietary: ["V", "Hot"] }),
      pricedDish("sundries", "Jalfrezi Sauce", 4.95, { dietary: ["V", "Hot"] }),
      pricedDish("sundries", "Chilli Masala Sauce", 4.95, { dietary: ["V", "Hot"] }),
      pricedDish("sundries", "Raitha", 2.95, { dietary: ["V"] }),
      pricedDish("sundries", "Mango Chutney", 0.9, { dietary: ["V"] }),
      pricedDish("sundries", "Mint Sauce", 0.9, { dietary: ["V"] }),
      pricedDish("sundries", "Onion Salad", 0.9, { dietary: ["V", "VG"] }),
      pricedDish("sundries", "Chilli Sauce", 0.9, { dietary: ["V", "Hot"] }),
      pricedDish("sundries", "Lime Pickle", 1, { dietary: ["V", "VG"] }),
      pricedDish("sundries", "Green Salad", 3.95, { dietary: ["V", "VG"] }),
      pricedDish("sundries", "Chutney Set", 2.25, { dietary: ["V"], description: "Mango, mint and onion." }),
      variantDish(
        "sundries",
        "Poppadom",
        [
          { id: "plain", label: "Plain", price: 0.9 },
          { id: "spicy", label: "Spicy", price: 0.9 },
        ],
        { dietary: ["V"] }
      ),
      pricedDish("sundries", "Chips", 3.95, { dietary: ["V", "VG"] }),
    ],
  },
  {
    slug: "sunday-buffet",
    title: "Sunday Buffet",
    blurb: "Eat as much as you like every Sunday from 12.00pm till 2.30pm.",
    dishes: [
      {
        id: "sunday-buffet-eat-as-much-as-you-like",
        name: "Sunday Buffet",
        description: "Every Sunday from 12.00pm till 2.30pm. Please call to confirm the latest buffet price and availability.",
        orderable: false,
      },
    ],
  },
];

export const dietaryKey: Record<DietaryTag, string> = {
  V: "Vegetarian",
  VG: "Vegan option",
  GF: "Gluten-free option",
  Hot: "Hot",
};

export function findDishById(dishId: string): Dish | undefined {
  for (const category of menu) {
    const dish = category.dishes.find((item) => item.id === dishId);
    if (dish) return dish;
  }
  return undefined;
}

export function getDishStartingPrice(dish: Dish): number | null {
  if (dish.basePrice !== undefined) return dish.basePrice;
  if (dish.variants?.length) {
    return Math.min(...dish.variants.map((variant) => variant.price));
  }
  return null;
}

export function getDishDefaultVariant(dish: Dish): Variant | undefined {
  return dish.variants?.[0];
}