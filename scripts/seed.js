import mongoose from "mongoose";
import Topic from "../models/topic.js";

const sampleTopics = [
  {
    title: "Introduction to Next.js",
    description: "Learn the basics of Next.js framework for React applications",
    author: "John Doe",
    category: "Technology",
    status: "Active",
    priority: "High",
  },
  {
    title: "MongoDB Best Practices",
    description: "Essential practices for working with MongoDB databases",
    author: "Jane Smith",
    category: "Technology",
    status: "Active",
    priority: "Medium",
  },
  {
    title: "Business Strategy 101",
    description: "Fundamental concepts of business strategy and planning",
    author: "Mike Johnson",
    category: "Business",
    status: "Active",
    priority: "High",
  },
  {
    title: "Healthy Living Tips",
    description: "Daily habits for maintaining good health and wellness",
    author: "Sarah Wilson",
    category: "Health",
    status: "Active",
    priority: "Low",
  },
  {
    title: "Online Learning Platforms",
    description: "Review of popular online education platforms and their features",
    author: "David Brown",
    category: "Education",
    status: "Active",
    priority: "Medium",
  },
];

const connectMongoDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI || "mongodb://mongodb:27017/nextjsapp";
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectMongoDB();

    // Clear existing data
    await Topic.deleteMany({});
    console.log("Cleared existing topics");

    // Insert sample data
    const topics = await Topic.insertMany(sampleTopics);
    console.log(`Seeded ${topics.length} topics successfully`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
