import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

export default function AreaItem({area}) {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity
      onPress={()=>router.push(`/properties/${area.name}`)}
      style={{
        padding: 10,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 20,
        marginLeft: 10,
      }}>
        <Text style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: 'outfit-medium'
        }}>{area.name}</Text>
      </TouchableOpacity>
      </View>
  )
}