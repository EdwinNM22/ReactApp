import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../../assets/background.jpg')} 
        style={styles.background}
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Explora las funciones de nuestra app</Text>
          </View>

          <View style={styles.buttonContainer}>
            {/* Botón Clima */}
            <TouchableOpacity 
              style={[styles.button, styles.weatherButton]}
              onPress={() => navigation.navigate('Weather')}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.buttonGradient}
              >
                <Icon name="weather-partly-cloudy" size={40} color="white" />
                <Text style={styles.buttonText}>Ver Clima</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botón Mapa */}
            <TouchableOpacity 
              style={[styles.button, styles.mapButton]}
              onPress={() => navigation.navigate('Map')}
            >
              <LinearGradient
                colors={['#38ef7d', '#11998e']}
                style={styles.buttonGradient}
              >
                <Icon name="map-marker-radius" size={40} color="white" />
                <Text style={styles.buttonText}>Abrir Mapa</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Botón Cuenta */}
            <TouchableOpacity 
              style={[styles.button, styles.accountButton]}
              onPress={() => navigation.navigate('Account')}
            >
              <LinearGradient
                colors={['#f857a6', '#ff5858']}
                style={styles.buttonGradient}
              >
                <Icon name="account-cog" size={40} color="white" />
                <Text style={styles.buttonText}>Mi Cuenta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Explora todas las posibilidades</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    height: 100,
    borderRadius: 20,
    marginVertical: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  weatherButton: {
    backgroundColor: '#4facfe',
  },
  mapButton: {
    backgroundColor: '#38ef7d',
  },
  accountButton: {
    backgroundColor: '#f857a6',
  },
  footer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});

export default Home;