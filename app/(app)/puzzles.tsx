/**
 * puzzles.tsx — Puzzles Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { theme } from '@/design/theme';
import { fontSizes, fontWeights, palette, radii, spacing } from '@/design/tokens';

type PuzzleState = 'solving' | 'correct' | 'incorrect';

const PUZZLE = {
  number: 4821, rating: 1287,
  themes: ['Fork', 'Knight', 'Intermediate'],
  hint: 'Look for a Knight move that attacks two pieces at once.',
  description: 'White to move. Find the move that wins material.',
};

// Minimal 8×8 board — wire to chess.js for real game state
function ChessBoard({ state }: { state: PuzzleState }) {
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = [8,7,6,5,4,3,2,1];
  const overlay = state === 'correct' ? 'rgba(127,204,38,0.15)' : state === 'incorrect' ? 'rgba(214,69,69,0.15)' : null;

  return (
    <View style={b.board}>
      {ranks.map(rank => (
        <View key={rank} style={b.rank}>
          {files.map((file, fi) => (
            <View
              key={file + rank}
              style={[(fi + rank) % 2 === 0 ? b.light : b.dark]}
            />
          ))}
        </View>
      ))}
      {overlay && (
        <View style={[b.overlay, { backgroundColor: overlay }]}>
          <Text style={b.overlayIcon}>{state === 'correct' ? '✓' : '✗'}</Text>
        </View>
      )}
      <View style={b.turnRow}>
        <View style={b.turnDot} />
        <Text style={b.turnText}>White to move</Text>
      </View>
    </View>
  );
}

export default function PuzzlesRoute() {
  const [state,     setState]     = useState<PuzzleState>('solving');
  const [hintShown, setHintShown] = useState(false);
  const [streak,    setStreak]    = useState(5);

  const handleNew = () => { setState('solving'); setHintShown(false); };

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Top Bar ───────────────────────────────── */}
      <View style={s.topBar}>
        <View>
          <Text style={s.puzzleIdLabel}>Puzzle</Text>
          <Text style={s.puzzleIdValue}>#{PUZZLE.number}</Text>
        </View>
        <Text style={s.heading}>Puzzles</Text>
        <View style={s.streak}>
          <Text style={{ fontSize: 16 }}>🔥</Text>
          <Text style={s.streakCount}>{streak}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Board ─────────────────────────────────── */}
        <ChessBoard state={state} />

        {/* ── Result Banner ─────────────────────────── */}
        {state !== 'solving' && (
          <View style={[s.result, state === 'correct' ? s.resultCorrect : s.resultWrong]}>
            <Text style={{ fontSize: 22 }}>{state === 'correct' ? '🎉' : '😕'}</Text>
            <Text style={s.resultText}>
              {state === 'correct' ? 'Brilliant! +10 bonus' : 'Not quite — try the next one!'}
            </Text>
          </View>
        )}

        {/* ── Info Panel ────────────────────────────── */}
        <View style={s.info}>
          <View style={s.infoHeader}>
            <View style={s.ratingBox}>
              <Text style={s.ratingLabel}>Rating</Text>
              <Text style={s.ratingValue}>{PUZZLE.rating}</Text>
            </View>
            <Text style={s.desc}>{PUZZLE.description}</Text>
          </View>

          <View style={s.themes}>
            {PUZZLE.themes.map(t => (
              <View key={t} style={s.theme}><Text style={s.themeText}>{t}</Text></View>
            ))}
          </View>

          {hintShown ? (
            <View style={s.hintBox}>
              <Text style={s.hintLabel}>💡 Hint</Text>
              <Text style={s.hintText}>{PUZZLE.hint}</Text>
            </View>
          ) : (
            <Button onPress={() => setHintShown(true)} variant="secondary">
              💡 Show Hint (−5 pts)
            </Button>
          )}
        </View>

        {/* Dev simulate — remove before launch */}
        {state === 'solving' && (
          <View style={s.devRow}>
            <Button onPress={() => { setState('correct'); setStreak(n => n + 1); }} variant="brand">
              ✓ Simulate Correct
            </Button>
            <Button onPress={() => { setState('incorrect'); setStreak(0); }} variant="secondary">
              ✗ Simulate Wrong
            </Button>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── New Puzzle CTA ────────────────────────── */}
      <View style={s.footer}>
        <Button onPress={handleNew} variant="brand">New Puzzle ›</Button>
      </View>
    </SafeAreaView>
  );
}

// Board styles
const b = StyleSheet.create({
  board: {
    width: '100%', aspectRatio: 1,
    borderRadius: radii.sm, overflow: 'hidden',
    position: 'relative',
  },
  rank:  { flex: 1, flexDirection: 'row' },
  light: { flex: 1, backgroundColor: '#F0D9B5' },
  dark:  { flex: 1, backgroundColor: '#B58863' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  overlayIcon: { fontSize: 72, opacity: 0.7 },
  turnRow:  { position: 'absolute', bottom: spacing.xs, right: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  turnDot:  { width: 10, height: 10, borderRadius: radii.pill, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border },
  turnText: { fontSize: 9, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 1 },
});

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  puzzleIdLabel: { fontSize: 10, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 1 },
  puzzleIdValue: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  heading:       { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  streak: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xxs,
    backgroundColor: `${palette.accentYellow}33`, borderWidth: 1, borderColor: palette.accentYellow,
    borderRadius: radii.pill, paddingVertical: spacing.xxs, paddingHorizontal: spacing.sm,
  },
  streakCount: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },

  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },

  result: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderRadius: radii.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md,
  },
  resultCorrect: { backgroundColor: `${palette.brandGreen}1A`, borderWidth: 1, borderColor: palette.brandGreen },
  resultWrong:   { backgroundColor: palette.errorBackground, borderWidth: 1, borderColor: palette.error },
  resultText:    { flex: 1, fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },

  info: {
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
    padding: spacing.md, gap: spacing.md,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ratingBox: {
    backgroundColor: palette.backgroundSoft, borderRadius: radii.sm,
    padding: spacing.md, alignItems: 'center', minWidth: 64, gap: spacing.xxs,
  },
  ratingLabel: { fontSize: 9, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  ratingValue: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.brandGreen },
  desc:        { flex: 1, fontSize: fontSizes.label, color: palette.ink, lineHeight: 22 },

  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  theme: {
    backgroundColor: `${palette.brandGreen}1A`, paddingVertical: 2, paddingHorizontal: spacing.sm,
    borderRadius: radii.pill, borderWidth: 1, borderColor: `${palette.brandGreen}40`,
  },
  themeText: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen },

  hintBox: {
    backgroundColor: `${palette.accentYellow}22`, borderRadius: radii.sm,
    borderLeftWidth: 3, borderLeftColor: palette.accentYellow,
    padding: spacing.md, gap: spacing.xs,
  },
  hintLabel: { fontSize: 10, fontWeight: fontWeights.bold, color: palette.ink, textTransform: 'uppercase', letterSpacing: 1 },
  hintText:  { fontSize: fontSizes.caption, color: palette.ink, lineHeight: 20 },

  devRow: { gap: spacing.sm },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: palette.border,
  },
});
