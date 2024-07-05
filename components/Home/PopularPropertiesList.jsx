import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PopularPropertiesCard from './PopularPropertiesCard';

export default function PopularPropertiesList() {
  const [popularProperties, setPopularProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetPopularProperties();
  }, []);

  const GetPopularProperties = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'Properties'), limit(10));
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      setPopularProperties(properties);
    } catch (err) {
      setError('Failed to load popular properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Properties</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <FlatList
        data={popularProperties}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => <PopularPropertiesCard property={item} />}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
  },
  viewAll: {
    color: Colors.PRIMARY,
    fontFamily: 'outfit-medium',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
