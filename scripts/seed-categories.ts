import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID } from "../lib/appwrite"
import { ID } from "appwrite"

const defaultCategories = [
  {
    name: "Programming Languages",
    slug: "programming-languages",
    description: "Books about specific programming languages like JavaScript, Python, Java, etc.",
    color: "#3b82f6",
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full-stack web development resources",
    color: "#10b981",
  },
  {
    name: "Data Science",
    slug: "data-science",
    description: "Machine learning, AI, statistics, and data analysis",
    color: "#8b5cf6",
  },
  {
    name: "Software Engineering",
    slug: "software-engineering",
    description: "Software architecture, design patterns, and engineering practices",
    color: "#f59e0b",
  },
  {
    name: "Computer Science",
    slug: "computer-science",
    description: "Algorithms, data structures, and theoretical computer science",
    color: "#ef4444",
  },
  {
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "Deployment, infrastructure, containerization, and cloud platforms",
    color: "#06b6d4",
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS, Android, and cross-platform mobile app development",
    color: "#84cc16",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Information security, ethical hacking, and privacy",
    color: "#dc2626",
  },
]

async function seedCategories() {
  try {
    console.log("Starting to seed categories...")

    for (const category of defaultCategories) {
      try {
        await databases.createDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, ID.unique(), {
          ...category,
          ebookCount: 0,
        })
        console.log(`✅ Created category: ${category.name}`)
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`⚠️  Category already exists: ${category.name}`)
        } else {
          console.error(`❌ Error creating category ${category.name}:`, error)
        }
      }
    }

    console.log("✅ Categories seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding categories:", error)
  }
}

// Run the seeding function
seedCategories()
