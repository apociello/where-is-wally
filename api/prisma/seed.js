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
    slug: 'hollywood',
    name: 'Hollywood',
    imageUrl: '/maps/hollywood.jpg',
    width: 3000,
    height: 1935,
    placements: {
      Wally: { xMin: 2092, yMin: 816, xMax: 2118, yMax: 868 },
      Wenda: { xMin: 1762, yMin: 1287, xMax: 1782, yMax: 1311 },
      Wizard: { xMin: 2057, yMin: 1287, xMax: 2086, yMax: 1339 },
      Odlaw: { xMin: 1652, yMin: 1525, xMax: 1672, yMax: 1562 },
      Woof: { xMin: 2540, yMin: 1247, xMax: 2563, yMax: 1270 },
    },
  },
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
  {
    slug: 'beach',
    name: 'Beach',
    imageUrl: '/maps/beach.jpg',
    width: 3000,
    height: 1926,
    placements: {
      Wally: { xMin: 1843, yMin: 709, xMax: 1866, yMax: 787 },
      Wenda: { xMin: 2303, yMin: 770, xMax: 2329, yMax: 807 },
      Wizard: { xMin: 798, yMin: 662, xMax: 824, yMax: 729 },
      Odlaw: { xMin: 312, yMin: 671, xMax: 324, yMax: 741 },
      Woof: { xMin: 2031, yMin: 715, xMax: 2048, yMax: 726 },
    },
  },
  {
    slug: 'space',
    name: 'Space',
    imageUrl: '/maps/space.jpg',
    width: 2560,
    height: 1685,
    placements: {
      Wally: { xMin: 1025, yMin: 1039, xMax: 1039, yMax: 1084 },
      Wenda: { xMin: 745, yMin: 859, xMax: 759, yMax: 900 },
      Wizard: { xMin: 1990, yMin: 960, xMax: 2006, yMax: 1000 },
      Odlaw: { xMin: 166, yMin: 1149, xMax: 192, yMax: 1187 },
      Woof: { xMin: 1494, yMin: 1525, xMax: 1513, yMax: 1532 },
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

  // Maps removed from this file are removed from the database too (with their placements and games)
  await prisma.map.deleteMany({
    where: { slug: { notIn: maps.map((map) => map.slug) } },
  });

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
