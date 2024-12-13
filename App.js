import React, { useEffect, useState } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  CreateOrder,
} from './src/screens'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator()

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  // Check if the user is logged in by looking for the token in AsyncStorage
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        setIsLoggedIn(true)  // User is logged in
      } else {
        setIsLoggedIn(false)  // User is not logged in
      }
    }

    checkLoginStatus()
  }, [])

  // Show a loading screen or placeholder until the login status is checked
  if (isLoggedIn === null) {
    return null // Or a loading screen
  }

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Dashboard' : 'StartScreen'}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CreateOrder" component={CreateOrder} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
