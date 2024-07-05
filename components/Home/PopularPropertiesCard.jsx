import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function PopularPropertiesCard({ property }) {
    const router = useRouter();
    const firstImageUrl = property?.imageUrl[0];

    return (
        <TouchableOpacity
            onPress={() => router.push(`/propertydetails/${property?.docId}`)}
            style={{
                marginLeft: 10,
                padding: 10,
                backgroundColor: '#FFF',
                borderRadius: 15,
                flexDirection: 'row',
                maxWidth: '90%',
                overflow: 'hidden', // Ensure no overflow beyond maxWidth
            }}
        >
            <View>
                <Image
                    source={{ uri: firstImageUrl }}
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 15,
                    }}
                />
            </View>
            <View style={{ marginLeft: 10, flexShrink: 1 }}>
                <Text style={{ fontFamily: 'outfit-bold', fontSize: 14 }}>{property?.name}</Text>
                <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>{`${property?.share} per month`}</Text>
                <Text style={{ fontFamily: 'outfit', fontSize: 12, color: Colors.GRAY }}>{property?.locality}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={{ fontFamily: 'outfit', backgroundColor: Colors.PRIMARY, color: '#FFF', padding: 3, fontSize: 10, borderRadius: 5 }}>{property?.furnished ? 'Furnished' : 'Not Furnished'}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 3, marginTop: 10, justifyContent: 'flex-end' }}>
                    <Text style={{ fontFamily: 'outfit', fontSize: 12 }}>{`Shortlisted: ${property?.shortlisted}`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
