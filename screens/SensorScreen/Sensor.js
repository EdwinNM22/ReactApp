import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Animated, Easing, Dimensions } from 'react-native';
import { Barometer } from 'expo-sensors'; // SENSOR: BARÓMETRO
import * as Location from 'expo-location'; // SENSOR: UBICACIÓN Y BRÚJULA
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function Sensor() {
  const [pressure, setPressure] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasVerticalAccuracy, setHasVerticalAccuracy] = useState(false);
  const [subscriptionBarometer, setSubscriptionBarometer] = useState(null);
  const [heading, setHeading] = useState(0);
  const [compassReady, setCompassReady] = useState(false);
  const animatedHeading = useState(new Animated.Value(0))[0];

  // ====== SENSOR 1: BARÓMETRO ======
  useEffect(() => {
    const subBaro = Barometer.addListener(({ pressure }) => {
      setPressure(pressure);
    });
    setSubscriptionBarometer(subBaro);

    return () => {
      if (subscriptionBarometer) {
        subscriptionBarometer.remove();
      }
    };
  }, []);
  // ====== FIN SENSOR 1: BARÓMETRO ======

  // ====== SENSOR 2 y 3: BRÚJULA + UBICACIÓN GPS ======
  useEffect(() => {
    let subscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      // === SENSOR 2: BRÚJULA ===
      subscription = await Location.watchHeadingAsync((headingData) => {
        const angle = headingData.trueHeading ?? headingData.magHeading;
        setHeading(Math.round(angle));
        Animated.timing(animatedHeading, {
          toValue: angle,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start();
        setCompassReady(true);
      });
      // === FIN SENSOR 2: BRÚJULA ===

      // === SENSOR 3: UBICACIÓN GPS ===
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const verticalAccAvailable = loc.coords.verticalAccuracy !== null &&
        loc.coords.verticalAccuracy !== undefined;

      setHasVerticalAccuracy(verticalAccAvailable);
      setLocation(loc);
      // === FIN SENSOR 3: UBICACIÓN GPS ===
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
  // ====== FIN SENSOR 2 y 3: BRÚJULA + UBICACIÓN GPS ======

  const getWeatherCondition = (pressure) => {
    if (!pressure) return 'Desconocido';
    if (pressure < 1000) return 'Tormenta';
    if (pressure < 1013) return 'Lluvioso';
    if (pressure < 1020) return 'Nublado';
    return 'Soleado';
  };

  const getCardinalDirection = (angle) => {
    const directions = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
  };

  const rotate = animatedHeading.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderCompassMarkers = () => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions.map((dir, index) => {
      const angle = index * 45;
      const rotation = `${angle}deg`;
      return (
        <View key={dir} style={[styles.markerContainer, { transform: [{ rotate: rotation }] }]}>
          <Text style={[styles.markerText, angle % 90 === 0 ? styles.cardinalMarker : styles.intermediateMarker]}>
            {dir}
          </Text>
        </View>
      );
    });
  }
  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <MaterialIcons name="sensors" size={isSmallScreen ? 28 : 32} color="#fff" />
          <Text style={styles.header}>Monitor Ambiental</Text>
        </View>

        {errorMsg && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color="#ff6b6b" />
            <Text style={styles.error}>{errorMsg}</Text>
          </View>
        )}

        {/* Brújula mejorada */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="compass" size={isSmallScreen ? 18 : 20} color="#4ecca3" />
            <Text style={styles.cardTitle}>Brújula</Text>
          </View>
          {compassReady ? (
            <>
              <View style={styles.compassContainer}>
                <View style={styles.compassOuterRing}>
                  {renderCompassMarkers()}
                  <Animated.View style={[styles.compassNeedle, { transform: [{ rotate }] }]}>
                    <View style={styles.needle} />
                    <View style={styles.needleCenter} />
                    <View style={[styles.needle, styles.needleTail]} />
                  </Animated.View>
                </View>
              </View>
              <Text style={styles.directionText}>
                Dirección: {getCardinalDirection(heading)} ({heading}°)
              </Text>
            </>
          ) : (
            <ActivityIndicator size="small" color="#4ecca3" />
          )}
        </View>

        {/* Barómetro */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="tachometer-alt" size={isSmallScreen ? 18 : 20} color="#4ecca3" />
            <Text style={styles.cardTitle}>Presión Atmosférica</Text>
          </View>
          {pressure ? (
            <>
              <Text style={styles.pressureValue}>{pressure.toFixed(2)} hPa</Text>
              <View style={styles.weatherCondition}>
                <Text style={styles.weatherText}>
                  Condición: {getWeatherCondition(pressure)}
                </Text>
              </View>
            </>
          ) : (
            <ActivityIndicator size="small" color="#4ecca3" />
          )}
        </View>

        {/* Ubicación */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="map-marker-alt" size={isSmallScreen ? 18 : 20} color="#4ecca3" />
            <Text style={styles.cardTitle}>Ubicación GPS</Text>
          </View>
          {location ? (
            <>
              <View style={styles.locationRow}>
                <MaterialIcons name="my-location" size={14} color="#fff" />
                <Text style={styles.locationText}>
                  Lat: {location.coords.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MaterialIcons name="my-location" size={14} color="#fff" />
                <Text style={styles.locationText}>
                  Lon: {location.coords.longitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.accuracyContainer}>
                <Text style={styles.accuracyText}>
                  Precisión Horizontal: {location.coords.accuracy.toFixed(2)} m
                </Text>
                {hasVerticalAccuracy ? (
                  <Text style={styles.accuracyText}>
                    Precisión Vertical: {location.coords.verticalAccuracy.toFixed(2)} m
                  </Text>
                ) : (
                  <Text style={styles.accuracyText}>
                    Precisión Vertical: No soportada
                  </Text>
                )}
              </View>
            </>
          ) : (
            <ActivityIndicator size="small" color="#4ecca3" />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Datos en tiempo real - {new Date().toLocaleTimeString()}</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: isSmallScreen ? 15 : 20,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 15 : 20,
    gap: 10,
  },
  header: {
    color: '#fff',
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
    padding: 10,
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: 8,
  },
  error: {
    color: '#ff6b6b',
    fontSize: isSmallScreen ? 14 : 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: isSmallScreen ? 12 : 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(78, 204, 163, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: isSmallScreen ? 180 : 220,
    marginVertical: 10,
  },
  compassOuterRing: {
    width: isSmallScreen ? 180 : 220,
    height: isSmallScreen ? 180 : 220,
    borderRadius: isSmallScreen ? 90 : 110,
    borderWidth: 2,
    borderColor: 'rgba(78, 204, 163, 0.5)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    position: 'absolute',
    width: isSmallScreen ? 180 : 220,
    height: isSmallScreen ? 180 : 220,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  markerText: {
    color: '#fff',
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: 'bold',
  },
  cardinalMarker: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#4ecca3',
  },
  intermediateMarker: {
    color: '#bbb',
  },
  compassNeedle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  needle: {
    position: 'absolute',
    width: 2,
    height: isSmallScreen ? 70 : 90,
    backgroundColor: '#ff4d4d',
    borderRadius: 2,
    bottom: '50%',
  },
  needleTail: {
    backgroundColor: '#4ecca3',
    transform: [{ rotate: '180deg' }],
    top: '50%',
  },
  needleCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  directionText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 10,
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '500',
  },
  pressureValue: {
    color: '#fff',
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  weatherCondition: {
    marginTop: 8,
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(78, 204, 163, 0.1)',
    borderRadius: 8,
  },
  weatherText: {
    color: '#ccc',
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: isSmallScreen ? 14 : 15,
  },
  accuracyContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
  accuracyText: {
    color: '#bbb',
    fontSize: isSmallScreen ? 12 : 13,
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: isSmallScreen ? 11 : 12,
  },
});