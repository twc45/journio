import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function OnboardingScreen({ onComplete }) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    setError(null);
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!name.trim()) {
      setError("What should the universe call you?");
      return;
    }
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setError("That birthday doesn't look quite right — check the numbers.");
      return;
    }

    onComplete(name, d, m, y);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.wordmark}>journio</Text>
          <Text style={styles.tagline}>before we begin, the universe would like to know you</Text>

          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Tom"
            placeholderTextColor="#8a86a8"
          />

          <Text style={styles.label}>Your date of birth</Text>
          <View style={styles.dobRow}>
            <TextInput
              style={[styles.input, styles.dobInput]}
              value={day}
              onChangeText={setDay}
              placeholder="DD"
              placeholderTextColor="#8a86a8"
              keyboardType="number-pad"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.dobInput]}
              value={month}
              onChangeText={setMonth}
              placeholder="MM"
              placeholderTextColor="#8a86a8"
              keyboardType="number-pad"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.dobInputYear]}
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              placeholderTextColor="#8a86a8"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Reveal my sign</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  scroll: { flexGrow: 1, padding: 26, justifyContent: "center" },
  wordmark: {
    fontFamily: "System",
    fontStyle: "italic",
    fontSize: 28,
    color: colors.cream,
    textAlign: "center",
  },
  tagline: {
    fontSize: 12,
    color: colors.brassLight,
    letterSpacing: 0.5,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 36,
  },
  label: {
    fontSize: 11,
    color: colors.brassLight,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    backgroundColor: colors.inkLight,
    borderWidth: 1,
    borderColor: colors.inkLine,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: colors.cream,
    fontSize: 15,
  },
  dobRow: { flexDirection: "row", gap: 10 },
  dobInput: { flex: 1, textAlign: "center" },
  dobInputYear: { flex: 1.4, textAlign: "center" },
  error: {
    color: colors.plumLight,
    fontSize: 12,
    marginTop: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.brass,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});