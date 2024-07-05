import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { Colors } from '../../constants/Colors';

export default function Slider() {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    try {
      const q = query(collection(db, 'Sliders'));
      const querySnapshots = await getDocs(q);
      const sliderData = querySnapshots.docs.map(doc => doc.data());
      setSlider(sliderData);
    } catch (err) {
      setError('Failed to load slider data');
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
    <View style={styles.container}>
      <Text style={styles.title}>#Special for you</Text>
      <FlatList
        data={slider}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    paddingLeft: 20,
    marginBottom: 5,
  },
  flatListContent: {
    paddingLeft: 20,
  },
  image: {
    width: 300,
    height: 160,
    borderRadius: 15,
    marginRight: 15,
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
