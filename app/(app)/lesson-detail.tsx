/**
 * lesson-detail.tsx — Lesson Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { router, useLocalSearchParams } from 'expo-router';
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

const STEPS = [
  {
    id: '1',
    instruction: 'The Knight is the only piece that can jump over other pieces. It moves in an "L" shape: two squares in one direction, then one square perpendicular.',
    tip: 'Knights always land on a different color square than they started on!',
    highlight: 'g1',
  },
  {
    id: '2',
    instruction: 'From e4, the Knight can jump to f6, g5, g3, f2, d2, c3, c5, or d6 — up to 8 squares from the center!',
    tip: 'Center Knights are more powerful — they control more squares.',
    highlight: 'e4',
  },
  {
    id: '3',
    instruction: 'At the edge of the board, the Knight loses options. A Knight on a1 can only reach b3 or c2 — just 2 squares!',
    tip: '"A Knight on the rim is dim."',
    highlight: 'a1',
  },
  {
    id: '4',
    instruction: 'Knights are excellent at creating "forks" — attacking two pieces at once. Because of their L-shape, opponents often miss the threat!',
    tip: 'Look for Knight forks against the King and Rook — a "royal fork".',
  },
];

function ChessBoard({ highlight }: { highlight?: string }) {
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = [8,7,6,5,4,3,2,1];

  return (
    <View style={b.board}>
      {ranks.map(rank => (
        <View key={rank} style={b.rank}>
          {files.map((file, fi) => {
            const sq   = `${file}${rank}`;
            const isHl = sq === (highlight ?? 'g1');
            return (
              <View key={sq} style={[
                b.square,
                (fi + rank) % 2 === 0 ? b.light : b.dark,
                isHl && b.hl,
              ]}>
                {isHl && <Text style={b.piece}>♞</Text>}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function LessonDetailRoute() {
  const { piece = 'knight' } = useLocalSearchParams<{ piece: string }>();
  const [step,      setStep]      = useState(0);
  const [completed, setCompleted] = useState(false);

  const current   = STEPS[step];
  const isLast    = step === STEPS.length - 1;
  const progress  = (step + 1) / STEPS.length;

  const handleNext = () => {
    if (isLast) { setCompleted(true); }
    else        { setStep(n => n + 1); }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Top Bar ───────────────────────────────── */}
      <View style={s.topBar}>
        <Pressable
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={() => router.back()}
          style={s.backBtn}
        >
          <Text style={s.backArrow}>‹</Text>
        </Pressable>
        <View style={s.topCenter}>
          <Text style={s.topLabel}>{(piece as string).charAt(0).toUpperCase() + (piece as string).slice(1)} Lesson</Text>
          <Text style={s.topTitle}>The L-Shape Move</Text>
        </View>
        <View style={s.counter}>
          <Text style={s.counterText}>{step + 1}/{STEPS.length}</Text>
        </View>
      </View>

      {/* ── Progress ──────────────────────────────── */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Board ─────────────────────────────────── */}
        <ChessBoard highlight={current?.highlight} />

        {/* ── Content ───────────────────────────────── */}
        {!completed ? (
          <View style={s.panel}>
            <View style={s.pieceBadge}>
              <Text style={{ fontSize: 24 }}>♞</Text>
              <Text style={s.pieceName}>Knight</Text>
            </View>
            <Text style={s.instruction}>{current.instruction}</Text>
            {current.tip && (
              <View style={s.tip}>
                <Text style={s.tipLabel}>💡 Tip</Text>
                <Text style={s.tipText}>{current.tip}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={s.completion}>
            <Text style={{ fontSize: 64 }}>🏆</Text>
            <Text style={s.completionTitle}>Lesson Complete!</Text>
            <Text style={s.completionBody}>
              You've mastered the basics of the Knight. Keep it up!
            </Text>
            <View style={s.xpBadge}><Text style={s.xpText}>+50 XP</Text></View>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Controls ──────────────────────────────── */}
      <View style={s.footer}>
        {!completed ? (
          <View style={s.controls}>
            <Button
              onPress={() => (step === 0 ? router.back() : setStep(n => n - 1))}
              style={s.backButton}
              variant="secondary"
            >
              {step === 0 ? 'Exit' : '‹ Back'}
            </Button>
            <Button onPress={handleNext} style={s.nextButton} variant="brand">
              {isLast ? 'Finish ✓' : 'Next ›'}
            </Button>
          </View>
        ) : (
          <Button onPress={() => router.back()} variant="primary">
            Next Lesson →
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const b = StyleSheet.create({
  board:  { width: '100%', aspectRatio: 1, borderRadius: radii.sm, overflow: 'hidden' },
  rank:   { flex: 1, flexDirection: 'row' },
  square: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  light:  { backgroundColor: '#F0D9B5' },
  dark:   { backgroundColor: '#B58863' },
  hl:     { backgroundColor: 'rgba(127,204,38,0.45)' },
  piece:  { fontSize: 22 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: radii.pill,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: palette.border,
  },
  backArrow:  { fontSize: fontSizes.heading, color: palette.ink, marginTop: -2 },
  topCenter:  { flex: 1, alignItems: 'center' },
  topLabel:   { fontSize: 10, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 1.2 },
  topTitle:   { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  counter: {
    backgroundColor: palette.ink, paddingVertical: spacing.xxs, paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
  },
  counterText: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.white },

  progressTrack: {
    height: 4, backgroundColor: palette.border, borderRadius: radii.pill, overflow: 'hidden',
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  progressFill: { height: '100%', backgroundColor: palette.brandGreen, borderRadius: radii.pill },

  scroll: { paddingHorizontal: spacing.lg, gap: spacing.lg },

  panel: {
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
    padding: spacing.md, gap: spacing.md,
  },
  pieceBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pieceName:  { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  instruction: { fontSize: fontSizes.body, color: palette.ink, lineHeight: 26 },
  tip: {
    backgroundColor: `${palette.accentYellow}22`, borderRadius: radii.sm,
    borderLeftWidth: 3, borderLeftColor: palette.accentYellow,
    padding: spacing.md, gap: spacing.xs,
  },
  tipLabel: { fontSize: 10, fontWeight: fontWeights.bold, color: palette.ink, textTransform: 'uppercase', letterSpacing: 1.2 },
  tipText:  { fontSize: fontSizes.caption, color: palette.ink, lineHeight: 20 },

  completion: {
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
    padding: spacing.xl, alignItems: 'center', gap: spacing.md,
  },
  completionTitle: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  completionBody:  { fontSize: fontSizes.body, color: palette.gray, textAlign: 'center', lineHeight: 24 },
  xpBadge: {
    backgroundColor: palette.accentYellow, paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg, borderRadius: radii.pill,
  },
  xpText: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: palette.border,
  },
  controls:   { flexDirection: 'row', gap: spacing.sm },
  backButton: { flex: 1 },
  nextButton: { flex: 2 },
});
