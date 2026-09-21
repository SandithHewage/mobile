/**
 * play-game.tsx — Play vs Computer Game Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
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

type GameResult = 'win' | 'lose' | 'draw' | null;

const MOVES = [
  { n: 1, w: 'e4',  b: 'e5'  },
  { n: 2, w: 'Nf3', b: 'Nc6' },
  { n: 3, w: 'Bb5', b: 'a6'  },
  { n: 4, w: 'Ba4', b: 'Nf6' },
  { n: 5, w: 'O-O', b: 'Be7' },
  { n: 6, w: 'Re1', b: 'b5'  },
  { n: 7, w: 'Bb3' },
];

function ChessBoard({ playerColor }: { playerColor: string }) {
  const files = playerColor === 'white' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];
  const ranks = playerColor === 'white' ? [8,7,6,5,4,3,2,1]               : [1,2,3,4,5,6,7,8];

  return (
    <View style={b.board}>
      {ranks.map(rank => (
        <View key={rank} style={b.rank}>
          <View style={b.rankLabel}><Text style={b.labelText}>{rank}</Text></View>
          {files.map((file, fi) => {
            const hl = (file === 'e' && rank === 4) || (file === 'e' && rank === 5);
            return (
              <View key={file + rank} style={[
                b.square,
                (fi + rank) % 2 === 0 ? b.light : b.dark,
                hl && b.hl,
              ]} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function PlayerRow({ label, isActive, time, captured }: {
  label: string; isActive: boolean; time: string; captured?: string;
}) {
  return (
    <View style={[p.row, isActive && p.rowActive]}>
      <View style={p.avatar}><Text style={{ fontSize: 20 }}>{label === 'You' ? '🧑' : '🤖'}</Text></View>
      <View style={p.info}>
        <Text style={p.name}>{label}</Text>
        {captured && <Text style={p.captured}>{captured}</Text>}
      </View>
      <View style={[p.timer, isActive && p.timerActive]}>
        <Text style={[p.timerText, isActive && p.timerTextActive]}>{time}</Text>
      </View>
    </View>
  );
}

function GameOverModal({ result, onNewGame, onExit }: {
  result: GameResult; onNewGame: () => void; onExit: () => void;
}) {
  return (
    <Modal animationType="fade" transparent visible={result !== null}>
      <View style={m.overlay}>
        <View style={m.card}>
          <Text style={{ fontSize: 56 }}>
            {result === 'win' ? '🏆' : result === 'draw' ? '🤝' : '😓'}
          </Text>
          <Text style={m.title}>
            {result === 'win' ? 'You Win!' : result === 'draw' ? 'Draw!' : 'You Lose'}
          </Text>
          <Text style={m.body}>
            {result === 'win'  ? 'Excellent play! You defeated the computer!'
           : result === 'draw' ? 'The game ended in a draw. Good fight!'
           :                     "Don't give up — every loss is a lesson!"}
          </Text>
          <Button onPress={onNewGame} variant="brand">Play Again</Button>
          <Button onPress={onExit}    variant="secondary">Exit</Button>
        </View>
      </View>
    </Modal>
  );
}

export default function PlayGameRoute() {
  const { color = 'white', difficulty = 'Beginner' } = useLocalSearchParams<{ color: string; difficulty: string }>();
  const [tutorOpen,  setTutorOpen]  = useState(true);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const isPlayerTurn = true;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Dark Top Bar ──────────────────────────── */}
      <View style={s.topBar}>
        <Pressable
          accessibilityLabel="Exit game"
          hitSlop={8}
          onPress={() => router.back()}
          style={s.topBackBtn}
        >
          <Text style={s.topBackArrow}>‹</Text>
        </Pressable>
        <Text style={s.topTitle}>vs Computer</Text>
        <View style={s.diffBadge}>
          <Text style={s.diffText}>{difficulty}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Opponent ──────────────────────────────── */}
        <PlayerRow label={`Computer (${difficulty})`} isActive={!isPlayerTurn} time="10:00" />

        {/* ── Board ─────────────────────────────────── */}
        <ChessBoard playerColor={color as string} />

        {/* ── Player ────────────────────────────────── */}
        <PlayerRow label="You" isActive={isPlayerTurn} time="9:42" captured="♙ ♙" />

        {/* ── Tutor Panel ───────────────────────────── */}
        <View style={s.tutor}>
          <Pressable
            onPress={() => setTutorOpen(v => !v)}
            style={s.tutorHeader}
          >
            <View style={s.tutorLeft}>
              <Text style={{ fontSize: 18 }}>🎓</Text>
              <Text style={s.tutorTitle}>Tutor</Text>
              <View style={s.evalBadge}>
                <Text style={s.evalText}>+0.3</Text>
              </View>
            </View>
            <Text style={s.tutorChevron}>{tutorOpen ? '‹' : '›'}</Text>
          </Pressable>
          {tutorOpen && (
            <View style={s.tutorBody}>
              <Text style={s.tutorTip}>
                The Ruy Lopez opening. Consider castling to protect your king before attacking.
              </Text>
            </View>
          )}
        </View>

        {/* ── Move History ──────────────────────────── */}
        <View style={s.movesLabel}>
          <Text style={s.movesLabelText}>Move History</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.moves}>
          {MOVES.map(m => (
            <View key={m.n} style={s.moveGroup}>
              <Text style={s.moveNum}>{m.n}.</Text>
              <View style={s.moveToken}><Text style={s.moveText}>{m.w}</Text></View>
              {m.b && <View style={[s.moveToken, s.moveTokenBlack]}><Text style={[s.moveText, { color: palette.white }]}>{m.b}</Text></View>}
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Controls Footer ───────────────────────── */}
      <View style={s.footer}>
        {[
          { icon: '↩', label: 'Undo',   onPress: () => {},                              style: s.ctrlBtn },
          { icon: '⇅', label: 'Flip',   onPress: () => {},                              style: s.ctrlBtn },
          { icon: '🤝', label: 'Draw',   onPress: () => setGameResult('draw'),           style: s.ctrlBtn },
          { icon: '🏳', label: 'Resign', onPress: () => setGameResult('lose'),           style: [s.ctrlBtn, s.ctrlBtnResign] },
        ].map(item => (
          <Pressable
            key={item.label}
            accessibilityLabel={item.label}
            onPress={item.onPress}
            style={[...(Array.isArray(item.style) ? item.style : [item.style])]}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            <Text style={[s.ctrlLabel, item.label === 'Resign' && s.ctrlLabelResign]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <GameOverModal
        result={gameResult}
        onNewGame={() => { setGameResult(null); router.back(); }}
        onExit={() => { setGameResult(null); router.back(); }}
      />
    </SafeAreaView>
  );
}

const b = StyleSheet.create({
  board:     { width: '100%', aspectRatio: 1, borderRadius: radii.sm, overflow: 'hidden' },
  rank:      { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  rankLabel: { width: 14, alignItems: 'center', justifyContent: 'center' },
  labelText: { fontSize: 8, color: palette.muted, opacity: 0.6, fontWeight: fontWeights.bold },
  square:    { flex: 1 },
  light:     { backgroundColor: '#F0D9B5' },
  dark:      { backgroundColor: '#B58863' },
  hl:        { backgroundColor: 'rgba(127,204,38,0.45)' },
});

const p = StyleSheet.create({
  row:           { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.xs, borderRadius: radii.md },
  rowActive:     { backgroundColor: `${palette.brandGreen}1A` },
  avatar:        { width: 38, height: 38, borderRadius: radii.pill, backgroundColor: palette.backgroundSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.border },
  info:          { flex: 1, gap: 2 },
  name:          { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.ink },
  captured:      { fontSize: fontSizes.caption, color: palette.muted, letterSpacing: 2 },
  timer:         { backgroundColor: palette.ink, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radii.sm, minWidth: 60, alignItems: 'center' },
  timerActive:   { backgroundColor: palette.brandGreen },
  timerText:     { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  timerTextActive: { color: palette.ink },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(31,31,31,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: {
    width: '100%', maxWidth: 380,
    backgroundColor: theme.colors.surface, borderRadius: radii.lg,
    padding: spacing.xl, alignItems: 'center', gap: spacing.md,
  },
  title: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  body:  { fontSize: fontSizes.body, color: palette.gray, textAlign: 'center', lineHeight: 24 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: palette.ink,
  },
  topBackBtn:   { width: 34, height: 34, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  topBackArrow: { fontSize: fontSizes.heading, color: palette.white, marginTop: -2 },
  topTitle:     { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.white },
  diffBadge:    { backgroundColor: `${palette.brandGreen}1A`, paddingVertical: spacing.xxs, paddingHorizontal: spacing.sm, borderRadius: radii.pill },
  diffText:     { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen },

  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md },

  tutor: { backgroundColor: theme.colors.surface, borderRadius: radii.sm, borderWidth: 1, borderColor: palette.border, overflow: 'hidden' },
  tutorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, backgroundColor: `${palette.accentYellow}22` },
  tutorLeft:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  tutorTitle:  { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  evalBadge:   { backgroundColor: `${palette.brandGreen}1A`, paddingVertical: 2, paddingHorizontal: spacing.xs, borderRadius: radii.pill },
  evalText:    { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen },
  tutorChevron: { fontSize: fontSizes.heading, color: palette.muted },
  tutorBody:    { padding: spacing.md },
  tutorTip:     { fontSize: fontSizes.caption, color: palette.ink, lineHeight: 20 },

  movesLabel:     { },
  movesLabelText: { fontSize: 10, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 1.2 },
  moves:          { paddingVertical: spacing.sm, gap: spacing.xs, alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: radii.sm, paddingHorizontal: spacing.md },
  moveGroup:      { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  moveNum:        { fontSize: fontSizes.caption, color: palette.muted, minWidth: 18 },
  moveToken:      { paddingVertical: spacing.xxs, paddingHorizontal: spacing.xs, backgroundColor: palette.backgroundSoft, borderRadius: radii.sm },
  moveTokenBlack: { backgroundColor: palette.ink },
  moveText:       { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.ink },

  footer: {
    flexDirection: 'row', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, paddingBottom: spacing.lg,
    backgroundColor: palette.ink,
  },
  ctrlBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: spacing.xxs, paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radii.md, minHeight: 54,
  },
  ctrlBtnResign:  { backgroundColor: 'rgba(214,69,69,0.15)' },
  ctrlLabel:      { fontSize: 9, fontWeight: fontWeights.bold, color: 'rgba(255,255,255,0.5)' },
  ctrlLabelResign: { color: palette.error },
});
