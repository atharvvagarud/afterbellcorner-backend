// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri || !dbName) {
  console.warn(
    '⚠️  MONGODB_URI or MONGODB_DB_NAME is not set in .env. ' +
    'Database connection will fail until these are configured.'
  );
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbInstance = null;

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    dbInstance = client.db(dbName);
    console.log(`✅ Connected to MongoDB Atlas database: ${dbName}`);
    return dbInstance;
  } catch (err) {
    console.error('❌ Error connecting to MongoDB Atlas:', err.message);
    throw err;
  }
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialised. Call connectToDatabase() first.');
  }
  return dbInstance;
}

module.exports = {
  connectToDatabase,
  getDb,
};
