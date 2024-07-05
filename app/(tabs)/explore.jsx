import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import TitleAndToggleButton from './../../components/Explore/TitleAndToggleButton';
import FiltersSection from './../../components/Explore/FiltersSection';
import PropertiesList from './../../components/Explore/PropertiesList';

export default function Explore() {
  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    isFurnished: false,
    isParkingCar: false,
    isParkingBike: false,
    petsAllowed: false,
    availableForMale: false,
    availableForFemale: false,
    availableForStudent: false,
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filterAnim = useState(new Animated.Value(0))[0];

  const applyFilters = async () => {
    setLoading(true);
    let q = collection(db, 'Properties');

    if (filters.isFurnished) {
      q = query(q, where('furnished', '==', filters.isFurnished));
    }
    if (filters.isParkingCar) {
      q = query(q, where('parkingCar', '==', filters.isParkingCar));
    }
    if (filters.isParkingBike) {
      q = query(q, where('parkingBike', '==', filters.isParkingBike));
    }
    if (filters.petsAllowed) {
      q = query(q, where('pets', '==', filters.petsAllowed));
    }
    if (filters.availableForMale) {
      q = query(q, where('availableForMale', '==', filters.availableForMale));
    }
    if (filters.availableForFemale) {
      q = query(q, where('availableForFemale', '==', filters.availableForFemale));
    }
    if (filters.availableForStudent) {
      q = query(q, where('availableForStudent', '==', filters.availableForStudent));
    }

    q = query(q, limit(5));

    const querySnapshot = await getDocs(q);
    const propertiesData = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    setProperties(propertiesData);

    setLoading(false);
    setShowFilters(false);
    Animated.timing(filterAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleFilters = () => {
    if (showFilters) {
      applyFilters();
    }
    setShowFilters(!showFilters);
    Animated.timing(filterAnim, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterSectionHeight = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={styles.container}>
      <TitleAndToggleButton
        title="Explore Properties (99+)"
        showFilters={showFilters}
        toggleFilters={toggleFilters}
      />
      <Animated.View style={[styles.filtersContainer, { height: filterSectionHeight }]}>
        <FiltersSection filters={filters} handleFilterChange={handleFilterChange} />
      </Animated.View>
      <PropertiesList loading={loading} properties={properties} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.WHITE,
  },
  filtersContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
});
