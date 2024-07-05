import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useWarmUpBrowser } from './../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';



WebBrowser.maybeCompleteAuthSession();



export default function LoginScreen() {
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    }, [startOAuthFlow]);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/loginbg.jpg')} style={styles.image} />
            </View>
            <View style={styles.subContainer}>
                <Text style={styles.textAlign}>Your Ultimate Flatmate Finder</Text>
                <Text style={styles.title}>
                    <Text style={styles.primaryText}>Connect & Share</Text> Smartly.
                </Text>
                <TouchableOpacity style={styles.btn} onPress={onPress} accessibilityRole="button" accessibilityLabel="Let's Get Started">
                    <Text style={styles.btnText}>Let's Get Started</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    By clicking "Let's Get Started," you agree to our Terms and Conditions and Privacy Policy.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    imageContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 100,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 20,
        borderWidth: 6,
        borderColor: '#000',
    },
    subContainer: {
        backgroundColor: '#FFF',
        padding: 10,
        marginTop: -20,
    },
    textAlign: {
        fontSize: 30,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
    },
    title: {
        fontSize: 30,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        marginTop: 40,
    },
    primaryText: {
        color: Colors.PRIMARY,
    },
    btn: {
        backgroundColor: Colors.PRIMARY,
        padding: 16,
        borderRadius: 99,
        marginTop: 40,
    },
    btnText: {
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'outfit',
    },
    termsContainer: {
        padding: 10,
        alignItems: 'center',
    },
    termsText: {
        color: '#bbd4ce',
        fontFamily: 'outfit',
    },
});
