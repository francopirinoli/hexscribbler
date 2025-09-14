// PerlinNoise.js - A self-contained, seeded Perlin noise generator.
// Based on the classic implementation.

// Alea PRNG for seeded random numbers
function alea(seed) {
  // --- FIX: Added a hashing function to handle string seeds correctly ---
  if (typeof seed === 'string') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    seed = hash;
  }
  // --- END FIX ---

  let s0 = 0, s1 = 0, s2 = 0, c = 1;
  if (seed == null) seed = +new Date;
  s0 = (seed >>> 0) * 0x9e3779b9;
  s1 = seed * 0x9e3779b9;
  s2 = seed * 0x9e3779b9;
  for (let i = 0; i < 4; i++) {
    s0 = (s0 + 0x9e3779b9) | 0;
    s1 = (s1 + 0x9e3779b9) | 0;
    s2 = (s2 + 0x9e3779b9) | 0;
  }
  let random = function() {
    const t = (s0 + s1 | 0) + s2 | 0;
    s2 = s2 + 1 | 0;
    s0 = s1 ^ s1 >>> 9;
    s1 = s2 + (s2 << 3) | 0;
    s2 = s2 << 21 | s2 >>> 11;
    s1 = s1 + t | 0;
    return (t >>> 0) / 4294967296;
  };
  return random;
}

class Perlin {
    constructor(seed) {
        this.p = new Uint8Array(512);
        const random = alea(seed);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const n = Math.floor((i + 1) * random());
            const q = p[i];
            p[i] = p[n];
            p[n] = q;
        }
        for (let i = 0; i < 256; i++) {
            this.p[i] = this.p[i + 256] = p[i];
        }
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(a, b, t) { return (1 - t) * a + t * b; }
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const p = this.p;
        const A = p[X] + Y, B = p[X + 1] + Y;
        const val = this.lerp(
            this.lerp(this.grad(p[A], x, y), this.grad(p[B], x - 1, y), u),
            this.lerp(this.grad(p[A + 1], x, y - 1), this.grad(p[B + 1], x - 1, y - 1), u),
            v
        );
        return (val + 1) / 2; // Return in [0, 1] range
    }
}

export default Perlin;