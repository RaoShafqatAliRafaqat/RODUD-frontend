import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View, Text, Button as RNButton } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';  // for date picking
import Background from '../components/Background';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../constants/api';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';

export default function CreateOrder({ navigation }) {
  // State variables to hold form inputs
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');
  const [pickupTime, setPickupTime] = useState(null); // pickupTime as a date object
  const [deliveryTime, setDeliveryTime] = useState(null); // deliveryTime as a date object
  const [isPickupTimePickerVisible, setIsPickupTimePickerVisible] = useState(false);
  const [isDeliveryTimePickerVisible, setIsDeliveryTimePickerVisible] = useState(false);

  const handleSubmit = () => {
    if (!title || !location || !size || !weight || !pickupTime || !deliveryTime) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    handleCreateOrder();
  };

  const handleCreateOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        Alert.alert('Error', 'No token found, please log in again');
        return;
      }

      const response = await fetch(ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          location,
          size,
          weight,
          pickup_time: pickupTime.toISOString(),  // ISO string format for the date
          delivery_time: deliveryTime.toISOString(), // ISO string format for the date
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Order Created successfully!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        Alert.alert('Error', result.message || 'Order creation failed!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while creating the order');
    }
  };

  const showPickupTimePicker = () => setIsPickupTimePickerVisible(true);
  const hidePickupTimePicker = () => setIsPickupTimePickerVisible(false);

  const handlePickupTimeConfirm = (date) => {
    setPickupTime(date);
    hidePickupTimePicker();
  };

  const showDeliveryTimePicker = () => setIsDeliveryTimePickerVisible(true);
  const hideDeliveryTimePicker = () => setIsDeliveryTimePickerVisible(false);

  const handleDeliveryTimeConfirm = (date) => {
    setDeliveryTime(date);
    hideDeliveryTimePicker();
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
       <Logo />
      <Header>Create Order</Header>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Size"
          value={size}
          onChangeText={setSize}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <RNButton title="Pick Pickup Time" onPress={showPickupTimePicker} />
        <Text style={styles.dateText}>
          {pickupTime ? pickupTime.toLocaleString() : 'No pickup time selected'}
        </Text>

        <RNButton title="Pick Delivery Time" onPress={showDeliveryTimePicker} />
        <Text style={styles.dateText}>
          {deliveryTime ? deliveryTime.toLocaleString() : 'No delivery time selected'}
        </Text>
      </View>

      <DateTimePickerModal
        isVisible={isPickupTimePickerVisible}
        mode="datetime"
        onConfirm={handlePickupTimeConfirm}
        onCancel={hidePickupTimePicker}
      />

      <DateTimePickerModal
        isVisible={isDeliveryTimePickerVisible}
        mode="datetime"
        onConfirm={handleDeliveryTimeConfirm}
        onCancel={hideDeliveryTimePicker}
      />

      <RNButton
        title="Submit Order"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
  },
  dateText: {
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
});
