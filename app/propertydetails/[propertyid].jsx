import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { collection, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Detailed from '../../components/PropertyDetail/Detailed'
import PropertyImages from '../../components/PropertyDetail/PropertyImages'
import ActionButton from './../../components/PropertyDetail/ActionButton'
import Shortlist from '../../components/PropertyDetail/Shortlist';
import Basic from './../../components/PropertyDetail/Basic'
import IncludednAmenities from './../../components/PropertyDetail/IncludednAmenities';
import CurrentOccupants from './../../components/PropertyDetail/CurrentOccupants'
export default function PropertyDetails() {

    useEffect(()=>{
        GetPropertyDetails(); 
    },[])
    const {propertyid} = useLocalSearchParams();
    const [property, setProperty] = useState('');
    const [loading, setLoading] = useState(false);
    const GetPropertyDetails = async () => {
        setProperty('');
        setLoading(true);
        const docRef = doc(db, 'Properties', propertyid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){

          //  console.log(docSnap.data())
            setProperty({docId:docSnap.id, ...docSnap.data()});
            setLoading(false);
        }
        else{
            console.log("Property details not found");
            setLoading(false);
        }
    }
  return (<ScrollView>
  {loading ? (
    <ActivityIndicator
    style={styles.activityIndicator}
    size="large"
    color={Colors.PRIMARY}
  />
  ) : (
    <View style={{ flex: 1 }}>
      
      {/* Images Section */}
      <PropertyImages propertyImages={property?.imageUrl} />
      
      {/* Shortlist Section */}
      <Shortlist property={property} />
      {/* Basic Details  */}
      <Basic property={property}/>
      {/* Action Button Section */}
      <ActionButton property={property} />

      {/* Included and Amenities */}
      <IncludednAmenities property={property}  />
     
      {/* Current Occupants */}
      <CurrentOccupants flatmates = {property?.currentOccupant}/>

      {/* Detailed Section */}
      <Detailed detailed={property?.detailed} />

     
    </View>
  )}
</ScrollView>
 )
}
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
  },
});