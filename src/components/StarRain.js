import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View, Easing } from "react-native";
import { colors } from "../theme/colors";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Small mix of sparkle glyphs rather than one repeated star, for a glitter feel.
const SPARKLE_GLYPHS = ["✦", "✧", "⋆", "★", "✨"];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function StarRain({
  count = 32,
  // Gold-only tones from the brand palette, no plum — keeps it reading as "glitter" not "confetti".
  palette = [colors.brass, colors.brassLight, colors.cream],
  sizeRange = [6, 15],
  durationRange = [900, 2000],
  onComplete,
}) {
  const stars = useRef([]);
  const created = useRef(false);

  if (!created.current) {
    for (let i = 0; i < count; i++) {
      const left = random(6, Math.max(24, SCREEN_W - 24));
      const size = Math.floor(random(sizeRange[0], sizeRange[1]));
      const color = palette[Math.floor(Math.random() * palette.length)];
      const glyph = SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)];
      const delay = Math.floor(random(0, 900));
      const duration = Math.floor(random(durationRange[0], durationRange[1]));
      const translateY = new Animated.Value(random(-SCREEN_H * 0.6, -20));
      const opacity = new Animated.Value(0);
      const twinkle = new Animated.Value(0.6);
      const rotateStart = random(-60, 60);
      const rotate = new Animated.Value(rotateStart);
      const jitterX = random(-8, 8);
      const scale = new Animated.Value(random(0.7, 1));

      stars.current.push({
        left, size, color, glyph, delay, duration,
        translateY, opacity, twinkle, rotate, rotateStart, jitterX, scale,
      });
    }
    created.current = true;
  }

  useEffect(() => {
    const anims = stars.current.map((s) => {
      const rotateTo = s.rotateStart + random(40, 140);
      return Animated.sequence([
        Animated.delay(s.delay),
        Animated.parallel([
          Animated.timing(s.opacity, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // a quick twinkle flicker as it appears, then it settles — gives the glitter shimmer
          Animated.sequence([
            Animated.timing(s.twinkle, { toValue: 1, duration: 120, useNativeDriver: true }),
            Animated.timing(s.twinkle, { toValue: 0.5, duration: 120, useNativeDriver: true }),
            Animated.timing(s.twinkle, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]),
          Animated.timing(s.translateY, {
            toValue: SCREEN_H + 60,
            duration: s.duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(s.rotate, {
            toValue: rotateTo,
            duration: s.duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(s.scale, {
            toValue: 1,
            duration: Math.min(s.duration, 600),
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(25, anims).start(() => {
      const fadeOuts = stars.current.map((s) =>
        Animated.parallel([
          Animated.timing(s.opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(s.scale, { toValue: 0.7, duration: 500, useNativeDriver: true }),
        ])
      );
      Animated.parallel(fadeOuts).start(() => {
        if (onComplete) onComplete();
      });
    });
  }, []);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {stars.current.map((s, i) => {
        const rotate = s.rotate.interpolate({
          inputRange: [-360, 360],
          outputRange: ["-360deg", "360deg"],
        });
        // combine the base fade with the twinkle flicker
        const combinedOpacity = Animated.multiply(s.opacity, s.twinkle);
        return (
          <Animated.Text
            key={i}
            style={[
              styles.star,
              {
                left: s.left,
                fontSize: s.size,
                color: s.color,
                textShadowColor: s.color,
                opacity: combinedOpacity,
                transform: [
                  { translateY: s.translateY },
                  { translateX: s.jitterX },
                  { rotate },
                  { scale: s.scale },
                ],
              },
            ]}
          >
            {s.glyph}
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
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    zIndex: 9999,
  },
  star: {
    position: "absolute",
    // a warm glow in the star's own colour, rather than a dark drop shadow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});