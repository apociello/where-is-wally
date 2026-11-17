import { prisma } from '../lib/prisma.js';
import { TARGET_RADIUS } from '../lib/hitbox.js';

export const getMap = async (req, res) => {
  // select picks exactly which fields leave the server: never the placement boxes
  const map = await prisma.map.findUnique({
    where: { slug: req.params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      width: true,
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
  res.json({
    ...mapData,
    // The client draws its circle with this, so it matches what the server checks
    targetRadius: TARGET_RADIUS,
    characters: placements.map((p) => p.character),
  });
};
