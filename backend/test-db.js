
const db = require("./db");

async function testDatabase() {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS dbName");
    console.log("Database connected successfully!");
    console.log("Database:", rows[0].dbName);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await db.end();
  }
}

testDatabase();
