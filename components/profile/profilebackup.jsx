import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useUser, useSignOut, useClerk } from '@clerk/clerk-expo';
import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk(); // Import the useSignOut hook
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Default image
  const [imageUrl, setImageUrl] = useState(require('./../../assets/images/placeholder.png'));

  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('30');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, Mumbai, India');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedIn] = useState('');
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [company, setCompany] = useState('Tech Corp');

  const [docId, setDocId] = useState('');

  const GetUserDetails = async () => {
    try {
      const q = query(collection(db, 'Users'), where('email', '==', userEmail), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      setDocId(doc.id); // Store docId
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await GetUserDetails();
    setIsRefreshing(false);
  };

  useEffect(() => {
    GetUserDetails();
  }, [userEmail]);

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '');
      setGender(userDetails.gender || '');
      setAge(userDetails.age || '');
      setEmail(userDetails.email || '');
      setPhone(userDetails.phone || '');
      setAddress(userDetails.address || '');
      setFacebook(userDetails.facebook || '');
      setInstagram(userDetails.instagram || '');
      setLinkedIn(userDetails.linkedin || '');
      setJobTitle(userDetails.jobTitle || '');
      setCompany(userDetails.company || '');

      // Set image based on gender
      if (userDetails.gender === 'female') {
        setImageUrl(require('./../../assets/images/female-placeholder.jpg'));
      } else if (userDetails.gender === 'male') {
        setImageUrl(require('./../../assets/images/male-placeholder.jpg'));
      } else {
        setImageUrl(require('./../../assets/images/placeholder.png'));
      }
    }
  }, [userDetails]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsEditing(false);

    if (!docId) {
      console.error('Document ID is not available.');
      return;
    }

    try {
      const userDocRef = doc(db, 'Users', docId);

      await updateDoc(userDocRef, {
        name,
        gender,
        age,
        email,
        phone,
        address,
        facebook,
        instagram,
        linkedin,
        jobTitle,
        company,
      });

      console.log('User details updated successfully.');
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('User signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Image 
          source={imageUrl} 
          style={styles.profilePicture} 
        />
        <Text style={styles.username}>{name}</Text>
        <TouchableOpacity style={styles.editIcon} onPress={isEditing ? handleSave : handleEditToggle}>
          <MaterialCommunityIcons name={isEditing ? 'content-save' : 'pencil'} size={24} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderField('Name', name, setName, isEditing)}
        {renderField('Age', age, setAge, isEditing, 'numeric')}
        {renderField('Email', email, setEmail, isEditing)}
        {renderField('Phone Number', phone, setPhone, isEditing, 'phone-pad')}
        {renderField('Address', address, setAddress, isEditing)}
        {renderGenderField('Gender', gender, setGender, isEditing)}
        {renderField('Job Title', jobTitle, setJobTitle, isEditing)}
        {renderField('Current Company', company, setCompany, isEditing)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Media Links</Text>
        {renderField('Facebook', facebook, setFacebook, isEditing)}
        {renderField('Instagram', instagram, setInstagram, isEditing)}
        {renderField('LinkedIn', linkedin, setLinkedIn, isEditing)}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const renderField = (label, value, setValue, isEditing, keyboardType = 'default') => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    {isEditing ? (
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={setValue} 
        keyboardType={keyboardType}
        placeholder={label}
        placeholderTextColor={Colors.GRAY}
      />
    ) : (
      <Text style={styles.text}>{value || 'N/A'}</Text>
    )}
  </View>
);

const renderGenderField = (label, value, setValue, isEditing) => {
  const genderList = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Prefer not to Say', value: 'none' }
  ];
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={genderList}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Gender"
          value={value.toLowerCase()}  // Ensure value matches the dropdown valueField
          onChange={item => {
            setValue(item.value); // Update gender value
          }}
        />
      ) : (
        <Text style={styles.text}>{value || 'N/A'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: Colors.light.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  input: {
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: Colors.WHITE,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.LIGHTGRAY,
  },
  dropdown: {
    height: 40,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.light.text,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
