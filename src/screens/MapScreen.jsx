import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCIQ9hKZdTKeX1P-xo1udaGfiRDZjs9X40';

const MapScreen = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });
  const mapRef = useRef(null);

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
        method: 'GET',
        headers: { 'User-Agent': 'LocationDistanceApp/1.0' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.length > 0) return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      throw new Error('Location not found. Try a more specific address.');
    } catch (error) {
      console.error('Geocoding error:', error);
      try {
        const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
        const googleData = await googleResponse.json();
        if (googleData.status === 'OK' && googleData.results.length > 0) {
          const location = googleData.results[0].geometry.location;
          return { latitude: location.lat, longitude: location.lng };
        }
      } catch (googleError) {
        console.error('Google Geocoding fallback failed:', googleError);
      }
      throw new Error('Unable to find location. Please check the address.');
    }
  };

  const showNearbyPlaces = async () => {
    const cities = [
      { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
      { name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
      { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
      { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
      { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
      { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
      { name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
      { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    ];
    setNearbyPlaces(cities);
  };

  useEffect(() => {
    showNearbyPlaces();
  }, []);

  const calculateDistanceHaversine = (from, to) => {
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return {
      distance: `${d.toFixed(2)} km`,
      duration: `${(d / 40).toFixed(2)} hrs`, // Assuming 40km/h avg
    };
  };

  const handleSearch = async () => {
    if (!fromLocation.trim() || !toLocation.trim()) return Alert.alert('Error', 'Enter both locations');
    setLoading(true);
    try {
      const fromCoordinates = await geocodeAddress(fromLocation);
      const toCoordinates = await geocodeAddress(toLocation);
      setFromCoords(fromCoordinates);
      setToCoords(toCoordinates);
      setDistance(calculateDistanceHaversine(fromCoordinates, toCoordinates));
      if (mapRef.current) {
        mapRef.current.fitToCoordinates([fromCoordinates, toCoordinates], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (place, isFrom) => {
    if (isFrom) setFromLocation(place.name);
    else setToLocation(place.name);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.inputCard}>
        <TextInput style={styles.input} placeholder="Starting location" value={fromLocation} onChangeText={setFromLocation} />
        <TextInput style={styles.input} placeholder="Destination location" value={toLocation} onChangeText={setToLocation} />
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Search & Show Route</Text>}
        </TouchableOpacity>
        {distance && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Route Info</Text>
            <Text style={styles.cardContent}>Distance: {distance.distance}</Text>
            <Text style={styles.cardContent}>Estimated Time: {distance.duration}</Text>
          </View>
        )}
      </ScrollView>
      <MapView ref={mapRef} style={styles.map} initialRegion={currentRegion}>
        {nearbyPlaces.map((place, i) => (
          <Marker key={i} coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.name} pinColor="blue" />
        ))}
        {fromCoords && <Marker coordinate={fromCoords} title="From" pinColor="green" />}
        {toCoords && <Marker coordinate={toCoords} title="To" pinColor="red" />}
        {fromCoords && toCoords && <Polyline coordinates={[fromCoords, toCoords]} strokeColor="#007AFF" strokeWidth={3} />}
      </MapView>
      <ScrollView horizontal style={styles.cityScroller} showsHorizontalScrollIndicator={false}>
        {nearbyPlaces.map((place, index) => (
          <View key={index} style={styles.cityCard}>
            <Text style={styles.cityName}>{place.name}</Text>
            <View style={styles.cityButtons}>
              <TouchableOpacity style={[styles.cityBtn, { backgroundColor: '#28a745' }]} onPress={() => handleCitySelect(place, true)}>
                <Text style={styles.btnText}>From</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cityBtn, { backgroundColor: '#dc3545' }]} onPress={() => handleCitySelect(place, false)}>
                <Text style={styles.btnText}>To</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 40,
    height: 100,
  },
  inputCard: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#fff',
    height: 90,
  },
  input: {
    width: '90%',
    height: 46,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f9f9f9',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 11,
    paddingHorizontal: 20,
    marginLeft: 35,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 36,
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222'
  },
  cardContent: {
    fontSize: 16,
    color: '#555'
  },
  map: {
    flex: 1,
    minHeight: 300
  },
  cityScroller: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  cityCard: {
    marginRight: 15,
    padding: 10,
    backgroundColor: '#fefefe',
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
    elevation: 1
  },
  cityName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333'
  },
  cityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  cityBtn: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
});

export default MapScreen;