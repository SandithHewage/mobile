/**
 * play.tsx — Play vs Computer Setup Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { theme } from '@/design/theme';
import { fontSizes, fontWeights, palette, radii, spacing } from '@/design/tokens';

type PieceColor  = 'white' | 'black';
type Difficulty  = 'beginner' | 'easy' | 'medium' | 'hard' | 'master';

const DIFFICULTIES: { id: Difficulty; label: string; emoji: string; desc: string; level: number; color: string }[] = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Learn the basics',   level: 1,  color: palette.brandGreen  },
  { id: 'easy',     label: 'Easy',     emoji: '😊', desc: 'Gentle challenge',   level: 4,  color: palette.brandGreenSoft },
  { id: 'medium',   label: 'Medium',   emoji: '🤔', desc: 'Real thinking',      level: 8,  color: palette.accentYellow   },
  { id: 'hard',     label: 'Hard',     emoji: '😤', desc: 'Strong tactics',     level: 14, color: '#FF8C42'               },
  { id: 'master',   label: 'Master',   emoji: '👑', desc: 'Near-perfect play',  level: 20, color: palette.error           },
];

export default function PlayRoute() {
  const [color,      setColor]      = useState<PieceColor>('white');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');

  const chosen = DIFFICULTIES.find(d => d.id === difficulty)!;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Top Bar ───────────────────────────────────── */}
      <View style={s.topBar}>
        <Text style={s.heading}>Play vs Computer</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Color Picker ──────────────────────────────── */}
        <Text style={s.sectionLabel}>Choose your color</Text>
        <View style={s.colorRow}>
          {(['white', 'black'] as PieceColor[]).map(c => (
            <Pressable
              key={c}
              accessibilityLabel={`Play as ${c}`}
              accessibilityState={{ selected: color === c }}
              onPress={() => setColor(c)}
              style={[
                s.colorCard,
                c === 'black' && s.colorCardBlack,
                color === c && s.colorCardSelected,
              ]}
            >
              {color === c && (
                <View style={[s.checkmark, c === 'white' ? s.checkmarkDark : s.checkmarkLight]}>
                  <Text style={{ fontSize: 10, fontWeight: fontWeights.bold, color: palette.brandGreen }}>✓</Text>
                </View>
              )}
              <Text style={{ fontSize: 38 }}>{c === 'white' ? '♔' : '♚'}</Text>
              <Text style={[s.colorLabel, c === 'black' && s.colorLabelLight]}>
                {c === 'white' ? 'White' : 'Black'}
              </Text>
              <Text style={[s.colorSub, c === 'black' && s.colorSubLight]}>
                {c === 'white' ? 'Moves first' : 'Moves second'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Difficulty Grid ───────────────────────────── */}
        <View style={s.diffSection}>
          <View style={s.diffHeader}>
            <Text style={s.sectionLabel}>Choose difficulty</Text>
            <View style={[s.chosenBadge, { backgroundColor: chosen.color + '22' }]}>
              <Text style={[s.chosenBadgeText, { color: chosen.color }]}>
                {chosen.emoji} {chosen.label}
              </Text>
            </View>
          </View>

          <View style={s.diffGrid}>
            <View style={s.diffRow}>
              {DIFFICULTIES.slice(0, 3).map(d => (
                <Pressable
                  key={d.id}
                  accessibilityLabel={`Difficulty: ${d.label}`}
                  accessibilityState={{ selected: difficulty === d.id }}
                  onPress={() => setDifficulty(d.id)}
                  style={[s.diffCard, difficulty === d.id && s.diffCardActive]}
                >
                  <View style={[s.diffAccent, { backgroundColor: d.color }]} />
                  <Text style={{ fontSize: 22, marginTop: spacing.sm }}>{d.emoji}</Text>
                  <Text style={[s.diffLabel, difficulty === d.id && s.diffLabelActive]}>{d.label}</Text>
                  <Text style={s.diffDesc}>{d.desc}</Text>
                  <View style={s.dots}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View
                        key={i}
                        style={[s.dot, { backgroundColor: i < DIFFICULTIES.indexOf(d) + 1 ? d.color : palette.border }]}
                      />
                    ))}
                  </View>
                </Pressable>
              ))}
            </View>
            <View style={[s.diffRow, { justifyContent: 'center' }]}>
              {DIFFICULTIES.slice(3).map(d => (
                <Pressable
                  key={d.id}
                  accessibilityLabel={`Difficulty: ${d.label}`}
                  accessibilityState={{ selected: difficulty === d.id }}
                  onPress={() => setDifficulty(d.id)}
                  style={[s.diffCard, difficulty === d.id && s.diffCardActive]}
                >
                  <View style={[s.diffAccent, { backgroundColor: d.color }]} />
                  <Text style={{ fontSize: 22, marginTop: spacing.sm }}>{d.emoji}</Text>
                  <Text style={[s.diffLabel, difficulty === d.id && s.diffLabelActive]}>{d.label}</Text>
                  <Text style={s.diffDesc}>{d.desc}</Text>
                  <View style={s.dots}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View
                        key={i}
                        style={[s.dot, { backgroundColor: i < DIFFICULTIES.indexOf(d) + 1 ? d.color : palette.border }]}
                      />
                    ))}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* ── Summary ───────────────────────────────────── */}
        <View style={s.summary}>
          {[
            { label: 'Playing as', value: color === 'white' ? '♔ White' : '♚ Black' },
            { label: 'Difficulty',  value: `${chosen.emoji} ${chosen.label}`           },
            { label: 'Engine',      value: `Lv ${chosen.level}`                        },
          ].map((item, i, arr) => (
            <View key={item.label} style={[s.summaryItem, i < arr.length - 1 && s.summaryBorder]}>
              <Text style={s.summaryLabel}>{item.label}</Text>
              <Text style={s.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Let's Go CTA ──────────────────────────────── */}
      <View style={s.footer}>
        <Button
          onPress={() => router.push({ pathname: '/play-game', params: { color, difficulty } })}
          variant="brand"
        >
          Let's Go! ♟
        </Button>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  heading: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: palette.ink },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.xl },

  sectionLabel: {
    fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.muted,
    textTransform: 'uppercase', letterSpacing: 1.2,
  },

  colorRow:      { flexDirection: 'row', gap: spacing.md },
  colorCard: {
    flex: 1, borderRadius: radii.xl, borderWidth: 2, borderColor: palette.border,
    backgroundColor: '#FAFAFA', padding: spacing.lg,
    alignItems: 'center', gap: spacing.xs, position: 'relative', overflow: 'hidden',
  },
  colorCardBlack:    { backgroundColor: '#2A2A2A', borderColor: '#444' },
  colorCardSelected: { borderColor: palette.brandGreen },
  checkmark: {
    position: 'absolute', top: spacing.xs, right: spacing.xs,
    width: 22, height: 22, borderRadius: radii.pill,
    alignItems: 'center', justifyContent: 'center',
  },
  checkmarkDark:  { backgroundColor: palette.ink },
  checkmarkLight: { backgroundColor: palette.white },
  colorLabel:     { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  colorLabelLight: { color: palette.white },
  colorSub:        { fontSize: fontSizes.caption, color: palette.gray },
  colorSubLight:   { color: 'rgba(255,255,255,0.5)' },

  diffSection: { gap: spacing.md },
  diffHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chosenBadge: { paddingVertical: 3, paddingHorizontal: spacing.sm, borderRadius: radii.pill },
  chosenBadgeText: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold },
  diffGrid:  { gap: spacing.sm },
  diffRow:   { flexDirection: 'row', gap: spacing.sm },
  diffCard: {
    flex: 1, backgroundColor: theme.colors.surface,
    borderRadius: radii.lg, borderWidth: 2, borderColor: palette.border,
    padding: spacing.sm, alignItems: 'center', gap: spacing.xxs,
    overflow: 'hidden', position: 'relative',
  },
  diffCardActive: { borderColor: palette.brandGreen, backgroundColor: `${palette.brandGreen}1A` },
  diffAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
  },
  diffLabel:       { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.ink },
  diffLabelActive: { color: palette.brandGreen },
  diffDesc:  { fontSize: 10, color: palette.muted, textAlign: 'center' },
  dots:      { flexDirection: 'row', gap: 3, marginTop: spacing.xxs },
  dot:       { width: 5, height: 5, borderRadius: radii.pill },

  summary: {
    flexDirection: 'row', backgroundColor: theme.colors.surface,
    borderRadius: radii.sm, borderWidth: 1, borderColor: palette.border,
  },
  summaryItem:   { flex: 1, alignItems: 'center', paddingVertical: spacing.md, gap: 3 },
  summaryBorder: { borderRightWidth: 1, borderRightColor: palette.border },
  summaryLabel:  { fontSize: 10, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  summaryValue:  { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: palette.border,
  },
});
