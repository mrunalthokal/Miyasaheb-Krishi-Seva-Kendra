require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Scheme = require('../models/Scheme');
const CropTip = require('../models/CropTip');

async function seed() {
  await connectDB();

  // --- Admin ---
  const adminMobile = process.env.ADMIN_MOBILE || '9999999999';
  const existingAdmin = await Admin.findOne({ mobile: adminMobile });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await Admin.create({ name: process.env.ADMIN_NAME || 'KSK Admin', mobile: adminMobile, password: hashed });
    console.log(`Admin created -> mobile: ${adminMobile}, password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  // --- Categories ---
  const categoryNames = ['Seeds', 'Fertilizers', 'Pesticides', 'Tools & Equipment'];
  const categories = {};
  for (const name of categoryNames) {
    let cat = await Category.findOne({ name });
    if (!cat) cat = await Category.create({ name });
    categories[name] = cat;
  }
  console.log('Categories ready.');

  // --- Products ---
  const seedProducts = [
    // Seeds
    { name: 'Hybrid Cotton Seeds (BT-1)', categoryId: categories['Seeds']._id, description: 'High-yield hybrid cotton seeds suited for black soil regions. Bollworm resistant variety.', price: 850, unit: 'packet (450g)', stockStatus: 'Available', imageUrl: '/images/cotten_hybrid.jpg' },
    { name: 'Soybean Seeds JS-335', categoryId: categories['Seeds']._id, description: 'Certified soybean seeds with high germination rate, ideal for Kharif season.', price: 95, unit: 'kg', stockStatus: 'Available', imageUrl: '/images/soyabean.jpg' },
    { name: 'Wheat Seeds GW-496', categoryId: categories['Seeds']._id, description: 'High-yielding wheat variety suitable for irrigated conditions in Rabi season.', price: 65, unit: 'kg', stockStatus: 'Available', imageUrl: '/images/wheat.jpg' },
    { name: 'Onion Seeds Bhima Raj', categoryId: categories['Seeds']._id, description: 'Popular onion variety with good bulb size and long storage life.', price: 1200, unit: 'kg', stockStatus: 'Available', imageUrl: '/images/onion.jpg' },
    { name: 'Tomato Seeds Hybrid F1', categoryId: categories['Seeds']._id, description: 'Disease resistant hybrid tomato seeds with high yield potential.', price: 550, unit: 'packet (10g)', stockStatus: 'Available', imageUrl: '/images/tomato.jpg' },
    { name: 'Maize Seeds DHM-117', categoryId: categories['Seeds']._id, description: 'High yielding hybrid maize seeds suitable for Kharif season.', price: 480, unit: 'packet (1kg)', stockStatus: 'Available', imageUrl: '/images/Maize.jpg' },
    { name: 'Sunflower Seeds KBSH-44', categoryId: categories['Seeds']._id, description: 'High oil content sunflower hybrid suitable for all seasons.', price: 320, unit: 'packet (500g)', stockStatus: 'Available', imageUrl: '/images/cotten.jpg' },
    { name: 'Groundnut Seeds TAG-24', categoryId: categories['Seeds']._id, description: 'Bold seeded groundnut variety with high pod yield.', price: 85, unit: 'kg', stockStatus: 'Unavailable', imageUrl: '/images/soyabean.jpg' },
    // Fertilizers
    { name: 'Urea Fertilizer', categoryId: categories['Fertilizers']._id, description: 'Nitrogen-rich fertilizer for vegetative growth of crops.', price: 266, unit: 'bag (45kg)', stockStatus: 'Available', imageUrl: '/images/urea.jpg' },
    { name: 'DAP Fertilizer', categoryId: categories['Fertilizers']._id, description: 'Di-Ammonium Phosphate for strong root development.', price: 1350, unit: 'bag (50kg)', stockStatus: 'Available', imageUrl: '/images/dap.jpg' },
    { name: 'Vermi Compost', categoryId: categories['Fertilizers']._id, description: 'Organic compost that improves soil fertility and structure.', price: 180, unit: 'bag (20kg)', stockStatus: 'Available', imageUrl: '/images/vermicompost.jpg' },
    { name: 'MOP (Muriate of Potash)', categoryId: categories['Fertilizers']._id, description: 'Potassium fertilizer that improves crop quality and disease resistance.', price: 1700, unit: 'bag (50kg)', stockStatus: 'Available', imageUrl: '/images/dap.jpg' },
    { name: 'NPK 19:19:19', categoryId: categories['Fertilizers']._id, description: 'Balanced water soluble fertilizer for foliar spray and drip irrigation.', price: 1100, unit: 'bag (25kg)', stockStatus: 'Available', imageUrl: '/images/urea.jpg' },
    { name: 'Zinc Sulphate', categoryId: categories['Fertilizers']._id, description: 'Micronutrient fertilizer to correct zinc deficiency in crops.', price: 450, unit: 'bag (25kg)', stockStatus: 'Available', imageUrl: '/images/vermicompost.jpg' },
    { name: 'Organic Neem Cake', categoryId: categories['Fertilizers']._id, description: 'Natural soil amendment that repels pests and enriches soil nutrients.', price: 220, unit: 'bag (20kg)', stockStatus: 'Available', imageUrl: '/images/vermicompost.jpg' },
    // Pesticides
    { name: 'Neem Oil Pesticide', categoryId: categories['Pesticides']._id, description: 'Organic pest repellent effective against aphids, mites and whiteflies.', price: 420, unit: 'litre', stockStatus: 'Unavailable', imageUrl: '/images/neem-oil.jpg' },
    { name: 'Chlorpyrifos 20% EC', categoryId: categories['Pesticides']._id, description: 'Broad-spectrum insecticide for soil and foliar pests.', price: 560, unit: 'litre', stockStatus: 'Unavailable', imageUrl: '/images/chlorpyrifos.jpg' },
    { name: 'Mancozeb 75% WP', categoryId: categories['Pesticides']._id, description: 'Broad spectrum fungicide for control of fungal diseases in crops.', price: 380, unit: 'kg', stockStatus: 'Available', imageUrl: '/images/chlorpyrifos.jpg' },
    { name: 'Imidacloprid 17.8% SL', categoryId: categories['Pesticides']._id, description: 'Systemic insecticide effective against sucking pests like aphids and jassids.', price: 650, unit: '250ml', stockStatus: 'Available', imageUrl: '/images/neem-oil.jpg' },
    { name: 'Glyphosate 41% SL', categoryId: categories['Pesticides']._id, description: 'Non-selective herbicide for control of weeds in non-crop areas.', price: 480, unit: 'litre', stockStatus: 'Available', imageUrl: '/images/chlorpyrifos.jpg' },
    { name: 'Copper Oxychloride 50% WP', categoryId: categories['Pesticides']._id, description: 'Protective fungicide for control of downy mildew and blight diseases.', price: 290, unit: 'kg', stockStatus: 'Available', imageUrl: '/images/neem-oil.jpg' },
    { name: 'Thiamethoxam 25% WG', categoryId: categories['Pesticides']._id, description: 'Systemic insecticide for seed treatment and foliar application.', price: 720, unit: '250g', stockStatus: 'Available', imageUrl: '/images/chlorpyrifos.jpg' },
    // Tools & Equipment
    { name: 'Battery Sprayer Pump (16L)', categoryId: categories['Tools & Equipment']._id, description: 'Rechargeable battery-operated sprayer for pesticide and fertilizer application.', price: 2450, unit: 'unit', stockStatus: 'Available', imageUrl: '/images/battery-sprayer.jpg' },
    { name: 'Hand Hoe (Khurpi)', categoryId: categories['Tools & Equipment']._id, description: 'Durable steel hand tool for weeding and light digging.', price: 120, unit: 'unit', stockStatus: 'Available', imageUrl: '/images/khurpi.jpg' },
    { name: 'Drip Irrigation Kit (0.5 acre)', categoryId: categories['Tools & Equipment']._id, description: 'Complete drip irrigation set for water-efficient farming.', price: 6800, unit: 'kit', stockStatus: 'Available', imageUrl: '/images/drip-irrigation.jpg' },
    { name: 'Manual Seed Drill', categoryId: categories['Tools & Equipment']._id, description: 'Hand operated seed drill for uniform seed sowing at proper depth and spacing.', price: 1800, unit: 'unit', stockStatus: 'Available', imageUrl: '/images/khurpi.jpg' },
    { name: 'Sickle (Vilet)', categoryId: categories['Tools & Equipment']._id, description: 'Sharp stainless steel sickle for harvesting crops.', price: 95, unit: 'unit', stockStatus: 'Available', imageUrl: '/images/khurpi.jpg' },
    { name: 'Wheel Hoe', categoryId: categories['Tools & Equipment']._id, description: 'Single wheel hoe for inter-row cultivation and weed control.', price: 1450, unit: 'unit', stockStatus: 'Unavailable', imageUrl: '/images/drip-irrigation.jpg' },
    { name: 'Soil Testing Kit', categoryId: categories['Tools & Equipment']._id, description: 'Portable kit to test soil pH, nitrogen, phosphorus and potassium levels.', price: 950, unit: 'kit', stockStatus: 'Available', imageUrl: '/images/battery-sprayer.jpg' },
    { name: 'Tarpaulin Sheet (20x20 ft)', categoryId: categories['Tools & Equipment']._id, description: 'Heavy duty waterproof tarpaulin for crop storage and protection.', price: 680, unit: 'unit', stockStatus: 'Available', imageUrl: '/images/drip-irrigation.jpg' },
  ];

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(seedProducts);
    console.log('Sample products inserted.');
  } else {
    const unavailableNames = seedProducts
      .filter((product) => product.stockStatus === 'Unavailable')
      .map((product) => product.name);
    const result = await Product.updateMany(
      { name: { $in: unavailableNames } },
      { $set: { stockStatus: 'Unavailable' } }
    );
    console.log(`Updated ${result.modifiedCount} seeded products to Unavailable; other products were left unchanged.`);
  }

  // --- Schemes ---
  await Scheme.deleteMany({});
  await Scheme.insertMany([
    {
      title: 'PM-KISAN Samman Nidhi',
      description: 'Income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments.',
      eligibility: 'All landholding farmer families with cultivable land.',
      benefits: '₹2,000 every 4 months directly to bank account.',
      officialLink: 'https://pmkisan.gov.in',
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests or disease.',
      eligibility: 'All farmers growing notified crops in notified areas.',
      benefits: 'Low premium crop insurance with full sum insured on loss.',
      officialLink: 'https://pmfby.gov.in',
    },
    {
      title: 'Soil Health Card Scheme',
      description: 'Provides farmers with soil nutrient status and recommendations for appropriate fertilizer use.',
      eligibility: 'All farmers with agricultural land.',
      benefits: 'Free soil testing every 2 years with customized fertilizer advice.',
      officialLink: 'https://soilhealth.dac.gov.in',
    },
    {
      title: 'Kisan Credit Card (KCC)',
      description: 'Provides farmers with affordable credit for agricultural needs including crop cultivation and allied activities.',
      eligibility: 'All farmers, sharecroppers, tenant farmers and self-help groups.',
      benefits: 'Credit up to ₹3 lakh at 4% interest rate per annum.',
      officialLink: 'https://www.nabard.org/content.aspx?id=572',
    },
    {
      title: 'PM Krishi Sinchai Yojana',
      description: 'Aims to enhance water use efficiency and expand cultivable area under assured irrigation.',
      eligibility: 'All farmers with agricultural land.',
      benefits: 'Subsidy on drip and sprinkler irrigation systems up to 55%.',
      officialLink: 'https://pmksy.gov.in',
    },
    {
      title: 'National Agriculture Market (eNAM)',
      description: 'Online trading platform for agricultural commodities to help farmers get better prices.',
      eligibility: 'All farmers registered with their local APMC mandi.',
      benefits: 'Access to pan-India market, transparent price discovery and online payment.',
      officialLink: 'https://enam.gov.in',
    },
    {
      title: 'Paramparagat Krishi Vikas Yojana',
      description: 'Promotes organic farming through cluster approach and PGS certification.',
      eligibility: 'Farmer groups of minimum 50 farmers with 50 acres of land.',
      benefits: '₹50,000 per hectare over 3 years for organic farming inputs and certification.',
      officialLink: 'https://pgsindia-ncof.gov.in',
    },
    {
      title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
      description: 'Provides financial assistance to states for agricultural development and infrastructure.',
      eligibility: 'Farmers in states implementing RKVY projects.',
      benefits: 'Subsidies on farm machinery, storage, processing and market infrastructure.',
      officialLink: 'https://rkvy.nic.in',
    },
  ]);
  console.log('Schemes updated with official links.');

  // --- Crop Tips ---
  const tipCount = await CropTip.countDocuments();
  if (tipCount === 0) {
    await CropTip.insertMany([
      {
        cropName: 'Cotton',
        season: 'Kharif',
        tipContent: 'Sow after the first good monsoon rain. Maintain spacing of 90x60 cm for hybrid varieties and monitor for bollworm from the 45th day.',
      },
      {
        cropName: 'Soybean',
        season: 'Kharif',
        tipContent: 'Treat seeds with Rhizobium culture before sowing to improve nitrogen fixation. Avoid waterlogging.',
      },
      {
        cropName: 'Wheat',
        season: 'Rabi',
        tipContent: 'Ideal sowing window is mid-November. Apply first irrigation 20-25 days after sowing at the crown root stage.',
      },
      {
        cropName: 'Onion',
        season: 'Rabi',
        tipContent: 'Use well-drained soil and apply potash to improve bulb size and storage life.',
      },
    ]);
    console.log('Sample crop tips inserted.');
  } else {
    console.log('Crop tips already exist, skipping.');
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
