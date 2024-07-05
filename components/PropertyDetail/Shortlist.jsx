import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { arrayUnion, arrayRemove, doc, increment, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { db } from '../../config/FirebaseConfig';

const Shortlist = ({ property }) => {
  const [filled, setFilled] = useState(false);
  const [heartFillAnimation] = useState(new Animated.Value(0));
  const [shortlistedCount, setShortlistedCount] = useState(property?.shortlisted || 0);
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const handlePress = () => {
    if (filled) {
      setFilled(false);
      Animated.timing(heartFillAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
      updateShortlist("remove");
    } else {
      setFilled(true);
      Animated.timing(heartFillAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
      updateShortlist("add");
    }
  };

  const heartFillInterpolation = heartFillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#e74c3c'],
  });

  const updateShortlist = async (task) => {
    const docRef = doc(db, 'Properties', property?.docId);

    try {
      if (task === "add") {
        await updateDoc(docRef, {
          shortlistedBy: arrayUnion({
            name: user?.fullName,
            userEmail: userEmail,
          }),
          shortlisted: increment(1),
        });
        setShortlistedCount(prevCount => prevCount + 1);
        await updateUserShortlist(arrayUnion(property?.docId));
      } else if (task === "remove") {
        await updateDoc(docRef, {
          shortlistedBy: arrayRemove({
            name: user?.fullName,
            userEmail: userEmail,
          }),
          shortlisted: increment(-1),
        });
        setShortlistedCount(prevCount => prevCount - 1);
        await updateUserShortlist(arrayRemove(property?.docId));
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const updateUserShortlist = async (updateOperation) => {
    try {
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Assuming email is unique, there should be only one document
        const userDocRef = doc(db, 'Users', userDoc.id);
        await updateDoc(userDocRef, {
          shortlistedProperties: updateOperation
        });
      }
    } catch (error) {
      console.error("Error updating user document: ", error);
    }
  };

  const checkIfShortlisted = async () => {
    const docRef = doc(db, 'Properties', property?.docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const isShortlisted = data.shortlistedBy?.some(
        (entry) => entry?.userEmail === userEmail
      );

      if (isShortlisted) {
        setFilled(true);
        Animated.timing(heartFillAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    }
  };

  useEffect(() => {
    if (property?.docId && userEmail) {
      checkIfShortlisted();
    }
  }, [property?.docId, userEmail, heartFillAnimation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.touchable}>
        <Animated.View style={[styles.heartContainer, { backgroundColor: heartFillInterpolation }]}>
          <MaterialCommunityIcons
            name={filled ? 'heart' : 'heart-outline'}
            size={24}
            color={filled ? '#ffffff' : '#e74c3c'}
            style={styles.heartIcon}
          />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.shortlistContainer}>
        <Text style={styles.shortlistText}>{shortlistedCount}</Text>
        <Text style={styles.shortlistLabel}>Shortlisted</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginVertical: 10,
  },
  touchable: {
    borderRadius: 50,
  },
  heartContainer: {
    padding: 10,
    borderRadius: 50,
  },
  heartIcon: {
    backgroundColor: 'transparent',
  },
  shortlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortlistText: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginRight: 5,
  },
  shortlistLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#666',
  },
});

export default Shortlist;
