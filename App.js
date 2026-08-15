import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MainApp from "./src/navigation/MainApp";
import { useProfile } from "./src/hooks/useProfile";
import { colors } from "./src/theme/colors";
import StarRain from "./src/components/StarRain";

export default function App() {
  const { profile, loaded, saveProfile } = useProfile();
  const [showStars, setShowStars] = useState(true);

  useEffect(() => {
    // safety fallback: hide stars after 3s in case the animation doesn't call onComplete
    const t = setTimeout(() => setShowStars(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!loaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.brassLight} />
          {showStars && (
            <StarRain
              count={28}
              palette={[colors.plum, colors.brassLight, colors.cream]}
              onComplete={() => setShowStars(false)}
            />
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {profile ? (
        <MainApp profile={profile} showStars={showStars} />
      ) : (
        <OnboardingScreen onComplete={saveProfile} />
      )}
      {showStars && (
        <StarRain
          count={20}
          palette={[colors.plum, colors.brassLight, colors.cream]}
          onComplete={() => setShowStars(false)}
        />
      )}
    </SafeAreaProvider>
  );
}