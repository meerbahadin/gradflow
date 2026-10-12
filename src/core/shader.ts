export const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

export const FRAGMENT_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  // u_time is the integral of speed over time and u_time2 the integral of
  // speed squared, both accumulated on the CPU. Multiplying a clock by the
  // speed in here instead would make the pattern jump whenever speed changes.
  uniform float u_time;
  uniform float u_time2;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_scale;
  uniform int u_type;
  uniform int u_prevType;
  uniform float u_mix;
  uniform float u_noise;
  uniform vec2 u_resolution;
  // xy: pointer in uv space, z: lens strength
  uniform vec3 u_pointer;

  varying vec2 vUv;

  #define PI 3.14159265359


  // @Utility
  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // @Gradient Types
  vec3 linearGradient(vec2 uv, float time) {
    float t = (uv.y * u_scale) + sin(uv.x * PI + time) * 0.1;
    t = clamp(t, 0.0, 1.0);

    return t < 0.5
      ? mix(u_color1, u_color2, t * 2.0)
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 conicGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;

    float angle = atan(pos.y, pos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI);

    float t = fract(normalizedAngle * u_scale + time * 0.3);
    float smoothT = t;

    vec3 color;
    if (smoothT < 0.33) {
      color = mix(u_color1, u_color2, smoothstep(0.0, 0.33, smoothT));
    } else if (smoothT < 0.66) {
      color = mix(u_color2, u_color3, smoothstep(0.33, 0.66, smoothT));
    } else {
      color = mix(u_color3, u_color1, smoothstep(0.66, 1.0, smoothT));
    }

    float dist = length(pos);
    color += sin(dist * 8.0 + time * 1.5) * 0.03;

    return color;
  }

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float advancedNoise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                  mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5 * n;
  }

  vec3 animatedGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 tuv = uv;
    tuv -= 0.5;

    float degree = advancedNoise(vec2(u_time2 * 0.1, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 * u_scale + 180.0));
    tuv.y *= ratio;

    float frequency = 5.0 * u_scale;
    float amplitude = 30.0;
    float speed = u_time2 * 2.0;
    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    vec3 layer1 = mix(u_color1, u_color2, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(u_color2, u_color3, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    vec3 finalComp = mix(layer1, layer2, S(0.05, -0.2, tuv.y));

    return finalComp;
  }

  vec3 waveGradient(vec2 uv, float time) {
    float y = uv.y;

    float wave1 = sin(uv.x * PI * u_scale * 0.8 + u_time2 * 0.5) * 0.1;
    float wave2 = sin(uv.x * PI * u_scale * 0.5 + u_time2 * 0.3) * 0.15;
    float wave3 = sin(uv.x * PI * u_scale * 1.2 + u_time2 * 0.8) * 0.2;

    float flowingY = y + wave1 + wave2 + wave3;
    float pattern = smoothstep(0.0, 1.0, clamp(flowingY, 0.0, 1.0));

    vec3 color;
    if (pattern < 0.33) {
      float t = smoothstep(0.0, 0.33, pattern);
      color = mix(u_color1, u_color2, t);
    } else if (pattern < 0.66) {
      float t = smoothstep(0.33, 0.66, pattern);
      color = mix(u_color2, u_color3, t);
    } else {
      float t = smoothstep(0.66, 1.0, pattern);
      color = mix(u_color3, u_color1, t);
    }

    float variation = sin(uv.x * PI * 2.0 + u_time2) *
                      cos(uv.y * PI * 1.5 + u_time2 * 0.7) * 0.02;
    color += variation;

    return clamp(color, 0.0, 1.0);
  }

  vec3 silkGradient(vec2 uv, float time) {
    vec2 fragCoord = uv * u_resolution;
    vec2 invResolution = 1.0 / u_resolution.xy;
    vec2 centeredUv = (fragCoord * 2.0 - u_resolution.xy) * invResolution;

    centeredUv *= u_scale;

    float dampening = 1.0 / (1.0 + u_scale * 0.1);

    float d = -u_time2 * 0.5;
    float a = 0.0;

    for (float i = 0.0; i < 8.0; ++i) {
        a += cos(i - d - a * centeredUv.x) * dampening;
        d += sin(centeredUv.y * i + a) * dampening;
    }

    d += u_time2 * 0.5;

    vec3 patterns = vec3(
      cos(centeredUv.x * d + a) * 0.5 + 0.5,
      cos(centeredUv.y * a + d) * 0.5 + 0.5,
      cos((centeredUv.x + centeredUv.y) * (d + a) * 0.5) * 0.5 + 0.5
    );

    vec3 color1Mix = mix(u_color1, u_color2, patterns.x);
    vec3 color2Mix = mix(u_color2, u_color3, patterns.y);
    vec3 color3Mix = mix(u_color3, u_color1, patterns.z);

    vec3 finalColor = mix(color1Mix, color2Mix, patterns.z);
    finalColor = mix(finalColor, color3Mix, patterns.x * 0.5);

    vec3 originalPattern = vec3(cos(centeredUv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    originalPattern = cos(originalPattern * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

    return mix(finalColor, originalPattern * finalColor, 0.3);
  }

  vec3 smokeGradient(vec2 uv, float time) {
    float mr = min(u_resolution.x, u_resolution.y);
    vec2 fragCoord = uv * u_resolution;
    vec2 p = (2.0 * fragCoord.xy - u_resolution.xy) / mr;

    p *= u_scale;

    float iTime = u_time2;

    for(int i = 1; i < 10; i++) {
      vec2 newp = p;
      float fi = float(i);
      newp.x += 0.6 / fi * sin(fi * p.y + iTime + 0.3 * fi) + 1.0;
      newp.y += 0.6 / fi * sin(fi * p.x + iTime + 0.3 * (fi + 10.0)) - 1.4;
      p = newp;
    }

    float redPattern = 1.0;
    float greenPattern = 1.0 - sin(p.y);
    float bluePattern = sin(p.x + p.y);

    greenPattern = clamp(greenPattern, 0.0, 1.0);
    bluePattern = bluePattern * 0.5 + 0.5;

    vec3 color;

    vec3 color12 = mix(u_color1, u_color2, greenPattern);

    color = mix(color12, u_color3, bluePattern);

    return clamp(color, 0.0, 1.0);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * advancedNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 meshGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * ratio, uv.y);
    float t = time * 0.6;

    vec2 c1 = vec2((0.3 + 0.25 * sin(t * 0.9)) * ratio, 0.4 + 0.3 * cos(t * 0.7));
    vec2 c2 = vec2((0.7 + 0.25 * cos(t * 0.8)) * ratio, 0.6 + 0.3 * sin(t * 1.1));
    vec2 c3 = vec2((0.5 + 0.3 * sin(t * 0.6 + 2.0)) * ratio, 0.5 + 0.35 * cos(t * 0.9 + 4.0));

    float falloff = 1.5 + u_scale * 2.5;
    float w1 = exp(-falloff * dot(p - c1, p - c1));
    float w2 = exp(-falloff * dot(p - c2, p - c2));
    float w3 = exp(-falloff * dot(p - c3, p - c3));

    // soft base so areas far from every blob stay colored
    float wBase = 0.08;
    vec3 base = mix(u_color1, u_color3, uv.y);

    vec3 color = (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 + base * wBase)
               / (w1 + w2 + w3 + wBase);

    return clamp(color, 0.0, 1.0);
  }

  vec3 auroraGradient(vec2 uv, float time) {
    float t = time * 0.4;

    // curtains: fbm-driven horizontal displacement, stronger near the top
    float curve = fbm(vec2(uv.x * 2.0 * u_scale + t * 0.5, t * 0.3)) - 0.5;
    float y = uv.y + curve * 0.5;

    float band = smoothstep(0.15, 0.55, y) * smoothstep(1.05, 0.6, y);
    float shimmer = fbm(vec2(uv.x * 5.0 * u_scale - t * 0.8, y * 3.0 + t * 0.5));
    float intensity = band * (0.5 + 0.9 * shimmer);

    // color2 is the sky, color1/color3 tint the curtains bottom-to-top
    vec3 sky = mix(u_color2, u_color2 * 0.35, uv.y);
    vec3 curtain = mix(u_color1, u_color3, clamp(y + (shimmer - 0.5) * 0.6, 0.0, 1.0));

    return clamp(sky + curtain * intensity, 0.0, 1.0);
  }

  vec3 stripeGradient(vec2 uv, float time) {
    vec2 p = ((uv * u_resolution * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0) * u_scale;
    float t = time * 0.7, a = 4.0 * p.y - sin(-p.x * 3.0 + p.y - t);
    a = smoothstep(cos(a) * 0.7, sin(a) * 0.7 + 1.0, cos(a - 4.0 * p.y) - sin(a + 3.0 * p.x));

    vec2 warped = (cos(a) * p + sin(a) * vec2(-p.y, p.x)) * 0.5 + 0.5;
    vec3 color = mix(u_color1, u_color2, warped.x);

    color = mix(color, u_color3, warped.y);
    color *= color + 0.6 * sqrt(color);

    return clamp(color, 0.0, 1.0);
  }

  // ---- shared helpers for the newer types ----------------------------------

  #define TAU 6.28318530718

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // each octave is rotated and scaled slightly off 2.0 so the lattice never
  // lines up with itself and shows through as a grid
  float vfbm(vec2 p) {
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

  float vfbm3(vec2 p) {
    const mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
    float f = 0.5 * vnoise(p);
    p = m * p * 2.03 + vec2(1.7, 9.2);
    f += 0.25 * vnoise(p);
    p = m * p * 2.03 + vec2(1.7, 9.2);
    f += 0.125 * vnoise(p);
    return f / 0.875;
  }

  // centered coordinates, y in [-0.5, 0.5], x stretched by the aspect ratio
  vec2 centered(vec2 uv) {
    vec2 p = uv - 0.5;
    p.x *= u_resolution.x / max(u_resolution.y, 1.0);
    return p;
  }

  // @Gradient Types (next)

  // the sun behind a moon: a dark disc with a crisp bright rim and a long soft
  // corona outside it. One side burns brighter, and that side drifts around.
  vec3 eclipseGradient(vec2 uv, float time) {
    vec2 p = centered(uv) * 2.0;
    float t = time * 0.6;

    float r = length(p);
    float a = atan(p.y, p.x);
    float radius = 0.58 / sqrt(max(u_scale, 0.05));

    // whole multiples of the angle only, so the atan seam never shows
    float wobble = 0.007 * sin(a * 3.0 + t * 0.7) + 0.004 * sin(a * 5.0 - t * 0.5);
    float d = r - radius - wobble;
    float away = max(d, 0.0);

    float arc = 0.5 + 0.5 * cos(a - t * 0.35 - 1.2);
    arc *= arc;

    float outside = smoothstep(-0.05, 0.0, d);
    float corona = exp(-away * (6.5 - 4.0 * arc)) * outside;
    float rim = exp(-abs(d) * 46.0);
    float flare = exp(-away * 2.2) * arc * outside;

    vec3 color = u_color2 * (1.0 - 0.45 * smoothstep(0.0, 1.8, r));
    // the disc itself, a shade under the sky around it
    color *= mix(0.4, 1.0, smoothstep(-0.3, 0.02, d));

    color += u_color1 * (corona * (0.5 + 0.5 * arc) + flare * 0.35);
    color += u_color3 * (rim * (0.35 + 0.65 * arc) + corona * corona * arc * 0.55);

    return clamp(color, 0.0, 1.0);
  }

  // light through moving water: an iterated sine warp whose reciprocal length
  // piles up into bright filaments
  vec3 causticsGradient(vec2 uv, float time) {
    vec2 p = centered(uv) * TAU * 0.55 * u_scale - 250.0;
    vec2 i = p;
    float t = time * 0.6;
    float c = 1.0;
    const float inten = 0.005;

    for (int n = 0; n < 5; n++) {
      float tt = t * (1.0 - 3.5 / float(n + 1));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
    }

    c /= 5.0;
    c = 1.17 - pow(c, 1.4);
    float light = pow(abs(c), 8.0);

    vec3 color = mix(u_color2, u_color1, clamp(light * 1.4 + uv.y * 0.3, 0.0, 1.0));
    color = mix(color, u_color3, clamp(light * light * 1.3, 0.0, 1.0));

    return clamp(color, 0.0, 1.0);
  }

  // one layer of stars on a grid: a pinpoint with a soft halo, twinkling
  float starLayer(vec2 p, float cells, float density, float time) {
    vec2 g = p * cells;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float seed = hash21(id);
    vec2 offset = (vec2(hash21(id + 7.0), hash21(id + 3.0)) - 0.5) * 0.4;
    float d = length(f - offset);
    float size = 0.4 + 0.6 * hash21(id + 11.0);
    // the halo has to die out before it reaches the edge of its cell
    float star = size * 0.006 / (d * d + 0.006) * smoothstep(0.3, 0.04, d);
    star *= 0.65 + 0.35 * sin(time * 2.0 + seed * 40.0);
    return star * step(1.0 - density, seed);
  }

  // glowing gas: a twice-warped cloud lit from inside, with thin bright
  // filaments, dark dust lanes across it, and stars behind
  vec3 nebulaGradient(vec2 uv, float time) {
    vec2 c = centered(uv);
    vec2 p = c * (1.8 * u_scale);
    float t = time * 0.5;

    vec2 q = vec2(vfbm3(p + t * 0.04), vfbm3(p + vec2(5.2, 1.3) - t * 0.03));
    vec2 r = vec2(
      vfbm3(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.02),
      vfbm3(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.02)
    );

    float gas = vfbm(p * 0.9 + 2.6 * r);
    float filament = 1.0 - abs(2.0 * vfbm3(p * 1.4 + 2.2 * r + 3.0) - 1.0);
    filament = pow(filament, 5.0);
    float dust = smoothstep(0.45, 0.72, vfbm3(p * 1.1 - 2.0 * q + 4.0));

    // the cloud is a warped band across the frame, not a fill
    float across = dot(p + (q - 0.5) * 1.4, vec2(0.45, 0.89));
    float cloud = exp(-across * across * 1.1);

    float glow = smoothstep(0.25, 0.7, gas) * cloud;
    float core = smoothstep(0.42, 0.74, gas) * cloud;

    // the cores turn to color3 rather than adding it, so it keeps its hue
    vec3 light = mix(u_color1 * glow * 1.15, u_color3 * 1.15, core * core * 0.85)
               + u_color3 * filament * glow * 0.4;
    light *= 1.0 - 0.6 * dust;

    vec3 color = u_color2 * (0.3 + 0.5 * vfbm3(p * 0.7 + 7.0));

    float stars = starLayer(c, 46.0, 0.1, time) + starLayer(c + 3.7, 17.0, 0.05, time * 0.7) * 1.5;
    color += mix(vec3(1.0), u_color3, 0.3) * stars * (1.0 - 0.85 * glow);

    // roll off instead of clipping, so the bright gas glows
    color += 1.0 - exp(-light * 1.5);

    return clamp(color, 0.0, 1.0);
  }

  // shafts of light: 1d noise in angle around an off-screen source
  vec3 raysGradient(vec2 uv, float time) {
    vec2 p = centered(uv);
    float t = time * 0.6;

    vec2 source = vec2(0.18 * sin(t * 0.2), 0.78);
    vec2 d = p - source;
    float angle = atan(d.x, -d.y);
    float dist = length(d);

    float a = angle * (6.0 * u_scale);
    float shaft = vnoise(vec2(a + t * 0.15, t * 0.1)) * 0.6
                + vnoise(vec2(a * 2.3 - t * 0.22, 3.0 + t * 0.07)) * 0.4;
    shaft = pow(shaft, 1.6);

    float falloff = exp(-dist * 1.35) * smoothstep(1.45, 0.2, abs(angle));
    float beam = shaft * falloff * 2.3;

    vec3 color = mix(u_color2 * 0.55, u_color2, uv.y);
    color += u_color1 * beam;
    color += u_color3 * (pow(beam, 2.5) * 0.9 + exp(-dist * 5.0) * 0.6);

    return clamp(color, 0.0, 1.0);
  }

  float topoHeight(vec2 p, float t) {
    return vfbm(p + vec2(t * 0.06, -t * 0.04));
  }

  // contour map: the height field is sampled three times so the lines can be
  // kept one pixel-width wide wherever the slope changes
  vec3 topoGradient(vec2 uv, float time) {
    float zoom = 2.2 * u_scale;
    vec2 p = centered(uv) * zoom;
    float t = time * 0.7;
    const float levels = 10.0;
    const float e = 0.01;

    float h = topoHeight(p, t);
    float hx = topoHeight(p + vec2(e, 0.0), t);
    float hy = topoHeight(p + vec2(0.0, e), t);
    float slope = length(vec2(hx - h, hy - h)) / e;

    float v = h * levels;
    float pixel = zoom / max(u_resolution.y, 1.0);
    float distPx = abs(fract(v) - 0.5) / (slope * levels * pixel + 0.0001);
    float line = 1.0 - smoothstep(0.5, 1.6, distPx);

    vec3 color = mix(u_color2, u_color1, smoothstep(0.25, 0.8, h));
    color = mix(color, u_color3, line * 0.85);

    return clamp(color, 0.0, 1.0);
  }

  vec3 softField(vec2 p, float t) {
    float a = vfbm3(p * 0.9 + vec2(t * 0.08, t * 0.05));
    float b = vfbm3(p * 0.9 + vec2(4.1, 2.7) - vec2(t * 0.06, -t * 0.07));
    vec3 c = mix(u_color1, u_color2, smoothstep(0.3, 0.7, a));
    return mix(c, u_color3, smoothstep(0.42, 0.75, b));
  }

  // fluted glass: every rib is a cylindrical lens that squeezes and flips the
  // soft field behind it
  vec3 glassGradient(vec2 uv, float time) {
    vec2 p = centered(uv) * 2.0;
    float ribs = 9.0 * u_scale;

    float x = p.x * ribs;
    float f = fract(x) - 0.5;
    float bent = (floor(x) + 0.5 + sin(f * PI) * 1.7) / ribs;

    vec3 color = softField(vec2(bent, p.y), time);

    float edge = smoothstep(0.38, 0.5, abs(f));
    float sheen = pow(1.0 - abs(f) * 2.0, 4.0);
    color *= 1.0 - edge * 0.22;
    color += sheen * 0.07;

    return clamp(color, 0.0, 1.0);
  }

  // panes of glass folded over each other. Each pane has one creased edge
  // that catches the light and thins out to nothing behind it; panes screen
  // over one another, so overlaps get brighter instead of darker.
  vec3 foldGradient(vec2 uv, float time) {
    vec2 q = Rot(0.6) * centered(uv) * 2.0 * u_scale;
    float t = time * 0.6;
    float pixel = 2.0 * u_scale / max(u_resolution.y, 1.0);

    vec3 color = mix(u_color2, u_color2 * 0.45, clamp(length(centered(uv)) * 1.3, 0.0, 1.0));

    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float bend = mod(fi, 2.0) * 2.0 - 1.0;

      float crease = (fi - 2.5) * 0.4
                   + 0.26 * sin(q.x * (1.05 + 0.12 * fi) + fi * 1.9 + t * (0.25 + 0.05 * fi))
                   + 0.1 * bend * q.x * q.x;
      float s = q.y - crease;
      float pane = smoothstep(-pixel, pixel, s);
      float back = max(s, 0.0);

      // thick near the crease, clear further in
      float body = exp(-back * 1.7);
      float fresnel = exp(-back * 8.0);
      // the lit edge, and a fainter line just inside it for the glass's thickness
      float rim = exp(-back * 80.0);
      float inner = exp(-pow((back - 0.045) / 0.014, 2.0));
      float bloom = exp(-abs(s) * 20.0);

      vec3 tint = mix(u_color1, u_color3, clamp(fresnel * 0.6 + 0.08 + 0.14 * sin(fi * 2.1 + q.x * 0.8 + t * 0.2), 0.0, 1.0));
      vec3 light = tint * pane * (body * 0.42 + fresnel * 0.4)
                 + u_color3 * (pane * (rim * 0.6 + inner * 0.12) + bloom * 0.1);

      // screen blend
      color += light * (1.0 - color);
    }

    return clamp(color, 0.0, 1.0);
  }

  // rotated dot screen; the dot radius follows a slow noise field
  vec3 halftoneGradient(vec2 uv, float time) {
    vec2 p = centered(uv);
    float cells = 34.0 * u_scale;
    mat2 screen = Rot(0.5236);
    float t = time * 0.8;

    vec2 g = screen * p * cells;
    vec2 id = floor(g) + 0.5;
    vec2 f = g - id;
    // back to the cell center in unrotated space, so a whole dot shares one value
    vec2 cp = (id / cells) * screen;

    float v = vfbm3(cp * 2.4 + vec2(t * 0.12, t * 0.07));
    v = smoothstep(0.2, 0.8, v + 0.22 * sin(cp.x * 2.0 + t * 0.4));
    float tint = vfbm3(cp * 1.3 + vec2(7.0, 2.0) - t * 0.05);

    float radius = sqrt(v) * 0.62;
    float pixel = cells / max(u_resolution.y, 1.0);
    float dotMask = 1.0 - smoothstep(radius - pixel, radius + pixel, length(f));

    vec3 ink = mix(u_color1, u_color3, smoothstep(0.4, 0.65, tint));

    return mix(u_color2, ink, dotMask);
  }

  float prismBand(float x) {
    float w = 0.5 + 0.5 * cos(TAU * x);
    return w * w * w;
  }

  // light split by a prism: one smoothly folded band field read at three
  // nearby phases, one per color. Where the bands overlap the colors add up
  // toward white, and at their edges they fringe apart.
  vec3 prismGradient(vec2 uv, float time) {
    vec2 p = centered(uv) * (1.15 * u_scale);
    float t = time * 0.5;

    // sines rather than noise: the folds stay glassy at any zoom
    vec2 q = p;
    q += 0.38 * vec2(sin(q.y * 1.7 + t * 0.6), cos(q.x * 1.3 - t * 0.5));
    q += 0.22 * vec2(sin(q.y * 3.1 - t * 0.4 + 1.3), cos(q.x * 2.7 + t * 0.3 + 2.1));

    float base = dot(q, vec2(0.75, 0.66)) * 0.85 + t * 0.06;
    float spread = 0.13 + 0.05 * sin(q.x * 1.1 - q.y * 0.7 + t * 0.3);

    vec3 beam = u_color1 * prismBand(base - spread)
              + u_color2 * prismBand(base)
              + u_color3 * prismBand(base + spread);

    // a wider, dimmer second order behind the first
    float far = base * 0.5 + 0.31;
    vec3 ghost = u_color3 * prismBand(far - spread * 1.6)
               + u_color2 * prismBand(far)
               + u_color1 * prismBand(far + spread * 1.6);

    vec3 color = (u_color1 + u_color2 + u_color3) * 0.035;
    color += ghost * 0.22;
    color += beam;

    // roll off instead of clipping, so overlaps glow rather than flatten
    return 1.0 - exp(-color * 1.2);
  }

  // one ridgeline: skewed swells, a long windward slope into a short slip face
  float duneCrest(float x, float seed) {
    float a = x * 1.1 + seed;
    return sin(a + 0.6 * sin(a)) * 0.6
         + sin(x * 2.3 + seed * 1.7) * 0.25
         + (vfbm3(vec2(x * 1.2, seed)) - 0.5) * 0.3;
  }

  // stacked dunes, far to near, each drifting at its own rate. A ridge's faces
  // split into sunlit and shadowed sides, and the split shears down the slope
  // so it reads as an edge running toward the viewer.
  vec3 dunesGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(uv.x * ratio, uv.y);
    float t = time * 0.8;

    // sky: color3 at the horizon rising into color1, with a low sun in the haze
    vec3 haze = mix(u_color3, u_color1, 0.3);
    vec3 color = mix(u_color3, u_color1, smoothstep(0.5, 1.05, uv.y));
    vec2 sun = vec2(ratio * 0.7, 0.74);
    color = mix(color, u_color3, exp(-length(p - sun) * 3.0) * 0.9);

    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float depth = fi / 4.0;
      float seed = fi * 3.3;

      float x = p.x * (0.95 + depth * 0.75) * u_scale + fi * 13.7 + t * (0.03 + depth * 0.09);
      float amp = 0.1 + 0.1 * depth;
      float crest = 0.64 - depth * 0.6 + duneCrest(x, seed) * amp;
      float d = crest - p.y;
      float below = smoothstep(-0.003, 0.003, d);
      float fall = max(d, 0.0);

      // the sun is to the right: faces falling away to the right catch it
      float sx = x + fall * (3.0 - depth * 1.4);
      float slope = duneCrest(sx + 0.04, seed) - duneCrest(sx - 0.04, seed);
      float lit = smoothstep(0.02, -0.02, slope);

      vec3 sunlit = mix(u_color1, u_color3, 0.12 + 0.3 * exp(-fall * 7.0));
      // shadows start as a deeper color1 and only reach color2 up close, so the
      // middle distance never mixes into mud
      vec3 shadow = mix(u_color1 * 0.5, u_color2, depth * depth);
      vec3 layer = mix(shadow, sunlit, lit);

      // a bright rim on the crest, and distance fading the far ridges out
      layer = mix(layer, u_color3, exp(-fall * 60.0) * (0.25 + 0.35 * lit));
      layer = mix(layer, haze, (1.0 - depth) * 0.45);
      color = mix(color, layer, below);
    }

    return clamp(color, 0.0, 1.0);
  }

  // a glow on the horizon: two soft-edged hills, a wide one in color1 and a
  // hot one in color3 beneath it, lit like blurred shapes set to plus-lighter
  vec3 horizonGradient(vec2 uv, float time) {
    float x = uv.x - 0.5;
    float t = time * 0.5;
    float rise = 0.42 * u_scale;

    float body = rise + 0.15 * sin(x * 2.6 + t * 0.5 + 0.7) + 0.04 * sin(x * 5.3 - t * 0.35);
    float hot = rise * 0.32 + 0.1 * sin(x * 2.1 - t * 0.4 + 2.2) + 0.03 * sin(x * 4.7 + t * 0.3);

    // the width of each smoothstep is the blur radius
    float glow = smoothstep(0.34, -0.3, uv.y - body);
    float core = smoothstep(0.26, -0.2, uv.y - hot);
    glow *= glow;
    core *= core;

    vec3 color = mix(u_color2, u_color2 * 0.6, uv.y);
    color = mix(color, u_color1, glow);
    color += u_color1 * glow * core * 0.35;
    color += u_color3 * core;

    return clamp(color, 0.0, 1.0);
  }

  vec3 shade(int type, vec2 uv, float time) {
    if (type == 0) return linearGradient(uv, time);
    if (type == 1) return conicGradient(uv, time);
    if (type == 2) return animatedGradient(uv, time);
    if (type == 3) return waveGradient(uv, time);
    if (type == 4) return silkGradient(uv, time);
    if (type == 5) return smokeGradient(uv, time);
    if (type == 6) return stripeGradient(uv, time);
    if (type == 7) return meshGradient(uv, time);
    if (type == 8) return auroraGradient(uv, time);
    if (type == 9) return eclipseGradient(uv, time);
    if (type == 10) return causticsGradient(uv, time);
    if (type == 11) return nebulaGradient(uv, time);
    if (type == 12) return raysGradient(uv, time);
    if (type == 13) return topoGradient(uv, time);
    if (type == 14) return glassGradient(uv, time);
    if (type == 15) return foldGradient(uv, time);
    if (type == 16) return halftoneGradient(uv, time);
    if (type == 17) return prismGradient(uv, time);
    if (type == 18) return dunesGradient(uv, time);
    if (type == 19) return horizonGradient(uv, time);
    return animatedGradient(uv, time);
  }

  // @Main
  void main() {
    vec2 uv = vUv;
    float time = u_time;

    // pointer lens: pull the sample point toward the pointer so the pattern
    // swells underneath it
    if (u_pointer.z > 0.001) {
      vec2 d = uv - u_pointer.xy;
      d.x *= u_resolution.x / max(u_resolution.y, 1.0);
      float lens = exp(-dot(d, d) * 7.0) * u_pointer.z;
      uv -= (uv - u_pointer.xy) * lens * 0.4;
    }

    vec3 color = shade(u_type, uv, time);

    // while a type change is in flight the old pattern dissolves into the
    // new one along a noise front instead of a flat cross-fade
    if (u_mix < 0.999) {
      vec3 from = shade(u_prevType, uv, time);
      float front = vfbm3(centered(uv) * 2.5 + 3.0);
      float k = smoothstep(0.0, 1.0, clamp(u_mix * 1.7 - front * 0.7, 0.0, 1.0));
      color = mix(from, color, k);
    }

    if (u_noise > 0.001) {
      float grain = noise(vUv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`
