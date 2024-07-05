import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('window');

export default function PropertyImages({ propertyImages }) {
  if (!propertyImages || propertyImages.length === 0) {
    return (
      <View style={styles.noImagesContainer}>
        <Text style={styles.noImagesText}>No images available</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList 
        data={propertyImages}
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 340,
    resizeMode: 'cover',
  },
  noImagesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
  },
  noImagesText: {
    color: '#687076',
    fontSize: 16,
  },
});
