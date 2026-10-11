// Street Cinema reminder: cobalt blue, Rollz saffron, asymmetric poster rhythm, Arabic-first clarity, and appetizing motion.

export type MenuPrice = {
  label: string;
  value: number;
};

export type MenuItem = {
  name: string;
  note: string;
  prices: MenuPrice[];
  image: string;
  imageSource?: "rollz-category";
  accent: "saffron" | "tomato" | "cream" | "cobalt";
};

export type MenuCategory = {
  id: string;
  label: string;
  kicker: string;
  intro: string;
  items: MenuItem[];
};

const FOOD = "/manus-storage/rollz_website_hero_416eca4d.png";
const FRIES = "/manus-storage/rollz_premium_hero_01_grand_feast_f71a3b7e.png";
const FEAST = "/manus-storage/rollz-hero-reference_7311bba7.jpg";
const MENU_SOURCE = "/manus-storage/rollz-menu-source_5ba81986.png";
const BEEF_BURGER = "/manus-storage/rollz-menu-beef-burger_3c98d93d.jpg";
const POTATO_FEAST = "/manus-storage/rollz-menu-potato-feast_09c77a6a.jpg";
const SNACKS = "/manus-storage/rollz-menu-snacks_75721573.jpg";
const GENERATED_CHICKEN_BURGER = "/manus-storage/rollz-item-chicken-burger_a757468e.jpg";
const GENERATED_BEEF_BURGER = "/manus-storage/rollz-item-beef-burger_66d730fd.jpg";
const GENERATED_POTATO_SANDWICH = "/manus-storage/rollz-item-potato-sandwich_d72a707c.jpg";
const GENERATED_LOADED_PLATE = "/manus-storage/rollz-item-loaded-potato-plate_e29077e5.jpg";
const GENERATED_SNACKS = "/manus-storage/rollz-item-snacks_8144036f.jpg";
const REAL_BURGERS_AND_SANDWICHES = "/manus-storage/rollz-real-burgers-and-sandwiches_76b1145e.webp";
const REAL_LOADED_FRIES = "/manus-storage/rollz-real-loaded-fries_3f0ad79e.webp";
const REAL_LONG_SANDWICHES = "/manus-storage/rollz-real-long-sandwiches_7dc12bea.webp";
const REAL_SANDWICHES = "/manus-storage/rollz-real-real-sandwiches_6cab843f.webp";
const MENU_JALAPENO = "/manus-storage/rollz-menu-jalapeno_8b61ad29.png";
const MENU_MOZZARELLA = "/manus-storage/rollz-menu-mozzarella_0ccab9a0.png";
const MENU_GARLIC_SAUCE = "/manus-storage/rollz-menu-garlic-sauce_42d1d0d2.png";
const MENU_MUSHROOM = "/manus-storage/rollz-menu-mushroom_85b72af5.png";
const MENU_SMOKED_TURKEY = "/manus-storage/rollz-menu-smoked-turkey_256b780d.png";

export const menuSource = MENU_SOURCE;

export const menuCategories: MenuCategory[] = [
  {
    id: "burgers",
    label: "برجر",
    kicker: "لقطة البرجر",
    intro: "اختار فراخ أو بيف، وبعدها حدّد سنجل أو دابل وخلي اللفة تبدأ.",
    items: [
      { name: "برجر فراخ عادي", note: "تشكن برجر كرسبي · خس · طماطم · صوص رولز", prices: [{ label: "سنجل", value: 45 }, { label: "دابل", value: 70 }], image: REAL_BURGERS_AND_SANDWICHES, imageSource: "rollz-category", accent: "saffron" },
      { name: "تشيز برجر فراخ", note: "تشكن برجر كرسبي · خس · طماطم · صوص رولز", prices: [{ label: "سنجل", value: 50 }, { label: "دابل", value: 75 }], image: REAL_BURGERS_AND_SANDWICHES, imageSource: "rollz-category", accent: "tomato" },
      { name: "تشيز برجر سبيشيال", note: "تشكن برجر · صوص جبنة · صوصات رولز", prices: [{ label: "سنجل", value: 75 }, { label: "دابل", value: 120 }], image: GENERATED_CHICKEN_BURGER, accent: "cream" },
      { name: "تريبل تشيز برجر", note: "ثلاث طبقات برجر · جبنة · صوص رولز", prices: [{ label: "السعر", value: 90 }], image: GENERATED_BEEF_BURGER, accent: "cobalt" },
      { name: "كورن برجر", note: "برجر · جبنة · صوص كريمي · لمسة حارة", prices: [{ label: "السعر", value: 100 }], image: GENERATED_BEEF_BURGER, accent: "saffron" },
      { name: "تشيز برجر بيف", note: "برجر بيف · جبنة · خس · طماطم · صوص رولز", prices: [{ label: "سنجل", value: 45 }, { label: "دابل", value: 70 }], image: GENERATED_BEEF_BURGER, accent: "tomato" },
      { name: "تشيز برجر سبيشيال لحم", note: "برجر بيف · جبنة · صوصات رولز", prices: [{ label: "سنجل", value: 75 }, { label: "دابل", value: 120 }], image: GENERATED_BEEF_BURGER, accent: "cream" },
      { name: "تريبل تشيز برجر بيف", note: "ثلاث طبقات برجر بيف · جبنة · صوص رولز", prices: [{ label: "سنجل", value: 80 }, { label: "دابل", value: 125 }], image: GENERATED_BEEF_BURGER, accent: "cobalt" },
      { name: "سوبر ماجنم", note: "برجر بيف · جبنة · صوص خاص · مكونات رولز", prices: [{ label: "سنجل", value: 90 }, { label: "دابل", value: 160 }], image: GENERATED_BEEF_BURGER, accent: "saffron" },
    ],
  },
  {
    id: "potato-sandwiches",
    label: "ساندوتشات البطاطس",
    kicker: "لقطة البطاطس",
    intro: "بطاطس داخل العيش، وصوص أو جبنة على مزاجك. الحجم عندك والاختيار لك.",
    items: [
      { name: "ويتش بطاطس عادي", note: "بطاطس · صوص رولز", prices: [{ label: "صغير", value: 40 }, { label: "كبير", value: 45 }, { label: "جامبو", value: 55 }], image: REAL_LONG_SANDWICHES, imageSource: "rollz-category", accent: "saffron" },
      { name: "ويتش بطاطس ميكس صوص", note: "بطاطس · ميكس صوصات رولز", prices: [{ label: "صغير", value: 50 }, { label: "كبير", value: 60 }, { label: "جامبو", value: 65 }], image: REAL_SANDWICHES, imageSource: "rollz-category", accent: "tomato" },
      { name: "ويتش بطاطس شيدر", note: "بطاطس · صوص شيدر", prices: [{ label: "صغير", value: 50 }, { label: "كبير", value: 55 }, { label: "جامبو", value: 65 }], image: GENERATED_POTATO_SANDWICH, accent: "cream" },
      { name: "ويتش بطاطس موزاريلا", note: "بطاطس · موزاريلا", prices: [{ label: "صغير", value: 50 }, { label: "كبير", value: 60 }, { label: "جامبو", value: 65 }], image: GENERATED_POTATO_SANDWICH, accent: "cobalt" },
      { name: "ويتش بطاطس ميكس تشيز", note: "بطاطس · ميكس جبن", prices: [{ label: "صغير", value: 55 }, { label: "كبير", value: 65 }, { label: "جامبو", value: 70 }], image: GENERATED_POTATO_SANDWICH, accent: "saffron" },
      { name: "ويتش بطاطس سويس مشروم موزاريلا", note: "بطاطس · سويس مشروم · موزاريلا", prices: [{ label: "صغير", value: 65 }, { label: "كبير", value: 75 }, { label: "جامبو", value: 85 }], image: GENERATED_POTATO_SANDWICH, accent: "tomato" },
      { name: "ويتش بطاطس استربس موزاريلا", note: "بطاطس · استربس · موزاريلا", prices: [{ label: "صغير", value: 75 }, { label: "كبير", value: 85 }, { label: "جامبو", value: 100 }], image: GENERATED_POTATO_SANDWICH, accent: "cream" },
      { name: "ويتش بطاطس شاورما موزاريلا", note: "بطاطس · شاورما · موزاريلا", prices: [{ label: "كبير", value: 100 }, { label: "جامبو", value: 110 }], image: GENERATED_POTATO_SANDWICH, accent: "cobalt" },
      { name: "رولز ساندوتش", note: "بطاطس · سويس مشروم · برجر بيف · موزاريلا", prices: [{ label: "كبير", value: 85 }, { label: "جامبو", value: 100 }], image: GENERATED_POTATO_SANDWICH, accent: "saffron" },
    ],
  },
  {
    id: "plates",
    label: "أطباق البطاطس",
    kicker: "لقطة الطبق",
    intro: "من الاختيار البسيط للتركيبة الغنية، اختار حجمك وظبّط كل تفصيلة قبل ما تثبّت طلبك.",
    items: [
      { name: "طبق بطاطس عادي", note: "بطاطس رولز", prices: [{ label: "وسط", value: 50 }, { label: "كبير", value: 60 }], image: REAL_LOADED_FRIES, imageSource: "rollz-category", accent: "saffron" },
      { name: "طبق بطاطس رانش", note: "بطاطس · صوص رانش", prices: [{ label: "وسط", value: 60 }, { label: "كبير", value: 70 }], image: REAL_LOADED_FRIES, imageSource: "rollz-category", accent: "tomato" },
      { name: "طبق بطاطس ميكس صوص", note: "بطاطس · ميكس صوصات", prices: [{ label: "وسط", value: 65 }, { label: "كبير", value: 75 }], image: GENERATED_LOADED_PLATE, accent: "cream" },
      { name: "طبق بطاطس صوص شيدر", note: "بطاطس · صوص شيدر", prices: [{ label: "وسط", value: 60 }, { label: "كبير", value: 75 }], image: GENERATED_LOADED_PLATE, accent: "cobalt" },
      { name: "طبق بطاطس موزاريلا", note: "بطاطس · موزاريلا", prices: [{ label: "وسط", value: 65 }, { label: "كبير", value: 75 }], image: GENERATED_LOADED_PLATE, accent: "saffron" },
      { name: "طبق بطاطس هالبينو موزاريلا", note: "بطاطس · هالبينو · موزاريلا", prices: [{ label: "وسط", value: 70 }, { label: "كبير", value: 80 }], image: GENERATED_LOADED_PLATE, accent: "tomato" },
      { name: "طبق بطاطس فرايداي", note: "شيدر · هالبينو · موزاريلا · صوص رولز", prices: [{ label: "وسط", value: 65 }, { label: "كبير", value: 75 }], image: GENERATED_LOADED_PLATE, accent: "cream" },
      { name: "طبق بطاطس ميكس تشيز", note: "بطاطس · ميكس تشيز", prices: [{ label: "وسط", value: 70 }, { label: "كبير", value: 80 }], image: GENERATED_LOADED_PLATE, accent: "cobalt" },
      { name: "طبق بطاطس سوسيس موزاريلا وشيدر", note: "بطاطس · سوسيس · موزاريلا · شيدر", prices: [{ label: "وسط", value: 80 }, { label: "كبير", value: 90 }], image: GENERATED_LOADED_PLATE, accent: "saffron" },
      { name: "طبق بطاطس استربس موزاريلا وشيدر", note: "بطاطس · استربس · موزاريلا · شيدر", prices: [{ label: "وسط", value: 90 }, { label: "كبير", value: 110 }], image: GENERATED_LOADED_PLATE, accent: "tomato" },
      { name: "طبق بطاطس شيش موزاريلا", note: "بطاطس · شيش · موزاريلا", prices: [{ label: "وسط", value: 90 }, { label: "كبير", value: 110 }], image: GENERATED_LOADED_PLATE, accent: "cream" },
      { name: "طبق بطاطس كبار الزوار", note: "بطاطس · طبقات وصوصات رولز", prices: [{ label: "وسط", value: 95 }, { label: "كبير", value: 115 }], image: GENERATED_LOADED_PLATE, accent: "cobalt" },
      { name: "طبق فورسيزون", note: "رانش · شيدر · استربس · رومي مدخن · هالبينو", prices: [{ label: "وسط", value: 110 }, { label: "كبير", value: 130 }], image: GENERATED_LOADED_PLATE, accent: "tomato" },
    ],
  },
  {
    id: "snacks",
    label: "سناكس",
    kicker: "لقطة جانبية",
    intro: "اختيار جانبي للوجبة أو طلب صغير لوحده. شوف القطع والسعر قبل الإضافة.",
    items: [
      { name: "حلقات بصل", note: "4 قطع · يقدم مع صوص", prices: [{ label: "4 قطع", value: 50 }], image: GENERATED_SNACKS, accent: "saffron" },
      { name: "موزاريلا ستيك", note: "3 قطع · يقدم مع صوص", prices: [{ label: "3 قطع", value: 55 }], image: GENERATED_SNACKS, accent: "tomato" },
      { name: "بطاطس فريسكس", note: "بطاطس مقرمشة · يقدم مع صوص", prices: [{ label: "السعر", value: 60 }], image: GENERATED_SNACKS, accent: "cream" },
      { name: "مسحب", note: "3 قطع · يقدم مع صوص", prices: [{ label: "3 قطع", value: 75 }], image: GENERATED_SNACKS, accent: "cobalt" },
    ],
  },
  {
    id: "extras",
    label: "الإضافات",
    kicker: "لمستك الأخيرة",
    intro: "صوص، جبنة، هالبينو أو إضافة ثانية: التفاصيل الصغيرة تخلي اللفة على مزاجك.",
    items: [
      { name: "عيش", note: "إضافة", prices: [{ label: "السعر", value: 7 }], image: FOOD, accent: "saffron" },
      { name: "هالبينو", note: "إضافة", prices: [{ label: "السعر", value: 10 }], image: MENU_JALAPENO, accent: "tomato" },
      { name: "موزاريلا", note: "إضافة", prices: [{ label: "السعر", value: 25 }], image: MENU_MOZZARELLA, accent: "cream" },
      { name: "تومية", note: "إضافة", prices: [{ label: "السعر", value: 10 }], image: MENU_GARLIC_SAUCE, accent: "cobalt" },
      { name: "ميكس تشيز", note: "إضافة", prices: [{ label: "السعر", value: 30 }], image: FEAST, accent: "saffron" },
      { name: "مشروم", note: "إضافة", prices: [{ label: "السعر", value: 20 }], image: MENU_MUSHROOM, accent: "tomato" },
      { name: "رومي مدخن", note: "إضافة", prices: [{ label: "السعر", value: 20 }], image: MENU_SMOKED_TURKEY, accent: "cream" },
      { name: "بيج تيستي", note: "إضافة", prices: [{ label: "السعر", value: 15 }], image: FOOD, accent: "cobalt" },
      { name: "صوصات", note: "رانش · تومية · باربكيو · هوت صوص · شيدر", prices: [{ label: "السعر", value: 10 }], image: FRIES, accent: "saffron" },
    ],
  },
];
