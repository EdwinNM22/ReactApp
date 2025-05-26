import {Text,StyleSheet,View,TextInput,TouchableOpacity,Alert,Image,KeyboardAvoidingView,Platform,} from "react-native";
import React, { useState } from "react";

import appFirebase from "../../firebase-config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useRoleStore from "./useRoleStore";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const setUserRole = useRoleStore((state) => state.setUserRole);

  const Logueo = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener el rol desde Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rol = docSnap.data().rol;
        setUserRole(rol)

        props.navigation.navigate("Home");
      } else {
        Alert.alert("Error", "No se encontró el perfil del usuario");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "El usuario o contraseña son incorrectos");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, isFocusedEmail && styles.inputFocused]}
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, isFocusedPassword && styles.inputFocused]}
              placeholder="su contraseña"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={Logueo}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Register")}
            >
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    height: 56,
    borderColor: "#E5E7EB",
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  inputFocused: {
    borderColor: "#7EBFAD",
    shadowColor: "#7EBFAD",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#7EBFAD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#7EBFAD",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  link: {
    fontSize: 14,
    color: "#7EBFAD",
    fontWeight: "600",
    marginLeft: 5,
    textDecorationLine: "underline",
  },

  logoContainer: {
    position: "absolute",
    top: 60, // puedes ajustar según lo necesites
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },


  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});
