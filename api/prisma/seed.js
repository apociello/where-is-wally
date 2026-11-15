import { prisma } from '../src/lib/prisma.js';

const characters = [
  { name: 'Wally', avatarUrl: '/characters/wally.webp' },
  { name: 'Wenda', avatarUrl: '/characters/wenda.webp' },
  { name: 'Wizard', avatarUrl: '/characters/wizard.gif' },
  { name: 'Odlaw', avatarUrl: '/characters/odlaw.webp' },
  { name: 'Woof', avatarUrl: '/characters/woof.webp' },
];

const maps = [
  {
    slug: 'winter',
    name: 'Winter',
    imageUrl: '/maps/winter.jpg',
    width: 2560,
    height: 1623,
    // Boxes in pixels of the original image
    placements: {
      Wally: { xMin: 2173, yMin: 1162, xMax: 2199, yMax: 1239 },
      Wenda: { xMin: 1244, yMin: 658, xMax: 1257, yMax: 701 },
      Wizard: { xMin: 164, yMin: 1205, xMax: 189, yMax: 1252 },
      Odlaw: { xMin: 800, yMin: 1020, xMax: 817, yMax: 1044 },
      Woof: { xMin: 749, yMin: 1153, xMax: 770, yMax: 1166 },
    },
  },
];

async function main() {
  // upsert = create if it doesn't exist, update if it does, so the seed can run many times
  for (const character of characters) {
    await prisma.character.upsert({
      where: { name: character.name },
      update: character,
      create: character,
    });
  }

  for (const { placements, ...mapData } of maps) {
    const map = await prisma.map.upsert({
      where: { slug: mapData.slug },
      update: mapData,
      create: mapData,
    });

    for (const [name, box] of Object.entries(placements)) {
      const character = await prisma.character.findUnique({ where: { name } });

      await prisma.placement.upsert({
        where: { mapId_characterId: { mapId: map.id, characterId: character.id } },
        update: box,
        create: { mapId: map.id, characterId: character.id, ...box },
      });
    }
  }

  console.log('Seed done');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
