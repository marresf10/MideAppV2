import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';

const EditEquipoScreen = ({ route, navigation }) => {
  const { descripcion, marca, modelo, idequipovale } = route.params;

  const [newDescripcion, setNewDescripcion] = useState(descripcion);
  const [newMarca, setNewMarca] = useState(marca);
  const [newModelo, setNewModelo] = useState(modelo);

  const saveChanges = async () => {
    // Valida los campos antes de enviar
    if (!newDescripcion || !newMarca || !newModelo) {
      Alert.alert('¡Importante!', 'Por favor, llena todos los campos.');
      return;
    }

    // Prepara los datos para enviarlos al servidor
    let data = new FormData();
    data.append('funcion', 'guardarCambiosEquipo');
    data.append('idequipovale', idequipovale);
    data.append('descripcion', newDescripcion);
    data.append('marca', newMarca);
    data.append('modelo', newModelo);

    try {
      const response = await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result && result.success) {
        Alert.alert('¡Éxito!', 'Los cambios se han guardado correctamente.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Hubo un problema al guardar los cambios.');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      Alert.alert('Error', 'Hubo un problema con la conexión al servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={newDescripcion}
        onChangeText={setNewDescripcion}
        placeholder="Descripción"
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        value={newMarca}
        onChangeText={setNewMarca}
        placeholder="Marca"
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        value={newModelo}
        onChangeText={setNewModelo}
        placeholder="Modelo"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#457B9D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditEquipoScreen;
