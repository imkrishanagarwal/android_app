import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Colors } from '../../constants/Colors';

const placeholderImage = require('./../../assets/images/placeholder.png'); // Placeholder image for flatmates

export default function CurrentOccupants({ flatmates }) {

  // Render a flatmate item
  const renderFlatmateItem = ({ item }) => (
    <View style={styles.flatmateContainer}>
      <Image source={placeholderImage} style={styles.profileImage} />
      <Text style={styles.flatmateName}>{item.name}</Text>
    </View>
  );

  // Check if flatmates is an array and has data
  if (!flatmates || !Array.isArray(flatmates) || flatmates.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Current Occupants</Text>
        <Text style={styles.emptyText}>No current occupants</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Occupants</Text>
      <FlatList
        data={flatmates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFlatmateItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: Colors.GRAY, // Use a gray border for separation
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 15,
    color: Colors.PRIMARY,
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  flatmateContainer: {
    alignItems: 'center',
    marginRight: 20, // Space between items
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd', // Placeholder background color
    marginBottom: 5, // Space between image and name
  },
  flatmateName: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.TEXT,
  },
  emptyText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
  },
});
