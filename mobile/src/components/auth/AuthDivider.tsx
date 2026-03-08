import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>Or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#8A8A8A",
  },
});