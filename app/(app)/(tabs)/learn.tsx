/**
 * learn.tsx — Lessons Selection Screen
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

type PieceId = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

const PIECES = [
  { id: 'king'   as PieceId, name: 'King',   emoji: '♔', done: 3, total: 3 },
  { id: 'queen'  as PieceId, name: 'Queen',  emoji: '♕', done: 2, total: 4 },
  { id: 'rook'   as PieceId, name: 'Rook',   emoji: '♖', done: 0, total: 3 },
  { id: 'bishop' as PieceId, name: 'Bishop', emoji: '♗', done: 0, total: 3 },
  { id: 'knight' as PieceId, name: 'Knight', emoji: '♘', done: 0, total: 4 },
  { id: 'pawn'   as PieceId, name: 'Pawn',   emoji: '♙', done: 0, total: 5 },
];

const LESSONS: Record<PieceId, { id: string; title: string; duration: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; done: boolean; locked: boolean }[]> = {
  king: [
    { id: 'k1', title: 'The Most Important Piece',  duration: '5 min',  difficulty: 'Beginner',     done: true,  locked: false },
    { id: 'k2', title: 'King Safety & Castling',    duration: '8 min',  difficulty: 'Beginner',     done: true,  locked: false },
    { id: 'k3', title: 'King in the Endgame',       duration: '10 min', difficulty: 'Intermediate', done: true,  locked: false },
  ],
  queen: [
    { id: 'q1', title: 'How the Queen Moves',       duration: '5 min',  difficulty: 'Beginner',     done: true,  locked: false },
    { id: 'q2', title: 'Queen Development',         duration: '7 min',  difficulty: 'Beginner',     done: true,  locked: false },
    { id: 'q3', title: 'Queen vs Minor Pieces',     duration: '10 min', difficulty: 'Intermediate', done: false, locked: false },
    { id: 'q4', title: 'Queen Tactics & Forks',     duration: '12 min', difficulty: 'Intermediate', done: false, locked: true  },
  ],
  rook:   [
    { id: 'r1', title: 'How the Rook Moves',        duration: '5 min',  difficulty: 'Beginner',     done: false, locked: false },
    { id: 'r2', title: 'Open Files & Rooks',        duration: '8 min',  difficulty: 'Beginner',     done: false, locked: true  },
    { id: 'r3', title: 'Rook Endgames',             duration: '12 min', difficulty: 'Advanced',     done: false, locked: true  },
  ],
  bishop: [
    { id: 'b1', title: 'How the Bishop Moves',      duration: '5 min',  difficulty: 'Beginner',     done: false, locked: false },
    { id: 'b2', title: 'Good and Bad Bishops',      duration: '8 min',  difficulty: 'Intermediate', done: false, locked: true  },
    { id: 'b3', title: 'Bishop Pairs',              duration: '10 min', difficulty: 'Intermediate', done: false, locked: true  },
  ],
  knight: [
    { id: 'n1', title: 'The L-Shape Move',          duration: '6 min',  difficulty: 'Beginner',     done: false, locked: false },
    { id: 'n2', title: 'Knight Outposts',           duration: '9 min',  difficulty: 'Intermediate', done: false, locked: true  },
    { id: 'n3', title: 'Knight Forks',              duration: '10 min', difficulty: 'Intermediate', done: false, locked: true  },
    { id: 'n4', title: 'Knight vs Bishop',          duration: '12 min', difficulty: 'Advanced',     done: false, locked: true  },
  ],
  pawn:   [
    { id: 'p1', title: 'How Pawns Move',            duration: '5 min',  difficulty: 'Beginner',     done: false, locked: false },
    { id: 'p2', title: 'Pawn Captures & En Passant',duration: '8 min',  difficulty: 'Beginner',     done: false, locked: true  },
    { id: 'p3', title: 'Pawn Promotion',            duration: '7 min',  difficulty: 'Beginner',     done: false, locked: true  },
    { id: 'p4', title: 'Pawn Structures',           duration: '12 min', difficulty: 'Intermediate', done: false, locked: true  },
    { id: 'p5', title: 'Passed Pawns',              duration: '10 min', difficulty: 'Advanced',     done: false, locked: true  },
  ],
};

const DIFF_COLOR = { Beginner: palette.brandGreen, Intermediate: palette.accentYellow, Advanced: palette.error };

const totalDone  = PIECES.reduce((n, p) => n + p.done, 0);
const totalAll   = PIECES.reduce((n, p) => n + p.total, 0);

export default function LearnRoute() {
  const [piece, setPiece]   = useState<PieceId>('king');
  const [lesson, setLesson] = useState<string | null>(null);

  const currentPiece = PIECES.find(p => p.id === piece)!;
  const lessons = LESSONS[piece];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ──────────────────────────────────── */}
        <View style={s.header}>
          <Text style={s.heading}>Lessons</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${(totalDone / totalAll) * 100}%` as any }]} />
          </View>
          <Text style={s.progressLabel}>{totalDone}/{totalAll} lessons complete</Text>
        </View>

        {/* ── Piece Cards ─────────────────────────────── */}
        <Text style={s.sectionLabel}>Select a piece</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.piecesScroll}>
          {PIECES.map(p => (
            <Pressable
              key={p.id}
              accessibilityLabel={`${p.name} lessons`}
              accessibilityState={{ selected: piece === p.id }}
              onPress={() => { setPiece(p.id); setLesson(null); }}
              style={[s.pieceCard, piece === p.id && s.pieceCardActive]}
            >
              <View style={s.pieceEmoji}><Text style={{ fontSize: 22 }}>{p.emoji}</Text></View>
              <Text style={[s.pieceName, piece === p.id && s.pieceNameActive]}>{p.name}</Text>
              <View style={s.pieceProg}>
                <View style={[s.pieceProgFill, { width: `${(p.done / p.total) * 100}%` as any }]} />
              </View>
              <Text style={s.pieceCount}>{p.done}/{p.total}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Lesson List ─────────────────────────────── */}
        <View style={s.lessonSection}>
          <View style={s.lessonHeader}>
            <Text style={s.sectionLabel}>{currentPiece.name} Lessons</Text>
            <View style={s.doneBadge}>
              <Text style={s.doneBadgeText}>{currentPiece.done}/{currentPiece.total} done</Text>
            </View>
          </View>

          {lessons.map(l => (
            <Pressable
              key={l.id}
              accessibilityLabel={`${l.locked ? 'Locked: ' : ''}${l.title}`}
              accessibilityState={{ selected: lesson === l.id, disabled: l.locked }}
              disabled={l.locked}
              onPress={() => setLesson(l.id)}
              style={[s.lessonRow, lesson === l.id && s.lessonRowActive, l.locked && s.lessonRowLocked]}
            >
              <View style={[s.statusIcon, l.done && s.statusIconDone]}>
                <Text style={{ fontSize: 13 }}>{l.locked ? '🔒' : l.done ? '✓' : '○'}</Text>
              </View>
              <View style={s.lessonInfo}>
                <Text style={[s.lessonTitle, l.locked && s.lessonTitleLocked]}>{l.title}</Text>
                <View style={s.lessonMeta}>
                  <View style={[s.diffBadge, { backgroundColor: DIFF_COLOR[l.difficulty] + '22' }]}>
                    <Text style={[s.diffText, { color: DIFF_COLOR[l.difficulty] }]}>{l.difficulty}</Text>
                  </View>
                  <Text style={s.duration}>⏱ {l.duration}</Text>
                </View>
              </View>
              {!l.locked && <Text style={s.arrow}>›</Text>}
            </Pressable>
          ))}
        </View>

        {/* Bottom spacer for sticky button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Sticky Start Button ─────────────────────── */}
      <View style={s.footer}>
        <Button
          disabled={!lesson}
          onPress={() => lesson && router.push({ pathname: '/lesson-detail', params: { id: lesson, piece } })}
          variant="brand"
        >
          {lesson ? 'Start Lesson →' : 'Select a lesson'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingTop: spacing.lg, paddingBottom: spacing.md },

  header: { paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.lg },
  heading: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: palette.ink },
  progressBar:  { height: 7, backgroundColor: palette.border, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: palette.brandGreen, borderRadius: radii.pill },
  progressLabel: { fontSize: fontSizes.caption, color: palette.gray },

  sectionLabel: {
    fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.muted,
    textTransform: 'uppercase', letterSpacing: 1.2,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  piecesScroll: { paddingHorizontal: spacing.lg, gap: spacing.sm },

  pieceCard: {
    width: 82, backgroundColor: theme.colors.surface,
    borderRadius: radii.lg, borderWidth: 2, borderColor: palette.border,
    padding: spacing.sm, alignItems: 'center', gap: spacing.xs,
  },
  pieceCardActive: { borderColor: palette.brandGreen, backgroundColor: `${palette.brandGreen}1A` },
  pieceEmoji: {
    width: 40, height: 40, borderRadius: radii.pill,
    backgroundColor: palette.backgroundSoft, alignItems: 'center', justifyContent: 'center',
  },
  pieceName:       { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.gray },
  pieceNameActive: { color: palette.brandGreen },
  pieceProg:  { width: '100%', height: 3, backgroundColor: palette.border, borderRadius: radii.pill, overflow: 'hidden' },
  pieceProgFill: { height: '100%', backgroundColor: palette.brandGreen, borderRadius: radii.pill },
  pieceCount: { fontSize: fontSizes.caption, color: palette.muted },

  lessonSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  lessonHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  doneBadge: {
    backgroundColor: `${palette.brandGreen}1A`, paddingVertical: 3, paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
  },
  doneBadgeText: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen },

  lessonRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border, padding: spacing.md,
  },
  lessonRowActive: { borderColor: palette.brandGreen, backgroundColor: `${palette.brandGreen}1A` },
  lessonRowLocked: { opacity: 0.5 },
  statusIcon: {
    width: 30, height: 30, borderRadius: radii.pill,
    backgroundColor: palette.backgroundSoft, alignItems: 'center', justifyContent: 'center',
  },
  statusIconDone: { backgroundColor: `${palette.brandGreen}1A` },
  lessonInfo:  { flex: 1, gap: 3 },
  lessonTitle: { fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: palette.ink },
  lessonTitleLocked: { color: palette.muted },
  lessonMeta:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  diffBadge:   { paddingVertical: 2, paddingHorizontal: spacing.xs, borderRadius: radii.pill },
  diffText:    { fontSize: fontSizes.caption, fontWeight: fontWeights.bold },
  duration:    { fontSize: fontSizes.caption, color: palette.muted },
  arrow:       { fontSize: fontSizes.heading, color: palette.muted },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: theme.colors.background, borderTopWidth: 1, borderTopColor: palette.border,
  },
});
