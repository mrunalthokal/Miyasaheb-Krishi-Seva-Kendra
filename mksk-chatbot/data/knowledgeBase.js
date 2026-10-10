// General-purpose agriculture Q&A used when no DB match and no LLM is
// configured (or as grounding context when an LLM IS configured). Answers are
// intentionally general/educational — for exact chemical dosages the bot
// always points the farmer to the product label or center staff rather than
// prescribing a number, same as a responsible extension worker would.
//
// Each entry lists "primary" keywords (strong, distinctive signal — a single
// hit is enough to match) and "secondary" keywords (weaker/generic terms that
// need to combine with another hit to match). This keeps matching forgiving
// without letting generic words like "time" or "water" fire on their own.

module.exports = [
  {
    id: "sowing-time-general",
    primary: ["sow", "sowing", "kharif", "rabi"],
    secondary: ["when", "time", "season", "plant"],
    question: "When should I sow my crop?",
    answer: "Sowing time depends on the crop and season. Kharif crops (cotton, soybean, bajra, tur) are typically sown with the first reliable monsoon showers, roughly June–July. Rabi crops (wheat, onion, gram) are usually sown October–December after the monsoon retreats. Check the Crop Tips section for exact windows for your crop, or ask me about a specific crop by name.",
  },
  {
    id: "irrigation-scheduling",
    primary: ["irrigation", "irrigate", "drip"],
    secondary: ["water", "watering", "how often"],
    question: "How often should I irrigate my field?",
    answer: "It depends on the crop, soil type and stage of growth, but a few general rules help: irrigate at critical growth stages (germination, flowering, grain/fruit filling) rather than on a fixed calendar; avoid waterlogging, which damages roots as much as drought does; and drip irrigation typically needs more frequent, shorter watering than flood irrigation. A soil moisture check by hand before irrigating is a simple, reliable guide.",
  },
  {
    id: "soil-testing",
    primary: ["soil test", "soil health", "soil ph"],
    secondary: ["nutrient", "soil"],
    question: "Why should I get my soil tested?",
    answer: "A soil test tells you your field's nutrient levels (N, P, K), pH and organic carbon, so you apply only the fertiliser your soil actually needs instead of guessing. This saves money and protects long-term soil health. The Soil Health Card Scheme offers this testing free — visit the Schemes page or ask me about it.",
  },
  {
    id: "organic-farming",
    primary: ["organic", "natural farming", "chemical free"],
    secondary: ["compost", "vermicompost"],
    question: "How do I start organic farming?",
    answer: "Start gradually: build soil organic matter with compost, vermicompost or farmyard manure; use crop rotation and intercropping to break pest cycles naturally; switch to bio-pesticides like neem oil for pest control; and consider certification only once your practices are consistent, since certification takes a few years of chemical-free cultivation to qualify.",
  },
  {
    id: "pest-general",
    primary: ["pest", "infestation", "borer", "aphid", "caterpillar"],
    secondary: ["insect"],
    question: "How do I deal with a pest problem in my crop?",
    answer: "First identify the pest and the crop stage affected — many pests target specific stages (e.g. bollworm in cotton near flowering). Start with the least harmful option: neem-based bio-pesticides or mechanical traps often control early infestations. For chemical control, match the product to the specific pest and follow the label's dosage exactly — our staff can help you pick the right product and quantity for your field size.",
  },
  {
    id: "disease-general",
    primary: ["disease", "fungus", "blight", "wilt", "leaf spot", "yellow", "spots"],
    secondary: ["rot", "yellowing"],
    question: "My crop has a disease — what should I do?",
    answer: "Fungal and bacterial diseases spread fast in humid conditions, so remove and destroy visibly infected plants/leaves early to slow spread. Improve field drainage and airflow (avoid overcrowding). For a confirmed diagnosis and the right fungicide, it's best to bring a sample or a clear photo to the center — disease symptoms can look similar across different causes.",
  },
  {
    id: "fertilizer-general",
    primary: ["fertilizer", "fertiliser", "urea", "dap", "npk"],
    secondary: ["dose", "dosage", "nutrient"],
    question: "How much fertiliser should I use?",
    answer: "The right dose depends on your crop, soil test results and target yield — there's no one-size-fits-all number. As a general principle, split nitrogen application across 2–3 doses through the season rather than applying it all at once, since crops use it more efficiently that way. Bring your soil health card (or get tested) and our staff can recommend an exact quantity for your field.",
  },
  {
    id: "crop-rotation",
    primary: ["crop rotation", "same crop", "intercropping"],
    secondary: ["rotate"],
    question: "Should I grow the same crop every season?",
    answer: "Repeatedly growing the same crop depletes specific soil nutrients and builds up pests/diseases suited to that crop. Rotating with a different crop family (e.g. a legume like soybean or tur after a cereal like wheat) restores soil nitrogen and breaks pest cycles. Intercropping (growing two compatible crops together) can achieve a similar benefit within one season.",
  },
  {
    id: "storage-post-harvest",
    primary: ["storage", "store", "godown", "post harvest"],
    secondary: ["spoilage"],
    question: "How should I store my harvest to avoid spoilage?",
    answer: "Dry produce fully before storage — excess moisture is the single biggest cause of spoilage and fungal growth. Store in a cool, dry, well-ventilated place off the ground, use clean containers/bags, and inspect stored grain periodically for pests. For larger quantities, government or cooperative warehouses often offer better conditions than home storage.",
  },
  {
    id: "market-price-general",
    primary: ["mandi", "msp", "market price", "selling price"],
    secondary: ["sell", "rate"],
    question: "How do I get a good price for my produce?",
    answer: "Check current mandi (market) rates before selling — prices vary by market and can change daily. Government MSP (Minimum Support Price) applies to certain notified crops as a price floor. Selling through Farmer Producer Organisations (FPOs) or direct-to-consumer channels can sometimes fetch better prices than a single local trader. Ask center staff about current local mandi rates.",
  },
  {
    id: "weather-farming",
    primary: ["rain", "rainfall", "monsoon", "forecast", "drought"],
    secondary: ["weather"],
    question: "How should weather affect my farming decisions?",
    answer: "Check the short-term forecast before spraying pesticides or fertiliser — rain soon after application washes it away and wastes money. Delay sowing if heavy rain is expected right after, since seeds can rot in waterlogged soil. Check the Weather page on our portal for a district-wise forecast before planning key field operations.",
  },
  {
    id: "seed-selection",
    primary: ["seed", "seeds", "hybrid", "certified seed"],
    secondary: ["variety"],
    question: "How do I choose good seeds?",
    answer: "Prefer certified or hybrid seeds from a reliable source — they have known germination rates and disease resistance, unlike uncertified seed of unknown quality. Match the variety to your local soil and rainfall pattern, and check the maturity duration fits your season. Our seed stock lists germination-relevant details on each product page.",
  },
  {
    id: "spacing-general",
    primary: ["spacing", "row spacing", "distance between plants"],
    secondary: [],
    question: "What spacing should I use between plants?",
    answer: "Spacing depends heavily on the crop and variety — wider spacing suits crops that branch out (like cotton), while closer spacing suits crops grown for dense stands (like wheat). Wider spacing generally improves airflow (fewer diseases) but needs more land per plant. Check crop-specific tips on our Crop Tips page for common spacing figures.",
  },
  {
    id: "kcc-general",
    primary: ["kisan credit card", "kcc"],
    secondary: ["credit", "loan"],
    question: "What is a Kisan Credit Card?",
    answer: "The Kisan Credit Card (KCC) gives farmers a revolving credit line for crop production and related needs, at a concessional interest rate — currently as low as 4% per year with prompt repayment. All farmers, including tenant farmers and sharecroppers, are eligible. Visit our Schemes page or ask center staff for help applying.",
  },
  {
    id: "greeting",
    primary: [],
    secondary: [],
    question: "__greeting__",
    answer: "Namaskar! I'm Krishi Mitra, your farming assistant at Miyasaheb Krishi Seva Kendra. Ask me about crops, seeds, fertilisers, pests, irrigation, government schemes, weather, or our products — I'm here to help.",
  },
];
