import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View, Easing } from "react-native";
import { colors } from "../theme/colors";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function StarRain({
  count = 28,
  palette = [colors.plum, colors.brassLight, colors.cream],
  sizeRange = [10, 22],
  durationRange = [1400, 3200],
  onComplete,
  emoji = "★",
}) {
  const stars = useRef([]);
  const created = useRef(false);

  if (!created.current) {
    // initialize star data once
    for (let i = 0; i < count; i++) {
      const left = random(6, Math.max(24, SCREEN_W - 24));
      const size = Math.floor(random(sizeRange[0], sizeRange[1]));
      const color = palette[Math.floor(Math.random() * palette.length)];
      const delay = Math.floor(random(0, 900));
      const duration = Math.floor(random(durationRange[0], durationRange[1]));
      const translateY = new Animated.Value(random(-SCREEN_H * 0.6, -20));
      const opacity = new Animated.Value(0);
      const rotateStart = random(-60, 60);
      const rotate = new Animated.Value(rotateStart);
      const jitterX = random(-8, 8);
      const scale = new Animated.Value(random(0.85, 1));

      stars.current.push({
        left,
        size,
        color,
        delay,
        duration,
        translateY,
        opacity,
        rotate,
        rotateStart,
        jitterX,
        scale,
      });
    }
    created.current = true;
  }

  useEffect(() => {
    const anims = stars.current.map((s) => {
      // rotate to a slightly different angle while falling
      const rotateTo = s.rotateStart + random(40, 140);

      return Animated.sequence([
        Animated.delay(s.delay),
        Animated.parallel([
          // gentle fade-in
          Animated.timing(s.opacity, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // fall with easing for smoother motion
          Animated.timing(s.translateY, {
            toValue: SCREEN_H + 80,
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
          // slight scale up during fall for a softer presence
          Animated.timing(s.scale, {
            toValue: 1.05,
            duration: Math.min(s.duration, 800),
                      easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    // stagger slightly so they don't all fall at once
    Animated.stagger(35, anims).start(() => {
      // after the fall, gracefully fade all stars out and slightly shrink before signalling completion
      const fadeOuts = stars.current.map((s) =>
        Animated.parallel([
          Animated.timing(s.opacity, { toValue: 0, duration: 650, useNativeDriver: true }),
          Animated.timing(s.scale, { toValue: 0.85, duration: 650, useNativeDriver: true }),
        ])
      );
      Animated.parallel(fadeOuts).start(() => {
        if (onComplete) onComplete();
      });
    });

    // nothing to cleanup for Animated.Values here
  }, []);

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {stars.current.map((s, i) => {
        const rotate = s.rotate.interpolate({
          inputRange: [-360, 360],
          outputRange: ["-360deg", "360deg"],
        });

        return (
          <Animated.Text
            key={i}
            style={[
              styles.star,
              {
                left: s.left,
                fontSize: s.size,
                color: s.color,
                opacity: s.opacity,
                transform: [
                  { translateY: s.translateY },
                  { translateX: s.jitterX },
                  { rotate },
                      { scale: s.scale },
                    ],
              },
            ]}
          >
            {emoji}
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
    // textShadow helps the star pop on varied backgrounds
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
