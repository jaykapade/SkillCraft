const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
        { name: "Art" },
      ],
    });
    console.log("Successfully Seeded the db");
  } catch (error) {
    console.error("Error Seeding the db", error);
  } finally {
    await db.$disconnect();
  }
}

main();
