// PropertiesList.js
import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PopularPropertiesCard from '../../components/Home/PopularPropertiesCard';
import { Colors } from '../../constants/Colors';

const PropertiesList = ({ loading, properties }) => {
  return (
    loading ? (
      <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loadingIndicator} />
    ) : properties.length === 0 ? (
      <Text style={styles.noPropertiesText}>No properties found</Text>
    ) : (
      <FlatList
        data={properties}
        keyExtractor={(item) => item.docId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.propertyItem}>
            <PopularPropertiesCard property={item} />
          </View>
        )}
      />
    )
  );
};

const styles = StyleSheet.create({
  propertyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_LIGHT,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginBottom: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPropertiesText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit-medium',
    color: Colors.GRAY,
  },
});

export default PropertiesList;
