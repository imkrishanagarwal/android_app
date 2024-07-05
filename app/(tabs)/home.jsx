import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import Areas from '../../components/Home/Areas';
import PopularPropertiesList from '../../components/Home/PopularPropertiesList';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arealist, setAreaList] = useState([]);

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.fullName;

  useEffect(() => {
    if (userEmail) {
      insertUserToFirestore(userEmail, userName);
    }
    GetAreaList();
  }, [userEmail, userName]); // Added userEmail and userName as dependencies

  const GetAreaList = async () => {
    try {
      const q = collection(db, 'Properties');
      const querySnapshot = await getDocs(q);
      const localities = querySnapshot.docs.map(doc => doc.data().locality);
      const uniqueLocalitiesSet = new Set(localities);
      const uniqueLocalitiesArray = Array.from(uniqueLocalitiesSet); 
      const areaListWithNames = uniqueLocalitiesArray.map(locality => ({ name: locality }));    
      setAreaList(areaListWithNames);
    } catch (err) {
      setError('Failed to load areas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const insertUserToFirestore = async (userEmail, userName) => {
    try {
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // No existing user found, proceed to add a new user
        const newUser = {
          email: userEmail,
          name: userName,
        };
        await addDoc(usersCollection, newUser);
        console.log('User added to Firestore:', newUser);
      } else {
        console.log('User with this email already exists.');
      }
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header arealist={arealist} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false} // Hides scroll indicator for a cleaner look
      >
        <Slider />
        <Areas arealist={arealist} loading={loading} error={error}/>
        <PopularPropertiesList />
        <View style={styles.footerSpace}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Light gray background for a subtle look
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensures that content doesn't get hidden behind any tab bars or footers
  },
  footerSpace: {
    height: 100, // Space at the bottom to ensure content isn't obscured by a potential footer or tab bar
  },
});
