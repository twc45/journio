import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { colors } from "../theme/colors";

const GLYPHS = ["✦", "✧", "⋆", "★", "✨"];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function SparkleBurst({
  count = 12,
  size = 220,
  palette = [colors.brass, colors.brassLight, colors.cream],
  onComplete,
}) {
  const particles = useRef(
    Array.from({ length: count }).map(() => ({
      angle: random(0, Math.PI * 2),
      distance: random(size * 0.22, size * 0.5),
      dotSize: Math.floor(random(8, 16)),
      color: palette[Math.floor(Math.random() * palette.length)],
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    }))
  ).current;

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (onComplete) onComplete();
    });
  }, []);

  return (
    <View pointerEvents="none" style={[styles.overlay, { width: size, height: size }]}>
      {particles.map((p, i) => {
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(p.angle) * p.distance],
        });
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(p.angle) * p.distance],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.15, 1],
          outputRange: [0, 1, 0],
        });
        const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.1] });

        return (
          <Animated.Text
            key={i}
            style={[
              styles.particle,
              {
                fontSize: p.dotSize,
                color: p.color,
                textShadowColor: p.color,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }],
              },
            ]}
          >
            {p.glyph}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});