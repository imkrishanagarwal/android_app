import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For adding icons

export default function Basic({ property }) {
  return (
    <View style={styles.container}>
      <Text style={styles.propertyName}>{property?.name}</Text>
      <Text style={styles.textBasic}>{`${property?.share} per month`}</Text>
      <Text style={styles.textBasic}>{property?.locality}</Text>
      <View style={styles.row}>
        <MaterialCommunityIcons name="calendar" size={16} color={Colors.GRAY} />
        <Text style={styles.textBasic}>{`Available from ${property?.available}`}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{property?.furnished ? 'Furnished' : 'Not Furnished'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTGRAY, // Using LIGHTGRAY for separation
  },
  propertyName: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    marginBottom: 10,
  },
  textBasic: {
    fontFamily: 'outfit',
    color: Colors.DARKGRAY,
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  status: {
    fontFamily: 'outfit',
    backgroundColor: Colors.PRIMARY,
    color: '#FFF',
    padding: 5,
    fontSize: 12,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
