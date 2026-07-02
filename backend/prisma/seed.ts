import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Technology', slug: 'technology', color: '#7c3aed' },
  { name: 'Design', slug: 'design', color: '#ec4899' },
  { name: 'DevOps', slug: 'devops', color: '#06b6d4' },
  { name: 'AI & ML', slug: 'ai-ml', color: '#f59e0b' },
  { name: 'Web Dev', slug: 'web-dev', color: '#10b981' },
  { name: 'Cloud', slug: 'cloud', color: '#3b82f6' },
];

async function main() {
  console.log('🌱 Seeding categories...');

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, color: category.color },
      create: category,
    });
  }

  console.log(`✅ Seeded ${CATEGORIES.length} categories.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
