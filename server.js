// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase, getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const now = new Date().toISOString();
    console.log(
      `[${now}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});


// Central error handler (always returns JSON)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Internal server error',
  });
});

// ===== ROUTES =====

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'After Bell Corner backend is running 🎓' });
});

// DB test route to ensure connection is usable
app.get('/db-test', async (req, res) => {
  try {
    const db = getDb();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    res.json({
      ok: true,
      database: process.env.MONGODB_DB_NAME,
      collections: collectionNames,
    });
  } catch (err) {
    console.error('Error in /db-test:', err.message);
    res.status(500).json({ ok: false, error: 'Database not initialised' });
  }
});

// Get all lessons
app.get('/lessons', async (req, res) => {
  try {
    const db = getDb();
    const lessons = await db
      .collection('lessons')
      .find({})
      .toArray();

    res.json(lessons);
  } catch (err) {
    console.error('Error in GET /lessons:', err.message);
    res.status(500).json({ error: 'Failed to fetch lessons from database' });
  }
});

// Create an order
app.post('/orders', async (req, res) => {
  try {
    const db = getDb();
    const ordersCollection = db.collection('orders');

    const { name, phone, items } = req.body;

    // ===== Validation =====
    if (!name || typeof name !== "string" || !/^[A-Za-z]+$/.test(name)) {
      return res.status(400).json({ error: "Name is required and must contain only letters." });
    }

    if (!phone || typeof phone !== "string" || !/^[0-9]+$/.test(phone)) {
      return res.status(400).json({ error: "Phone is required and must be numbers only." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items must be a non-empty array." });
    }

    for (const item of items) {
      if (!item.id || typeof item.id !== "number") {
        return res.status(400).json({ error: "Each cart item must have a valid numeric id." });
      }
      if (!item.qty || typeof item.qty !== "number") {
        return res.status(400).json({ error: "Each cart item must include a quantity." });
      }
    }

    // ===== Insert Order =====
    const newOrder = {
      name,
      phone,
      items,
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);

    res.json({
      ok: true,
      message: "Order placed successfully",
      orderId: result.insertedId,
    });

  } catch (err) {
    console.error("Error in POST /orders:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update lesson spaces by id
app.put('/lessons/:id', async (req, res) => {
  try {
    const db = getDb();
    const lessonsCollection = db.collection('lessons');

    const id = parseInt(req.params.id, 10);
    const { availableInventory } = req.body;

    // Validate id
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Lesson id in URL must be a valid number." });
    }

    // Validate availableInventory
    if (
      typeof availableInventory !== "number" ||
      !Number.isInteger(availableInventory) ||
      availableInventory < 0
    ) {
      return res.status(400).json({
        error: "availableInventory must be a non-negative integer.",
      });
    }

    const result = await lessonsCollection.updateOne(
      { id: id },
      { $set: { availableInventory } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: `No lesson found with id ${id}` });
    }

    res.json({
      ok: true,
      message: "Lesson spaces updated successfully",
      updatedCount: result.modifiedCount,
    });

  } catch (err) {
    console.error("Error in PUT /lessons/:id:", err.message);
    res.status(500).json({ error: "Failed to update lesson spaces" });
  }
});


// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// ===== START SERVER =====

async function startServer() {
  try {
  
    await connectToDatabase();

  
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB error');
    process.exit(1);
  }
}

startServer();
