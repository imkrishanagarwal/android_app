import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Share, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ActionButton({ property }) {
    const actionButtonMenu = [
        {
            id: 1,
            name: 'Call',
            icon: require('./../../assets/images/phone.png'),
            url: `tel:${property?.contact}`,
        },
        {
            id: 2,
            name: 'Location',
            icon: require('./../../assets/images/pin.png'),
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property?.address)}`,
        },
        {
            id: 3,
            name: 'Whatsapp',
            icon: require('./../../assets/images/whatsapp.png'),
            url: `https://wa.me/+91${property?.contact}`,
        },
        {
            id: 4,
            name: 'Share',
            icon: require('./../../assets/images/share.png'),
            action: 'share',
        },
    ];

    const onPressHandler = (item) => {
        if (item.name === 'Share') {
            Share.share({
                message: `${property?.name} \n Address: ${property?.address} \n Find more details on Flat n Flatmates App!`
            });
        } else {
            Linking.openURL(item.url);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                {actionButtonMenu.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => onPressHandler(item)}
                        style={styles.button}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={item.icon}
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.LIGHTGRAY,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    buttonText: {
        fontFamily: 'outfit-medium',
        textAlign: 'center',
        marginTop: 5,
        fontSize: 14,
        color: Colors.GRAY,
    },
});
