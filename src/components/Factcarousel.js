import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function FactCarousel({ facts, width, textColor, dotActive, dotInactive, arrowColor }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  // Picks a fresh starting fact each time this mounts (e.g. each time the tab is opened).
  const initialIndex = useRef(Math.floor(Math.random() * facts.length)).current;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: initialIndex * width, animated: false });
      setIndex(initialIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (newIndex) => {
    const wrapped = (newIndex + facts.length) % facts.length;
    scrollRef.current?.scrollTo({ x: wrapped * width, animated: true });
    setIndex(wrapped);
  };

  const handleScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <View style={{ width }}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => goTo(index - 1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="chevron-left" size={16} color={arrowColor} />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          style={{ width: width - 56 }}
        >
          {facts.map((f, i) => (
            <View key={i} style={{ width: width - 56 }}>
              <Text style={[styles.fact, { color: textColor }]}>{f}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={() => goTo(index + 1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  fact: { fontSize: 12, lineHeight: 17, opacity: 0.85, minHeight: 52 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 8 },
  dot: { width: 4, height: 4, borderRadius: 2 },
});