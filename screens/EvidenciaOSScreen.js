import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';

import { baseUrl } from '../configuration/database';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign, MaterialIcons, Feather, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

const EvidenciaOSScreen = ({ props, route }) => {
  const [file, setFile] = useState({ uri: null, type: 'cancelled' });
  const [files, setFiles] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const FileItem = ({ id, datafile, fecha }) => {
    let ext = datafile.split('.').pop();
    let filename = datafile.replace(/\.[^/.]+$/, '');
    let item = (
      <View style={{ elevation: 3, backgroundColor: 'white', flexDirection: 'row', margin: 4, justifyContent: 'space-between', padding: 2, borderRadius: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://sgi.midelab.com/ERP/archivosentregas/' + datafile)}
            style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
            {ext == 'png' || ext == 'jpg' || ext == 'jpeg' ? (
              <Image
                source={{ uri: 'https://sgi.midelab.com/ERP/archivosentregas/' + datafile }}
                style={{ width: 50, height: 50, margin: 2, borderRadius: 10 }}
              />
            ) : (
              <AntDesign name='file1' size={47} color='lightgray' />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 5 }}>
          <View style={{ flex: 2, padding: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }} numberOfLines={1} ellipsizeMode='tail'>
              {filename}
            </Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Fecha: {fecha}</Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={{ color: 'gray' }}>Tipo: {ext.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Eliminar evidencia de OS', '¿Esta seguro de eliminar el archivo?', [
              { text: 'Salir' },
              { text: 'Confirmar', onPress: () => deleteFileItem(id, datafile) },
            ])
          }
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name='close' size={24} color='lightgray' />
        </TouchableOpacity>
      </View>
    );
    return item;
  };

  const pickAFile = async () => {
    setDescripcion('');
    let result = await DocumentPicker.getDocumentAsync();
    if (result.type == 'cancel') {
      setFile({ uri: null, type: 'cancelled' });
    } else {
      let ext = result.uri.split('.').pop();
      if (ext == 'mp4' || ext == 'mwv' || ext == 'mpeg' || ext == 'mp3' || ext == 'wav' || ext == 'wma' || ext == 'opus' || ext == 'ogg') {
        Alert.alert('¡Importante!', 'El archivo seleccionado contiene un formato no aceptado');
        setFile({ uri: null, type: 'cancelled' });
        return;
      }
      setFile(result);
    }
    if (result.type == 'cancel') {
      setFile({ uri: null, type: 'cancel' });
    } else {
      let ext = result.uri.split('.').pop();
      if (ext == 'mp4' || ext == 'mwv' || ext == 'mpeg' || ext == 'mp3' || ext == 'wav' || ext == 'wma' || ext == 'opus' || ext == 'ogg') {
        Alert.alert('¡Importante!', 'El archivo seleccionado contiene un formato no aceptado');
        setFile({ uri: null, type: 'cancel' });
        return;
      }
      setFile(result);
    }
  };

  const takeAPhoto = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('¡Importante!', 'Usted ha rechazado la solicitud de permisos para acceso a galeria');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      let archivo = result.uri.substring(result.uri.lastIndexOf('/') + 1);
      let extension = archivo.substring(archivo.lastIndexOf('.') + 1);
      let nombreArchivo = archivo.replace('.' + extension, '.jpg');
      setFile({ uri: result.uri, type: 'success', mimeType: 'image/jpeg', name: nombreArchivo });
    } else if (result.cancelled) {
      setFile({ uri: null, type: 'cancelled' });
    }
  };

  const pickAnImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('¡Importante!', 'Usted ha rechazado la solicitud de permisos para acceso a galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      let ext = result.uri.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg' && ext != 'png' && ext != 'bmp') {
        Alert.alert('¡Importante!', 'El archivo seleccionado contiene un formato no aceptado');
        setFile({ uri: null, type: 'cancelled' });
        return;
      }
      let archivo = result.uri.substring(result.uri.lastIndexOf('/') + 1);
      let extension = archivo.substring(archivo.lastIndexOf('.') + 1);
      let nombreArchivo = archivo.replace('.' + extension, '.jpg');
      setFile({ uri: result.uri, type: 'success', mimeType: 'image/jpeg', name: nombreArchivo });
    } else if (result.cancelled) {
      setFile({ uri: null, type: 'cancelled' });
    }
  };

  const uploadAFile = async () => {
    if (file == null || file == '' || file.uri == null || file.type == 'cancel') {
      Alert.alert('¡Importante!', 'Seleccione un archivo');
    } else if (descripcion.length < 1) {
      Alert.alert('¡Importante!', 'El campo de descripción no puede ser vacio');
    } else {
      setUploading(true);
      let data = new FormData();
      data.append('esporapp', 1);
      data.append('HDidosArchivosEvidencia', route.params.idOS);
      data.append('archivo_evidencia', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      });
      await fetch(baseUrl + 'ERP/php/almacen_evidencia_upload_archivo.php', {
        method: 'POST',
        body: data,
        header: {
          'content-type': 'multipart/form-data',
        },
      })
        .then((res) => res.json())
        .then((response) => {
          setUploading(false);
          if (response[0].exito == '1' && response[0].error == 0) {
            setFile({ uri: null, type: 'cancelled' });
            setDescripcion('');
            loadFiles();
            Alert.alert('¡Subida exitosa!', 'El archivo se ha subido correctamente');
          } else if (response[0].exito == 0 || response[0].error != 0) {
            Alert.alert('¡Importante!', 'El archivo no se ha podido subir');
          } else {
            Alert.alert('¡Importante!', 'Ocurrio un error al intentar subir el archivo');
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const loadFiles = async () => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('tipoMovimiento', 'mostrarArchivosEvidenciaEntrega');
    data.append('idosdetalle', route.params.idOS);
    await fetch(baseUrl + 'ERP/php/almacen_evidencias_cmd.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response[0].archivo == null) {
          setFiles([]);
        } else if (response[0].archivo != null) {
          setFiles(response);
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar consultar el registro de evidencias en la OS');
          setFiles([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const cerrarSesion = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('idUsuario');
    } catch (e) {
      console.log(e);
    }
    navigation.popToTop('Inicio', {
      error: '1',
    });
  };

  const deleteFileItem = async (idvale, nombre) => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('tipoMovimiento', 'eliminarArchivoEvidenciaEntrega');
    data.append('identregaarchivo', idvale);
    data.append('archivo', nombre);
    await fetch(baseUrl + 'ERP/php/almacen_evidencias_cmd.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(JSON.stringify(response));
        if (response == 1) {
          Alert.alert('Archivo eliminado!', 'El archivo se ha eliminado correctamente');
          loadFiles();
        } else if (response == 0) {
          Alert.alert('¡Importante!', 'No se ha podido eliminar el archivo');
          loadFiles();
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar eliminar el archivo');
          loadFiles();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await loadFiles();
    setIsRefreshing(false);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: '#003667' }}>
        <View style={{ marginTop: 2 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            OS: {route.params.folio} - {route.params.estatus}
          </Text>
        </View>
        <View style={{ padding: 5 }}>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Descripción: {route.params.descripcion}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Marca: {route.params.marca}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Modelo: {route.params.modelo}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Intervalo: {route.params.intervalo}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            No. de serie: {route.params.noserie}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Identificación: {route.params.identificacion}
          </Text>
        </View>
      </View>
      <View style={{ padding: 5 }}>
        <TouchableOpacity
          onPress={() => pickAFile()}
          style={{
            flexDirection: 'row',
            marginBottom: 6,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 8,
            borderRadius: 3,
          }}>
          <MaterialIcons name='attach-file' size={20} color='white' />
          <Text style={{ color: 'white' }}> SELECCIONAR ARCHIVO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickAnImage()}
          style={{
            flexDirection: 'row',
            marginBottom: 6,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 8,
            borderRadius: 3,
          }}>
          <Entypo name='images' size={20} color='white' />
          <Text style={{ color: 'white' }}> SELECCIONAR IMAGEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => takeAPhoto()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 8,
            borderRadius: 3,
          }}>
          <MaterialCommunityIcons name='camera' size={20} color='white' />
          <Text style={{ color: 'white' }}> TOMAR FOTOGRAFÍA</Text>
        </TouchableOpacity>
      </View>
      {file.type == 'success' && (
        <>
          {file.mimeType.includes('image') ? (
            <>
              <View
                style={{
                  backgroundColor: '#EDEDED',
                  borderRadius: 3,
                  elevation: 0,
                  padding: 3,
                  borderWidth: 0,
                  borderColor: '#DEDEDE',
                  marginBottom: 5,
                }}>
                <Text>Descripción: *</Text>
                <View>
                  <TextInput style={styles.textInput} placeholder='Descripción' value={descripcion} onChangeText={(val) => setDescripcion(val)} />
                </View>
                <Text>Previsualización:</Text>
                <View style={{ marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={{ uri: file.uri }} style={{ width: 144, height: 144 }} />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>Archivo: </Text>
                  <Text>{file.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => uploadAFile()}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  paddingVertical: 10,
                  borderRadius: 3,
                }}>
                <MaterialIcons name='upload-file' size={20} color='white' />
                <Text style={{ color: 'white' }}> SUBIR ARCHIVO</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                backgroundColor: '#EDEDED',
                borderRadius: 3,
                elevation: 0,
                padding: 3,
                borderWidth: 0,
                borderColor: '#DEDEDE',
                marginBottom: 5,
              }}>
              <Text>Descripción: *</Text>
              <View>
                <TextInput style={styles.textInput} placeholder='Descripción' value={descripcion} onChangeText={(val) => setDescripcion(val)} />
              </View>
              <View style={{ marginBottom: 3 }}>
                <Text style={{ fontWeight: 'bold' }}>Archivo: </Text>
                <Text>{file.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => uploadAFile()}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  paddingVertical: 10,
                  borderRadius: 3,
                }}>
                <MaterialIcons name='upload-file' size={20} color='white' />
                <Text style={{ color: 'white' }}> SUBIR ARCHIVO</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {uploading && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='small' color='#0000ff' />
          <Text> Espere porfavor...</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
        <AntDesign name='doubleright' size={14} color='#003667' />
        <Text style={{ color: '#003667', fontWeight: 'bold' }}> Archivos cargados </Text>
        {files.length > 0 && <Text style={{ color: '#003667', fontWeight: 'bold' }}>({files.length})</Text>}
      </View>
      <View style={{ height: '87%' }}>
        {files.length > 0 ? (
          <>
            <FlatList
              data={files}
              renderItem={({ item, key }) => {
                return <FileItem id={item.identregaarchivo} datafile={item.archivo} fecha={item.fecha} key={key} />;
              }}
              keyExtractor={(item) => item.identregaarchivo.toString()}
              refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
            />
          </>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>No hay evidencias</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#003667',
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardHeader: {
    flex: 6,
    flexDirection: 'row',
  },
  bkgHeader: {
    flex: 8,
    backgroundColor: '#003667',
    padding: 3,
    borderWidth: 0,
    borderColor: '#003667',
  },
  pddnHeader: {
    paddingLeft: 3,
  },
  txtClientCard: {
    color: 'white',
    fontWeight: 'bold',
  },
  txtWhite: {
    color: 'white',
  },
  tchUploadEvidences: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003667',
    borderWidth: 0,
    borderColor: '#003667',
  },
  cardContent: {
    flex: 19,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  flxRight: {
    flexDirection: 'row',
  },
  cardLine1: {
    flex: 2,
    backgroundColor: '#EFEFEF',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine2: {
    flex: 4,
    backgroundColor: '#FEFEFE',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine3: {
    flex: 2,
    backgroundColor: '#DDDDDD',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine4: {
    flex: 4,
    backgroundColor: '#EDEDED',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  negrita: {
    fontWeight: 'bold',
  },
});

export default EvidenciaOSScreen;
