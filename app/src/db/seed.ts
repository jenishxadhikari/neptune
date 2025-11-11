import { Pool } from "pg";
import data from "@/data.json";
import { drizzle } from "drizzle-orm/node-postgres";
import { songs } from "./schema";
import { InferInsertModel } from "drizzle-orm";
import "dotenv/config";
import { addSong } from "@/features/admin/songs/actions";

type SongInsert = InferInsertModel<typeof songs>;

const seedData: SongInsert[] = data.map((song) => ({
  ...song,
  year: String(song.year),
}));

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    // Insert all songs (parallel)
    await Promise.all(seedData.map((song) => addSong(song)));

    console.log("Seeded successfully!");
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
