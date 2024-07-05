import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import AreaItem from './AreaItem';

export default function Areas({arealist, loading, error}) {

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
        <Text style={styles.title}>#Top Localities</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <FlatList
        data={arealist}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <AreaItem area={item} />}
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
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
  },
  viewAll: {
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
  },
  flatListContainer: {
    paddingLeft: 10,
  },
  errorText: {
    color: '#FF0000',
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
