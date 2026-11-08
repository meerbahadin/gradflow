import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { GradFlow, type PresetName } from 'gradflow-expo'

type Phase = 'idle' | 'listening' | 'thinking' | 'answering'
type Message = { id: number; role: 'user' | 'assistant'; text: string }

// the gradient tells the user what the assistant is doing:
// a glow at the bottom while idle, light around the edges while it works
const PHASE_PRESET: Record<Phase, PresetName> = {
  idle: 'gemini',
  listening: 'halo',
  thinking: 'halo',
  answering: 'gemini',
}

const SUGGESTIONS = [
  'Explain how a shader draws a gradient',
  'Plan a weekend in the mountains',
  'Name my new coffee shop',
  'Write a short poem about light',
]

const REPLIES: Record<string, string> = {
  [SUGGESTIONS[0]]:
    'A fragment shader runs once for every pixel. GradFlow hands it the pixel position, the time and three colors, and the shader mixes those colors with a bit of math, like sine waves or noise, so each frame comes out slightly different. That is the whole trick: one small program, millions of times a second.',
  [SUGGESTIONS[1]]:
    'Leave Friday after lunch to beat the traffic. Saturday: an early ridge hike while the air is still cold, a long lunch in town, and a sunset viewpoint. Sunday: a slow breakfast, a short lake walk, and home before dark.',
  [SUGGESTIONS[2]]:
    'A few to start with: Slow Pour, Second Cup, Ember & Oat, Corner Light, Half Past. Say a word about the neighborhood and I can tune them.',
  [SUGGESTIONS[3]]:
    'Morning spills over the hills,\nslow as honey, warm as hands.\nThe window keeps a square of it\nlong after the sun has gone.',
}

const fallbackReply = (prompt: string) =>
  `This demo does not call a real model, but here is what the screen does with "${prompt}": the edges light up while it thinks, then the glow settles back to the bottom while the answer streams in.`

function Assistant() {
  const insets = useSafeAreaInsets()
  const [phase, setPhase] = useState<Phase>('idle')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const send = (text: string) => {
    const prompt = text.trim()
    if (!prompt || phase === 'thinking' || phase === 'answering') return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    setDraft('')
    const id = Date.now()
    setMessages((list) => [...list, { id, role: 'user', text: prompt }])
    setPhase('thinking')

    later(() => {
      const reply = REPLIES[prompt] ?? fallbackReply(prompt)
      const answerId = id + 1
      setPhase('answering')
      setMessages((list) => [...list, { id: answerId, role: 'assistant', text: '' }])

      // stream it word by word
      const words = reply.split(/(\s+)/)
      words.forEach((_, i) => {
        later(() => {
          setMessages((list) =>
            list.map((m) => (m.id === answerId ? { ...m, text: words.slice(0, i + 1).join('') } : m))
          )
          if (i === words.length - 1) {
            setPhase('idle')
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
          }
        }, i * 28)
      })
    }, 1800)
  }

  const toggleListening = () => {
    Haptics.selectionAsync().catch(() => {})
    setPhase((p) => (p === 'listening' ? 'idle' : p === 'idle' ? 'listening' : p))
  }

  const empty = messages.length === 0
  const busy = phase === 'thinking' || phase === 'answering'

  return (
    <GradFlow
      preset={PHASE_PRESET[phase]}
      transition={900}
      interactive
      style={StyleSheet.absoluteFill}
    >
      <StatusBar style='light' />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 24 },
            empty && styles.contentEmpty,
          ]}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps='handled'
        >
          {empty ? (
            <View>
              <Text style={styles.hello}>Hello there</Text>
              <Text style={styles.ask}>How can I help today?</Text>
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => send(s)}
                    style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                  >
                    <Text style={styles.chipText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            messages.map((m) =>
              m.role === 'user' ? (
                <View key={m.id} style={styles.userBubble}>
                  <Text style={styles.userText}>{m.text}</Text>
                </View>
              ) : (
                <View key={m.id} style={styles.answer}>
                  <Ionicons name='sparkles' size={18} color='#8ab4f8' style={styles.answerIcon} />
                  <Text style={styles.answerText}>{m.text}</Text>
                </View>
              )
            )
          )}
          {phase === 'thinking' && <Thinking />}
        </ScrollView>

        <View style={[styles.composerWrap, { paddingBottom: insets.bottom + 12 }]}>
          {phase === 'listening' && <Text style={styles.status}>Listening…</Text>}
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => send(draft)}
              placeholder='Ask anything'
              placeholderTextColor='rgba(255,255,255,0.45)'
              style={styles.input}
              returnKeyType='send'
              editable={!busy}
            />
            {draft.trim() ? (
              <Pressable
                onPress={() => send(draft)}
                accessibilityRole='button'
                accessibilityLabel='Send'
                style={({ pressed }) => [styles.send, pressed && styles.pressed]}
              >
                <Ionicons name='arrow-up' size={20} color='#0b0c14' />
              </Pressable>
            ) : (
              <Pressable
                onPress={toggleListening}
                accessibilityRole='button'
                accessibilityLabel={phase === 'listening' ? 'Stop listening' : 'Talk'}
                style={({ pressed }) => [
                  styles.mic,
                  phase === 'listening' && styles.micActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name={phase === 'listening' ? 'stop' : 'mic'} size={20} color='white' />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradFlow>
  )
}

/** A soft pulsing status line while the assistant works. */
function Thinking() {
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [opacity])

  return (
    <Animated.View style={[styles.answer, { opacity }]}>
      <Ionicons name='sparkles' size={18} color='#8ab4f8' style={styles.answerIcon} />
      <Text style={styles.thinking}>Thinking…</Text>
    </Animated.View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Assistant />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 18 },
  contentEmpty: { flexGrow: 1, justifyContent: 'center' },
  hello: {
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: -1,
    color: '#8ab4f8',
  },
  ask: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: '500',
    letterSpacing: -0.8,
    color: 'rgba(255,255,255,0.55)',
  },
  suggestions: { marginTop: 32, gap: 10 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  chipText: { color: 'rgba(255,255,255,0.88)', fontSize: 15 },
  pressed: { opacity: 0.6 },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    borderBottomRightRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  userText: { color: 'white', fontSize: 16, lineHeight: 22 },
  answer: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  answerIcon: { marginTop: 3 },
  answerText: { flex: 1, color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 24 },
  thinking: { color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 24 },
  composerWrap: { paddingHorizontal: 12, paddingTop: 8 },
  status: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 10,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: 'rgba(14,15,24,0.82)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  input: { flex: 1, color: 'white', fontSize: 16, paddingVertical: 10 },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  mic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  micActive: { backgroundColor: '#4285f4' },
})
