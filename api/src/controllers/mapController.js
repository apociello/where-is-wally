import { prisma } from '../lib/prisma.js';

export const getMap = async (req, res) => {
  // select picks exactly which fields leave the server: never the placement boxes
  const map = await prisma.map.findUnique({
    where: { slug: req.params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      placements: {
        orderBy: { characterId: 'asc' },
        select: {
          character: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!map) {
    return res.status(404).json({ error: 'Map not found' });
  }

  const { placements, ...mapData } = map;
  res.json({ ...mapData, characters: placements.map((p) => p.character) });
};
