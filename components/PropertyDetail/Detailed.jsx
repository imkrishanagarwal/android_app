import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function Detailed({ detailed }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.description}>{detailed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: Colors.GRAY, // Consistent border color with other components
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 10, // Space between title and description
    color: Colors.PRIMARY, // Use primary color for title to make it stand out
  },
  description: {
    fontFamily: 'outfit',
    fontSize: 16, // Slightly smaller font size for the description
    lineHeight: 24, // Adjust line height for better readability
    color: Colors.text, // Use text color for consistency
  },
});
  