import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function FactCarousel({ facts, width, textColor, dotActive, dotInactive, arrowColor }) {
  // Starts on a fresh random fact each time this mounts (e.g. each time the tab is opened).
  const [index, setIndex] = useState(() => Math.floor(Math.random() * facts.length));
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const animateTo = (newIndex, direction) => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: direction * -18, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      setIndex(newIndex);
      translateX.setValue(direction * 18);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => animateTo((index + 1) % facts.length, 1);
  const goPrev = () => animateTo((index - 1 + facts.length) % facts.length, -1);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -24) goNext();
        else if (gesture.dx > 24) goPrev();
      },
    })
  ).current;

  return (
    <View style={{ width }}>
      <View style={styles.row}>
        <TouchableOpacity onPress={goPrev} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="chevron-left" size={16} color={arrowColor} />
        </TouchableOpacity>

        <View style={styles.factBox} {...panResponder.panHandlers}>
          <Animated.Text
            style={[styles.fact, { color: textColor, opacity, transform: [{ translateX }] }]}
          >
            {facts[index]}
          </Animated.Text>
        </View>

        <TouchableOpacity onPress={goNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="chevron-right" size={16} color={arrowColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.dots}>
        {facts.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === index ? dotActive : dotInactive }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  factBox: { flex: 1 },
  fact: { fontSize: 12, lineHeight: 17, opacity: 0.85, minHeight: 52 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 8 },
  dot: { width: 4, height: 4, borderRadius: 2 },
});