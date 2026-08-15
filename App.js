import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
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

  return (
    <SafeAreaProvider>
      {!loaded ? (
        <View
          style={{ flex: 1, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={colors.brassLight} />
        </View>
      ) : (
        <>
          <StatusBar style="light" />
          {profile ? <MainApp profile={profile} /> : <OnboardingScreen onComplete={saveProfile} />}
        </>
      )}

      {/* Rendered once, outside the loaded/!loaded branches, so it never remounts and
          restarts mid-fall when the profile finishes loading. */}
      {showStars && (
        <StarRain
          count={32}
          palette={[colors.brass, colors.brassLight, colors.cream]}
          onComplete={() => setShowStars(false)}
        />
      )}
    </SafeAreaProvider>
  );
}