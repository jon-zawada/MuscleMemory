// import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// const connect = async () => {
//   const client = new Client({ connectionString: process.env.DATABASE_URL });

//   await client.connect();
//   console.log("Connected to database");

//   const res = await client.query("SELECT current_database() as db");
//   console.log("Database:", res.rows[0].db);

//   await client.end();
//   console.log("Disconnected");
// };

// connect();
