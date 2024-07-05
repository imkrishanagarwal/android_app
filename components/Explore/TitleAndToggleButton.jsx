// TitleAndToggleButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const TitleAndToggleButton = ({ title, showFilters, toggleFilters }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={toggleFilters} style={styles.toggleButton}>
        <Ionicons name={showFilters ? "close" : "filter"} size={24} color={Colors.WHITE} />
        <Text style={styles.toggleButtonText}>{showFilters ? 'Apply Filters' : 'Show Filters'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginLeft: 10,
  },
});

export default TitleAndToggleButton;
