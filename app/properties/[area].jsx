import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import PopularPropertiesCard from '../../components/Home/PopularPropertiesCard'; // Assume you have a PropertyCard component

export default function PropertiesByArea() {
    const { area } = useLocalSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        GetPropertiesByArea();
    }, []);

    const GetPropertiesByArea = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'Properties'), where('locality', '==', area));
            const querySnapshot = await getDocs(q);

            const propertiesData = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setProperties(propertiesData);
            
        } catch (err) {
            setError('Failed to load properties by area');
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

    if (properties.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={[styles.noDataText, {marginTop: '100%'}]}>No properties found in this area.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Properties in {area}</Text>
            <FlatList
                data={properties}
                keyExtractor={(item) => item.docId}
                renderItem={({ item }) => <PopularPropertiesCard property={item} />} // Render your property card
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 20,
        fontFamily: 'outfit-bold',
        padding: 20,
        paddingTop: 40,
    },
    flatListContainer: {
        paddingHorizontal: 10,
    },
    errorText: {
        color: '#FF0000',
        fontFamily: 'outfit',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    noDataText: {
        color: Colors.GRAY,
        fontFamily: 'outfit',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
});
