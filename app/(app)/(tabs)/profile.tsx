/**
 * profile.tsx — Profile Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

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

const BADGES = [
  { id: '1', emoji: '🌱', label: 'First Lesson'   },
  { id: '2', emoji: '🧩', label: 'Puzzle Solver'  },
  { id: '3', emoji: '♟',  label: 'First Win'      },
  { id: '4', emoji: '🔥', label: '5-Day Streak'   },
  { id: '5', emoji: '📚', label: 'Quick Learner'  },
  { id: '6', emoji: '🏆', label: 'Champion',       locked: true },
];

const STATS = [
  { label: 'Lessons',   value: '5'  },
  { label: 'Puzzles',   value: '12' },
  { label: 'Wins',      value: '3'  },
  { label: 'Streak',    value: '5🔥' },
];

export default function ProfileRoute() {
  const { session, signOut } = useSession();
  const username = session.status === 'authenticated' ? session.user.role : 'Student';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Profile Hero ──────────────────────────── */}
        <View style={s.hero}>
          <View style={s.avatar}>
            <Text style={s.avatarInitial}>{username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={s.username}>{username.charAt(0).toUpperCase() + username.slice(1)}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleBadgeText}>{username === 'mentor' ? 'Mentor' : 'Student'}</Text>
          </View>
        </View>

        {/* ── Stats Row ─────────────────────────────── */}
        <View style={s.statsRow}>
          {STATS.map(stat => (
            <View key={stat.label} style={s.statItem}>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Badges ────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Badges</Text>
          <View style={s.badgesGrid}>
            {BADGES.map(badge => (
              <View key={badge.id} style={[s.badge, badge.locked && s.badgeLocked]}>
                <Text style={s.badgeEmoji}>{badge.emoji}</Text>
                <Text style={s.badgeLabel}>{badge.label}</Text>
                {badge.locked && <Text style={s.lockedOverlay}>🔒</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* ── Account ───────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Account</Text>
          <View style={s.menuCard}>
            {[
              { label: 'Edit Profile',         emoji: '✏️' },
              { label: 'Notification Settings', emoji: '🔔' },
              { label: 'Privacy & Security',   emoji: '🔒' },
              { label: 'Help & Support',       emoji: '❓' },
            ].map((item, i, arr) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  s.menuRow,
                  i < arr.length - 1 && s.menuRowBorder,
                  pressed && s.menuRowPressed,
                ]}
              >
                <Text style={s.menuEmoji}>{item.emoji}</Text>
                <Text style={s.menuLabel}>{item.label}</Text>
                <Text style={s.menuArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Button onPress={signOut} variant="secondary">Sign out</Button>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.xl },

  hero:        { alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 80, height: 80, borderRadius: radii.pill,
    backgroundColor: `${palette.brandGreen}1A`,
    borderWidth: 3, borderColor: palette.brandGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: palette.brandGreen },
  username:      { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  roleBadge: {
    backgroundColor: `${palette.brandGreen}1A`, borderWidth: 1,
    borderColor: palette.brandGreen, borderRadius: radii.pill,
    paddingVertical: spacing.xxs, paddingHorizontal: spacing.sm,
  },
  roleBadgeText: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, gap: spacing.xxs },
  statValue: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink },
  statLabel: { fontSize: fontSizes.caption, color: palette.muted },

  section:      { gap: spacing.md },
  sectionTitle: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    width: '30%', backgroundColor: theme.colors.surface,
    borderRadius: radii.sm, borderWidth: 1, borderColor: palette.border,
    padding: spacing.md, alignItems: 'center', gap: spacing.xs,
    position: 'relative', overflow: 'hidden',
  },
  badgeLocked:  { opacity: 0.4 },
  badgeEmoji:   { fontSize: 28 },
  badgeLabel:   { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.gray, textAlign: 'center' },
  lockedOverlay: { position: 'absolute', top: spacing.xs, right: spacing.xs, fontSize: 12 },

  menuCard: {
    backgroundColor: theme.colors.surface, borderRadius: radii.sm,
    borderWidth: 1, borderColor: palette.border, overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md,
  },
  menuRowBorder:   { borderBottomWidth: 1, borderBottomColor: palette.border },
  menuRowPressed:  { backgroundColor: palette.backgroundSoft },
  menuEmoji:       { fontSize: 18, width: 28 },
  menuLabel:       { flex: 1, fontSize: fontSizes.label, color: palette.ink },
  menuArrow:       { fontSize: fontSizes.heading, color: palette.muted },
});
