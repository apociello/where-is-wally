import { describe, test, expect } from 'vitest';
import { circleTouchesBox } from '../src/lib/hitbox.js';

// A character's box in image pixels, and a circle of radius 50 around each click
const box = { xMin: 100, yMin: 100, xMax: 200, yMax: 200 };
const radius = 50;

describe('circleTouchesBox', () => {
  test('a click inside the box hits', () => {
    expect(circleTouchesBox({ x: 150, y: 150 }, radius, box)).toBe(true);
  });

  test('a click just outside the box still hits if the circle reaches it', () => {
    expect(circleTouchesBox({ x: 240, y: 150 }, radius, box)).toBe(true);
  });

  test('a click exactly one radius away hits (touching the edge counts)', () => {
    expect(circleTouchesBox({ x: 250, y: 150 }, radius, box)).toBe(true);
  });

  test('a click further than one radius away misses', () => {
    expect(circleTouchesBox({ x: 251, y: 150 }, radius, box)).toBe(false);
  });

  test('near a corner, the distance is measured diagonally', () => {
    // 35px right and 35px down from the corner (200, 200): about 49.5px away → hit
    expect(circleTouchesBox({ x: 235, y: 235 }, radius, box)).toBe(true);
    // 36px and 36px: about 50.9px away → miss, even though each axis alone is under 50
    expect(circleTouchesBox({ x: 236, y: 236 }, radius, box)).toBe(false);
  });
});
