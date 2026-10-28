// A broad (not exhaustive) agriculture vocabulary used to decide whether an
// incoming message is in scope for Krishi Mitra. Keeping this as plain data
// makes it easy to extend without touching the guard logic itself.
// Includes common English terms plus a few widely-used Hindi/Marathi terms
// farmers actually type (transliterated), since the audience is bilingual.

const CROPS = [
  "wheat", "rice", "paddy", "cotton", "soybean", "soyabean", "sugarcane", "onion", "tomato",
  "tur", "pigeon pea", "bajra", "jowar", "maize", "corn", "groundnut", "peanut", "gram",
  "chickpea", "mustard", "sunflower", "banana", "grape", "pomegranate", "chilli", "chili",
  "turmeric", "ginger", "garlic", "potato", "brinjal", "eggplant", "okra", "bhindi",
  "cabbage", "cauliflower", "gehu", "chawal", "kapas", "bhuimug", "kanda", "ऊस", "गहू",
  "भात", "कापूस", "सोयाबीन", "कांदा", "crop", "crops", "farming", "cultivation", "harvest",
  "sowing", "sow", "season", "kharif", "rabi", "zaid",
];

const INPUTS = [
  "seed", "seeds", "fertilizer", "fertiliser", "urea", "dap", "npk", "compost", "manure",
  "vermicompost", "pesticide", "insecticide", "fungicide", "herbicide", "weedicide",
  "bio-pesticide", "neem oil", "organic farming", "chemical", "spray", "dose", "dosage",
  "khad", "beej", "kirtnashak",
];

const OPERATIONS = [
  "irrigation", "drip irrigation", "sprinkler", "watering", "water", "mulching",
  "intercropping", "crop rotation", "tillage", "ploughing", "plowing", "transplanting",
  "spacing", "weeding", "pruning", "grafting", "nursery", "germination", "yield",
  "soil test", "soil health", "soil ph", "nutrient", "sindchan",
];

const PROBLEMS = [
  "pest", "pests", "disease", "diseases", "fungus", "blight", "wilt", "borer", "aphid",
  "caterpillar", "locust", "rot", "yellowing", "yellow", "leaf spot", "leaf", "leaves",
  "insect", "infestation", "weed", "weeds", "drought", "flood", "frost", "hailstorm",
  "crop loss", "rog", "किड",
];

const BUSINESS = [
  "scheme", "schemes", "subsidy", "loan", "kcc", "kisan credit card", "insurance",
  "pm-kisan", "pmkisan", "soil health card", "fasal bima", "mandi", "market price",
  "msp", "minimum support price", "yojana", "anudan", "krishi", "farmer", "farmers",
  "agriculture", "agricultural", "agri", "kendra", "center", "centre",
];

const EQUIPMENT = [
  "tractor", "sprayer", "weeder", "power tiller", "harvester", "thresher", "plough",
  "cultivator", "drip kit", "equipment", "machinery", "auzar",
];

const LIVESTOCK = [
  "dairy", "cattle", "cow", "buffalo", "goat", "poultry", "hen", "chicken", "fodder",
  "animal husbandry", "livestock", "milk yield", "vaccination schedule cattle",
];

const WEATHER_AG = [
  "rain", "rainfall", "monsoon", "weather", "forecast", "temperature", "humidity",
  "climate", "drought", "hailstorm", "pausa",
];

const GREETINGS = [
  "hi", "hello", "hey", "namaste", "namaskar", "good morning", "good afternoon",
  "good evening", "thanks", "thank you", "thanku", "ok thanks", "bye", "goodbye",
];

const ABOUT_BOT = [
  "who are you", "what can you do", "what are you", "your name",
  "what is this", "how do you work", "what is krishi mitra",
];

const AGRICULTURE_KEYWORDS = [
  ...CROPS, ...INPUTS, ...OPERATIONS, ...PROBLEMS, ...BUSINESS, ...EQUIPMENT,
  ...LIVESTOCK, ...WEATHER_AG,
];

module.exports = {
  CROPS, INPUTS, OPERATIONS, PROBLEMS, BUSINESS, EQUIPMENT, LIVESTOCK, WEATHER_AG,
  GREETINGS, ABOUT_BOT, AGRICULTURE_KEYWORDS,
};
