const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('ecommerceDB');

    // Clean existing data
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Sample Products (Flexible Schema / Polymorphic)
    await db.collection('products').insertMany([
      { name: 'Wireless Headphones', category: 'Electronics', price: 99.99, specs: { battery: '30h', bluetooth: true }, tags: ['audio', 'sale'] },
      { name: 'Ergonomic Chair', category: 'Furniture', price: 249.99, specs: { material: 'Mesh', adjustable: true }, tags: ['office'] },
      { name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, specs: { switches: 'Blue', rgb: true }, tags: ['gaming'] }
    ]);

    // Sample Orders (Embedded Documents)
    await db.collection('orders').insertMany([
      { customerId: 'CUST-001', items: [{ productId: 'P1', qty: 1, price: 99.99 }], total: 99.99, status: 'completed', createdAt: new Date() },
      { customerId: 'CUST-002', items: [{ productId: 'P2', qty: 2, price: 249.99 }], total: 499.98, status: 'completed', createdAt: new Date() },
      { customerId: 'CUST-001', items: [{ productId: 'P3', qty: 1, price: 129.99 }], total: 129.99, status: 'pending', createdAt: new Date() }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();