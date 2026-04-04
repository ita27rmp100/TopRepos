// createCountryCollections.js
// Uses crud.js (CRUD-FirestoreDB/CommonJS_version) to create a collection per country

const { configuration, uploadProcessData } = require("./crud");

// ─── Countries ────────────────────────────────────────────────────────────────
const countries = [
  "algeria", "argentina", "australia", "belgium", "brazil",
  "canada", "china", "egypt", "ethiopia", "finland",
  "france", "germany", "hong_kong", "india", "indonesia",
  "iran", "iraq", "italy", "japan", "kenya",
  "luxembourg", "mexico", "morocco", "netherlands", "new_zealand",
  "nigeria", "norway", "palestine", "poland", "portugal",
  "qatar", "russia", "saudi_arabia", "south_africa", "south_korea",
  "spain", "sweden", "switzerland", "syria", "taiwan",
  "tunisia", "turkey", "uae", "uk", "ukraine",
  "united_states", "yemen",
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Initialize Firebase using your .env credentials
  await configuration();

  console.log(`🚀  Creating ${countries.length} country collections...\n`);

  for (const country of countries) {
    try {
      // uploadProcessData(data, collectionName, documentId)
      // Each collection needs at least one document to exist in Firestore.
      // We use a fixed documentId "_init" so re-running the script is idempotent.
      await uploadProcessData(
        {
          createdAt: new Date().toISOString(),
          note: "Collection initialised",
        },
        country,    // collection name  → e.g. "algeria"
        "_init"     // document ID      → can be deleted later
      );

      console.log(`✅  ${country}`);
    } catch (err) {
      console.error(`❌  Failed for "${country}":`, err.message);
    }
  }

  console.log("\n🎉  All collections created!");
  process.exit(0);
}

main();