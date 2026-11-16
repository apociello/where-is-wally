import { prisma } from '../lib/prisma.js';

export const createGame = async (req, res) => {
  const map = await prisma.map.findUnique({
    where: { slug: req.params.slug },
    select: { id: true },
  });

  if (!map) {
    return res.status(404).json({ error: 'Map not found' });
  }

  // startedAt is set by the server at this moment: the client never sends a time
  const game = await prisma.game.create({ data: { mapId: map.id } });

  res.status(201).json({ gameId: game.id });
};
