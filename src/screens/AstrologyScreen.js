import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { ZODIAC_SIGNS } from "../data/zodiacData";
import { PHASE_INFO, SPECIAL_MOONS } from "../data/moonData";
import { getMoonPhase } from "../utils/moonPhase";

function dateRangeLabel(sign) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [sm, sd] = sign.start;
  const [em, ed] = sign.end;
  return `${months[sm - 1]} ${sd} – ${months[em - 1]} ${ed}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

function ZodiacContent({ profile, isDark }) {
  const [expanded, setExpanded] = useState(null);
  const mySign = ZODIAC_SIGNS.find((s) => s.name === profile?.signName);
  const others = ZODIAC_SIGNS.filter((s) => s.name !== profile?.signName);
  const t = isDark ? darkText : lightText;

  return (
    <>
      {mySign && (
        <View style={[styles.mySignCard, isDark && styles.mySignCardDark]}>
          <Text style={[styles.mySignBadge, t.accent]}>YOUR SIGN</Text>
          <Text style={[styles.mySignSymbol, t.primary]}>{mySign.symbol}</Text>
          <Text style={[styles.mySignName, t.primary]}>{mySign.name}</Text>
          <Text style={[styles.mySignMeta, t.accent]}>
            {mySign.element} · {dateRangeLabel(mySign)}
          </Text>
          {mySign.facts.map((f, i) => (
            <Text key={i} style={[styles.mySignFact, t.primary]}>
              {f}
            </Text>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, t.primary]}>Explore the others</Text>
      {others.map((sign) => {
        const isOpen = expanded === sign.name;
        return (
          <TouchableOpacity
            key={sign.name}
            activeOpacity={0.8}
            onPress={() => setExpanded(isOpen ? null : sign.name)}
            style={[styles.signRow, isDark && styles.signRowDark]}
          >
            <View style={styles.signRowHeader}>
              <Text style={[styles.signSymbol, t.primary]}>{sign.symbol}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.signName, t.primary]}>{sign.name}</Text>
                <Text style={[styles.signMeta, t.accent]}>
                  {sign.element} · {dateRangeLabel(sign)}
                </Text>
              </View>
              <Text style={[styles.chevron, t.accent]}>{isOpen ? "–" : "+"}</Text>
            </View>
            {isOpen &&
              sign.facts.map((f, i) => (
                <Text key={i} style={[styles.signFact, t.primary]}>
                  {f}
                </Text>
              ))}
          </TouchableOpacity>
        );
      })}
    </>
  );
}

function MoonContent() {
  const moon = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <>
      <View style={styles.currentCard}>
        <Text style={styles.currentEmoji}>{moon.emoji}</Text>
        <Text style={styles.currentName}>{moon.name}</Text>
        <Text style={styles.currentMeta}>
          {moon.illumination}% illuminated · day {moon.ageDays} of the cycle
        </Text>
        <View style={styles.divider} />
        <View style={styles.nextRow}>
          <View style={styles.nextItem}>
            <Text style={styles.nextLabel}>Next Full Moon</Text>
            <Text style={styles.nextValue}>{formatDate(moon.nextFullMoon)}</Text>
          </View>
          <View style={styles.nextItem}>
            <Text style={styles.nextLabel}>Next New Moon</Text>
            <Text style={styles.nextValue}>{formatDate(moon.nextNewMoon)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitleDark}>The eight phases</Text>
      {PHASE_INFO.map((p) => (
        <View key={p.name} style={styles.phaseRow}>
          <Text style={styles.phaseEmoji}>{p.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.phaseName}>{p.name}</Text>
            <Text style={styles.phaseDesc}>{p.description}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitleDark}>Special moons</Text>
      {SPECIAL_MOONS.map((m) => (
        <View key={m.name} style={styles.specialCard}>
          <Text style={styles.specialName}>{m.name}</Text>
          <Text style={styles.specialFact}>{m.fact}</Text>
        </View>
      ))}
    </>
  );
}

export default function AstrologyScreen({ profile }) {
  const [view, setView] = useState("zodiac");
  const isDark = view === "moon";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? colors.ink : colors.parchment }]}
      edges={["top"]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, isDark ? darkText.primary : lightText.primary]}>Astrology</Text>
          <Text style={[styles.subtitle, isDark ? darkText.accent : lightText.accent]}>
            your sign, and the sky above
          </Text>
        </View>
      </View>

      <View style={[styles.toggle, isDark && styles.toggleDark]}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === "zodiac" && (isDark ? styles.toggleActiveDark : styles.toggleActive)]}
          onPress={() => setView("zodiac")}
        >
          <Text style={[styles.toggleText, view === "zodiac" && styles.toggleTextActive]}>Zodiac</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === "moon" && (isDark ? styles.toggleActiveDark : styles.toggleActive)]}
          onPress={() => setView("moon")}
        >
          <Text style={[styles.toggleText, view === "moon" && styles.toggleTextActive]}>Moon</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {view === "zodiac" ? <ZodiacContent profile={profile} isDark={isDark} /> : <MoonContent />}
      </ScrollView>
    </SafeAreaView>
  );
}

const lightText = {
  primary: { color: colors.ink },
  accent: { color: colors.plum },
};
const darkText = {
  primary: { color: colors.cream },
  accent: { color: colors.brassLight },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { paddingHorizontal: 22, paddingTop: 20 },
  title: { fontSize: 22 },
  subtitle: { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 },
  toggle: {
    flexDirection: "row",
    marginHorizontal: 22,
    marginTop: 16,
    backgroundColor: colors.cream,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
  },
  toggleDark: { backgroundColor: colors.inkLight, borderColor: colors.inkLine },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 18, alignItems: "center" },
  toggleActive: { backgroundColor: colors.plum },
  toggleActiveDark: { backgroundColor: colors.brass },
  toggleText: { fontSize: 12, color: "#9a8b6d" },
  toggleTextActive: { color: colors.cream, fontWeight: "600" },
  scroll: { padding: 22, paddingBottom: 40 },

  // Zodiac styles
  mySignCard: {
    backgroundColor: colors.cream,
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.parchmentLine,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  mySignCardDark: { backgroundColor: colors.inkLight, borderColor: colors.inkLine, borderLeftColor: colors.brass },
  mySignBadge: { fontSize: 9, letterSpacing: 1.5 },
  mySignSymbol: { fontSize: 40, marginTop: 10 },
  mySignName: { fontSize: 20, marginTop: 4 },
  mySignMeta: { fontSize: 11, marginTop: 4, marginBottom: 14 },
  mySignFact: { fontSize: 13, opacity: 0.75, lineHeight: 19, marginBottom: 8, alignSelf: "stretch" },
  sectionTitle: { fontSize: 15, marginTop: 28, marginBottom: 12 },
  signRow: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
  },
  signRowDark: { backgroundColor: colors.inkLight, borderColor: colors.inkLine },
  signRowHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  signSymbol: { fontSize: 24, width: 32 },
  signName: { fontSize: 14 },
  signMeta: { fontSize: 11, marginTop: 2 },
  chevron: { fontSize: 18, width: 20, textAlign: "center" },
  signFact: { fontSize: 12, opacity: 0.7, lineHeight: 17, marginTop: 10 },

  // Moon styles (always dark themed)
  currentCard: {
    backgroundColor: colors.inkLight,
    borderRadius: 14,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.inkLine,
  },
  currentEmoji: { fontSize: 48 },
  currentName: { fontSize: 20, color: colors.cream, marginTop: 8 },
  currentMeta: { fontSize: 11, color: colors.brassLight, marginTop: 4, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: colors.inkLine, width: "100%", marginVertical: 16 },
  nextRow: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  nextItem: { flex: 1 },
  nextLabel: { fontSize: 9, color: colors.brassLight, letterSpacing: 1, textTransform: "uppercase" },
  nextValue: { fontSize: 13, color: colors.cream, marginTop: 4 },
  sectionTitleDark: { fontSize: 15, color: colors.cream, marginTop: 28, marginBottom: 12, opacity: 0.9 },
  phaseRow: { flexDirection: "row", gap: 12, marginBottom: 16, alignItems: "flex-start" },
  phaseEmoji: { fontSize: 22, width: 30 },
  phaseName: { fontSize: 13, color: colors.cream },
  phaseDesc: { fontSize: 12, color: colors.cream, opacity: 0.6, lineHeight: 17, marginTop: 2 },
  specialCard: {
    backgroundColor: colors.inkLight,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.inkLine,
  },
  specialName: { fontSize: 13, color: colors.brassLight, marginBottom: 4 },
  specialFact: { fontSize: 12, color: colors.cream, opacity: 0.75, lineHeight: 17 },
});