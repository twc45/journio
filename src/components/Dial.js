import React, { useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const SIZE = 220;
const CENTER = SIZE / 2;

export default function Dial({ onReveal, spinning }) {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0);

  const handlePress = () => {
    if (spinning) return;
    const extra = 360 * 2 + Math.floor(Math.random() * 320);
    totalRotation.current += extra;
    Animated.timing(rotateValue, {
      toValue: totalRotation.current,
      duration: 1100,
      useNativeDriver: true,
    }).start();
    onReveal();
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const ticks = Array.from({ length: 12 });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ rotate: rotateInterpolate }] }]}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle cx={CENTER} cy={CENTER} r={96} fill="none" stroke={colors.inkLine} strokeWidth={1} />
        <Circle cx={CENTER} cy={CENTER} r={80} fill="none" stroke={colors.brass} strokeWidth={1.2} opacity={0.6} />
        {ticks.map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = CENTER + 96 * Math.sin(angle);
          const y1 = CENTER - 96 * Math.cos(angle);
          const x2 = CENTER + 86 * Math.sin(angle);
          const y2 = CENTER - 86 * Math.cos(angle);
          return (
            <Line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.brassLight}
              strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
              opacity={i % 3 === 0 ? 0.9 : 0.4}
            />
          );
        })}
        {[15, 75, 135, 195, 255, 315].map((deg, i) => {
          const angle = (deg * Math.PI) / 180;
          const x = CENTER + 68 * Math.sin(angle);
          const y = CENTER - 68 * Math.cos(angle);
          return <Circle key={i} cx={x} cy={y} r={1.6} fill={colors.cream} opacity={0.7} />;
        })}
      </Svg>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.button}>
        <Feather name="moon" size={30} color={colors.brassLight} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  button: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.inkLight,
    borderWidth: 1,
    borderColor: colors.brass,
    alignItems: "center",
    justifyContent: "center",
  },
});
