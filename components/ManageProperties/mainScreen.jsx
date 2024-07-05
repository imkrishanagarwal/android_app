import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import ManagePropertyCard from './ManagePropertyCard'; // Adjust the import path as needed
import { Ionicons } from '@expo/vector-icons'; // Use icons from @expo/vector-icons
import { useUser } from '@clerk/clerk-expo';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function MainScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(''); // Add error state

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchProperties = async () => {
      try {

        // Create a query to fetch properties posted by the user
        const propertiesQuery = query(
          collection(db, 'Properties'),
          where('postedBy', '==', userEmail)
        );

        const querySnapshot = await getDocs(propertiesQuery);
        const propertiesData = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        
        setProperties(propertiesData);
      } catch (err) {
        setError('Error fetching properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userEmail]);

  const handleFindFlatmates = () => {
    router.push('/posts/empty');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Manage Properties</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <ManagePropertyCard key={property.id} property={property} />
          ))
        ) : (
          <Text style={styles.noPropertiesText}>No properties added yet</Text>
        )}
      </View>
      <TouchableOpacity style={styles.flatmatesButton} onPress={handleFindFlatmates}>
        <Ionicons name="people-outline" size={24} color={Colors.WHITE} />
        <Text style={styles.flatmatesButtonText}>Find Flatmates</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 40, // Ensure title is visible
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.TEXT,
  },
  flatmatesButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  flatmatesButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  noPropertiesText: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.PRIMARY,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.RED,
  },
});
