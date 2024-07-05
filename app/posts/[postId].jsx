import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Button } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Colors } from '../../constants/Colors';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function FindFlatmates() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { postId } = useLocalSearchParams();
  const [errors, setErrors] = useState({});


  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    detailed: '',
    locality: '',
    contact: '',
    whatsapp: '',
    share: '',
    furnished: false,
    parkingCar: false,
    parkingBike: false,
    pets: false,
    available: '',
    amenities: '',
    included: '',
    notIncluded: '',
    map: '',
    shortlisted: 0,
    postedBy: userEmail,
  });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: postId === "empty" ? "Add New Property" : "Modify Your Listing",
      headerShown: true
    });

    const fetchProperty = async () => {
      setLoading(true);
      try {
        if (postId !== "empty") {
          const docRef = doc(db, 'Properties', postId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProperty({ docId: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [postId]);

  useEffect(() => {
    if (property?.name) {
      setFormData({
        name: property.name || '',
        detailed: property.detailed || '',
        locality: property.locality || '',
        contact: property.contact || '',
        whatsapp: property.whatsapp || '',
        share: property.share ? property.share.toString() : '',
        furnished: property.furnished || false,
        parkingCar: property.parkingCar || false,
        parkingBike: property.parkingBike || false,
        pets: property.pets || false,
        available: property.available || '',
        amenities: property.amenities ? property.amenities.join(', ') : '',
        included: property.included ? property.included.join(', ') : '',
        notIncluded: property.notIncluded ? property.notIncluded.join(', ') : '',
        map: property.map || '',
      });
      setImages(property.imageUrl || []);
    }
  }, [property]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (value) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const handleSwitchChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const imageOperations = async () => {
    const imageUrls = [];
    for (const imageUri of images) {
      if (imageUri.startsWith('file://')) {
        const fileName = Date.now().toString() + ".jpg";
        const resp = await fetch(imageUri);
        const blob = await resp.blob();
        const imageRef = ref(storage, `properties/${fileName}`);
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      } else {
        imageUrls.push(imageUri);
      }
    }
    return imageUrls;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(item => item);
      const includedArray = formData.included.split(',').map(item => item.trim()).filter(item => item);
      const notIncludedArray = formData.notIncluded.split(',').map(item => item.trim()).filter(item => item);

      const existingImageUrls = property.imageUrl || [];
      const urls = await imageOperations();
      const imageUrls = [...existingImageUrls, ...urls].filter((url, index, self) => self.indexOf(url) === index);
      const updatedImageUrls = imageUrls.filter(url => !removedImages.includes(url));

      const propertyData = {
        ...formData,
        amenities: amenitiesArray,
        included: includedArray,
        notIncluded: notIncludedArray,
        imageUrl: updatedImageUrls,
      };

      const cleanedPropertyData = Object.fromEntries(
        Object.entries(propertyData).filter(([_, value]) => value !== undefined && value !== '')
      );

      if (postId === "empty") {
        const newDocRef = await addDoc(collection(db, 'Properties'), cleanedPropertyData);
        console.log('New property added with ID:', newDocRef.id);
        router.back();
        alert('Property added successfully');
      } else {
        const propertyRef = doc(db, 'Properties', postId);
        await updateDoc(propertyRef, cleanedPropertyData);
        console.log('Property updated successfully');
        router.back();
        alert('Property updated successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const onImagePick = async () => {
    if (images.length >= 5) {
      alert('You can only upload up to 5 images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (uri) => {
    setImages(prev => prev.filter(image => image !== uri));
    setRemovedImages(prev => [...prev, uri]);
  };

  const validateStep1 = () => {
    const requiredFields = ['name', 'locality', 'share', 'map', 'available'];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!formData.amenities.trim() || !formData.included.trim() || !formData.notIncluded.trim()) {
      alert('Please enter at least one Amenity, Included Utility, and Not Included Utility before proceeding to Step 3.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (images.length === 0) {
      alert('Please upload at least one image before proceeding.');
      return false;
    }
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color={Colors.PRIMARY}
        />
      ) : (
        <ProgressSteps
        borderWidth={4}
          activeStepIconBorderColor="#4bb543"
          progressBarColor="#ebebe4"
          completedProgressBarColor="#4bb543"
          activeStepIconColor="transparent"
          completedStepIconColor="#4bb543"
          disabledStepIconColor="#ebebe4"
          activeLabelColor="#4bb543"
          completedCheckColor="white"
        >
          <ProgressStep label="Step 1" nextBtnText="Next" onNext={validateStep1}
          errors={!!Object.keys(errors).length}
          >
            <View style={styles.stepContent}>
              <Text 
              style={styles.label}>
                Property Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.errorInput]}
                placeholder="Property Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />

              <Text style={styles.label}>Detailed Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Detailed Description"
                value={formData.detailed}
                onChangeText={(text) => handleInputChange('detailed', text)}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Locality *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="Locality"
                value={formData.locality}
                onChangeText={(text) => handleInputChange('locality', text)}
              />

              <Text style={styles.label}>Share (Rent) *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="Share (Rent)"
                value={formData.share}
                onChangeText={(text) => handleInputChange('share', text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Map URL *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="Map URL"
                value={formData.map}
                onChangeText={(text) => handleInputChange('map', text)}
              />

              <Text style={styles.label}>Available Date *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="Available Date"
                value={formData.available}
                onChangeText={(text) => handleInputChange('available', text)}
              />

              <Text style={styles.label}>Contact *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="Contact Number"
                maxLength={10}
                value={formData.contact}
                onChangeText={(text) => handleInputChange('contact', text)}
                keyboardType="numeric"
              />

              <Text style={styles.label}>WhatsApp Contact *</Text>
              <TextInput
                style={[styles.input, errors.locality && styles.errorInput]}
                placeholder="WhatsApp Contact"
                maxLength={10}
                value={formData.whatsapp}
                onChangeText={(text) => handleInputChange('whatsapp', text)}
                keyboardType="numeric"
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Furnished</Text>
                <Switch
                  value={formData.furnished}
                  onValueChange={(value) => handleSwitchChange('furnished', value)}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Parking for Car</Text>
                <Switch
                  value={formData.parkingCar}
                  onValueChange={(value) => handleSwitchChange('parkingCar', value)}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Parking for Bike</Text>
                <Switch
                  value={formData.parkingBike}
                  onValueChange={(value) => handleSwitchChange('parkingBike', value)}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Pets Allowed</Text>
                <Switch
                  value={formData.pets}
                  onValueChange={(value) => handleSwitchChange('pets', value)}
                />
              </View>
            </View>
          </ProgressStep>

          <ProgressStep label="Step 2" nextBtnText="Next" previousBtnText="Back" onNext={validateStep2}>
            <View style={styles.stepContent}>
              <Text style={styles.label}>Amenities</Text>
              <TextInput
                style={styles.input}
                placeholder="Amenities"
                value={formData.amenities}
                onChangeText={(text) => handleInputChange('amenities', text)}
              />

              <Text style={styles.label}>Included Utilities</Text>
              <TextInput
                style={styles.input}
                placeholder="Included Utilities"
                value={formData.included}
                onChangeText={(text) => handleInputChange('included', text)}
              />

              <Text style={styles.label}>Not Included Utilities</Text>
              <TextInput
                style={styles.input}
                placeholder="Not Included Utilities"
                value={formData.notIncluded}
                onChangeText={(text) => handleInputChange('notIncluded', text)}
              />
            </View>
          </ProgressStep>

          <ProgressStep label="Step 3" nextBtnText="Next" previousBtnText="Back" onNext={validateStep3}>
            <View style={styles.stepContent}>
              <Button title="Add Image" onPress={onImagePick} />
              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(image)}
                    >
                      <Text style={styles.removeImageText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ProgressStep>

          <ProgressStep label="Step 4" nextBtnText="Submit" previousBtnText="Back">
            <View style={styles.stepContent}>
              <Text style={styles.label}>Review Your Details</Text>
              <Text style={styles.reviewText}>Property Name: {formData.name}</Text>
              <Text style={styles.reviewText}>Detailed Description: {formData.detailed}</Text>
              <Text style={styles.reviewText}>Locality: {formData.locality}</Text>
              <Text style={styles.reviewText}>Share (Rent): {formData.share}</Text>
              <Text style={styles.reviewText}>Map URL: {formData.map}</Text>
              <Text style={styles.reviewText}>Available Date: {formData.available}</Text>
              <Text style={styles.reviewText}>Contact: {formData.contact}</Text>
              <Text style={styles.reviewText}>WhatsApp Contact: {formData.whatsapp}</Text>
              <Text style={styles.reviewText}>Furnished: {formData.furnished ? 'Yes' : 'No'}</Text>
              <Text style={styles.reviewText}>Parking for Car: {formData.parkingCar ? 'Yes' : 'No'}</Text>
              <Text style={styles.reviewText}>Parking for Bike: {formData.parkingBike ? 'Yes' : 'No'}</Text>
              <Text style={styles.reviewText}>Pets Allowed: {formData.pets ? 'Yes' : 'No'}</Text>
              <Text style={styles.reviewText}>Amenities: {formData.amenities}</Text>
              <Text style={styles.reviewText}>Included Utilities: {formData.included}</Text>
              <Text style={styles.reviewText}>Not Included Utilities: {formData.notIncluded}</Text>
              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.image} />
                ))}
              </View>
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </ProgressStep>
        </ProgressSteps>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    height: 100,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
  },
  reviewText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
