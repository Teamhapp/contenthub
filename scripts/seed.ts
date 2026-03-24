import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pay-per-content";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  const db = mongoose.connection.db!;

  // Clear existing data
  const collections = ["users", "contents", "categories", "purchases", "transactions", "reviews", "carts", "platformsettings"];
  for (const col of collections) {
    try { await db.collection(col).drop(); } catch {}
  }
  console.log("Cleared existing data.");

  // Create users
  const hashedPassword = await bcryptjs.hash("password123", 12);

  const usersData = [
    { name: "Admin User", email: "admin@test.com", password: hashedPassword, role: "admin" },
    { name: "Sarah Creator", email: "sarah@test.com", password: hashedPassword, role: "creator", bio: "Full-stack developer and content creator" },
    { name: "Mike Creator", email: "mike@test.com", password: hashedPassword, role: "creator", bio: "Video tutorial specialist" },
    { name: "John Customer", email: "john@test.com", password: hashedPassword, role: "customer" },
    { name: "Jane Customer", email: "jane@test.com", password: hashedPassword, role: "customer" },
  ];

  const users = await db.collection("users").insertMany(
    usersData.map((u) => ({ ...u, isBanned: false, balance: 0, createdAt: new Date(), updatedAt: new Date() }))
  );
  const userIds = Object.values(users.insertedIds);
  console.log(`Created ${userIds.length} users.`);

  // Create categories
  const categoriesData = [
    { name: "Programming", slug: "programming", description: "Coding tutorials and guides", isActive: true, contentCount: 0 },
    { name: "Design", slug: "design", description: "UI/UX and graphic design", isActive: true, contentCount: 0 },
    { name: "Business", slug: "business", description: "Business and entrepreneurship", isActive: true, contentCount: 0 },
    { name: "Marketing", slug: "marketing", description: "Digital marketing strategies", isActive: true, contentCount: 0 },
    { name: "Photography", slug: "photography", description: "Photography tips and assets", isActive: true, contentCount: 0 },
  ];

  const categories = await db.collection("categories").insertMany(
    categoriesData.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
  );
  const catIds = Object.values(categories.insertedIds);
  console.log(`Created ${catIds.length} categories.`);

  // Create content
  const sarah = userIds[1];
  const mike = userIds[2];

  const contentsData = [
    {
      creator: sarah, title: "Complete React Guide 2024", slug: "complete-react-guide-2024-" + Date.now().toString(36),
      description: "Master React from basics to advanced patterns with this comprehensive guide.",
      body: "# Complete React Guide\n\nThis comprehensive guide covers everything you need to know about React development.\n\n## Chapter 1: Getting Started\n\nReact is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and a community of developers.\n\n## Chapter 2: Components\n\nComponents are the building blocks of React applications. They let you split the UI into independent, reusable pieces.\n\n## Chapter 3: Hooks\n\nHooks let you use state and other React features without writing a class. useState, useEffect, useContext are the most commonly used hooks.\n\n## Chapter 4: Advanced Patterns\n\nLearn about render props, higher-order components, compound components, and other advanced patterns.",
      type: "article", price: 1999, category: catIds[0], tags: ["react", "javascript", "frontend"],
      status: "published", previewContent: "Master React from basics to advanced patterns. Covers hooks, state management, and more.",
      totalSales: 15, totalRevenue: 25485, viewCount: 230, averageRating: 4.5, reviewCount: 3,
    },
    {
      creator: sarah, title: "Node.js API Development Masterclass", slug: "nodejs-api-masterclass-" + Date.now().toString(36),
      description: "Build production-ready REST APIs with Node.js, Express, and MongoDB.",
      body: "# Node.js API Development\n\n## Introduction\n\nIn this masterclass, you'll learn how to build robust, scalable APIs.\n\n## Setting Up Express\n\nExpress is the most popular web framework for Node.js.\n\n## Database with MongoDB\n\nLearn schema design, indexing, and aggregation.\n\n## Authentication & Authorization\n\nImplement JWT-based auth with role-based access control.\n\n## Testing & Deployment\n\nWrite tests and deploy to production.",
      type: "article", price: 2499, category: catIds[0], tags: ["nodejs", "api", "backend", "mongodb"],
      status: "published", previewContent: "Learn to build production APIs with Node.js and MongoDB.",
      totalSales: 8, totalRevenue: 16992, viewCount: 145, averageRating: 4.8, reviewCount: 2,
    },
    {
      creator: mike, title: "UI Design Fundamentals Video Course", slug: "ui-design-fundamentals-" + Date.now().toString(36),
      description: "Learn the core principles of UI design through hands-on video tutorials.",
      type: "video", price: 3999, category: catIds[1], tags: ["design", "ui", "figma"],
      status: "published", previewContent: "A 5-part video series covering color theory, typography, layout, and more.",
      totalSales: 12, totalRevenue: 40788, viewCount: 310, averageRating: 4.2, reviewCount: 4,
    },
    {
      creator: mike, title: "Startup Landing Page Template Pack", slug: "startup-landing-templates-" + Date.now().toString(36),
      description: "5 professional landing page templates ready to customize for your startup.",
      type: "file", price: 1499, category: catIds[1], tags: ["templates", "html", "landing-page"],
      status: "published", previewContent: "Includes 5 responsive HTML/CSS templates with modern designs.",
      totalSales: 22, totalRevenue: 28028, viewCount: 450, averageRating: 4.6, reviewCount: 5,
    },
    {
      creator: sarah, title: "TypeScript Design Patterns", slug: "typescript-design-patterns-" + Date.now().toString(36),
      description: "Implement common design patterns in TypeScript for cleaner, maintainable code.",
      body: "# TypeScript Design Patterns\n\nDesign patterns are reusable solutions to common problems.\n\n## Singleton Pattern\n\n## Factory Pattern\n\n## Observer Pattern\n\n## Strategy Pattern",
      type: "article", price: 999, category: catIds[0], tags: ["typescript", "patterns", "architecture"],
      status: "published", previewContent: "Learn Singleton, Factory, Observer, and Strategy patterns in TypeScript.",
      totalSales: 5, totalRevenue: 4245, viewCount: 89, averageRating: 4.0, reviewCount: 1,
    },
    {
      creator: mike, title: "Social Media Marketing Playbook", slug: "social-media-playbook-" + Date.now().toString(36),
      description: "A complete guide to growing your brand on social media platforms.",
      body: "# Social Media Marketing Playbook\n\n## Platform Strategies\n\n## Content Calendar\n\n## Analytics & Growth",
      type: "article", price: 1299, category: catIds[3], tags: ["marketing", "social-media", "growth"],
      status: "published", previewContent: "Strategies for Instagram, Twitter, LinkedIn, and TikTok growth.",
      totalSales: 18, totalRevenue: 19890, viewCount: 280, averageRating: 4.3, reviewCount: 3,
    },
    {
      creator: sarah, title: "Advanced CSS Animations", slug: "advanced-css-animations-" + Date.now().toString(36),
      description: "Create stunning animations using pure CSS - no JavaScript required.",
      type: "article", price: 799, category: catIds[0], tags: ["css", "animations", "frontend"],
      status: "pending", previewContent: "Learn keyframes, transitions, and advanced animation techniques.",
      body: "# Advanced CSS Animations\n\n## Keyframes\n\n## Transitions\n\n## Performance Tips",
      totalSales: 0, totalRevenue: 0, viewCount: 0, averageRating: 0, reviewCount: 0,
    },
    {
      creator: mike, title: "Photography Preset Pack", slug: "photography-presets-" + Date.now().toString(36),
      description: "50 professional Lightroom presets for stunning photo editing.",
      type: "file", price: 2499, category: catIds[4], tags: ["photography", "lightroom", "presets"],
      status: "pending", previewContent: "Includes warm, cool, vintage, and cinematic preset categories.",
      totalSales: 0, totalRevenue: 0, viewCount: 0, averageRating: 0, reviewCount: 0,
    },
  ];

  const contents = await db.collection("contents").insertMany(
    contentsData.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`Created ${Object.keys(contents.insertedIds).length} content items.`);

  // Update creator balances
  await db.collection("users").updateOne(
    { _id: sarah },
    { $set: { balance: 25485 + 16992 + 4245 } }
  );
  await db.collection("users").updateOne(
    { _id: mike },
    { $set: { balance: 40788 + 28028 + 19890 } }
  );

  // Create platform settings
  await db.collection("platformsettings").insertOne({
    commissionRate: 15,
    minContentPrice: 100,
    maxContentPrice: 100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Created platform settings.");

  // Create text index on contents
  await db.collection("contents").createIndex(
    { title: "text", description: "text", tags: "text" }
  );
  console.log("Created text index.");

  console.log("\n--- Seed Complete ---");
  console.log("Login credentials (all passwords: password123):");
  console.log("  Admin:    admin@test.com");
  console.log("  Creator:  sarah@test.com / mike@test.com");
  console.log("  Customer: john@test.com / jane@test.com");
  console.log("---");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
