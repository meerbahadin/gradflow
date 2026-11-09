/**
 * Six new gradient types written to GradFlow's contract: three colours, speed,
 * scale and grain, a vUv that runs 0..1 with y up, and time that is the
 * integral of speed (so changing speed never makes a pattern jump). They are
 * meant as candidates for new GradFlow types.
 */

export type FlowType = 'core' | 'ember' | 'ink' | 'ripple' | 'bokeh' | 'bloom' | 'drift' | 'current' | 'aura' | 'veil' | 'flute' | 'panes' | 'horizon' | 'mosaic'

export const VERTEX = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const HEADER = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_scale;
uniform float u_noise;
uniform vec2 u_resolution;
// interactive types only: the cursor in uv (y up) and its velocity
uniform vec2 u_pointer;
uniform vec2 u_vel;
uniform vec2 u_trail[12];
uniform float u_presence;
varying vec2 vUv;

float grain(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  const mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
  float f = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    f += a * vnoise(p);
    p = m * p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return f / 0.96875;
}

// y runs -0.5..0.5, x is stretched by the aspect ratio
vec2 centered(vec2 uv) {
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);
  return p;
}
`

// the light behind the fluted glass: a slow two-layer field, pushed aside by the
// cursor's trail, which glows hot at its head
const FLUTE_BEHIND = /* glsl */ `
vec3 behind(vec2 q, float t) {
  // the push: every tail point shoves the field away from itself
  vec2 push = vec2(0.0);
  float light = 0.0;
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    vec2 d = q - centered(u_trail[i]);
    float fade = (1.0 - fi / 12.0);
    float w = exp(-dot(d, d) * (18.0 + fi * 2.0));
    push += d * w * fade * 1.4;
    light += w * fade * fade;
  }
  push *= u_presence;
  light *= u_presence * 0.42;

  vec2 p = q - push;
  float a = fbm(p * 1.1 + vec2(t * 0.04, t * 0.03));
  float b = fbm(p * 1.7 + vec2(4.3, 1.9) - vec2(t * 0.03, -t * 0.04) + a);
  vec3 col = mix(u_color2, u_color1, smoothstep(0.32, 0.78, a));
  col = mix(col, mix(u_color1, u_color3, 0.55), smoothstep(0.5, 0.85, b) * 0.6);

  // the trail itself, hot at the head and cooling along the tail
  col = mix(col, u_color3, clamp(light, 0.0, 1.0) * 0.85);
  col += u_color3 * light * light * 0.4;
  return col;
}
`

const BODIES: Record<Exclude<FlowType, 'drift' | 'current' | 'aura' | 'veil' | 'flute' | 'panes' | 'horizon' | 'mosaic'>, string> = {
  // a lit sphere with weather inside it: two layers of warped noise turn
  // across its face, a fresnel rim in color3, a soft highlight, and a halo
  core: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0;
  float r = length(p);
  float R = 0.74;
  float px = 2.5 / max(u_resolution.y, 1.0);
  float inside = smoothstep(R + px, R - px, r);

  float z = sqrt(max(R * R - r * r, 0.0)) / R;
  vec3 n = normalize(vec3(p / R, z));

  float a = t * 0.45;
  vec2 q = n.xy / (1.0 + n.z) * 1.7 * u_scale;
  q = mat2(cos(a), -sin(a), sin(a), cos(a)) * q;
  float w = fbm(q * 1.4 + vec2(t * 0.25, -t * 0.18));
  float w2 = fbm(q * 2.2 + w * 2.0 - vec2(t * 0.2, t * 0.12));

  vec3 body = mix(u_color1, u_color2, smoothstep(0.3, 0.72, w2));
  body = mix(body, u_color3, smoothstep(0.58, 0.88, w) * 0.75);

  float fres = pow(1.0 - n.z, 2.2);
  vec3 col = body * (0.45 + 0.65 * n.z) + u_color3 * fres * 0.85;
  float spec = pow(max(dot(n, normalize(vec3(-0.45, 0.55, 0.75))), 0.0), 28.0);
  col += spec * 0.55;

  vec3 bg = u_color2 * 0.05;
  float halo = exp(-max(r - R, 0.0) * 7.0) * (1.0 - inside);
  bg += mix(u_color1, u_color3, 0.4) * halo * 0.55;

  return clamp(mix(bg, col, inside), 0.0, 1.0);
}
`,

  // heat rising: banded colour from a hot color3 floor through color1 into a
  // dark color2 sky, the bands licked upward by two layers of noise
  ember: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0 * u_scale;
  float rise = t * 0.55;
  vec2 q = vec2(p.x * 1.2, p.y - rise);
  float n1 = fbm(q * 1.3 + vec2(0.0, -rise * 0.3));
  float n2 = fbm(q * 2.4 + n1 * 1.6 + vec2(3.1, 1.7));
  float h = uv.y + (n2 - 0.5) * 0.6;

  vec3 col = mix(u_color3, u_color1, smoothstep(0.02, 0.45, h));
  col = mix(col, u_color2, smoothstep(0.38, 0.98, h));
  col += u_color3 * pow(n2, 4.0) * 0.7 * (1.0 - uv.y);
  return clamp(col, 0.0, 1.0);
}
`,

  // marbled ink: noise warped twice, read as soft colour fields with thin
  // veins where the field folds over itself
  ink: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 1.6 * u_scale;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.12)), fbm(p + vec2(5.2, 1.3) - t * 0.1));
  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 0.08), fbm(p + 3.5 * q + vec2(8.3, 2.8) - t * 0.07));
  float f = fbm(p + 3.0 * r);

  float vein = 1.0 - abs(2.0 * fract(f * 5.0 + r.x * 2.0) - 1.0);
  vein = pow(vein, 12.0);

  vec3 col = mix(u_color2, u_color1, smoothstep(0.25, 0.8, f));
  col = mix(col, u_color3, smoothstep(0.55, 0.95, length(r)) * 0.8);
  col += vein * 0.22 * u_color3;
  return clamp(col, 0.0, 1.0);
}
`,

  // two wandering drops: rings spread from each and fade with distance, and
  // where crests meet they catch the light in color3
  ripple: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0;
  vec2 s1 = vec2(0.45 * sin(t * 0.21), 0.35 * cos(t * 0.17));
  vec2 s2 = vec2(0.5 * cos(t * 0.15 + 2.0), 0.4 * sin(t * 0.19 + 1.0));
  float k = 20.0 * u_scale;
  float d1 = length(p - s1);
  float d2 = length(p - s2);
  float w1 = sin(d1 * k - t * 3.0) * exp(-d1 * 1.1);
  float w2 = sin(d2 * k - t * 3.0 + 1.3) * exp(-d2 * 1.1);
  float w = (w1 + w2) * 0.6;

  // a soft shading of the surface, plus sharp highlights on the crests
  vec3 col = mix(u_color2, u_color1, smoothstep(-0.9, 0.9, w) * 0.85 + 0.1);
  float crest = smoothstep(0.35, 0.9, w);
  col = mix(col, u_color3, crest * crest * 0.8);
  col *= 1.0 - 0.4 * smoothstep(0.7, 1.8, length(p));
  return clamp(col, 0.0, 1.0);
}
`,

  // out-of-focus lights: three depths of soft discs on a grid, each layer
  // drifting at its own rate, nearer ones larger and softer
  bokeh: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv);
  vec3 col = mix(u_color2 * 0.55, u_color2, uv.y);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float cells = (2.6 + fl * 2.4) * u_scale;
    vec2 g = p * cells + vec2(t * (0.05 + fl * 0.035), -t * (0.07 + fl * 0.05)) + fl * 13.1;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash21(id + fl * 17.0);
    vec2 o = (vec2(hash21(id + 3.1), hash21(id + 7.7)) - 0.5) * 0.3;
    float rad = 0.12 + 0.16 * h;
    float soft = 0.035 + (2.0 - fl) * 0.03;
    float d = length(f - o);
    // real bokeh: a flat disc with a slightly brighter rim
    float disc = smoothstep(rad, rad - soft, d);
    float rim = smoothstep(rad - soft * 2.5, rad - soft, d) * disc;
    vec3 c = mix(u_color1, u_color3, hash21(id + 11.0));
    float a = (disc * 0.7 + rim * 0.5) * step(0.58, h) * (0.2 + 0.22 * (2.0 - fl)) * (0.7 + 0.3 * sin(t * 1.1 + h * 30.0));
    col += c * a;
  }
  return clamp(col, 0.0, 1.0);
}
`,

  // three petal rings turning against each other, each a polar rose with a
  // lit rim, layered over a dark centre-weighted field
  bloom: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0 / max(u_scale, 0.05);
  float r = length(p);
  float a = atan(p.y, p.x);
  vec3 col = u_color2 * (1.0 - 0.5 * smoothstep(0.0, 1.6, r));

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float petals = 5.0 + fi;
    float dir = mod(fi, 2.0) * 2.0 - 1.0;
    float rot = t * (0.16 + fi * 0.07) * dir;
    float shape = (0.62 + 0.24 * cos(petals * (a + rot)) + 0.04 * sin(t * 0.8 + fi * 2.0)) * (1.0 - fi * 0.24);
    float d = r - shape;
    float petal = smoothstep(0.06, -0.3, d);
    float edge = exp(-abs(d) * 26.0);
    vec3 c = i == 0 ? u_color1 : (i == 1 ? mix(u_color1, u_color3, 0.5) : u_color3);
    col = mix(col, c * (0.5 + 0.5 * clamp(1.0 - r / max(shape, 0.01), 0.0, 1.0)), petal * 0.78);
    col += c * edge * 0.22;
  }
  return clamp(col, 0.0, 1.0);
}
`,
}

const MORE: Record<'drift' | 'current' | 'aura' | 'veil' | 'flute' | 'panes' | 'horizon' | 'mosaic', string> = {
  // two slow, low-contrast noise fields laid over each other: a quiet surface
  // for cards, where the colours change mood more than shape
  drift: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 1.2 * u_scale;
  float a = fbm(p * 0.9 + vec2(t * 0.06, -t * 0.04));
  float b = fbm(p * 1.3 + vec2(4.0, 1.0) - vec2(t * 0.05, t * 0.07) + a * 0.8);
  vec3 col = mix(u_color2, u_color1, smoothstep(0.25, 0.85, a));
  col = mix(col, u_color3, smoothstep(0.45, 0.9, b) * 0.7);
  return col;
}
`,

  // light travelling along x: a noise body that streams to the right, with
  // brighter streaks riding the middle of the band. For meters and pipes.
  current: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  float x = uv.x * u_resolution.x / max(u_resolution.y, 1.0);
  float flow = x * 0.6 * u_scale - t * 1.4;
  float n = fbm(vec2(flow, uv.y * 1.5 + t * 0.1));
  float streak = smoothstep(0.55, 0.92, fbm(vec2(flow * 2.2, uv.y * 5.0 + 3.0)));
  float band = exp(-pow((uv.y - 0.5) * 2.6, 2.0));
  vec3 col = mix(u_color2, u_color1, smoothstep(0.2, 0.8, n));
  col += u_color3 * streak * band * 0.9;
  return clamp(col, 0.0, 1.0);
}
`,

  // four lights wandering on their own orbits over a dark base, their edges
  // pushed around by noise so they read as glow, not circles; tone-mapped so
  // where they overlap they bloom instead of clipping
  aura: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0;
  p += 0.35 * vec2(fbm(p * 1.1 + vec2(t * 0.12, 0.0)) - 0.5, fbm(p * 1.1 + vec2(5.2, -t * 0.1)) - 0.5);
  vec3 col = vec3(0.012, 0.012, 0.03) + u_color2 * 0.08;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 c = vec2(sin(t * (0.23 + fi * 0.06) + fi * 1.7), cos(t * (0.19 + fi * 0.05) + fi * 2.3)) * vec2(1.05, 0.6);
    vec2 d = p - c;
    float w = exp(-dot(d, d) * 2.4 * u_scale);
    vec3 k = i == 0 ? u_color1 : (i == 1 ? u_color3 : (i == 2 ? u_color2 : mix(u_color1, u_color3, 0.5)));
    col += k * w * 0.9;
  }
  return 1.0 - exp(-col * 1.6);
}
`,

  // three ribbons of light drifting diagonally over a deep base: each a wide
  // soft glow with a fine bright core, coloured color1 to color3 along its run
  veil: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv) * 2.0;
  vec3 col = u_color2 * (0.75 + 0.25 * uv.y);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float y = 0.34 * sin(p.x * (0.85 + fi * 0.22) * u_scale + t * (0.32 + fi * 0.09) + fi * 2.1)
            + 0.1 * sin(p.x * 2.0 - t * 0.45 + fi * 1.3)
            + (fi - 1.0) * 0.34 - p.x * 0.28;
    float d = p.y - y;
    float glow = exp(-d * d * (7.0 + fi * 5.0));
    float core = exp(-d * d * 160.0);
    vec3 k = mix(u_color1, u_color3, clamp(0.5 + 0.35 * p.x + 0.2 * sin(t * 0.3 + fi * 1.7), 0.0, 1.0));
    col += k * (glow * 0.5 + core * 0.32) * (1.0 - fi * 0.15);
  }
  return 1.0 - exp(-col * 1.5);
}
`,

  // reeded glass over a scene you can touch. Behind the glass is a slow
  // field of colour; the cursor drags a tail of light through it (u_trail,
  // twelve points that chase each other) and pushes the field aside along
  // that path, so the colours bend around where you have been. Each wide rib
  // is a lens that flips and squeezes the slice behind it, with a little
  // colour split at its edges. The glass never moves; only what is behind it.
  flute: /* glsl */ `
${FLUTE_BEHIND}
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv);
  float ribs = 9.0 * u_scale;
  float x = p.x * ribs;
  float f = fract(x) - 0.5;
  float id = floor(x) + 0.5;

  // a cylinder lens: the slice is flipped and squeezed toward the rib centre
  float lens = -sin(f * 3.14159) * 0.7;
  float y = p.y + f * f * 0.04;
  vec3 col;
  col.r = behind(vec2((id + lens * 0.96) / ribs, y), t).r;
  col.g = behind(vec2((id + lens) / ribs, y), t).g;
  col.b = behind(vec2((id + lens * 1.05) / ribs, y), t).b;

  // shading: dark seams between ribs, a broad sheen and a thin bright edge
  float seam = smoothstep(0.36, 0.5, abs(f));
  col *= 1.0 - seam * 0.45;
  col += exp(-pow((f + 0.16) * 6.0, 2.0)) * 0.06;
  col += exp(-pow((f - 0.44) * 30.0, 2.0)) * 0.09;
  col *= 0.92 + 0.08 * uv.y;
  return clamp(col, 0.0, 1.0);
}
`,

  // the same glass and light as flute, but scale is the number of panes:
  // 1 is a single pane across the full width, 20 is twenty equal blinds
  panes: /* glsl */ `
${FLUTE_BEHIND}
// a lamp drifting behind the glass, so every pane has something bright to bend
vec3 lit(vec2 q, float t) {
  vec3 c = behind(q, t);
  vec2 lamp = vec2(0.45 * sin(t * 0.5), 0.2 + 0.08 * sin(t * 0.37 + 1.3));
  vec2 d = q - lamp;
  c += u_color3 * exp(-dot(d, d) * 8.0) * 0.32;
  c += u_color1 * exp(-dot(d, d) * 1.8) * 0.2;
  return c;
}

vec3 shade(vec2 uv, float t) {
  float n = max(u_scale, 1.0);
  float x = uv.x * n;
  float f = fract(x) - 0.5;
  float id = floor(x) + 0.5;
  // pane width in pixels, so seams and edges stay the same size however wide a pane is
  float w = u_resolution.x / n;

  // each pane is a cylinder lens: its slice of the light is flipped and squeezed
  float lens = -sin(f * 3.14159) * 0.7;
  float y = uv.y + f * f * 0.04;
  vec3 col;
  col.r = lit(centered(vec2((id + lens * 0.96) / n, y)), t).r;
  col.g = lit(centered(vec2((id + lens) / n, y)), t).g;
  col.b = lit(centered(vec2((id + lens * 1.05) / n, y)), t).b;

  // a dark seam where panes meet, a broad sheen, a bright right edge and a faint left one
  float edge = (0.5 - abs(f)) * w;
  col *= 1.0 - (1.0 - smoothstep(0.0, 7.0, edge)) * 0.45;
  col += exp(-pow((f + 0.18) * 5.0, 2.0)) * 0.08;
  col += exp(-pow(((0.5 - f) * w - 2.5) / 1.2, 2.0)) * 0.16;
  col += exp(-pow(((0.5 + f) * w - 1.5) / 1.0, 2.0)) * 0.05;
  col *= 0.92 + 0.08 * uv.y;
  return clamp(col, 0.0, 1.0);
}
`,

  // light rising from the bottom edge like a filled chart: a wandering crest
  // with a bright rim and a haze above it, faint rules in the dark above, so
  // anything drawn across the middle of the card stays on a clean dark field.
  // scale sets how high the crest climbs.
  horizon: /* glsl */ `
vec3 shade(vec2 uv, float t) {
  vec2 p = centered(uv);
  float crest = 0.24 * u_scale
    + 0.045 * sin(p.x * 2.2 + t * 0.35)
    + 0.08 * (fbm(vec2(p.x * 1.3 - t * 0.08, t * 0.05)) - 0.5);
  float h = uv.y - crest;

  // the dark above, a touch lighter near the crest
  vec3 col = u_color2 * (0.55 + 0.45 * exp(-max(h, 0.0) * 4.0));

  // faint rules every fifth of the height, one pixel wide, only in the dark
  float d = abs(fract(uv.y * 5.0 + 0.5) - 0.5) / 5.0 * u_resolution.y;
  col += (1.0 - smoothstep(0.0, 1.2, d)) * 0.035 * step(0.04, h);

  // the body: colour below the crest, brightest just under it, deepening toward the edge
  float n = fbm(vec2(p.x * 2.0 + t * 0.05, uv.y * 3.0 - t * 0.12));
  vec3 fill = mix(u_color1, u_color3, smoothstep(0.4, 0.85, n) * 0.45);
  float body = smoothstep(0.01, -0.02, h);
  col = mix(col, fill * (0.35 + 0.45 * exp(h * 6.0)), body);

  // the rim and a haze of light just above it
  col += u_color3 * exp(-h * h * 2600.0) * 0.55;
  col += u_color1 * exp(-max(h, 0.0) * 10.0) * 0.18 * step(0.0, h);
  return clamp(col, 0.0, 1.0);
}
`,

  // a contact sheet: a grid of rounded tiles, each a small mesh gradient in
  // one of ten palettes taken from the library (two soft blobs of colour
  // drifting over a deep base, with a gloss from above). The sheet rests in
  // faint greyscale; around the cursor a soft circle tints the tiles partway,
  // the trail behind it fades out, and only the tile under the cursor is in
  // full colour, with a bright edge,
  // and the sheet fades out toward the left so copy can sit there.
  // scale sets the tile size (72px at 1); the grid starts at the bottom-left.
  mosaic: /* glsl */ `
mat3 palette(float i) {
  if (i < 1.0) return mat3(vec3(0.420, 0.302, 1.000), vec3(1.000, 0.616, 0.714), vec3(0.086, 0.059, 0.227));
  if (i < 2.0) return mat3(vec3(1.000, 0.541, 0.235), vec3(1.000, 0.839, 0.627), vec3(0.227, 0.082, 0.188));
  if (i < 3.0) return mat3(vec3(0.145, 0.647, 0.553), vec3(0.714, 1.000, 0.894), vec3(0.012, 0.125, 0.106));
  if (i < 4.0) return mat3(vec3(0.184, 0.420, 1.000), vec3(0.659, 0.902, 1.000), vec3(0.020, 0.063, 0.180));
  if (i < 5.0) return mat3(vec3(1.000, 0.361, 0.541), vec3(1.000, 0.820, 0.878), vec3(0.165, 0.031, 0.125));
  if (i < 6.0) return mat3(vec3(0.627, 0.588, 1.000), vec3(0.941, 0.722, 1.000), vec3(0.075, 0.059, 0.235));
  if (i < 7.0) return mat3(vec3(0.078, 0.588, 0.745), vec3(0.745, 1.000, 0.898), vec3(0.016, 0.157, 0.314));
  if (i < 8.0) return mat3(vec3(1.000, 0.478, 0.239), vec3(1.000, 0.373, 0.659), vec3(0.165, 0.059, 0.133));
  if (i < 9.0) return mat3(vec3(0.122, 0.682, 0.478), vec3(0.902, 1.000, 0.604), vec3(0.012, 0.102, 0.071));
  return mat3(vec3(1.000, 0.416, 0.169), vec3(0.478, 0.659, 1.000), vec3(0.078, 0.039, 0.165));
}

vec3 shade(vec2 uv, float t) {
  vec2 px = uv * u_resolution;
  float cell = 72.0 * u_scale;
  float inset = 5.0;
  vec2 id = floor(px / cell);
  vec2 local = px - id * cell;
  vec2 f = (local - inset) / (cell - inset * 2.0);
  float h = hash21(id + 3.1);
  float h2 = hash21(id + 17.7);

  // the rounded tile
  vec2 q = abs(local - cell * 0.5) - (cell * 0.5 - inset - 12.0);
  float edge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 12.0;
  float tile = 1.0 - smoothstep(-0.6, 0.6, edge);

  // the tile's mesh gradient: two blobs drifting over a deep base
  mat3 p = palette(floor(h * 10.0));
  vec2 a = vec2(0.2 + 0.4 * h2, 0.15 + 0.35 * h) + 0.14 * vec2(sin(t * 0.4 + h * 6.3), cos(t * 0.33 + h2 * 6.3));
  vec2 b = vec2(0.8 - 0.4 * h, 0.85 - 0.35 * h2) + 0.14 * vec2(cos(t * 0.37 + h2 * 5.1), sin(t * 0.29 + h * 4.7));
  vec3 c = p[2];
  c = mix(c, p[0], exp(-dot(f - a, f - a) * 4.0));
  c = mix(c, p[1], exp(-dot(f - b, f - b) * 6.0) * 0.85);
  c *= 0.82 + 0.28 * f.y;
  c += 0.07 * smoothstep(0.55, 1.0, f.y) * (1.0 - smoothstep(0.0, 0.6, abs(f.x - 0.5)));

  // a soft circle around the cursor, and a trail behind it that fades
  float reveal = 0.0;
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float rad = 170.0 * (1.0 - fi / 18.0);
    float w = 1.0 - smoothstep(rad * 0.3, rad, length(px - u_trail[i] * u_resolution));
    reveal = max(reveal, w * (1.0 - fi / 12.0));
  }
  reveal *= u_presence;

  // the tile under the cursor is the only one in full colour
  vec2 dh = id - floor(u_pointer * u_resolution / cell);
  float hovered = (1.0 - step(0.5, dot(dh, dh))) * u_presence;

  // at rest a faint, low-contrast grey; the circle tints partway; the hovered tile is full colour
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 grey = vec3(smoothstep(0.0, 0.9, lum) * 0.6 + 0.03);
  float colour = max(reveal * 0.45, hovered);
  vec3 tileCol = mix(grey, c, colour);

  // a slow wave keeps the grey alive without drawing the eye
  float wave = 0.5 + 0.5 * sin(id.x * 0.5 - id.y * 0.35 - t * 0.8 + h * 2.5);
  float side = smoothstep(0.15, 0.85, uv.x);
  float rest = (0.2 + 0.08 * wave) * (0.08 + 0.92 * side);
  float lit = max(mix(rest, 0.7, reveal), hovered);

  vec3 col = u_color2;
  col = mix(col, tileCol * lit, tile);
  // a hairline along each tile's edge, brighter in the circle and on the hovered tile
  float rim = 1.0 - smoothstep(0.0, 1.2, abs(edge + 0.6));
  col += rim * (0.03 * lit + 0.04 * reveal + hovered * 0.3);
  return clamp(col, 0.0, 1.0);
}
`,
}

const MAIN = /* glsl */ `
void main() {
  vec3 color = shade(vUv, u_time);
  if (u_noise > 0.001) {
    float g = grain(vUv * 200.0 + u_time * 0.1);
    color *= (1.0 - u_noise * 0.4 + u_noise * g * 0.4);
  }
  gl_FragColor = vec4(color, 1.0);
}
`

export const fragment = (type: FlowType) => HEADER + ({ ...BODIES, ...MORE } as Record<FlowType, string>)[type] + MAIN

/** Each type's GLSL, for showing in the Source panel. */
export const SHADER_SOURCE = { ...BODIES, ...MORE } as Record<FlowType, string>
