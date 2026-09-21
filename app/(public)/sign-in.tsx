/**
 * sign-in.tsx — Login Screen
 * UI/UX design by Sandith Hewage (Y STEM and Chess)
 */

import { useState } from 'react';
import {
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

import { Button } from '@/components/ui/Button';
import { theme } from '@/design/theme';
import { fontSizes, fontWeights, palette, radii, spacing } from '@/design/tokens';
import { useSession } from '@/providers/SessionProvider';

export default function SignInRoute() {
  const { mockSignInAs } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    mockSignInAs('student'); // Replace with real auth
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.kav}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo / Hero ───────────────────────────── */}
          <View style={s.hero}>
            <View style={s.logoCircle}>
              <Text style={s.logoLetter}>Y</Text>
            </View>
            <Text style={s.wordmark}>Y STEM and Chess</Text>
            <Text style={s.tagline}>Learn. Play. Grow.</Text>
          </View>

          {/* ── Form Card ─────────────────────────────── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome back</Text>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Username</Text>
              <TextInput
                accessibilityLabel="Username"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={() => setUsernameFocused(false)}
                onChangeText={t => { setUsername(t); setError(''); }}
                onFocus={() => setUsernameFocused(true)}
                placeholder="Enter your username"
                placeholderTextColor={palette.muted}
                returnKeyType="next"
                style={[s.input, usernameFocused && s.inputFocused]}
                value={username}
              />
            </View>

            <View style={s.field}>
              <Text style={s.fieldLabel}>Password</Text>
              <TextInput
                accessibilityLabel="Password"
                onBlur={() => setPasswordFocused(false)}
                onChangeText={t => { setPassword(t); setError(''); }}
                onFocus={() => setPasswordFocused(true)}
                onSubmitEditing={handleSignIn}
                placeholder="Enter your password"
                placeholderTextColor={palette.muted}
                returnKeyType="done"
                secureTextEntry
                style={[s.input, passwordFocused && s.inputFocused]}
                value={password}
              />
            </View>

            {!!error && <Text style={s.errorText}>{error}</Text>}

            <Pressable accessibilityLabel="Forgot password" hitSlop={8}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </Pressable>

            <Button onPress={handleSignIn} variant="brand">
              Enter
            </Button>

            {/* Dev mock helpers — remove before launch */}
            <View style={s.devRow}>
              <Button onPress={() => mockSignInAs('student')} variant="secondary">
                Mock: Student
              </Button>
              <Button onPress={() => mockSignInAs('mentor')} variant="secondary">
                Mock: Mentor
              </Button>
            </View>

            <View style={s.signupRow}>
              <Text style={s.signupPrompt}>Don't have an account? </Text>
              <Pressable hitSlop={8}>
                <Text style={s.signupLink}>Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  kav:    { flex: 1 },
  scroll: {
    flexGrow: 1, alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl, paddingBottom: spacing.xl,
  },

  hero:       { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 72, height: 72, borderRadius: radii.pill,
    backgroundColor: palette.ink,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoLetter: { fontSize: fontSizes.display, fontWeight: fontWeights.bold, color: palette.brandGreen },
  wordmark:   { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink, marginBottom: spacing.xxs },
  tagline:    { fontSize: fontSizes.caption, color: palette.gray, letterSpacing: 1.5, textTransform: 'uppercase' },

  card: {
    width: '100%', maxWidth: 384,
    backgroundColor: theme.colors.surfaceStrong,
    borderRadius: radii.lg, borderWidth: 2, borderColor: palette.ink,
    padding: spacing.xl, gap: spacing.lg,
  },
  cardTitle: { fontSize: fontSizes.heading, fontWeight: fontWeights.bold, color: palette.ink, textAlign: 'center' },

  field:      { gap: spacing.xxs },
  fieldLabel: { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.ink },
  input: {
    height: 48, borderRadius: radii.md, borderWidth: 2,
    borderColor: palette.border, paddingHorizontal: spacing.md,
    backgroundColor: palette.white, color: palette.ink, fontSize: fontSizes.body,
  },
  inputFocused: { borderColor: palette.brandGreen },

  errorText:  { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.error, textAlign: 'center' },
  forgotText: { fontSize: fontSizes.caption, fontWeight: fontWeights.semibold, color: palette.brandGreen, textAlign: 'right' },

  devRow:       { flexDirection: 'row', gap: spacing.sm },
  signupRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupPrompt: { fontSize: fontSizes.caption, color: palette.gray },
  signupLink:   { fontSize: fontSizes.caption, fontWeight: fontWeights.bold, color: palette.brandGreen, textDecorationLine: 'underline' },
});
