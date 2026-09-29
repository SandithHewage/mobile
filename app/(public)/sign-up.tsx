/**
 * sign-up.tsx — Create Account Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/design/theme';
import { fontSizes, fontWeights, palette, radii, spacing } from '@/design/tokens';
import { useSession } from '@/providers/SessionProvider';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chessPiecePattern = require('@/assets/images/chess-piece-pattern.png');

type Role = 'student' | 'mentor';

const ROLES: { id: Role; emoji: string; label: string; desc: string }[] = [
  { id: 'student', emoji: '🎒', label: 'Student',  desc: 'I want to learn chess' },
  { id: 'mentor',  emoji: '🎓', label: 'Mentor',   desc: 'I want to teach chess'  },
];

export default function SignUpRoute() {
  const { mockSignInAs } = useSession();

  const [displayName,        setDisplayName]        = useState('');
  const [username,           setUsername]           = useState('');
  const [password,           setPassword]           = useState('');
  const [confirmPassword,    setConfirmPassword]    = useState('');
  const [role,               setRole]               = useState<Role>('student');
  const [showPassword,       setShowPassword]       = useState(false);
  const [showConfirm,        setShowConfirm]        = useState(false);
  const [nameFocused,        setNameFocused]        = useState(false);
  const [usernameFocused,    setUsernameFocused]    = useState(false);
  const [passwordFocused,    setPasswordFocused]    = useState(false);
  const [confirmFocused,     setConfirmFocused]     = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const pressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 50, bounciness: 4 }).start();

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Patterned Background ──────────────── */}
      <Image accessible={false} resizeMode="cover" source={chessPiecePattern} style={s.pattern} />
      <View pointerEvents="none" style={s.patternFade} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.kav}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back + Brand ──────────────────────── */}
          <View style={s.topRow}>
            <Pressable
              hitSlop={12}
              onPress={() => router.back()}
              style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.6 }]}
            >
              <Text style={s.backIcon}>←</Text>
            </Pressable>
            <View style={s.brand}>
              <View style={s.brandCircle}>
                <Text style={s.brandIcon}>♟</Text>
              </View>
            </View>
            {/* spacer to balance back button */}
            <View style={{ width: 36 }} />
          </View>

          <View style={s.headingBlock}>
            <Text style={s.headingTitle}>Create account</Text>
            <Text style={s.headingSub}>Join Y STEM and Chess — it's free</Text>
          </View>

          {/* ── Role Picker ───────────────────────── */}
          <View style={s.roleRow}>
            {ROLES.map(r => (
              <Pressable
                key={r.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: role === r.id }}
                onPress={() => setRole(r.id)}
                style={[s.roleCard, role === r.id && s.roleCardSelected]}
              >
                {role === r.id && (
                  <View style={s.roleCheck}>
                    <Text style={s.roleCheckIcon}>✓</Text>
                  </View>
                )}
                <Text style={s.roleEmoji}>{r.emoji}</Text>
                <Text style={[s.roleLabel, role === r.id && { color: palette.ink }]}>{r.label}</Text>
                <Text style={s.roleDesc}>{r.desc}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── Form Card ─────────────────────────── */}
          <View style={s.card}>

            {/* Display Name */}
            <View style={[s.field, nameFocused && s.fieldFocused]}>
              <Text style={s.fieldIcon}>✨</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                onBlur={() => setNameFocused(false)}
                onChangeText={setDisplayName}
                onFocus={() => setNameFocused(true)}
                placeholder="Display name"
                placeholderTextColor={palette.muted}
                returnKeyType="next"
                style={s.fieldInput}
                value={displayName}
              />
            </View>

            {/* Username */}
            <View style={[s.field, usernameFocused && s.fieldFocused]}>
              <Text style={s.fieldIcon}>👤</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => setUsernameFocused(false)}
                onChangeText={setUsername}
                onFocus={() => setUsernameFocused(true)}
                placeholder="Username"
                placeholderTextColor={palette.muted}
                returnKeyType="next"
                style={s.fieldInput}
                value={username}
              />
            </View>

            {/* Password */}
            <View style={[s.field, passwordFocused && s.fieldFocused]}>
              <Text style={s.fieldIcon}>🔒</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => setPasswordFocused(false)}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Password"
                placeholderTextColor={palette.muted}
                returnKeyType="next"
                secureTextEntry={!showPassword}
                style={[s.fieldInput, { flex: 1 }]}
                value={password}
              />
              <Pressable hitSlop={10} onPress={() => setShowPassword(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>

            {/* Confirm Password */}
            <View style={[
              s.field,
              confirmFocused && s.fieldFocused,
              passwordsMatch   && s.fieldValid,
              passwordMismatch && s.fieldError,
            ]}>
              <Text style={s.fieldIcon}>🔑</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => setConfirmFocused(false)}
                onChangeText={setConfirmPassword}
                onFocus={() => setConfirmFocused(true)}
                placeholder="Confirm password"
                placeholderTextColor={palette.muted}
                returnKeyType="done"
                secureTextEntry={!showConfirm}
                style={[s.fieldInput, { flex: 1 }]}
                value={confirmPassword}
              />
              {passwordsMatch ? (
                <Text style={[s.eyeIcon, { color: palette.brandGreen }]}>✓</Text>
              ) : (
                <Pressable hitSlop={10} onPress={() => setShowConfirm(v => !v)} style={s.eyeBtn}>
                  <Text style={s.eyeIcon}>{showConfirm ? '🙈' : '👁'}</Text>
                </Pressable>
              )}
            </View>

            {passwordMismatch && (
              <Text style={s.errorText}>Passwords don't match</Text>
            )}

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Pressable
                accessibilityLabel="Create account"
                accessibilityRole="button"
                onPressIn={pressIn}
                onPressOut={pressOut}
                style={s.createBtn}
              >
                <Text style={s.createBtnText}>Create Account  →</Text>
              </Pressable>
            </Animated.View>

            <View style={s.signinRow}>
              <Text style={s.signinHint}>Already have an account?  </Text>
              <Pressable hitSlop={8} onPress={() => router.back()}>
                <Text style={s.signinLink}>Sign in</Text>
              </Pressable>
            </View>
          </View>

          {/* ── Dev Quick-Create ──────────────────── */}
          <View style={s.dev}>
            <View style={s.devDivider}>
              <View style={s.devLine} />
              <Text style={s.devLabel}>DEV ONLY</Text>
              <View style={s.devLine} />
            </View>
            <View style={s.devRow}>
              {(['student', 'mentor'] as const).map(r => (
                <Pressable
                  key={r}
                  onPress={() => mockSignInAs(r)}
                  style={({ pressed }) => [s.devBtn, pressed && s.devBtnPressed]}
                >
                  <Text style={s.devBtnIcon}>{r === 'student' ? '🎒' : '🎓'}</Text>
                  <Text style={s.devBtnText}>Skip as {r === 'student' ? 'Student' : 'Mentor'}</Text>
                </Pressable>
              ))}
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
} as const;

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: theme.colors.background },
  pattern:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', opacity: 0.3 },
  patternFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', backgroundColor: theme.colors.background, opacity: 0.92 },
  kav:         { flex: 1 },
  scroll:      { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },

  /* Top row */
  topRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:     { width: 36, height: 36, borderRadius: radii.pill, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: palette.border, alignItems: 'center', justifyContent: 'center', ...SHADOW },
  backIcon:    { fontSize: 16, color: palette.ink },
  brand:       { alignItems: 'center' },
  brandCircle: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center' },
  brandIcon:   { fontSize: 22 },

  /* Heading */
  headingBlock: { gap: 2 },
  headingTitle: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: palette.ink, letterSpacing: -0.5 },
  headingSub:   { fontSize: fontSizes.caption, color: palette.muted },

  /* Role picker */
  roleRow:         { flexDirection: 'row', gap: spacing.sm },
  roleCard: {
    flex: 1, borderRadius: radii.xl, borderWidth: 2, borderColor: palette.border,
    padding: spacing.md, alignItems: 'center', gap: 4,
    backgroundColor: theme.colors.surface, position: 'relative', overflow: 'hidden',
    ...SHADOW,
  },
  roleCardSelected: { borderColor: palette.brandGreen, backgroundColor: palette.backgroundSoft },
  roleCheck:        { position: 'absolute', top: spacing.xs, right: spacing.xs, width: 18, height: 18, borderRadius: radii.pill, backgroundColor: palette.brandGreen, alignItems: 'center', justifyContent: 'center' },
  roleCheckIcon:    { fontSize: 9, fontWeight: fontWeights.bold, color: palette.ink },
  roleEmoji:        { fontSize: 28 },
  roleLabel:        { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.muted },
  roleDesc:         { fontSize: fontSizes.caption - 1, color: palette.muted, textAlign: 'center' },

  /* Card */
  card:        { backgroundColor: theme.colors.surfaceStrong, borderRadius: radii.xl, borderWidth: 1, borderColor: palette.border, padding: spacing.lg, gap: spacing.sm, ...SHADOW },

  /* Fields */
  field:        { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: palette.border, borderRadius: radii.md, backgroundColor: theme.colors.background, paddingHorizontal: spacing.md, minHeight: 52 },
  fieldFocused: { borderColor: palette.brandGreen, backgroundColor: palette.backgroundSoft },
  fieldValid:   { borderColor: palette.brandGreen },
  fieldError:   { borderColor: palette.error, backgroundColor: palette.errorBackground },
  fieldIcon:    { fontSize: 16 },
  fieldInput:   { flex: 1, fontSize: fontSizes.body, color: palette.ink, paddingVertical: spacing.sm },
  eyeBtn:       { padding: spacing.xs },
  eyeIcon:      { fontSize: 15 },
  errorText:    { fontSize: fontSizes.caption, color: palette.error, marginTop: -spacing.xxs },

  /* CTA */
  createBtn:     { backgroundColor: palette.brandGreen, borderRadius: radii.pill, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xs },
  createBtnText: { fontSize: fontSizes.label, fontWeight: fontWeights.bold, color: palette.ink, letterSpacing: 0.3 },

  signinRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signinHint: { fontSize: fontSizes.caption, color: palette.muted },
  signinLink: { fontSize: fontSizes.caption, color: palette.brandGreen, fontWeight: fontWeights.bold },

  /* Dev */
  dev:           { gap: spacing.sm },
  devDivider:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  devLine:       { flex: 1, height: 1, backgroundColor: palette.border },
  devLabel:      { fontSize: 9, fontWeight: fontWeights.bold, color: palette.muted, textTransform: 'uppercase', letterSpacing: 1.5 },
  devRow:        { flexDirection: 'row', gap: spacing.sm },
  devBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radii.md, borderWidth: 1, borderColor: palette.border, borderStyle: 'dashed', paddingVertical: spacing.sm },
  devBtnPressed: { backgroundColor: palette.backgroundSoft },
  devBtnIcon:    { fontSize: 15 },
  devBtnText:    { fontSize: fontSizes.caption, fontWeight: fontWeights.semibold, color: palette.gray },
});
