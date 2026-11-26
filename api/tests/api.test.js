import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

// A small test map (1000 × 1000 px) with two characters whose boxes we know
let wally;
let odlaw;

beforeAll(async () => {
  await prisma.map.deleteMany();
  await prisma.character.deleteMany();

  const map = await prisma.map.create({
    data: { slug: 'test-map', name: 'Test map', imageUrl: '/maps/test.jpg', width: 1000, height: 1000 },
  });
  wally = await prisma.character.create({ data: { name: 'Wally', avatarUrl: '/wally.png' } });
  odlaw = await prisma.character.create({ data: { name: 'Odlaw', avatarUrl: '/odlaw.png' } });

  await prisma.placement.createMany({
    data: [
      { mapId: map.id, characterId: wally.id, xMin: 100, yMin: 100, xMax: 200, yMax: 200 },
      { mapId: map.id, characterId: odlaw.id, xMin: 700, yMin: 700, xMax: 800, yMax: 800 },
    ],
  });
});

// Every test starts with no games (their found characters are deleted with them)
beforeEach(async () => {
  await prisma.game.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const startGame = async () => {
  const res = await request(app).post('/maps/test-map/games');
  return res.body.gameId;
};

// x and y in pixels of the 1000 × 1000 test map, sent as fractions like the client does
const guess = (gameId, characterId, x, y) =>
  request(app)
    .post(`/games/${gameId}/guesses`)
    .send({ characterId, x: x / 1000, y: y / 1000 });

describe('GET /maps/:slug', () => {
  test('never sends where the characters are', async () => {
    const res = await request(app).get('/maps/test-map');

    expect(res.status).toBe(200);
    expect(res.body.characters).toHaveLength(2);
    for (const character of res.body.characters) {
      expect(Object.keys(character).sort()).toEqual(['avatarUrl', 'id', 'name']);
    }
  });
});

describe('POST /games/:gameId/guesses', () => {
  test('a click on the character is correct and returns its marker', async () => {
    const gameId = await startGame();
    const res = await guess(gameId, wally.id, 150, 150);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ correct: true, marker: { x: 0.15, y: 0.15 }, finished: false });
  });

  test('a click far from the character is wrong and reveals nothing', async () => {
    const gameId = await startGame();
    const res = await guess(gameId, wally.id, 500, 500);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ correct: false });
  });

  test('the same character cannot be found twice', async () => {
    const gameId = await startGame();
    await guess(gameId, wally.id, 150, 150);
    const res = await guess(gameId, wally.id, 150, 150);

    expect(res.status).toBe(409);
  });

  test('coordinates outside the image are rejected', async () => {
    const gameId = await startGame();
    const res = await request(app)
      .post(`/games/${gameId}/guesses`)
      .send({ characterId: wally.id, x: 2, y: 0.5 });

    expect(res.status).toBe(400);
  });

  test('finding the last character ends the game with the time measured by the server', async () => {
    const gameId = await startGame();
    await guess(gameId, wally.id, 150, 150);

    // Pretend the game started 30 seconds ago
    await prisma.game.update({
      where: { id: gameId },
      data: { startedAt: new Date(Date.now() - 30_000) },
    });
    const res = await guess(gameId, odlaw.id, 750, 750);

    expect(res.body.finished).toBe(true);
    expect(res.body.durationMs).toBeGreaterThanOrEqual(30_000);
    expect(res.body.durationMs).toBeLessThan(31_000);
  });

  test('no more guesses are accepted once the game is finished', async () => {
    const gameId = await startGame();
    await guess(gameId, wally.id, 150, 150);
    await guess(gameId, odlaw.id, 750, 750);
    const res = await guess(gameId, wally.id, 150, 150);

    expect(res.status).toBe(409);
  });
});

describe('PATCH /games/:gameId (player name)', () => {
  const finishGame = async () => {
    const gameId = await startGame();
    await guess(gameId, wally.id, 150, 150);
    await guess(gameId, odlaw.id, 750, 750);
    return gameId;
  };

  test('a name cannot be saved before the game is finished', async () => {
    const gameId = await startGame();
    const res = await request(app).patch(`/games/${gameId}`).send({ name: 'Asier' });

    expect(res.status).toBe(409);
  });

  test('the name is saved once, and only once', async () => {
    const gameId = await finishGame();

    const first = await request(app).patch(`/games/${gameId}`).send({ name: 'Asier' });
    expect(first.status).toBe(200);

    const second = await request(app).patch(`/games/${gameId}`).send({ name: 'Someone else' });
    expect(second.status).toBe(409);
  });

  test('an empty name is rejected', async () => {
    const gameId = await finishGame();
    const res = await request(app).patch(`/games/${gameId}`).send({ name: '   ' });

    expect(res.status).toBe(400);
  });
});

describe('GET /maps/:slug/leaderboard', () => {
  test('lists only games with a name, fastest first', async () => {
    const map = await prisma.map.findUnique({ where: { slug: 'test-map' } });
    const finishedAt = new Date();
    await prisma.game.createMany({
      data: [
        { mapId: map.id, finishedAt, durationMs: 50_000, playerName: 'Slow' },
        { mapId: map.id, finishedAt, durationMs: 20_000, playerName: 'Fast' },
        { mapId: map.id, finishedAt, durationMs: 10_000, playerName: null },
      ],
    });

    const res = await request(app).get('/maps/test-map/leaderboard');

    expect(res.status).toBe(200);
    expect(res.body.scores).toEqual([
      { playerName: 'Fast', durationMs: 20_000 },
      { playerName: 'Slow', durationMs: 50_000 },
    ]);
  });
});
