const { MongoClient } = require('mongodb');
require('dotenv').config();

async function runDemo() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecommerceDB');

    console.log('--- 1. Polymorphic Product Query ---');
    const electronics = await db.collection('products').find({ category: 'Electronics' }).toArray();
    console.log(electronics);

    console.log('\n--- 2. Real-Time Aggregation Pipeline (Sales Analytics) ---');
    const salesReport = await db.collection('orders').aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$status', totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 } } }
    ]).toArray();
    console.log(salesReport);

  } catch (error) {
    console.error('Error running demo:', error);
  } finally {
    await client.close();
  }
}

runDemo();