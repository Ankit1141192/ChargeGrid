import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import car from '../../assets/images/car.jpeg';

const googleIcon = {
  uri: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png',
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter both email and password');
      return;
    }

    try {
      // Store dummy user data
      await AsyncStorage.setItem('user', JSON.stringify({ email }));
      Alert.alert('Login Success', `Welcome ${email}`);
      navigation.navigate('MapScreen');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ email: 'googleuser@example.com' }));
      Alert.alert('Google Login Success');
      navigation.navigate('MapScreen');
    } catch (error) {
      Alert.alert('Error', 'Google login failed');
    }
  };

  return (
    <View style={styles.login}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.image} source={car} />

      <Text style={styles.title}>Welcome to ChangeGrid</Text>
      <Text style={styles.subtitle}>Charge smarter, go farther</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
        <Image source={googleIcon} style={styles.googleIcon} />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  login: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily:"outfit",
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  loginBtn: {
    backgroundColor: '#34A853',
    paddingVertical: 12,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    marginBottom: 25,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
