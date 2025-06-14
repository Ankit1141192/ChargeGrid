import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
// import { Ionicons } from '@expo/vector-icons'; // Install: npm install @expo/vector-icons

Geocoder.init('AIzaSyCIQ9hKZdTKeX1P-xo1udaGfiRDZjs9X40');

const haversineDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapScreen = () => {
  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const getCoordinates = async (address, useCurrentLocation = false) => {
    if (address) {
      const geo = await Geocoder.from(address);
      if (!geo.results.length) throw new Error('No geocode result');
      const loc = geo.results[0].geometry.location;
      return { latitude: loc.lat, longitude: loc.lng };
    }

    if (useCurrentLocation) {
      const granted = await requestLocationPermission();
      if (!granted) throw new Error('Location permission denied');
      return await getCurrentLocation();
    }

    throw new Error('Invalid input');
  };

  const handleGeocode = async () => {
    try {
      const [coordA, coordB] = await Promise.all([
        getCoordinates(pointA, true),
        getCoordinates(pointB, true),
      ]);

      setCoordinates([coordA, coordB]);
      setDistance(haversineDistance(coordA, coordB).toFixed(2));

      setTimeout(() => {
        mapRef.current?.fitToCoordinates([coordA, coordB], {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }, 500);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Please enter valid locations or allow location access.');
      setCoordinates([]);
      setDistance(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="From "
          value={pointA}
          onChangeText={setPointA}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="To "
          value={pointB}
          onChangeText={setPointB}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={handleGeocode}>
          {/* <Ionicons name="navigate-circle-outline" size={22} color="#fff" /> */}
          <Text style={styles.buttonText}>Show Route</Text>
        </TouchableOpacity>
      </View>

      {distance && (
        <View style={styles.card}>
          <Text style={styles.cardText}>Distance: {distance} km</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 23.5937,
          longitude: 80.9629,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {coordinates.map((coord, i) => (
          <Marker
            key={i}
            coordinate={coord}
            title={i === 0 ? 'From' : 'To'}
            pinColor={i === 0 ? 'green' : 'red'}
          />
        ))}
        {coordinates.length === 2 && (
          <Polyline coordinates={coordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop:36,
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: '#ffffffee',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    zIndex: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default MapScreen;
