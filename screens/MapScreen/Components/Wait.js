import { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const Dot = ({ delay }) => {
  const animValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedStyle = {
    opacity: animValue,
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0.3, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  };

  return (
    <Animated.Text style={[styles.dot, animatedStyle]}>.</Animated.Text>
  );
};

export default function Wait() {
  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={300} />
      <Dot delay={600} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 4,
  },
});