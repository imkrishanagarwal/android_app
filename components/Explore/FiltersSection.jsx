// FiltersSection.js
import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';

const FiltersSection = ({ filters, handleFilterChange }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.filtersContainer}>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Furnishing</Text>
        <View style={styles.switchContainer}>
          <Text>Furnished</Text>
          <Switch value={filters.isFurnished} onValueChange={value => handleFilterChange('isFurnished', value)} />
        </View>
      </View>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Parking</Text>
        <View style={styles.switchContainer}>
          <Text>Car Parking</Text>
          <Switch value={filters.isParkingCar} onValueChange={value => handleFilterChange('isParkingCar', value)} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Bike Parking</Text>
          <Switch value={filters.isParkingBike} onValueChange={value => handleFilterChange('isParkingBike', value)} />
        </View>
      </View>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Pets</Text>
        <View style={styles.switchContainer}>
          <Text>Pets Allowed</Text>
          <Switch value={filters.petsAllowed} onValueChange={value => handleFilterChange('petsAllowed', value)} />
        </View>
      </View>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Availability</Text>
        <View style={styles.switchContainer}>
          <Text>Available for Male</Text>
          <Switch value={filters.availableForMale} onValueChange={value => handleFilterChange('availableForMale', value)} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Available for Female</Text>
          <Switch value={filters.availableForFemale} onValueChange={value => handleFilterChange('availableForFemale', value)} />
        </View>
        <View style={styles.switchContainer}>
          <Text>Available for Student</Text>
          <Switch value={filters.availableForStudent} onValueChange={value => handleFilterChange('availableForStudent', value)} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  filterSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_LIGHT,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default FiltersSection;
