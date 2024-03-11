import { Database } from "arangojs";

/* ARANGO SETUP */
export const setupArangoDB = async () => {
  const DB = new Database({
    // Database connection
    url: process.env.ARANGO_URL,
    // databaseName: process.env.DB_NAME,
  });

  // Specify the database user
  DB.useBasicAuth(process.env.DB_USER, process.env.DB_PASS);

  try {
    // Check if the database already exists
    const databases = await DB.listDatabases();
    if (!databases.includes(process.env.DB_NAME)) {
      // Create the database
      await DB.createDatabase(process.env.DB_NAME);
      console.log(`Database '${process.env.DB_NAME}' created.`);
    }

    // Switch to the specified database
    // DB.userDatabases(process.env.DB_NAME);

    // Database selection
    DB.database(process.env.DB_NAME);

    console.log(`Connected to ArangoDB database: ${process.env.DB_NAME}`);
    return DB;
  } catch (err) {
    console.error("Failed to connect to ArangoDB:", err);
    throw err;
  }
};
