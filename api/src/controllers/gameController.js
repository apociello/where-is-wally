import { prisma } from '../lib/prisma.js';
import { TARGET_RADIUS, circleTouchesBox } from '../lib/hitbox.js';

const isFraction = (value) => typeof value === 'number' && value >= 0 && value <= 1;

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

// Body: { characterId, x, y }, with x and y as fractions (0–1) of the image
export const createGuess = async (req, res) => {
  const { characterId, x, y } = req.body ?? {};

  if (!Number.isInteger(characterId) || !isFraction(x) || !isFraction(y)) {
    return res.status(400).json({ error: 'Invalid guess' });
  }

  const game = await prisma.game.findUnique({
    where: { id: req.params.gameId },
    include: { map: true },
  });

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const placement = await prisma.placement.findUnique({
    where: { mapId_characterId: { mapId: game.mapId, characterId } },
  });

  if (!placement) {
    return res.status(400).json({ error: 'Character is not in this map' });
  }

  // From fractions back to pixels of the original image, where the boxes are stored
  const click = { x: x * game.map.width, y: y * game.map.height };

  if (!circleTouchesBox(click, TARGET_RADIUS, placement)) {
    return res.json({ correct: false });
  }

  try {
    await prisma.foundCharacter.create({ data: { gameId: game.id, characterId } });
  } catch (err) {
    // The (gameId, characterId) key already exists
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Character already found' });
    }
    throw err;
  }

  // Only now that it's found does the client learn where the character is
  const marker = {
    x: (placement.xMin + placement.xMax) / 2 / game.map.width,
    y: (placement.yMin + placement.yMax) / 2 / game.map.height,
  };

  res.json({ correct: true, marker });
};
