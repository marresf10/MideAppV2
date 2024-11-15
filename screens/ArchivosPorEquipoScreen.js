import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  TextInput,
  RefreshControl,
} from 'react-native';

import { baseUrl } from '../configuration/database';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const ArchivosPorEquipoScreen = ({ route, navigation }) => {
  const [file, setFile] = useState({ uri: null, type: 'cancelled' });
  const [fileUri, setFileUri] = useState(null);
  const [fileMessage, setFileMessage] = useState('');
  const [token, setToken] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [foliotmp, setFoliotmp] = useState(route.params.foliotmpp);
  const [files, setFiles] = useState([]);
  const [idEquipoVale, setIdEquipoVale] = useState(route.params.idequipovale);
  const [descripcionEquipo, setDescripcionEquipo] = useState(route.params.descripcion);
  const [marcaEquipo, setMarcaEquipo] = useState(route.params.marca);
  const [modeloEquipo, setModeloEquipo] = useState(route.params.modelo);
  const [descripcion, setDescripcion] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    let tok = await SecureStore.getItemAsync('token');
    setToken(tok);
    let id = await SecureStore.getItemAsync('idUsuario');
    setIdUsuario(id);
    loadFiless(id, tok);
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
      setFileUri(result.uri);
      setFileMessage('Listo!, imágen cargada correctamente');
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
/*
  const takeAPhotoViejo = async () => {
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
      setFile({ uri: result.uri, type: 'success', mimeType: 'image/jpeg', name: foliotmp + '.jpg' });
    } else if (result.cancelled) {
      setFile({ uri: null, type: 'cancelled' });
    }
  };
*/

  const takeAPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('¡Importante!', 'Usted ha rechazado la solicitud de permisos para acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedPhoto = result.assets ? result.assets[0] : result;
      
      try {
        const uniqueId = new Date().getTime().toString();
        const tempUri = `${FileSystem.documentDirectory}${uniqueId}.jpg`;

        await FileSystem.copyAsync({
          from: selectedPhoto.uri,
          to: tempUri,
        });

        setFile({
          uri: tempUri,
          type: 'success',
          mimeType: 'image/jpeg',
          name: foliotmp + '.jpg',
        });

        console.log("Foto tomada y URI temporal generada:", tempUri);

      } catch (error) {
        console.error("Error al copiar la foto:", error);
        Alert.alert('¡Importante!', 'Hubo un problema al procesar la foto');
        setFile({ uri: null, type: 'cancelled' });
      }
    } else {
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
      setFile({ uri: result.uri, type: 'success', mimeType: 'image/jpeg', name: foliotmp + '.jpg' });
    } else if (result.cancelled) {
      setFile({ uri: null, type: 'cancelled' });
    }
  };

  const cerrarSesion = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('idUsuario');
      await SecureStore.setItemAsync('signed', 'false');
    } catch (error) {
      console.log('loadEquipos (1):');
      console.log(error);
    }
    navigation.popToTop('Inicio', {
      error: '1',
    });
  };

  const uploadAFile = async () => {
    if (file == null || file == '' || file.uri == null || file.type == 'cancel') {
      Alert.alert('¡Importante!', 'Seleccione un archivo');
    } else if (descripcion.length < 1) {
      Alert.alert('¡Importante!', 'El campo de descripción no puede ser vacio');
    } else {
      setUploading(true);
      let data = new FormData();
      data.append('foliotmp', foliotmp);
      data.append('esporapp', '1');
      data.append('archivo_equipo', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      });
      data.append('archivo_descripcion_equipo', descripcion);
      data.append('idequipovale', idEquipoVale);
      data.append('token', token);
      data.append('idusuario', idUsuario);
      await fetch(baseUrl + 'ERP/php/ap_ws_recepcion_upload_archivos_equipo.php', {
        method: 'POST',
        body: data,
        header: {
          'content-type': 'multipart/form-data',
        },
      })
        .then((res) => res.json())
        .then((response) => {
          setUploading(false);
          if (response == 1001) {
            cerrarSesion();
          } else if (response[0].exito == '1' && response[0].error == 0) {
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
        .catch((error) => console.log(error));
    }
  };

  const loadFiless = async (id, tok) => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('funcion', 'mostrarArchivosEquipos');
    data.append('foliotmp', foliotmp);
    data.append('token', tok);
    data.append('idusuario', id);
    data.append('idequipovale', idEquipoVale);
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == 1001) {
          setFiles([]);
          cerrarSesion();
        } else if (response == null || (Array.isArray(response) && response.length == 0) || response.nueva) {
          setFiles([]);
        } else if (response.length > 0) {
          setFiles(response);
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar consultar el registro de archivos generales para la recepción');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadFiles = async () => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('funcion', 'mostrarArchivosEquipos');
    data.append('foliotmp', foliotmp);
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('idequipovale', idEquipoVale);
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          setFiles([]);
        } else if (response == 1001) {
          setFiles([]);
          cerrarSesion();
        } else if (response == null || (Array.isArray(response) && response.length == 0) || response.nueva) {
          setFiles([]);
        } else if (response.length > 0) {
          setFiles(response);
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar consultar el registro de archivos generales para la recepción');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const FileItem = ({ id, datafile, descripcion }) => {
    let ext = datafile.split('.').pop();
    let filename = datafile.replace(/\.[^/.]+$/, '');
    let item = (
      <View style={{ elevation: 3, backgroundColor: 'white', flexDirection: 'row', margin: 4, justifyContent: 'space-between', padding: 2, borderRadius: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://sgi.midelab.com/ERP/archivos_recepcion/' + datafile)}
            style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
            {ext == 'png' || ext == 'jpg' || ext == 'jpeg' ? (
              <Image
                source={{ uri: 'https://sgi.midelab.com/ERP/archivos_recepcion/' + datafile }}
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
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Descripción: {descripcion}</Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={{ color: 'gray' }}>Tipo: {ext.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Eliminar archivo general', '¿Esta seguro de eliminar el archivo?', [
              { text: 'Salir' },
              { text: 'Confirmar', onPress: () => deleteFileItem(id) },
            ])
          }
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name='close' size={24} color='lightgray' />
        </TouchableOpacity>
      </View>
    );
    return item;
  };

  const deleteFileItem = async (idvale) => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('funcion', 'borrarArchivoEquipo');
    data.append('foliotmp', foliotmp);
    data.append('idvaleequipoarchivo', idvale);
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response[0].exito == '1' && response[0].error == 0) {
          Alert.alert('Archivo eliminado!', 'El archivo se ha eliminado correctamente');
          loadFiles();
        } else if (response[0].exito == '0') {
          Alert.alert('¡Importante!', 'No se ha podido eliminar el archivo');
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar eliminar el archivo');
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
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>DETALLES DEL EQUIPO</Text>
        </View>
        <View style={{ padding: 5 }}>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Descripción: {descripcionEquipo}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Marca: {marcaEquipo}
          </Text>
          <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode='tail'>
            Modelo: {modeloEquipo}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, padding: 5 }}>
        <TouchableOpacity
          onPress={() => pickAFile()}
          style={{
            flexDirection: 'row',
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 10,
            borderRadius: 3,
          }}>
          <MaterialIcons name='attach-file' size={20} color='white' />
          <Text style={{ color: 'white' }}> SELECCIONAR ARCHIVO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickAnImage()}
          style={{
            flexDirection: 'row',
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 10,
            borderRadius: 3,
          }}>
          <Entypo name='images' size={20} color='white' />
          <Text style={{ color: 'white' }}> SELECCIONAR IMAGEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => takeAPhoto()}
          style={{
            flexDirection: 'row',
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#003667',
            paddingVertical: 10,
            borderRadius: 3,
          }}>
          <MaterialCommunityIcons name='camera' size={20} color='white' />
          <Text style={{ color: 'white' }}> TOMAR FOTOGRAFÍA</Text>
        </TouchableOpacity>
        {file.type == 'success' ? (
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
        ) : (
          <></>
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
          {files.length > 0 && (
            <>
              <FlatList
                data={files}
                renderItem={({ item, key }) => {
                  return <FileItem id={item.idvaleequipoarchivo} datafile={item.archivo} descripcion={item.descripcion} key={key} />;
                }}
                keyExtractor={(item) => item.idvaleequipoarchivo.toString()}
                refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default ArchivosPorEquipoScreen;
