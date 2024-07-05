import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function PopularPropertiesCard({ property }) {
    const router = useRouter();
    const firstImageUrl = property?.imageUrl[0];
    
    return (
        <TouchableOpacity
            onPress={() => router.push(`/propertydetails/${property?.docId}`)}
            style={styles.card}
        >
            <Image
                source={{ uri: firstImageUrl }}
                style={styles.image}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.propertyTitle}>{property?.name}</Text>
                <Text style={styles.propertyText}>{`Share: ${property?.share} per month`}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.propertyText}>{property?.furnished ? 'Furnished' : 'Unfurnished'}</Text>
                    <Text style={styles.propertyText}>{property?.parkingCar ? 'Car Parking' : 'No Car Parking'}</Text>
                    <Text style={styles.propertyText}>{property?.parkingBike ? 'Bike Parking' : 'No Bike Parking'}</Text>
                    <Text style={styles.propertyText}>{property?.pets ? 'Pets Allowed' : 'No Pets Allowed'}</Text>
                    <View style={styles.availabilityContainer}>
                        {property?.availableForMale && <Text style={styles.tag}>Male</Text>}
                        {property?.availableForFemale && <Text style={styles.tag}>Female</Text>}
                        {property?.availableForStudent && <Text style={styles.tag}>Student</Text>}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10, // Reduced space between cards
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center', // Vertically center image and text
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10, // Space between image and text
    },
    infoContainer: {
        flex: 1,
    },
    propertyTitle: {
        fontFamily: 'outfit-bold',
        fontSize: 16,
        marginBottom: 5,
        color: Colors.TEXT,
    },
    propertyText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.GRAY,
        marginBottom: 3,
    },
    detailsContainer: {
        marginTop: 5,
    },
    availabilityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    tag: {
        backgroundColor: Colors.PRIMARY,
        color: '#FFF',
        paddingVertical: 3,
        paddingHorizontal: 6,
        fontSize: 12,
        borderRadius: 15,
        marginRight: 5,
        marginBottom: 5,
    },
});
