import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useJournio } from "../hooks/useJournio";
import { useFavorites } from "../hooks/useFavorites";
import { ZODIAC_SIGNS } from "../data/zodiacData";
import { getDailyHoroscope } from "../data/horoscopeData";

export default function JourneyScreen({ profile }) {
  const { streak, longest, totalEntries, last21Days } = useJournio();
  const { favorites, removeFavorite } = useFavorites();
  const sign = ZODIAC_SIGNS.find((s) => s.name === profile?.signName);
  const horoscope = getDailyHoroscope(profile?.signName);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your journio</Text>
        <Text style={styles.subtitle}>everything that's yours, in one place</Text>

        <View style={styles.grid}>
          {last21Days.map((d, i) => {
            const isToday = i === last21Days.length - 1;
            return (
              <View key={i} style={styles.gridCell}>
                <View
                  style={[
                    styles.dot,
                    {
                      width: isToday ? 14 : 10,
                      height: isToday ? 14 : 10,
                      borderRadius: 7,
                      backgroundColor: d === 1 ? (isToday ? colors.plum : colors.brass) : "transparent",
                      borderWidth: d === 1 ? 0 : 1.3,
                      borderColor: colors.parchmentLine,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "streak", value: streak },
            { label: "longest", value: longest },
            { label: "entries", value: totalEntries },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {sign && (
          <>
            <Text style={styles.sectionTitle}>Today's guidance</Text>
            <View style={styles.horoscopeCard}>
              <Text style={styles.horoscopeSign}>
                {sign.symbol} {sign.name}
              </Text>
              <Text style={styles.horoscopeText}>{horoscope}</Text>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Saved for guidance</Text>
        {favorites.length === 0 ? (
          <View style={styles.emptyFavorites}>
            <Feather name="bookmark" size={18} color={colors.plum} />
            <Text style={styles.emptyFavoritesText}>
              Tap the bookmark on a prompt from Home to keep it here.
            </Text>
          </View>
        ) : (
          favorites.map((f) => (
            <View key={f.id} style={styles.favoriteCard}>
              <Text style={styles.favoriteText}>{f.text}</Text>
              <TouchableOpacity onPress={() => removeFavorite(f.id)} style={styles.favoriteRemove}>
                <Feather name="x" size={14} color={colors.plum} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.quote}>
          "Every page you fill is a star you've placed. Look back — that's a constellation only you
          could have drawn."
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.parchment },
  scroll: { padding: 22, paddingTop: 8, paddingBottom: 40 },
  title: { fontSize: 22, color: colors.ink },
  subtitle: {
    fontSize: 10,
    color: colors.plum,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 20,
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.cream,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
  },
  gridCell: { width: "14.28%", alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  dot: {},
  statsRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.parchmentLine,
  },
  statValue: { fontSize: 20, color: colors.ink },
  statLabel: { fontSize: 9, color: colors.plum, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 },
  sectionTitle: { fontSize: 15, color: colors.ink, marginTop: 28, marginBottom: 12 },
  horoscopeCard: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  horoscopeSign: { fontSize: 12, color: colors.plum, marginBottom: 8 },
  horoscopeText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  emptyFavorites: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
    borderStyle: "dashed",
  },
  emptyFavoritesText: { flex: 1, fontSize: 12, color: colors.ink, opacity: 0.6, lineHeight: 17 },
  favoriteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.parchmentLine,
  },
  favoriteText: { flex: 1, fontSize: 13, color: colors.ink, lineHeight: 19, fontStyle: "italic" },
  favoriteRemove: { padding: 4 },
  quote: {
    marginTop: 26,
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 15,
    color: colors.ink,
    opacity: 0.75,
    lineHeight: 22,
  },
});