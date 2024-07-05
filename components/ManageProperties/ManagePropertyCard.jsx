import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import FindFlatmates from '../post/flatmates';
import { useRouter } from 'expo-router';

const ManagePropertyCard = ({ property }) => {
  const router = useRouter();
  const onPresshandler = () =>{
    router.push(`/posts/${property.docId}`)
  };
  return (
    <TouchableOpacity style={styles.card} onPress={()=>{onPresshandler()}}>
      <Text style={styles.propertyName}>{property.name}</Text>
      <Text style={styles.propertyDescription}>Shortlisted By: {property.shortlisted}</Text>
      
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: Colors.LIGHTGRAY,
    borderRadius: 8,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 10,
  },
  propertyDescription: {
    fontSize: 16,
    color: Colors.DARKGRAY,
  },
});

export default ManagePropertyCard;
