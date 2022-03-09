import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function ComingSoon() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ComingSoon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
