import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

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

export async function POST() {
  try {
    await connectMongoDB();

    // Clear existing data
    await Topic.deleteMany({});
    console.log("Cleared existing topics");

    // Insert sample data
    const topics = await Topic.insertMany(sampleTopics);
    console.log(`Seeded ${topics.length} topics successfully`);

    return NextResponse.json({
      message: `Database seeded successfully with ${topics.length} topics`,
      topics: topics
    }, { status: 201 });

  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({
      message: "Error seeding database",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const count = await Topic.countDocuments();
    return NextResponse.json({
      message: "Database status",
      totalTopics: count
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error checking database",
      error: error.message
    }, { status: 500 });
  }
}
