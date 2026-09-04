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
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: 'Hybrid Cotton Seeds (BT-1)',
        categoryId: categories['Seeds']._id,
        description: 'High-yield hybrid cotton seeds suited for black soil regions. Bollworm resistant variety.',
        price: 850,
        unit: 'packet (450g)',
        stockStatus: 'Available',
      },
      {
        name: 'Soybean Seeds JS-335',
        categoryId: categories['Seeds']._id,
        description: 'Certified soybean seeds with high germination rate, ideal for Kharif season.',
        price: 95,
        unit: 'kg',
        stockStatus: 'Available',
      },
      {
        name: 'Urea Fertilizer',
        categoryId: categories['Fertilizers']._id,
        description: 'Nitrogen-rich fertilizer for vegetative growth of crops.',
        price: 266,
        unit: 'bag (45kg)',
        stockStatus: 'Available',
      },
      {
        name: 'DAP Fertilizer',
        categoryId: categories['Fertilizers']._id,
        description: 'Di-Ammonium Phosphate for strong root development.',
        price: 1350,
        unit: 'bag (50kg)',
        stockStatus: 'Available',
      },
      {
        name: 'Vermi Compost',
        categoryId: categories['Fertilizers']._id,
        description: 'Organic compost that improves soil fertility and structure.',
        price: 180,
        unit: 'bag (20kg)',
        stockStatus: 'Available',
      },
      {
        name: 'Neem Oil Pesticide',
        categoryId: categories['Pesticides']._id,
        description: 'Organic pest repellent effective against aphids, mites and whiteflies.',
        price: 420,
        unit: 'litre',
        stockStatus: 'Available',
      },
      {
        name: 'Chlorpyrifos 20% EC',
        categoryId: categories['Pesticides']._id,
        description: 'Broad-spectrum insecticide for soil and foliar pests.',
        price: 560,
        unit: 'litre',
        stockStatus: 'Out of Stock',
      },
      {
        name: 'Battery Sprayer Pump (16L)',
        categoryId: categories['Tools & Equipment']._id,
        description: 'Rechargeable battery-operated sprayer for pesticide and fertilizer application.',
        price: 2450,
        unit: 'unit',
        stockStatus: 'Available',
      },
      {
        name: 'Hand Hoe (Khurpi)',
        categoryId: categories['Tools & Equipment']._id,
        description: 'Durable steel hand tool for weeding and light digging.',
        price: 120,
        unit: 'unit',
        stockStatus: 'Available',
      },
      {
        name: 'Drip Irrigation Kit (0.5 acre)',
        categoryId: categories['Tools & Equipment']._id,
        description: 'Complete drip irrigation set for water-efficient farming.',
        price: 6800,
        unit: 'kit',
        stockStatus: 'Available',
      },
    ]);
    console.log('Sample products inserted.');
  } else {
    console.log('Products already exist, skipping.');
  }

  // --- Schemes ---
  const schemeCount = await Scheme.countDocuments();
  if (schemeCount === 0) {
    await Scheme.insertMany([
      {
        title: 'PM-KISAN Samman Nidhi',
        description:
          'Income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments.',
        eligibility: 'All landholding farmer families with cultivable land.',
        benefits: '₹2,000 every 4 months directly to bank account.',
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests or disease.',
        eligibility: 'All farmers growing notified crops in notified areas.',
        benefits: 'Low premium crop insurance with full sum insured on loss.',
      },
      {
        title: 'Soil Health Card Scheme',
        description: 'Provides farmers with soil nutrient status and recommendations for appropriate fertilizer use.',
        eligibility: 'All farmers with agricultural land.',
        benefits: 'Free soil testing every 2 years with customized fertilizer advice.',
      },
    ]);
    console.log('Sample schemes inserted.');
  } else {
    console.log('Schemes already exist, skipping.');
  }

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
