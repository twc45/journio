import React, { useState } from "react";
import { View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import JourneyScreen from "../screens/JourneyScreen";
import AstrologyScreen from "../screens/AstrologyScreen";
import TabBar from "../components/TabBar";
import { colors } from "../theme/colors";

export default function MainApp({ profile, showStars = false }) {
  const [tab, setTab] = useState("home");
  const dark = tab === "home";

  return (
    <View style={{ flex: 1, backgroundColor: dark ? colors.ink : colors.parchment }}>
      <View style={{ flex: 1 }}>
        {tab === "home" && <HomeScreen profile={profile} initialAnimationPlaying={showStars} />}
        {tab === "journey" && <JourneyScreen profile={profile} />}
        {tab === "astrology" && <AstrologyScreen profile={profile} />}
      </View>
      <TabBar active={tab} onChange={setTab} dark={dark} />
    </View>
  );
}