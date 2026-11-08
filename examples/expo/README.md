# GradFlow Expo example

An assistant screen built with `gradflow-expo`. The gradient is the status light: a glow along the bottom while idle (`gemini` preset), and light running around the edges while it listens or thinks (`halo` preset). Switching presets blends one shader into the other.

## Run it

```bash
cd examples/expo
npm install
npm start        # builds packages/expo first, then starts Expo
```

Open it in Expo Go, or press `w` for the web.

The app links `gradflow-expo` from `../../packages/expo`; `metro.config.js` watches that folder and resolves React from this app so there is only one copy.
