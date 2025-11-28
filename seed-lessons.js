require('dotenv').config();
const { connectToDatabase } = require('./db');

async function seedLessons() {
  try {
    const db = await connectToDatabase();
    const lessonsCollection = db.collection('lessons');

    const existingCount = await lessonsCollection.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Lessons collection already has ${existingCount} documents. ` +
        `Clearing and reseeding...`
      );
      await lessonsCollection.deleteMany({});
    } else {
      console.log('Lessons collection is empty. Seeding fresh data...');
    }

    const lessons = [
      {
        id: 1001,
        title: "Maths Booster Session",
        description: "Focused small-group support for core exam skills.",
        price: 20,
        availableInventory: 5,
        rating: 4,
        location: "Room 101",
      },
      {
        id: 1002,
        title: "Science Lab Club",
        description: "Hands-on experiments with safety guidance.",
        price: 25,
        availableInventory: 5,
        rating: 5,
        location: "Lab 2",
      },
      {
        id: 1003,
        title: "Creative Writing Workshop",
        description: "Storycraft, characters, and confidence building.",
        price: 15,
        availableInventory: 5,
        rating: 3,
        location: "Library",
      },
      {
        id: 1004,
        title: "After-School Coding Club",
        description: "Intro to programming with puzzles and games.",
        price: 18,
        availableInventory: 5,
        rating: 4,
        location: "ICT Suite",
      },
      {
        id: 1005,
        title: "Art & Design Studio",
        description: "Painting, sketching and creative techniques.",
        price: 22,
        availableInventory: 5,
        rating: 5,
        location: "Art Room",
      },
      {
        id: 1006,
        title: "History Revision Clinic",
        description: "Key events, timelines and exam tips.",
        price: 17,
        availableInventory: 5,
        rating: 4,
        location: "Room 204",
      },
      {
        id: 1007,
        title: "Geography Field Skills",
        description: "Maps, fieldwork techniques and case studies.",
        price: 19,
        availableInventory: 5,
        rating: 4,
        location: "Geography Room",
      },
      {
        id: 1008,
        title: "English Literature Circle",
        description: "Discussion of key texts and themes.",
        price: 16,
        availableInventory: 5,
        rating: 3,
        location: "Room 110",
      },
      {
        id: 1009,
        title: "Music Practice Session",
        description: "Instrumental practice with guidance.",
        price: 21,
        availableInventory: 5,
        rating: 5,
        location: "Music Room",
      },
      {
        id: 1010,
        title: "Exam Stress Toolkit",
        description: "Study skills, organisation and wellbeing.",
        price: 14,
        availableInventory: 5,
        rating: 4,
        location: "Wellbeing Hub",
      },
    ];

    const result = await lessonsCollection.insertMany(lessons);
    console.log(`✅ Inserted ${result.insertedCount} lessons into the database.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lessons:', err.message);
    process.exit(1);
  }
}

seedLessons();