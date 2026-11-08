# gradflow-expo

Animated WebGL gradients for Expo and React Native. The same 21 shaders and 24 presets as [`gradflow`](https://www.npmjs.com/package/gradflow), drawn with `expo-gl`.

- Runs in Expo Go, development builds and on the web
- Blended transitions when the type, colors or speed change
- Touch interaction: the pattern swells under the finger
- Stops drawing while the app is in the background, while `paused`, or when the user has turned on Reduce Motion

## Installation

```bash
npx expo install gradflow-expo expo-gl
```

## Quick start

```tsx
import { StyleSheet, Text } from 'react-native'
import { GradFlow } from 'gradflow-expo'

export default function Screen() {
  return (
    <GradFlow preset='gemini' style={StyleSheet.absoluteFill}>
      <Text style={{ color: 'white' }}>Your content, on top.</Text>
    </GradFlow>
  )
}
```

`GradFlow` is a view: size it with `style`, and anything you pass as children is drawn on top of the gradient.

## Props

| Prop          | Type                   | Default | Description                                                  |
| ------------- | ---------------------- | ------- | ------------------------------------------------------------ |
| `config`      | `GradientConfigInput`  | —       | Colors, `type`, `speed`, `scale` and `noise`                 |
| `preset`      | `PresetName`           | —       | Built-in preset; `config` values override it                 |
| `transition`  | `number`               | `700`   | Milliseconds a config change takes to blend in; `0` disables |
| `interactive` | `boolean`              | `false` | Swell the pattern under the finger                           |
| `paused`      | `boolean`              | `false` | Freeze on a static frame                                     |
| `style`       | `StyleProp<ViewStyle>` | —       | Style of the view the gradient fills                         |
| `children`    | `ReactNode`            | —       | Content drawn on top                                         |

`config` takes the same shape as the web package. See the [web docs](https://gradflow.meerbahadin.dev/docs) for every type and preset.

## Performance

Each `GradFlow` owns a GL context. Use one for a screen background and a few for cards, rather than one per list row.

## License

MIT
