import mongoose from "mongoose";
import { config } from "./config/env";
import { User } from "./models/User";
import { Provider } from "./models/Provider";
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

    await User.deleteMany({});
    await Provider.deleteMany({});
    await Service.deleteMany({});

    const admin = await User.create({
      name: "Admin",
      email: "admin@sewa.com",
      password: "admin123",
      role: "admin",
      phone: "+977-9800000000",
    });
    console.log("Admin user created: admin@sewa.com / admin123");

    const user = await User.create({
      name: "Ram Bahadur",
      email: "ram@test.com",
      password: "password123",
      role: "user",
      phone: "+977-9800000001",
    });
    console.log("Test user created: ram@test.com / password123");

    const providerUser = await User.create({
      name: "Shyam Sharma",
      email: "shyam@test.com",
      password: "password123",
      role: "provider",
      phone: "+977-9800000002",
    });

    const seededServices = await Service.insertMany(services);
    console.log(`${services.length} services seeded`);

    const electrician = seededServices.find((s) => s.name === "Electrician");
    const plumber = seededServices.find((s) => s.name === "Plumber");

    await Provider.create({
      userId: providerUser._id,
      businessName: "Sharma Electricals",
      description: "Professional electrical services with 10+ years of experience. Licensed and insured.",
      services: electrician ? [electrician._id] : [],
      avgRating: 4.5,
      totalReviews: 12,
      totalJobs: 45,
      verified: true,
      availability: [
        { day: "mon", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "tue", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "wed", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "thu", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "fri", startTime: "09:00", endTime: "18:00", isAvailable: true },
        { day: "sat", startTime: "10:00", endTime: "15:00", isAvailable: true },
        { day: "sun", startTime: "00:00", endTime: "00:00", isAvailable: false },
      ],
    });
    console.log("Test provider created: shyam@test.com / password123");

    console.log("\n--- Seed Complete ---");
    console.log("Admin:    admin@sewa.com / admin123");
    console.log("User:     ram@test.com / password123");
    console.log("Provider: shyam@test.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
