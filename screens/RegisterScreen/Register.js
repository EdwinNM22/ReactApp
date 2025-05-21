import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import React, { useState } from 'react';
import appFirebase from "../../firebase-config";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function Register(props) {
  // Variables de estado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const registrar = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el nombre y el email en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        email: email,
        rol: 'USER', // Rol por defecto
      });
      console.log("Usuario guardado con rol USER");

      Alert.alert('Registro exitoso', '¡Bienvenido!');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Hubo un problema con el registro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regístrate</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.link}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333',
  },
  link: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
