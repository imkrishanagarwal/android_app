import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function IncludednAmenities({ property }) {
  const renderCheckmarkItem = (item) => (
    <View style={styles.itemContainer}>
      <MaterialCommunityIcons name="check-circle" size={24} color="#2ecc71" style={styles.icon} />
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );


  const renderBooleanItem = (title, value) => (
    <View style={styles.booleanContainer}>
      <Text style={styles.booleanTitle}>{title}:</Text>
      <Text style={styles.booleanLabel}>{value ? 'Yes' : 'No'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rent Covers</Text>
        <FlatList
          data={property?.included}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderCheckmarkItem(item)}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rent might increase because of</Text>
        <FlatList
          data={property?.notIncluded}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderCheckmarkItem(item)}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What else you get?</Text>
        <FlatList
          data={property?.amenities}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderCheckmarkItem(item)}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>

      <View style={styles.booleanSection}>
        {renderBooleanItem('Pets', property?.pets)}
        {renderBooleanItem('Car Parking', property?.parkingCar)}
        {renderBooleanItem('Bike Parking', property?.parkingBike)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 15,
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  itemText: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    marginLeft: 5,
    color: Colors.DARKGRAY,
  },
  icon: {
    marginRight: 5,
  },
  booleanSection: {
    marginTop: 20,
  },
  booleanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  booleanTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 15,
    width: 150,
    color: Colors.DARKGRAY,
  },
  booleanLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    color: Colors.DARKGRAY,
  },
});
