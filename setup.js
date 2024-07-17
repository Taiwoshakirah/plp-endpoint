const db = require("./db");

const createUsersTable = async () => {
  try {
    console.log("Attempting to connect to the database...");
    await db.getConnection();
    console.log("Connection successful!");

    const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `;

    await db.query(query);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

createUsersTable()
  .then(() => process.exit())
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1);
  });
