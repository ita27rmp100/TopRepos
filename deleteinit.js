// deleteInitDocs.js
const { configuration, deleteDocument } = require("./crud");

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

(async () => {
  await configuration();
  console.log("🗑️  Deleting _init documents...\n");

  for (const country of countries) {
    await deleteDocument(country, "_init");
  }

  console.log("\n✅  Done!");
  process.exit(0);
})();