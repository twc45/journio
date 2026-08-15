import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "journey", label: "Journey", icon: "compass" },
  { id: "astrology", label: "Astrology", icon: "star" },
];

export default function TabBar({ active, onChange, dark }) {
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        styles.wrap,
        { backgroundColor: dark ? colors.ink : colors.cream, borderTopColor: dark ? colors.inkLine : colors.parchmentLine },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const tint = isActive ? colors.brass : dark ? "#8a86a8" : "#a89a78";
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onChange(tab.id)} activeOpacity={0.7}>
            <Feather name={tab.icon} size={19} color={tint} />
            <Text style={[styles.label, { color: tint }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 6,
  },
  tab: { flex: 1, alignItems: "center", gap: 4 },
  label: { fontSize: 9, letterSpacing: 0.5 },
});