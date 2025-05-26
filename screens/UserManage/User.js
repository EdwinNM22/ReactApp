import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, FlatList, Modal, ActivityIndicator } from 'react-native';
import { getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import appFirebase from "../../firebase-config";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function UserAdmin({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    nombre: '',
    email: '',
    rol: 'USER'
  });

  // Cargar lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usersList = [];
        
        querySnapshot.forEach((doc) => {
          usersList.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Seleccionar usuario para editar
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditData({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol || 'USER'
    });
    setModalVisible(true);
  };

  // Actualizar datos del usuario
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Actualizar en Firestore
      await updateDoc(doc(db, "usuarios", selectedUser.id), {
        nombre: editData.nombre,
        rol: editData.rol
      });


      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      setModalVisible(false);
      refreshUserList();
    } catch (error) {
      console.error("Error updating user: ", error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    Alert.alert(
      'Confirmar',
      `¿Estás seguro de eliminar a ${selectedUser.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Eliminar de Firestore
              await deleteDoc(doc(db, "usuarios", selectedUser.id));
              

              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              setModalVisible(false);
              refreshUserList();
            } catch (error) {
              console.error("Error deleting user: ", error);
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          }
        }
      ]
    );
  };

  // Refrescar lista de usuarios
  const refreshUserList = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const usersList = [];
    
    querySnapshot.forEach((doc) => {
      usersList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setUsers(usersList);
    setLoading(false);
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  // Renderizar cada item de usuario
  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem} 
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.nombre}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={[styles.roleBadge, item.rol === 'ADMIN' && styles.roleBadgeAdmin]}>
        <Text style={styles.roleText}>{item.rol}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administración de Usuarios</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal de edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuario</Text>

            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={editData.nombre}
              onChangeText={(text) => setEditData({...editData, nombre: text})}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={editData.email}
              onChangeText={(text) => setEditData({...editData, email: text})}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Rol:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, editData.rol === 'USER' && styles.roleButtonActive]}
                onPress={() => setEditData({...editData, rol: 'USER'})}
              >
                <Text style={[styles.roleText, editData.rol === 'USER' && styles.roleTextActive]}>USER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, editData.rol === 'ADMIN' && styles.roleButtonActive]}
                onPress={() => setEditData({...editData, rol: 'ADMIN'})}
              >
                <Text style={[styles.roleText, editData.rol === 'ADMIN' && styles.roleTextActive]}>ADMIN</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleUpdateUser}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]} 
                onPress={handleDeleteUser}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  roleBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  roleBadgeAdmin: {
    backgroundColor: '#4CAF50',
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  roleTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutButtonText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
});