/**
 * index.tsx — Home Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { router } from 'expo-router';
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
import { useSession } from '@/providers/SessionProvider';

const STATS = [
  { emoji: '🌐', value: '2.5', unit: 'hrs',    label: 'Web Time'  },
  { emoji: '📚', value: '45',  unit: 'min',    label: 'Lessons'   },
  { emoji: '🧩', value: '12',  unit: 'solved', label: 'Puzzles'   },
];

const ACTIVITY = [
  { id: '1', text: 'Completed "How the Knight Moves"',  time: '2h ago'     },
  { id: '2', text: 'Solved puzzle #4821 — Mate in 2',   time: '3h ago'     },
  { id: '3', text: 'Earned "Quick Learner" badge 🏅',   time: 'Yesterday'  },
  { id: '4', text: 'Played 3 games vs Computer (Easy)', time: 'Yesterday'  },
];

export default function HomeRoute() {
  const { session, signOut } = useSession();

  const username =
    session.status === 'authenticated' ? session.user.role : 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const initial = username.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ──────────────────────────────────── */}
        <View style={s.hero}>
          <View style={s.heroText}>
            <Text style={s.greeting}>{greeting},</Text>
            <Text style={s.username}>{username}! 👋</Text>
            <Text style={s.heroSub}>Ready to learn something new?</Text>
          </View>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{initial}</Text>
          </View>
        </View>

        {/* ── Quick Actions ──────────────────────────── */}
        <View style={s.quickActions}>
          <Pressable
            accessibilityLabel="Start a lesson"
            onPress={() => router.push('/learn')}
            style={({ pressed }) => [s.quickBtn, s.quickBtnDark, pressed && s.pressed]}
          >
            <Text style={s.quickEmoji}>📚</Text>
            <Text style={s.quickLabel}>Start Lesson</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Daily puzzle"
            onPress={() => router.push('/puzzles')}
            style={({ pressed }) => [s.quickBtn, s.quickBtnGreen, pressed && s.pressed]}
          >
            <Text style={s.quickEmoji}>🧩</Text>
            <Text style={s.quickLabel}>Daily Puzzle</Text>
          </Pressable>
        </View>

        {/* ── Stats ─────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Your Progress</Text>
          <View style={s.statsRow}>
            {STATS.map(stat => (
              <View key={stat.label} style={s.statCard}>
                <Text style={s.statEmoji}>{stat.emoji}</Text>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statUnit}>{stat.unit}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Activity ──────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Recent Activity</Text>
          <View style={s.activityCard}>
            {ACTIVITY.map((item, i) => (
              <View key={item.id} style={s.activityRow}>
                <View style={s.timelineCol}>
                  <View style={s.dot} />
                  {i < ACTIVITY.length - 1 && <View style={s.line} />}
                </View>
                <View style={s.activityText}>
                  <Text style={s.activityDesc}>{item.text}</Text>
                  <Text style={s.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Donate CTA ────────────────────────────── */}
        <View style={s.donateCard}>
          <Text style={s.donateTitle}>Support our mission</Text>
          <Text style={s.donateBody}>
            Help us bring chess and STEM education to underserved students everywhere.
          </Text>
          <Button variant="brand">Donate</Button>
        </View>

        {/* Mentor shortcut */}
        {session.status === 'authenticated' && session.user.role === 'mentor' && (
          <Button onPress={() => router.push('/mentor')} variant="secondary">
            Open mentor area
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl },

  hero:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroText:  { flex: 1, gap: spacing.xxs },
  greeting:  { fontSize: fontSizes.body, color: palette.gray },
  username:  { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: palette.ink, lineHeight: 34 },
  heroSub:   { fontSize: fontSizes.caption, color: palette.gray },
  avatar: {
    width: 52, height: 52, borderRadius: radii.pill,
    backgroundColor: `${palette.brandGreen}1A`,
    borderWidth: 2, borderColor: palette.brandGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.brandGreen },

  quickActions: { flexDirection: 'row', gap: spacing.md },
  quickBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  quickBtnDark:  { backgroundColor: palette.ink },
  quickBtnGreen: { backgroundColor: palette.brandGreen },
  quickEmoji:    { fontSize: 18 },
  quickLabel:    { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.white },
  pressed:       { opacity: 0.8 },

  section:      { gap: spacing.md },
  sectionTitle: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },
  statsRow:     { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
    paddingVertical: spacing.md, gap: spacing.xxs,
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  statUnit:  { fontSize: fontSizes.caption, color: palette.muted },
  statLabel: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.gray, textAlign: 'center' },

  activityCard: {
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  activityRow:  { flexDirection: 'row', paddingVertical: spacing.sm },
  timelineCol:  { width: 20, alignItems: 'center', paddingTop: 4 },
  dot:  { width: 10, height: 10, borderRadius: radii.pill, backgroundColor: palette.brandGreen },
  line: { width: 2, flex: 1, backgroundColor: palette.border, marginTop: spacing.xxs },
  activityText: { flex: 1, paddingLeft: spacing.sm, gap: 2 },
  activityDesc: { fontSize: fontSizes.caption, color: palette.ink },
  activityTime: { fontSize: fontSizes.caption, color: palette.muted },

  donateCard: {
    backgroundColor: palette.ink, borderRadius: radii.lg,
    padding: spacing.lg, gap: spacing.md,
  },
  donateTitle: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.white },
  donateBody:  { fontSize: fontSizes.caption, color: `rgba(255,255,255,0.6)`, lineHeight: 20 },
});
