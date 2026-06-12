import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src', 'assets', 'animations');

const BRAND = [0.176, 0.435, 0.949, 1]; // #2d6ff2
const ERROR = [0.863, 0.149, 0.149, 1]; // #dc2626
const WARNING = [0.851, 0.467, 0.024, 1]; // #d97706
const SUCCESS = [0.086, 0.639, 0.290, 1]; // #16a34a
const WHITE = [1, 1, 1, 1];

function makeLottie({ w = 200, h = 200, fr = 30, ip = 0, op = 60, layers = [] }) {
  return { v: '5.7.4', fr, ip, op, w, h, nm: 'alius', ddd: 0, assets: [], layers };
}

function shapeLayer({ ind, shapes = [], ks = {}, ip = 0, op = 60, st = 0 }) {
  return {
    ddd: 0, ind, ty: 4, nm: `layer_${ind}`, sr: 1,
    ks: {
      o: ks.o || { a: 0, k: 100 },
      r: ks.r || { a: 0, k: 0 },
      p: ks.p || { a: 0, k: [100, 100, 0] },
      a: ks.a || { a: 0, k: [0, 0, 0] },
      s: ks.s || { a: 0, k: [100, 100, 100] },
    },
    ao: 0, shapes, ip, op, st,
  };
}

function ellipse(name, size = [60, 60], pos = [0, 0]) {
  return [
    { ty: 'el', d: 1, s: { a: 0, k: size }, p: { a: 0, k: pos }, nm: name },
  ];
}

function rect(name, size = [60, 60], pos = [0, 0], r = 0) {
  return [
    { ty: 'rc', d: 1, s: { a: 0, k: size }, p: { a: 0, k: pos }, r: { a: 0, k: r }, nm: name },
  ];
}

function fill(color = BRAND, opacity = 100) {
  return { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: opacity }, r: 1, nm: 'fill' };
}

function stroke(color = BRAND, width = 2, opacity = 100) {
  return { ty: 'st', c: { a: 0, k: color }, o: { a: 0, k: opacity }, w: { a: 0, k: width }, lc: 2, lj: 2, nm: 'stroke' };
}

function group(name, items, transform) {
  return {
    ty: 'gr', nm: name, it: [
      ...items,
      transform || { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ],
  };
}

function keyframes(frames) {
  return { a: 1, k: frames };
}

// --- Splash: Logo pulse + brand name fade-in ---
function splash() {
  return makeLottie({
    w: 400, h: 400, fr: 30, ip: 0, op: 90,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [
          group('logo_circle', [
            ...ellipse('circle', [120, 120]),
            fill(BRAND),
          ]),
        ],
        ks: {
          p: { a: 0, k: [200, 180, 0] },
          s: keyframes([
            { t: 0, s: [80, 80, 100], e: [105, 105, 100] },
            { t: 15, s: [105, 105, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100], e: [105, 105, 100] },
            { t: 60, s: [105, 105, 100], e: [100, 100, 100] },
            { t: 75, s: [100, 100, 100], e: [105, 105, 100] },
            { t: 90, s: [105, 105, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [0], e: [100] },
            { t: 20, s: [100] },
          ]),
        },
        op: 90,
      }),
      shapeLayer({
        ind: 2,
        shapes: [
          group('text_bar', [
            ...rect('bar', [80, 6], [0, 0], 3),
            fill(BRAND),
          ]),
        ],
        ks: {
          p: { a: 0, k: [200, 270, 0] },
          o: keyframes([
            { t: 0, s: [0] },
            { t: 30, s: [0], e: [100] },
            { t: 50, s: [100] },
          ]),
          s: keyframes([
            { t: 30, s: [60, 100, 100], e: [100, 100, 100] },
            { t: 50, s: [100, 100, 100] },
          ]),
        },
        op: 90,
      }),
    ],
  });
}

// --- Loading Popup: Rotating particles around logo ---
function loadingPopup() {
  const layers = [];
  // Central logo circle
  layers.push(shapeLayer({
    ind: 1,
    shapes: [group('center', [...ellipse('c', [50, 50]), fill(BRAND)])],
    ks: {
      p: { a: 0, k: [100, 100, 0] },
      s: keyframes([
        { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
        { t: 15, s: [110, 110, 100], e: [95, 95, 100] },
        { t: 30, s: [95, 95, 100], e: [105, 105, 100] },
        { t: 45, s: [105, 105, 100], e: [100, 100, 100] },
        { t: 60, s: [100, 100, 100] },
      ]),
    },
  }));

  // Orbiting dots
  for (let i = 0; i < 3; i++) {
    const angleOffset = i * 120;
    layers.push(shapeLayer({
      ind: 10 + i,
      shapes: [group(`dot_${i}`, [...ellipse(`d${i}`, [8, 8]), fill(BRAND, 70)])],
      ks: {
        p: keyframes(
          Array.from({ length: 7 }, (_, f) => {
            const t = f * 10;
            const angle = (angleOffset + t * 6) * (Math.PI / 180);
            return { t, s: [100 + Math.cos(angle) * 45, 100 + Math.sin(angle) * 45, 0], e: [100 + Math.cos(angle + 0.6) * 45, 100 + Math.sin(angle + 0.6) * 45, 0] };
          })
        ),
      },
    }));
  }
  return makeLottie({ w: 200, h: 200, fr: 30, op: 60, layers });
}

// --- Login Hero: Floating logo with particles ---
function loginHero() {
  return makeLottie({
    w: 400, h: 300, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('glow', [...ellipse('glow', [150, 150]), fill(BRAND, 15)])],
        ks: {
          p: { a: 0, k: [200, 150, 0] },
          o: keyframes([
            { t: 0, s: [10], e: [30] },
            { t: 20, s: [30], e: [10] },
            { t: 40, s: [10], e: [30] },
            { t: 60, s: [30] },
          ]),
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
            { t: 30, s: [120, 120, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('logo', [...ellipse('logo', [80, 80]), fill(BRAND)])],
        ks: {
          p: keyframes([
            { t: 0, s: [200, 155, 0], e: [200, 147, 0] },
            { t: 30, s: [200, 147, 0], e: [200, 155, 0] },
            { t: 60, s: [200, 155, 0] },
          ]),
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [85, 85, 100] },
            { t: 20, s: [85, 85, 100], e: [100, 100, 100] },
            { t: 40, s: [100, 100, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ]),
        },
      }),
      ...[0, 1, 2, 3, 4].map((i) =>
        shapeLayer({
          ind: 10 + i,
          shapes: [group(`p${i}`, [...ellipse(`p${i}`, [4 + (i % 3) * 2, 4 + (i % 3) * 2]), fill(BRAND, 60)])],
          ks: {
            p: keyframes(
              Array.from({ length: 5 }, (_, f) => {
                const t = f * 15;
                const angle = ((i / 5) * 360 + t * 2) * (Math.PI / 180);
                const r = 65 + f * 2;
                return { t, s: [200 + Math.cos(angle) * r, 150 + Math.sin(angle) * r, 0], e: [200 + Math.cos(angle + 0.4) * r, 150 + Math.sin(angle + 0.4) * r, 0] };
              })
            ),
            o: keyframes([
              { t: i * 8, s: [0], e: [80] },
              { t: i * 8 + 10, s: [80], e: [0] },
              { t: i * 8 + 20, s: [0] },
            ]),
          },
        })
      ),
    ],
  });
}

// --- Pull Refresh: Logo stretch and bounce ---
function pullRefresh() {
  return makeLottie({
    w: 100, h: 100, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('logo', [...ellipse('logo', [35, 35]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [50, 50, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [130, 80, 100] },
            { t: 15, s: [130, 80, 100], e: [80, 120, 100] },
            { t: 30, s: [80, 120, 100], e: [110, 95, 100] },
            { t: 45, s: [110, 95, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ]),
          r: keyframes([
            { t: 0, s: [0], e: [0] },
            { t: 15, s: [0], e: [360] },
            { t: 45, s: [360] },
          ]),
        },
      }),
    ],
  });
}

// --- Step Complete: Circle to checkmark ---
function stepComplete() {
  return makeLottie({
    w: 60, h: 60, fr: 30, op: 40,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('ring', [...ellipse('ring', [40, 40]), stroke(BRAND, 2, 30)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          o: keyframes([
            { t: 10, s: [100], e: [0] },
            { t: 20, s: [0] },
          ]),
          s: keyframes([
            { t: 10, s: [100, 100, 100], e: [150, 150, 100] },
            { t: 20, s: [150, 150, 100] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('check', [...ellipse('bg', [30, 30]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          s: keyframes([
            { t: 8, s: [0, 0, 100], e: [120, 120, 100] },
            { t: 16, s: [120, 120, 100], e: [100, 100, 100] },
            { t: 22, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 6, s: [0], e: [100] },
            { t: 10, s: [100] },
          ]),
        },
      }),
    ],
  });
}

// --- Step Active: Pulsing ring ---
function stepActive() {
  return makeLottie({
    w: 60, h: 60, fr: 30, op: 30,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('pulse', [...ellipse('ring', [36, 36]), stroke(BRAND, 2, 50)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [150, 150, 100] },
            { t: 30, s: [150, 150, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [50], e: [0] },
            { t: 30, s: [0] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('dot', [...ellipse('dot', [22, 22]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [115, 115, 100] },
            { t: 15, s: [115, 115, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100] },
          ]),
        },
      }),
    ],
  });
}

// --- Task Launch: Rising then success ---
function taskLaunch() {
  return makeLottie({
    w: 200, h: 200, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('logo', [...ellipse('l', [40, 40]), fill(BRAND)])],
        ks: {
          p: keyframes([
            { t: 0, s: [100, 130, 0], e: [100, 120, 0] },
            { t: 10, s: [100, 120, 0], e: [100, 80, 0] },
            { t: 30, s: [100, 80, 0], e: [100, 40, 0] },
            { t: 45, s: [100, 40, 0], e: [100, 20, 0] },
            { t: 60, s: [100, 20, 0] },
          ]),
          o: keyframes([
            { t: 0, s: [100] },
            { t: 40, s: [100], e: [0] },
            { t: 45, s: [0] },
          ]),
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [90, 90, 100] },
            { t: 10, s: [90, 90, 100] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('success', [...ellipse('bg', [36, 36]), fill(SUCCESS)])],
        ks: {
          p: { a: 0, k: [100, 100, 0] },
          s: keyframes([
            { t: 40, s: [0, 0, 100], e: [120, 120, 100] },
            { t: 52, s: [120, 120, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 38, s: [0], e: [100] },
            { t: 45, s: [100] },
          ]),
        },
      }),
      ...[0, 1, 2].map((i) =>
        shapeLayer({
          ind: 10 + i,
          shapes: [group(`trail_${i}`, [...ellipse(`t${i}`, [4, 4], [(i - 1) * 12, 0]), fill(BRAND, 50)])],
          ks: {
            p: keyframes([
              { t: 10, s: [100 + (i - 1) * 12, 150, 0], e: [100 + (i - 1) * 12, 100, 0] },
              { t: 30, s: [100 + (i - 1) * 12, 100, 0], e: [100 + (i - 1) * 12, 70, 0] },
              { t: 50, s: [100 + (i - 1) * 12, 70, 0] },
            ]),
            o: keyframes([
              { t: 10, s: [0], e: [80] },
              { t: 30, s: [80], e: [0] },
              { t: 50, s: [0] },
            ]),
          },
        })
      ),
    ],
  });
}

// --- SMS Success: Logo morphs to checkmark ---
function smsSuccess() {
  return makeLottie({
    w: 100, h: 100, fr: 30, op: 30,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('ring', [...ellipse('ring', [50, 50]), stroke(BRAND, 2, 60)])],
        ks: {
          p: { a: 0, k: [50, 50, 0] },
          s: keyframes([
            { t: 5, s: [30, 30, 100], e: [200, 200, 100] },
            { t: 25, s: [200, 200, 100] },
          ]),
          o: keyframes([
            { t: 5, s: [60], e: [0] },
            { t: 25, s: [0] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('logo', [...ellipse('l', [30, 30]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [50, 50, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [0, 0, 100] },
            { t: 8, s: [0, 0, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [100], e: [0] },
            { t: 8, s: [0] },
          ]),
        },
      }),
      shapeLayer({
        ind: 3,
        shapes: [group('check', [...ellipse('bg', [34, 34]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [50, 50, 0] },
          s: keyframes([
            { t: 6, s: [0, 0, 100], e: [130, 130, 100] },
            { t: 14, s: [130, 130, 100], e: [100, 100, 100] },
            { t: 20, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 4, s: [0], e: [100] },
            { t: 8, s: [100] },
          ]),
        },
      }),
    ],
  });
}

// --- Empty States: Floating logo with subtle motion ---
function emptyState(size = 80, extraShapes = []) {
  return makeLottie({
    w: 200, h: 200, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [
          group('logo', [
            ...ellipse('body', [size, size]),
            fill(BRAND, 40),
          ]),
          ...extraShapes,
        ],
        ks: {
          p: keyframes([
            { t: 0, s: [100, 102, 0], e: [100, 96, 0] },
            { t: 30, s: [100, 96, 0], e: [100, 102, 0] },
            { t: 60, s: [100, 102, 0] },
          ]),
          o: keyframes([
            { t: 0, s: [40], e: [100] },
            { t: 15, s: [100] },
          ]),
        },
      }),
    ],
  });
}

// --- Error State: Shake + crack ---
function errorState() {
  return makeLottie({
    w: 200, h: 200, fr: 30, op: 30,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('logo', [...ellipse('body', [70, 70]), fill(ERROR)])],
        ks: {
          p: { a: 0, k: [100, 100, 0] },
          r: keyframes([
            { t: 0, s: [0], e: [-5] },
            { t: 3, s: [-5], e: [4] },
            { t: 6, s: [4], e: [-3] },
            { t: 9, s: [-3], e: [2] },
            { t: 12, s: [2], e: [-1] },
            { t: 15, s: [-1], e: [0] },
            { t: 18, s: [0] },
          ]),
          s: keyframes([
            { t: 5, s: [100, 100, 100], e: [95, 95, 100] },
            { t: 10, s: [95, 95, 100], e: [100, 100, 100] },
            { t: 15, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [50], e: [100] },
            { t: 10, s: [100] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('alert', [...ellipse('badge', [20, 20]), fill(ERROR)])],
        ks: {
          p: { a: 0, k: [135, 65, 0] },
          s: keyframes([
            { t: 12, s: [0, 0, 100], e: [120, 120, 100] },
            { t: 20, s: [120, 120, 100], e: [100, 100, 100] },
            { t: 25, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 10, s: [0], e: [100] },
            { t: 15, s: [100] },
          ]),
        },
      }),
    ],
  });
}

// --- Warning State: Pulsing glow ---
function warningState() {
  return makeLottie({
    w: 200, h: 200, fr: 30, op: 30,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('glow', [...ellipse('glow', [100, 100]), fill(WARNING, 15)])],
        ks: {
          p: { a: 0, k: [100, 100, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [130, 130, 100] },
            { t: 15, s: [130, 130, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [10], e: [30] },
            { t: 15, s: [30], e: [10] },
            { t: 30, s: [10] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('logo', [...ellipse('body', [70, 70]), fill(WARNING)])],
        ks: {
          p: { a: 0, k: [100, 100, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [105, 105, 100] },
            { t: 15, s: [105, 105, 100], e: [100, 100, 100] },
            { t: 30, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [50], e: [100] },
            { t: 10, s: [100] },
          ]),
        },
      }),
    ],
  });
}

// --- Running Gear: Spinning logo ---
function runningGear() {
  return makeLottie({
    w: 60, h: 60, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('gear', [...ellipse('g', [24, 24]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          r: keyframes([
            { t: 0, s: [0], e: [360] },
            { t: 60, s: [360] },
          ]),
        },
      }),
    ],
  });
}

// --- Download Progress: Floating with arrow ---
function downloadProgress() {
  return makeLottie({
    w: 120, h: 120, fr: 30, op: 60,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('logo', [...ellipse('l', [35, 35]), fill(BRAND)])],
        ks: {
          p: keyframes([
            { t: 0, s: [60, 62, 0], e: [60, 56, 0] },
            { t: 30, s: [60, 56, 0], e: [60, 62, 0] },
            { t: 60, s: [60, 62, 0] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('arrow', [
          ...rect('shaft', [3, 12], [0, -3]),
          fill(BRAND),
        ])],
        ks: {
          p: keyframes([
            { t: 0, s: [60, 38, 0], e: [60, 50, 0] },
            { t: 15, s: [60, 50, 0] },
          ]),
          o: keyframes([
            { t: 0, s: [0], e: [80] },
            { t: 10, s: [80], e: [0] },
            { t: 15, s: [0] },
          ]),
        },
      }),
    ],
  });
}

// --- Logo Hover: Subtle scale + glow ---
function logoHover() {
  return makeLottie({
    w: 60, h: 60, fr: 30, op: 20,
    layers: [
      shapeLayer({
        ind: 1,
        shapes: [group('glow', [...ellipse('g', [30, 30]), fill(BRAND, 20)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [160, 160, 100] },
            { t: 10, s: [160, 160, 100], e: [100, 100, 100] },
            { t: 20, s: [100, 100, 100] },
          ]),
          o: keyframes([
            { t: 0, s: [0], e: [30] },
            { t: 10, s: [30], e: [0] },
            { t: 20, s: [0] },
          ]),
        },
      }),
      shapeLayer({
        ind: 2,
        shapes: [group('logo', [...ellipse('l', [22, 22]), fill(BRAND)])],
        ks: {
          p: { a: 0, k: [30, 30, 0] },
          s: keyframes([
            { t: 0, s: [100, 100, 100], e: [108, 108, 100] },
            { t: 10, s: [108, 108, 100], e: [100, 100, 100] },
            { t: 20, s: [100, 100, 100] },
          ]),
        },
      }),
    ],
  });
}

// Generate all animations
const animations = {
  'splash': splash,
  'loading-popup': loadingPopup,
  'login-hero': loginHero,
  'pull-refresh': pullRefresh,
  'step-complete': stepComplete,
  'step-active': stepActive,
  'task-launch': taskLaunch,
  'sms-success': smsSuccess,
  'empty-tasks': () => emptyState(70),
  'empty-agents': () => emptyState(70),
  'empty-notifications': () => emptyState(60),
  'empty-logs': () => emptyState(60),
  'error-state': errorState,
  'warning-state': warningState,
  'running-gear': runningGear,
  'download-progress': downloadProgress,
  'logo-hover': logoHover,
};

for (const [name, generator] of Object.entries(animations)) {
  const json = generator();
  const outPath = path.join(outDir, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
}

console.log(`Generated ${Object.keys(animations).length} Lottie animations in ${outDir}`);
