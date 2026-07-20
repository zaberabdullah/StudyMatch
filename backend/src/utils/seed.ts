import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db";
import University from "../models/University";
import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const universities = [
  {
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    shortDescription: "Canada's top-ranked research university with strong CS and engineering programs.",
    fullDescription:
      "The University of Toronto is a globally renowned public research university known for its rigorous academics, extensive research output, and diverse student body of over 97,000 students. Its Computer Science and Engineering faculties are consistently ranked among the best in the world.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    gallery: [
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    ],
    tuitionUSD: 45000,
    livingCostUSD: 15000,
    ranking: 21,
    rating: 4.6,
    reviewCount: 812,
    courses: ["Computer Science", "Data Science", "Engineering", "Business"],
    minIELTS: 6.5,
    minGPA: 3.3,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-01-15"),
    intakeSeasons: ["Fall", "Winter"],
    tags: ["research-intensive", "urban", "large-campus"],
  },
  {
    name: "Technical University of Munich",
    country: "Germany",
    city: "Munich",
    shortDescription: "Top German technical university with low tuition and strong industry ties.",
    fullDescription:
      "TUM is one of Europe's leading technical universities, offering highly ranked engineering, computer science, and natural science programs. Public universities in Germany charge minimal tuition, making it a top choice for budget-conscious international students.",
    imageUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
    gallery: ["https://images.unsplash.com/photo-1467269204594-9661b134dd2b"],
    tuitionUSD: 3000,
    livingCostUSD: 12000,
    ranking: 28,
    rating: 4.7,
    reviewCount: 654,
    courses: ["Mechanical Engineering", "Computer Science", "Robotics", "Physics"],
    minIELTS: 6.5,
    minGPA: 3.0,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-05-31"),
    intakeSeasons: ["Fall"],
    tags: ["low-tuition", "engineering-focused"],
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    shortDescription: "Australia's #1 university with a flexible curriculum and vibrant campus life.",
    fullDescription:
      "The University of Melbourne offers a broad range of undergraduate and postgraduate programs across a flexible, US-style curriculum. Melbourne is consistently rated one of the world's most liveable cities for international students.",
    imageUrl: "https://images.unsplash.com/photo-1523978591478-c753949ff840",
    gallery: ["https://images.unsplash.com/photo-1523978591478-c753949ff840"],
    tuitionUSD: 38000,
    livingCostUSD: 18000,
    ranking: 33,
    rating: 4.5,
    reviewCount: 921,
    courses: ["Business", "Law", "Computer Science", "Medicine"],
    minIELTS: 6.5,
    minGPA: 3.2,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2026-12-01"),
    intakeSeasons: ["Fall", "Summer"],
    tags: ["flexible-curriculum", "urban"],
  },
  {
    name: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    shortDescription: "Asia's top university, a global hub for tech and finance careers.",
    fullDescription:
      "NUS is consistently ranked as Asia's leading university, with strong connections to the region's booming tech and finance industries. Its computing and business faculties attract top talent from across the world.",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    gallery: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd"],
    tuitionUSD: 30000,
    livingCostUSD: 14000,
    ranking: 8,
    rating: 4.8,
    reviewCount: 1043,
    courses: ["Computer Science", "Finance", "Data Science", "Engineering"],
    minIELTS: 7.0,
    minGPA: 3.5,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-02-28"),
    intakeSeasons: ["Fall"],
    tags: ["highly-competitive", "tech-hub"],
  },
  {
    name: "University of Manchester",
    country: "United Kingdom",
    city: "Manchester",
    shortDescription: "A large, research-intensive UK university with strong alumni networks.",
    fullDescription:
      "The University of Manchester is a member of the prestigious Russell Group, offering one-year master's programs and strong industry placement opportunities across engineering, business, and the sciences.",
    imageUrl: "https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c",
    gallery: ["https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c"],
    tuitionUSD: 32000,
    livingCostUSD: 16000,
    ranking: 34,
    rating: 4.4,
    reviewCount: 738,
    courses: ["Business", "Engineering", "Computer Science"],
    minIELTS: 6.5,
    minGPA: 3.0,
    scholarshipAvailable: false,
    applicationDeadline: new Date("2027-01-31"),
    intakeSeasons: ["Fall"],
    tags: ["one-year-masters", "russell-group"],
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    city: "Vancouver",
    shortDescription: "West-coast Canadian university known for sustainability and innovation.",
    fullDescription:
      "UBC is a globally recognized university in Vancouver, celebrated for its beautiful campus, strong research output, and commitment to sustainability. Its co-op programs connect students directly with employers.",
    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3",
    gallery: ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3"],
    tuitionUSD: 41000,
    livingCostUSD: 16000,
    ranking: 41,
    rating: 4.5,
    reviewCount: 690,
    courses: ["Environmental Science", "Computer Science", "Business"],
    minIELTS: 6.5,
    minGPA: 3.2,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-01-15"),
    intakeSeasons: ["Fall", "Winter"],
    tags: ["co-op", "sustainability"],
  },
  {
    name: "Sorbonne University",
    country: "France",
    city: "Paris",
    shortDescription: "Historic Parisian university with affordable tuition for EU-model programs.",
    fullDescription:
      "Sorbonne University combines centuries of academic tradition with modern research facilities in the heart of Paris. Public tuition fees remain low even for international students in many programs.",
    imageUrl: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
    gallery: ["https://images.unsplash.com/photo-1431274172761-fca41d930114"],
    tuitionUSD: 4500,
    livingCostUSD: 13000,
    ranking: 45,
    rating: 4.3,
    reviewCount: 512,
    courses: ["Literature", "Data Science", "Physics", "International Relations"],
    minIELTS: 6.0,
    minGPA: 3.0,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-03-15"),
    intakeSeasons: ["Fall"],
    tags: ["low-tuition", "historic"],
  },
  {
    name: "Arizona State University",
    country: "United States",
    city: "Tempe",
    shortDescription: "Large, innovation-ranked US university with flexible admissions.",
    fullDescription:
      "ASU is the largest public university in the US by enrollment and has been ranked #1 in innovation for multiple years running. It offers extensive scholarship opportunities and a wide range of STEM programs.",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
    gallery: ["https://images.unsplash.com/photo-1498243691581-b145c3f54a5a"],
    tuitionUSD: 29000,
    livingCostUSD: 14000,
    ranking: 121,
    rating: 4.1,
    reviewCount: 455,
    courses: ["Computer Science", "Business", "Engineering", "Data Science"],
    minIELTS: 6.0,
    minGPA: 2.8,
    scholarshipAvailable: true,
    applicationDeadline: new Date("2027-06-01"),
    intakeSeasons: ["Fall", "Spring", "Summer"],
    tags: ["large-campus", "innovation"],
  },
];

async function seed() {
  await connectDB();

  let admin = await User.findOne({ email: "admin@studymatch.ai" });
  if (!admin) {
    const hashed = await bcrypt.hash("Admin@1234", 10);
    admin = await User.create({
      name: "StudyMatch Admin",
      email: "admin@studymatch.ai",
      password: hashed,
      role: "admin",
    });
  }

  await University.deleteMany({});
  await University.insertMany(universities.map((u) => ({ ...u, createdBy: admin!._id })));

  console.log(`[seed] Inserted ${universities.length} universities.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
