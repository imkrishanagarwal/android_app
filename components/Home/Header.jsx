import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header({ arealist }) {
  const { user } = useUser();
  const [searchText, setSearchText] = useState('');
  const [filteredAreas, setFilteredAreas] = useState([]);
  const router = useRouter();

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = arealist.filter(area =>
        area.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas([]);
    }
  };

  const handleAreaSelect = (area) => {
    setSearchText(area.name);
    router.push(`/properties/${area.name}`);
    setFilteredAreas([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image 
          source={{ uri: user?.imageUrl }} 
          style={styles.userImage} 
        />
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{user?.fullName}</Text>
        </View>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={24} color={Colors.PRIMARY} />
        <TextInput 
          placeholder='Search Localites...' 
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.GRAY}
        />
      </View>
      {/* Dropdown List */}
      {filteredAreas.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredAreas}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleAreaSelect(item)}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.dropdownList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  welcomeText: {
    color: '#FFF',
    fontFamily: 'outfit',
    fontSize: 16,
  },
  userName: {
    fontSize: 19,
    fontFamily: 'outfit-medium',
    color: '#FFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 10,
    color: Colors.text,
  },
  dropdownContainer: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
    maxHeight: 200, // Adjust as needed
    overflow: 'hidden',
  },
  dropdownList: {
    padding: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
  },
  dropdownText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.TEXT,
  },
});
