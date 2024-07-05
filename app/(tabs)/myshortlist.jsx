import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import PopularPropertiesCard from '../../components/Home/PopularPropertiesCard';
import { Colors } from '../../constants/Colors';

export default function Activity() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const [userProperties, setUserProperties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getUserShortlisted = async () => {
    try {
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userShortlisted = querySnapshot.docs[0].data().shortlistedProperties;

        const propertyPromises = userShortlisted.map(async (propertyId) => {
          const propertyDocRef = doc(db, 'Properties', propertyId);
          const propertyDocSnap = await getDoc(propertyDocRef);

          if (propertyDocSnap.exists()) {
            // Append docId to property data
            return { ...propertyDocSnap.data(), docId: propertyId };
          } else {
            console.log(`No property found for ID: ${propertyId}`);
            return null;
          }
        });

        const properties = await Promise.all(propertyPromises);
        setUserProperties(properties.filter(property => property !== null));
      }
    } catch (error) {
      console.error("Error retrieving shortlisted properties: ", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserShortlisted();
    setRefreshing(false);
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      getUserShortlisted();
    }
  }, [userEmail]);

  const renderItem = ({ item }) => (
    <View style={styles.propertyItem}>
      <PopularPropertiesCard property={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Shortlisted Properties</Text>
      {userProperties.length > 0 ? (
        <FlatList
          data={userProperties}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Use index as key
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={styles.noPropertiesText}>No properties shortlisted</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: -20,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noPropertiesText: {
    fontSize: 16,
    color: '#888',
  },
  propertyItem: {
    paddingHorizontal: 5,
    borderBottomColor: Colors.GRAY_LIGHT,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 5,
  },
});
