import { db, users, locations, trainingModules, trainingAssignments } from '../src/db';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

async function seed() {
  // Clear existing data
  await db.execute(sql`DELETE FROM "training_assignments"`);
  await db.execute(sql`DELETE FROM "training_modules"`);
  await db.execute(sql`DELETE FROM "users"`);
  await db.execute(sql`DELETE FROM "locations"`);

  const [location] = await db.insert(locations).values({
    name: 'Demo Kitchen',
    address: '123 Demo St, Demo City'
  }).returning();

  const demoUsers = [
    {
      email: 'manager@example.com',
      name: 'Demo Manager',
      role: 'Manager' as const,
      locationId: location.id,
      passwordHash: hashPassword('password')
    },
    {
      email: 'supervisor@example.com',
      name: 'Demo Supervisor',
      role: 'Supervisor' as const,
      locationId: location.id,
      passwordHash: hashPassword('password')
    },
    {
      email: 'staff@example.com',
      name: 'Demo Staff',
      role: 'Staff' as const,
      locationId: location.id,
      passwordHash: hashPassword('password')
    }
  ];

  const insertedUsers = await db.insert(users).values(demoUsers).returning();
  const managerId = insertedUsers.find(u => u.role === 'Manager')!.id;
  const supervisorId = insertedUsers.find(u => u.role === 'Supervisor')!.id;
  const staffId = insertedUsers.find(u => u.role === 'Staff')!.id;

  const modules = [
    {
      title: 'Food Safety Basics',
      description: 'Essential food safety protocols and HACCP principles for all kitchen staff. Learn proper temperature control, cross-contamination prevention, and hygiene practices.',
      content: {
        sections: [
          { title: 'Introduction to Food Safety', content: 'Food safety is critical in restaurant operations...', type: 'text' },
          { title: 'Temperature Control', content: 'Proper temperature control prevents bacterial growth...', type: 'text' }
        ]
      },
      status: 'active' as const,
      estimatedDuration: 45,
      createdBy: managerId
    },
    {
      title: 'Kitchen Equipment Safety',
      description: 'Proper operation and maintenance of commercial kitchen equipment. Safety protocols for ovens, fryers, and other machinery.',
      content: {
        sections: [
          { title: 'Equipment Overview', content: 'Understanding your kitchen equipment...', type: 'text' }
        ]
      },
      status: 'draft' as const,
      estimatedDuration: 30,
      createdBy: managerId
    },
    {
      title: 'Emergency Procedures',
      description: 'Fire safety, first aid, and emergency response protocols. Know what to do in case of accidents or emergencies.',
      content: {
        sections: [
          { title: 'Fire Safety', content: 'In case of fire, follow these steps...', type: 'text' }
        ]
      },
      status: 'active' as const,
      estimatedDuration: 20,
      createdBy: managerId
    }
  ];

  const insertedModules = await db.insert(trainingModules).values(modules).returning();

  await db.insert(trainingAssignments).values([
    {
      moduleId: insertedModules[0].id,
      assignedTo: supervisorId,
      assignedBy: managerId
    },
    {
      moduleId: insertedModules[0].id,
      assignedTo: staffId,
      assignedBy: managerId
    }
  ]);

  console.log('✅ Database seeded');
}

seed().then(() => process.exit(0)).catch(err => {
  console.error('Seed failed', err);
  process.exit(1);
});
