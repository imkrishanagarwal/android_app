import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import {Colors} from './../../constants/Colors'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY
    }}>
        <Tabs.Screen name='home' 
        options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color})=> 
                <Ionicons 
                    name="home" 
                    size={24} 
                    color={color} />
        }} />
        <Tabs.Screen name='explore' options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({color})=> 
                <Ionicons 
                    name="search" 
                    size={24} 
                    color={color} />
        }}/>
         <Tabs.Screen name='post' options={{
            tabBarLabel: 'Post',
            tabBarIcon: ({color})=> 
                <Ionicons 
                    name="add-circle" 
                    size={24} 
                    color={color} />
        }}/>
        <Tabs.Screen name='myshortlist' options={{
            tabBarLabel: 'My List',
            tabBarIcon: ({color})=> 
                <Ionicons 
                    name="heart" 
                    size={24} 
                    color={color} />
        }}/>
        <Tabs.Screen name='profile' options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color})=> 
                <Ionicons 
                    name="people" 
                    size={24} 
                    color={color} />
        }}/>
        
    </Tabs>
  )
}