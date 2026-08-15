import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Dial from "../components/Dial";
import FactCarousel from "../components/FactCarousel";
import { colors } from "../theme/colors";
import { PROMPTS } from "../data/journioData";
import { ZODIAC_SIGNS } from "../data/zodiacData";
import { getTodayPortal } from "../data/portalData";
import { useJournio } from "../hooks/useJournio";
import { useFavorites } from "../hooks/useFavorites";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SIGN_CARD_WIDTH = SCREEN_WIDTH - 20 * 2 - 14 * 2; // signCardWrap padding + signCard padding

export default function HomeScreen({ profile }) {
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const { streak, totalEntries, recordToday } = useJournio();
  const { isFavorited, toggleFavorite } = useFavorites();
  const sign = ZODIAC_SIGNS.find((s) => s.name === profile?.signName);
  const portal = getTodayPortal();

  const handleReveal = () => {
    setSpinning(true);
    setRevealed(false);
    const chosen = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setTimeout(() => {
      setPrompt(chosen);
      setSpinning(false);
      setRevealed(true);
      recordToday();
    }, 1100);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>journio</Text>
        <Text style={styles.tagline}>let the universe hand you the pen</Text>
        {profile && (
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>
              Welcome back, {profile.name} {sign?.symbol}
            </Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 12 }}>
        <Dial onReveal={handleReveal} spinning={spinning} />
        {!revealed && !spinning && (
          <Text style={styles.hint}>tap the dial to draw today's page</Text>
        )}
        {spinning && <Text style={styles.listening}>listening&hellip;</Text>}
      </View>

      {portal && (
        <View style={styles.cardWrap}>
          <View style={styles.portalCard}>
            <View style={styles.cardLabelRow}>
              <Feather name="zap" size={13} color={colors.brassLight} />
              <Text style={styles.portalLabel}>{portal.name} · today</Text>
            </View>
            <Text style={styles.portalFact}>{portal.fact}</Text>
            <Text style={styles.portalRitual}>{portal.ritual}</Text>
          </View>
        </View>
      )}

      {!revealed && !spinning && sign && (
        <View style={styles.signCardWrap}>
          <View style={styles.signCard}>
            <Text style={styles.signCardLabel}>
              {sign.symbol} {sign.name} · {sign.element}
            </Text>
            <FactCarousel
              facts={sign.facts}
              width={SIGN_CARD_WIDTH}
              textColor={colors.cream}
              dotActive={colors.brass}
              dotInactive={colors.inkLine}
              arrowColor={colors.brassLight}
            />
          </View>
        </View>
      )}

      {revealed && (
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <View style={styles.cardLabelRow}>
              <Feather name="star" size={13} color={colors.plum} />
              <Text style={styles.cardLabel}>today's page</Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(prompt)}
                style={styles.bookmarkBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name="bookmark"
                  size={16}
                  color={colors.plum}
                  style={{ opacity: isFavorited(prompt) ? 1 : 0.35 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.promptText}>{prompt}</Text>
            <View style={styles.cardFootRow}>
              <Feather name="edit-3" size={12} color={colors.ink} />
              <Text style={styles.cardFoot}>grab your notebook — this one's for paper</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.streakWrap}>
        <Text style={styles.streakPill}>
          {totalEntries === 0 && !revealed
            ? "your journio begins today"
            : `day ${Math.max(streak, 1)} of your journio`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, paddingTop: 8 },
  header: { alignItems: "center", paddingHorizontal: 24 },
  wordmark: { fontFamily: "System", fontStyle: "italic", fontSize: 26, color: colors.cream },
  tagline: {
    fontFamily: "System",
    fontSize: 10,
    color: colors.brassLight,
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: "uppercase",
  },
  hint: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 11,
    color: colors.cream,
    opacity: 0.6,
    letterSpacing: 1,
  },
  listening: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 11,
    color: colors.brassLight,
    letterSpacing: 1,
  },
  greetingRow: { marginTop: 10 },
  greeting: { fontSize: 12, color: colors.cream, opacity: 0.75 },
  signCardWrap: { marginTop: 22, paddingHorizontal: 20 },
  signCard: {
    backgroundColor: colors.inkLight,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.inkLine,
  },
  signCardLabel: {
    fontSize: 10,
    color: colors.brassLight,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardWrap: { marginTop: 22, paddingHorizontal: 20 },
  card: {
    backgroundColor: colors.parchment,
    borderRadius: 4,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  cardLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  bookmarkBtn: { marginLeft: "auto" },
  cardLabel: { fontSize: 10, color: colors.plum, letterSpacing: 1, textTransform: "uppercase" },
  promptText: { fontSize: 19, lineHeight: 27, color: colors.ink },
  cardFootRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16, opacity: 0.6 },
  cardFoot: { fontSize: 10, color: colors.ink },
  portalCard: {
    backgroundColor: colors.inkLight,
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.brass,
  },
  portalLabel: { fontSize: 10, color: colors.brassLight, letterSpacing: 1, textTransform: "uppercase" },
  portalFact: { fontSize: 13, lineHeight: 19, color: colors.cream, opacity: 0.85, marginTop: 4 },
  portalRitual: { fontSize: 13, lineHeight: 19, color: colors.brassLight, marginTop: 10, fontStyle: "italic" },
  streakWrap: { alignItems: "center", marginTop: 22, paddingBottom: 20 },
  streakPill: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.brassLight,
    borderWidth: 1,
    borderColor: colors.inkLine,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
});