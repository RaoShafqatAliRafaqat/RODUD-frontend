import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, Text } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import pusher from '../services/pusher';
import { ENDPOINTS } from '../constants/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard({ navigation }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
    
        if (!token) {
          Alert.alert('Error', 'No token found, please log in again');
          return;
        }
    
        const response = await fetch(ENDPOINTS.ORDERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
    
        const result = await response.json();
    
        if (response.ok) {
          setOrders(result.data);
        } else {
          Alert.alert('Error', result.message || 'Failed to fetch orders');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching orders');
      }
    };

    fetchOrders();

    const channel = pusher.subscribe('notifications');
    channel.bind('new-notification', (data) => {
      Alert.alert('Notification', data.message);
    });

    return () => {
      pusher.unsubscribe('notifications');
    };
  }, []);

  const onLogoutPressed = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.orderText}>Order ID: {item.id}</Text>
      <Text style={styles.orderText}>Title: {item.title}</Text>
      <Text style={styles.orderText}>Location: {item.location}</Text>
      <Text style={styles.orderText}>Size: {item.size}</Text>
      <Text style={styles.orderText}>Weight: {item.weight}</Text>
      <Text style={styles.orderText}>Pickup Time: {item.pickup_time}</Text>
      <Text style={styles.orderText}>Delivery Time: {item.delivery_time}</Text>
      <Text style={[styles.orderText, styles.status]}>{item.status}</Text>
    </View>
  );

  return (
    <Background>
      <Logo />
      <Header style={styles.header}>Your Orders</Header>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        mode="contained"
        onPress={() => navigation.replace('CreateOrder')}
        style={styles.createButton}
      >
        Create Order
      </Button>
      <Button
        mode="outlined"
        onPress={onLogoutPressed}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  status: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  createButton: {
    marginTop: 24,
  },
  logoutButton: {
    marginTop: 16,
  },
});