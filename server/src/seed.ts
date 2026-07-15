import mongoose from "mongoose";
import { config } from "./config/env";
import { Service } from "./models/Service";

const services = [
  { name: "Electrician", category: "Electrical", description: "Wiring, repairs, installations, and electrical maintenance", basePrice: 500, duration: 60, icon: "⚡" },
  { name: "Plumber", category: "Plumbing", description: "Pipe repairs, installations, leak fixes, and bathroom fittings", basePrice: 600, duration: 60, icon: "🔧" },
  { name: "Carpenter", category: "Woodwork", description: "Furniture repair, woodwork, installations, and custom builds", basePrice: 700, duration: 90, icon: "🪚" },
  { name: "Painter", category: "Painting", description: "Interior and exterior painting, wall treatments, and finishes", basePrice: 400, duration: 120, icon: "🎨" },
  { name: "AC Repair", category: "Appliance", description: "AC installation, servicing, gas refill, and repairs", basePrice: 800, duration: 60, icon: "❄️" },
  { name: "Cleaning", category: "Cleaning", description: "Home cleaning, deep cleaning, kitchen and bathroom cleaning", basePrice: 500, duration: 120, icon: "🧹" },
  { name: "Pest Control", category: "Pest Control", description: "Termite treatment, cockroach control, mosquito fogging", basePrice: 900, duration: 90, icon: "🐛" },
  { name: "Roofer", category: "Roofing", description: "Roof repairs, waterproofing, tile replacement, and leak fixes", basePrice: 1000, duration: 120, icon: "🏠" },
  { name: "Locksmith", category: "Security", description: "Lock installation, key replacement, emergency lockout help", basePrice: 500, duration: 30, icon: "🔐" },
  { name: "Gardener", category: "Garden", description: "Landscaping, lawn care, pruning, and garden maintenance", basePrice: 400, duration: 90, icon: "🌱" },
  { name: "Mason", category: "Construction", description: "Brickwork, stone laying, wall construction, and repairs", basePrice: 800, duration: 120, icon: "🧱" },
  { name: "Interior Designer", category: "Design", description: "Home interiors, space planning, modular kitchen design", basePrice: 2000, duration: 60, icon: "🛋️" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");

    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log(`${services.length} services seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
