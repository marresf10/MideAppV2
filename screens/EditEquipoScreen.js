import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { baseUrl } from '../configuration/database';

const EditEquipoScreen = ({ route, navigation }) => {
  const {
    descripcion,
    marca,
    modelo,
    intervalo,
    noserie,
    identificador,
    notas,
    observaciones,
    idequipovale,
    accesorios = [],
    token,
    idUsuario
  } = route.params;

  const [newDescripcion, setNewDescripcion] = useState(descripcion);
  const [newMarca, setNewMarca] = useState(marca);
  const [newModelo, setNewModelo] = useState(modelo);
  const [newIntervalo, setNewIntervalo] = useState(intervalo);
  const [newNoserie, setNewNoserie] = useState(noserie);
  const [newIdentificador, setNewIdentificador] = useState(identificador);
  const [newNotas, setNewNotas] = useState(notas);
  const [newObservaciones, setNewObservaciones] = useState(observaciones);
  const [newIdEquipoVale, setNewIdEquipoVale] = useState(idequipovale);
  const [newOtrosAccesorios, setNewOtrosAccesorios] = useState('');
  const [checkBoxes, setCheckBoxes] = useState([]);
  const [arrCheckBox, setArrCheckBox] = useState({});

  // Cargar accesorios existentes
  useEffect(() => {
    const loadCheckBoxes = async () => {
      let data = new FormData();
      data.append('token', token);
      data.append('idusuario', idUsuario);
      data.append('esporapp', 1);
  
      try {
        const response = await fetch(baseUrl + 'ERP/php/app_v2_ws_get_accesorios_equipos.php', {
          method: 'POST',
          body: data,
        });
  
        const result = await response.json();
  
        //console.log("ESTE ES EL LOADCHECKBOX: ", result);  // Ver los accesorios que has recibido del servidor
  
        if (result && Array.isArray(result) && result.length > 0) {
          let arre = {};
          result.forEach((item) => {
            arre['chk_accesorio_' + item.idaccesorio] = accesorios.includes(item.idaccesorio.toString());  // Asegurarse de comparar con tipo correcto
          });
          setArrCheckBox(arre);
          setCheckBoxes(result);
  
          // Verificar el estado de arrCheckBox después de actualizarlo
          //console.log("arrCheckBox después de actualizarlo: ", arre);
        } else {
          Alert.alert('¡Importante!', 'No se encontraron accesorios disponibles.');
          setCheckBoxes([]);
        }
      } catch (error) {
        console.error('Error al cargar accesorios:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los accesorios.');
      }
    };
  
    loadCheckBoxes();
  }, [accesorios]);
  

  // Guardar cambios
  const saveChanges = async () => {
    if (
      !newDescripcion ||
      !newMarca ||
      !newModelo ||
      !newIntervalo ||
      !newNoserie ||
      !newIdentificador ||
      !newNotas ||
      !newObservaciones ||
      !newIdEquipoVale
    ) {
      Alert.alert('¡Importante!', 'Por favor, llena todos los campos.');
      return;
    }
  
    // Asegurarnos de enviar el formato correcto para accesorios
    const formattedAccessories = { ...arrCheckBox }; // Mantiene el formato {chk_accesorio_X: boolean}
    
    let data = new FormData();
    data.append('funcion', 'guardarCambiosEquipo');
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    data.append('idequipovale', newIdEquipoVale);
    data.append('descripcion', newDescripcion);
    data.append('marca', newMarca);
    data.append('modelo', newModelo);
    data.append('intervalo', newIntervalo);
    data.append('noserie', newNoserie);
    data.append('identificador', newIdentificador);
    data.append('observaciones', newObservaciones);
    data.append('notas', newNotas);
    data.append('accesorios', JSON.stringify(formattedAccessories)); // Enviar como JSON
    
    console.log('Datos enviados al servidor desde EDITAR:');
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    await fetch(baseUrl + 'ERP/php/app_v2_editar_equipo_vale.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        // Agregar console.log para la respuesta del servidor
      console.log('Respuesta del servidor:', response);
      
        if (response == null) {
          Alert.alert('¡Importante!', 'Se ha tenido un problema al intentar editar el equipo', [{ text: 'Intentar despues' }]);
        } else if (response[0].exito == 1) {
          Alert.alert('¡Registro exitoso!', 'Se ha editado el equipo correctamente');
          navigation.goBack()
        } else {
          Alert.alert('¡Importante!', 'Se ha tenido un problema al intentar editar el equipo', [{ text: 'Intentar despues' }]);
        }
      })
      .catch((error) => {
        console.log('editarEquipo (2):');
        console.error(error);
      });
  };  

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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

      <Text style={styles.label}>Intervalo</Text>
      <TextInput
        style={styles.input}
        value={newIntervalo}
        onChangeText={setNewIntervalo}
        placeholder="Intervalo"
      />

      <Text style={styles.label}>No. Serie</Text>
      <TextInput
        style={styles.input}
        value={newNoserie}
        onChangeText={setNewNoserie}
        placeholder="No. Serie"
      />

      <Text style={styles.label}>Identificador</Text>
      <TextInput
        style={styles.input}
        value={newIdentificador}
        onChangeText={setNewIdentificador}
        placeholder="Identificador"
      />

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={styles.input}
        value={newNotas}
        onChangeText={setNewNotas}
        placeholder="Notas"
      />

      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        style={styles.input}
        value={newObservaciones}
        onChangeText={setNewObservaciones}
        placeholder="Observaciones"
      />

      <Text style={styles.label}>Accesorios</Text>
      {checkBoxes.length > 0 ? (
      checkBoxes.map((item, index) => {
        console.log("Accesorio actual: ", item.accesorio);  // Ver el accesorio en cada iteración
        console.log("Estado de la casilla (isChecked): ", arrCheckBox['chk_accesorio_' + item.idaccesorio]);  // Ver si está marcado

        return (
          <View key={index} style={styles.checkboxContainer}>
            <BouncyCheckbox
              fillColor="#003667"
              isChecked={arrCheckBox['chk_accesorio_' + item.idaccesorio]}
              onPress={(val) =>
                setArrCheckBox({ ...arrCheckBox, ['chk_accesorio_' + item.idaccesorio]: val })
              }
            />
            <Text>{item.accesorio}</Text>
          </View>
        );
      })
    ) : (
      <Text style={{ color: 'red', textAlign: 'center' }}>
        No hay accesorios disponibles.
      </Text>
    )}

    <Text style={styles.label}>Otros Accesorios</Text>
    <TextInput
      style={styles.input}
      value={newOtrosAccesorios}
      onChangeText={setNewOtrosAccesorios}
      placeholder="Ingresa otros accesorios"
    />


      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      </ScrollView>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
