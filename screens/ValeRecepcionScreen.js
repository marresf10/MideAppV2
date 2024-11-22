import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

//Librerias externas
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import { baseUrl } from '../configuration/database';
import * as DocumentPicker from 'expo-document-picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Signature from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
//Dropdown
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Dimensions } from 'react-native';

const SubMenu3Screen = ({ navigation, route }) => {
  //Datos para la navegación
  const [titleForm, setTitleForm] = useState('DATOS GENERALES');
  const [visualizedForm, setVisualizedForm] = useState(1);
  //Datos del usuario
  const [token, setToken] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [foliotmp, setFoliotmp] = useState(route.params.foliotmpp);
  //Funcionabilidad del form
  const [clienteSearch, setClienteSearch] = useState('');
  const [clientes, setClientes] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [nombreContacto, setNombreContacto] = useState('');
  const [otroCorreo, setOtroCorreo] = useState(false);
  const [otraDireccionCorreo, setOtraDireccionCorreo] = useState('');
  //Los que se envian en el form
  //Form1
  const [selServicioEnSitio, setSelServicioEnSitio] = useState('0');
  const [cliente, setCliente] = useState('Ninguno');
  const [contacto, setContacto] = useState('Ninguno');
  const [correo, setCorreo] = useState('ejemplocorreo@gmail.com');
  const [forma, setForma] = useState('ENTREGA PERSONAL CLIENTE');
  //dentro del uno pero desplegable
  const [m_quienrecibe, setM_quienrecibe] = useState('');
  const [m_quienenvia, setM_quienenvia] = useState('');
  const [m_mensajeria, setM_mensajeria] = useState('');
  const [m_guia, setM_guia] = useState('');
  const [dimensiones, setDimensiones] = useState('');
  const [peso, setPeso] = useState('');
  const [epr_quienentrega, setEpr_quienentrega] = useState('');
  const [epr_quienrecibe, setEpr_quienrecibe] = useState('');
  //Form2
  const [file, setFile] = useState({ uri: null, type: 'cancelled' });
  const [descripciónArchivoGeneral, setDescripciónArchivoGeneral] = useState('');
  const [files, setFiles] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //Form3
  //Funcionalidad
  const [checkBoxes, setCheckBoxes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [isRefreshingg, setIsRefreshingg] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  //Datos a enviar
  const [descripcion, setDescripcion] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [noserie, setNoserie] = useState('');
  const [ide, setIde] = useState('');
  const [notas, setNotas] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [arrCheckBox, setArrCheckBox] = useState([]);
  const [otrosAccesorios, setOtrosAccesorios] = useState('');
  //Form4
  const [isSigning, setIsSigning] = useState(false);
  const [isSavedSing, setIsSavedSign] = useState(false);
  const [signature, setSign] = useState(null);
  //Notas
  const [misNotas, setMisNotas] = useState('');
  const [showingNotes, setShowingNotes] = useState(true);
  const [uploading, setUploading] = useState(false);
  //Dropdown
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const searchRef = useRef(null);

  //Funciones generales de la screen
  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    let tok = await SecureStore.getItemAsync('token');
    setToken(tok);
    let id = await SecureStore.getItemAsync('idUsuario');
    setIdUsuario(id);
    let nameUsuario = await SecureStore.getItemAsync('nombreUsuario');
    setNombreUsuario(nameUsuario);
    setEpr_quienrecibe(nameUsuario);
    setM_quienrecibe(nameUsuario);

    const pruebita = navigation.addListener('focus', () => {
      loadEquipos(tok, id);
    });

    return pruebita;
  };

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de acceso al almacenamiento requerido');
    }
  };

  const cerrarSesion = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('idUsuario');
    } catch (e) {
      console.log(e);
    }
    navigation.popToTop('Inicio');
  };

  const navigationForm = (navigateTo) => {
    if (navigateTo == 'R') {
      if (visualizedForm == 1) {
        if (correo == 'ejemplocorreo@gmail.com') {
          Alert.alert('¡Importante!', 'Complete los campos de cliente para poder navegar a la siguiente sección');
          return;
        } else if (
          forma == 'MENSAJERIA' &&
          (m_quienrecibe.length < 1 || m_quienenvia.length < 1 || m_mensajeria.length < 1 || setM_guia.length < 1 || dimensiones.length < 1 || peso.length < 1)
        ) {
          Alert.alert('¡Importante!', 'Complete los campos de mensajeria para poder navegar a la siguiente sección');
          return;
        } else if (forma != 'MENSAJERIA' && (epr_quienentrega.length < 1 || epr_quienrecibe.length < 1)) {
          Alert.alert('¡Importante!', 'Complete los campos de recepción para poder navegar a la siguiente sección');
          return;
        } else if (otroCorreo == true && (!otraDireccionCorreo.includes('@') || !otraDireccionCorreo.substr(otraDireccionCorreo.indexOf('@')).includes('.'))) {
          Alert.alert('¡Importante!', 'Introduzca una dirección de correo valida para enviar la copia del vale recepción');
          return;
        }
        loadFiles();
        setTitleForm('ARCHIVOS GENERALES RECEPCIÓN');
        setVisualizedForm(2);
      } else if (visualizedForm == 2) {
        loadEquipos();
        setTitleForm('EQUIPOS PARA RECEPCIÓN');
        setVisualizedForm(3);
      } else if (visualizedForm == 3) {
        if (forma == 'MENSAJERIA') {
          setIsSigning(false);
          setIsSavedSign(false);
        }
        if (isRegistering) {
          return Alert.alert('¡Importante!', 'Es necesario terminar de registrar el equipo para poder navegar a la siguiente sección');
        } else if (equipos.length == 0) {
          return Alert.alert('¡Importante!', 'Registre un equipo para poder navegar a la siguiente sección');
        }
        setTitleForm('CONFIRMAR DATOSS');
        setVisualizedForm(4);
        loadNotes();
      } else {
        Alert.alert('¡Importante!', 'R- Error al cambiar de modulo');
      }
    } else if (navigateTo == 'L') {
      if (visualizedForm == 4) {
        loadEquipos();
        setTitleForm('EQUIPOS PARA RECEPCIÓN');
        setVisualizedForm(3);
      } else if (visualizedForm == 3) {
        if (isRegistering) {
          return Alert.alert('¡Importante!', 'Es necesario terminar de registrar el equipo para poder navegar');
        }
        loadFiles();
        setTitleForm('ARCHIVOS GENERALES RECEPCIÓN');
        setVisualizedForm(2);
      } else if (visualizedForm == 2) {
        setTitleForm('DATOS GENERALES');
        setVisualizedForm(1);
      } else {
        Alert.alert('¡Importante!', 'L- Error al cambiar de modulo');
      }
    } else {
      Alert.alert('¡Importante!', 'Error al cambiar de modulo');
    }
  };

  //Funciones del formulario 1
  const searchClients = async () => {
    const data = new FormData();
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    data.append('term', clienteSearch);
    await fetch(baseUrl + 'ERP/php/app_ws_get_clientes.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'No hay registros de clientes con la busquedad <' + clienteSearch + '>');
        } else if (response[0].error == 1001) {
          cerrarSesion();
          return;
        } else if (response.length > 0) {
          setClientes(response);
        } else {
          Alert.alert('¡Importante!', 'Surgio un error al intentar consultar el registro de clientes');
        }
      })
      .catch((error) => {
        console.log('searchClients (2): ');
        console.error(error);
      });
  };

  const searchAClient = (val) => {
    setClienteSearch(val);
    setCliente('Ninguno');
    setClientes([]);
    setContactos([]);
    setContacto('Ninguno');
    setCorreo('ejemplocorreo@gmail.com');
  };

  const pickAClient = (idclient) => {
    let findLabel = suggestionsList.find((o) => o.id == idclient);
    setCliente(idclient);
    setClienteSearch(findLabel.title);
    setClientes([]);
    searchContacts(idclient);
  };

  const searchContacts = async (idclient) => {
    let data = new FormData();
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    data.append('idcliente', idclient);
    await fetch(baseUrl + 'ERP/php/app_ws_get_contactos_cliente.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'No hay registros de contactos para el cliente seleccionado');
        } else if (response[0].error == 1001) {
          cerrarSesion();
          return;
        } else if (response.length > 0) {
          setContactos(response);
        } else {
          Alert.alert('¡Importante!', 'Surgio un error al intentar consultar el registro de contactos');
        }
      })
      .catch((error) => {
        console.log('searchContacts (2): ');
        console.error(error);
      });
  };

  const setAContact = (val) => {
    if (val == 'Ninguno') {
      Alert.alert('¡Importante!', 'Debe seleccionar un contacto');
      setContacto('Ninguno');
      setContacto(val);
      setNombreContacto('Ninguno');
      setCorreo('ejemplocorreo@gmail.com');
    } else if (val != 'Ninguno') {
      let findClient = contactos.find((o) => o.idcontacto == val);

      setContacto(val);
      setNombreContacto(findClient.contacto);
      setCorreo(findClient.correo);
    } else {
      Alert.alert('¡Importante!', 'Ocurrio un error al seleccionar el contacto');
    }
  };

  //Funciones del formulario 2
  const loadFiles = async () => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('funcion', 'mostrarArchivosRecepcion');
    data.append('foliotmp', foliotmp);
    data.append('token', token);
    data.append('idusuario', idUsuario);
    await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == null) {
          setFiles([]);
        } else if (response == 1001) {
          cerrarSesion();
          return;
        } else if (response == null || (Array.isArray(response) && response.length == 0) || response.nueva) {
          setFiles([]);
        } else if (response.length > 0) {
          setFiles(response);
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar consultar el registro de archivos generales para la recepción');
        }
      })
      .catch((error) => {
        console.log('loadFiles (2): ');
        console.error(error);
      });
  };
  
  // Función para seleccionar un archivo
  const pickAFile = async () => {
    console.log("Intentando seleccionar un archivo...");
  
    try {
      let result = await DocumentPicker.getDocumentAsync();
  
      console.log("Resultado del DocumentPicker:", result);
  
      if (result.canceled) {
        console.log("Selección de archivo cancelada.");
        setFile({ uri: null, type: 'cancelled' });
        return;
      }
  
      const selectedFile = result.assets ? result.assets[0] : result;
  
      if (selectedFile.uri) {
        const ext = selectedFile.uri.split('.').pop();
        const unsupportedFormats = ['mp4', 'mwv', 'mpeg', 'mp3', 'wav', 'wma', 'opus', 'ogg'];
  
        if (unsupportedFormats.includes(ext)) {
          Alert.alert('¡Importante!', 'El archivo seleccionado contiene un formato no aceptado');
          setFile({ uri: null, type: 'cancelled' });
        } else {
          // Crear el archivo que se subirá
          const newFile = {
            uri: selectedFile.uri,
            name: selectedFile.name || 'archivo.pdf',
            mimeType: selectedFile.mimeType || 'application/pdf',
            idvalearchivo: Date.now().toString(),
            descripcion: 'Descripción del archivo',
          };
  
          console.log("Archivo válido seleccionado:", newFile);
  
          // Actualizar el estado de `files`
          setFiles((prevFiles) => [...prevFiles, newFile]);
          setFile(newFile);
        }
      } else {
        console.log("No se obtuvo URI en el archivo seleccionado.");
      }
    } catch (error) {
      console.log("Error al seleccionar archivo:", error);
      setFile({ uri: null, type: 'error' });
    }
  };  

const takeAPhoto = async () => {
  setDescripciónArchivoGeneral('');

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
  setDescripciónArchivoGeneral('');
  
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    Alert.alert('¡Importante!', 'Usted ha rechazado la solicitud de permisos para acceso a galería');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 0.5,
  });

  if (result.canceled) {
    console.log("Selección de imagen cancelada.");
    setFile({ uri: null, type: 'cancelled' });
    return;
  }

  const selectedImage = result.assets ? result.assets[0] : result;

  if (selectedImage.uri) {
    let ext = selectedImage.uri.split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'bmp'].includes(ext)) {
      Alert.alert('¡Importante!', 'El archivo seleccionado contiene un formato no aceptado');
      setFile({ uri: null, type: 'cancelled' });
      return;
    }

    try {
      const uniqueId = new Date().getTime().toString();
      const tempUri = `${FileSystem.documentDirectory}${uniqueId}.${ext}`;
      
      await FileSystem.copyAsync({
        from: selectedImage.uri,
        to: tempUri,
      });

      setFile({
        uri: tempUri,
        type: 'success',
        mimeType: selectedImage.type || 'image/jpeg',
        name: foliotmp + '.' + ext,
      });

      console.log("Imagen seleccionada y URI temporal generada:", tempUri);
    } catch (error) {
      console.error("Error al copiar la imagen:", error);
      Alert.alert('¡Importante!', 'Hubo un problema al procesar la imagen');
      setFile({ uri: null, type: 'cancelled' });
    }
  } else {
    console.log("No se obtuvo URI en la imagen seleccionada.");
  }
};

  const uploadFile = async () => {
  if (!file || !file.uri || file.type === 'cancelled') {
    Alert.alert('¡Importante!', 'Seleccione un archivo');
    return;
  }

  try {
    setUploading(true);

    const tempUri = `${FileSystem.documentDirectory}${file.name}`;
    await FileSystem.copyAsync({
      from: file.uri,
      to: tempUri,
    });

    console.log("URI temporal del archivo:", tempUri);

    const data = new FormData();
    data.append('foliotmp', foliotmp);
    data.append('esporapp', '1');
    data.append('archivo_descripcion_recepcion', descripciónArchivoGeneral);
    data.append('token', token);
    data.append('idusuario', idUsuario);

    console.log("Datos a enviar con FormData:");
    console.log('foliotmp:', foliotmp);
    console.log('esporapp:', '1');
    console.log('archivo_descripcion_recepcion:', descripciónArchivoGeneral);
    console.log('token:', token);
    console.log('idusuario:', idUsuario);

    data.append('archivo_recepcion', {
      uri: tempUri,
      name: file.name,
      type: 'image/jpeg',
    });

    const response = await axios.post(
      'https://sgi.midelab.com/ERP/php/app_v2_ws_recepcion_upload_archivos_recepcion.php',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
      }
    );

    const result = response.data;
    setUploading(false);
    if (result && result[0].exito === '1') {
      Alert.alert('¡Importante!', 'El archivo se ha subido correctamente');
      setFile({ uri: null, type: 'cancelled' });
    } else {
      Alert.alert('¡Importante!', 'El archivo no se ha podido subir');
    }
  } catch (error) {
    setUploading(false);
    console.log('uploadFile error con axios:', error);
    Alert.alert('¡Error!', 'No se pudo subir el archivo');
  }
};

  const deleteFileItem = async (idvale) => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('funcion', 'borrarArchivoRecepcion');
    data.append('foliotmp', foliotmp);
    data.append('idvalearchivo', idvale);
    await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'No se ha podido eliminar el archivo');
        } else if (response == 1001) {
          cerrarSesion();
          return;
        } else if (response[0].exito == '1' && response[0].error == 0) {
          loadFiles();
          Alert.alert('¡Importante!', 'El archivo se ha eliminado correctamente');
        } else if (response[0].exito == '0') {
          Alert.alert('¡Importante!', 'No se ha podido eliminar el archivo');
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar eliminar el archivo');
        }
      })
      .catch((error) => {
        console.log('deleteFileItem (2):');
        console.error(error);
      });
  };

  const FileItemViejo = ({ id, datafile, name, descripcion }) => {
    console.log("Renderizando FileItem:", id, datafile, name, descripcion);
  
    let ext = datafile.split('.').pop();
  
    return (
      <View
        style={{
          elevation: 3,
          backgroundColor: 'white',
          flexDirection: 'row',
          margin: 4,
          justifyContent: 'space-between',
          padding: 2,
          borderRadius: 10,
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => Linking.openURL(datafile)}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            {ext === 'png' || ext === 'jpg' || ext === 'jpeg' ? (
              <Image
                source={{ uri: datafile }}
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
              {name} {/* Usar el nombre del archivo */}
            </Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4 }}>
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Descripción: {descripcion}</Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4 }}>
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Tipo de archivo: {ext.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Eliminar archivo general', '¿Está seguro de eliminar el archivo?', [
              { text: 'Salir' },
              { text: 'Confirmar', onPress: () => deleteFileItem(id) },
            ])
          }
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name='close' size={24} color='lightgray' />
        </TouchableOpacity>
      </View>
    );
  };  

  const FileItem = ({ id, datafile, name, descripcion }) => {
    console.log("Renderizando FileItem:", id, datafile, name, descripcion);
  
    // Verificar si datafile está definido y contiene una URI válida
    let ext = datafile && typeof datafile === 'string' ? datafile.split('.').pop() : '';
  
    return (
      <View
        style={{
          elevation: 3,
          backgroundColor: 'white',
          flexDirection: 'row',
          margin: 4,
          justifyContent: 'space-between',
          padding: 2,
          borderRadius: 10,
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => datafile && Linking.openURL(datafile)}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            {ext === 'png' || ext === 'jpg' || ext === 'jpeg' ? (
              <Image
                source={{ uri: datafile }}
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
              {name}
            </Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4 }}>
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Descripción: {descripcion}</Text>
          </View>
          <View style={{ flex: 2, paddingLeft: 4, paddingBottom: 4 }}>
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Tipo de archivo: {ext.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Eliminar archivo general', '¿Está seguro de eliminar el archivo?', [
              { text: 'Salir' },
              { text: 'Confirmar', onPress: () => deleteFileItem(id) },
            ])
          }
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name='close' size={24} color='lightgray' />
        </TouchableOpacity>
      </View>
    );
  };  

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await loadFiles();
    setIsRefreshing(false);
  });

  //Funciones del formulario 3
  const loadEquipos = async (tok, id) => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('funcion', 'mostrarEquiposVales');
    data.append('foliotmp', foliotmp);
    if (typeof tok == 'undefined' && typeof id == 'undefined') {
      data.append('token', token);
      data.append('idusuario', idUsuario);
    } else {
      data.append('token', tok);
      data.append('idusuario', id);
    }
    await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          setEquipos([]);
          return;
        } else if (response == 1001) {
          cerrarSesion();
          return;
        } else if (Array.isArray(response) && response.length == 0) {
          setEquipos([]);
          return;
        } else if (response[0].totalequipos == 0) {
          setEquipos([]);
          return;
        } else if (response.totalequipos == 0) {
          setEquipos([]);
          return;
        } else if (response.length > 0 && Array.isArray(response)) {
          setEquipos(response);
          return;
        } else {
          Alert.alert('¡Importante!', 'Ocurrio un error al intentar consultar el registro de archivos generales para la recepción');
          return;
        }
      })
      .catch((error) => {
        console.log('loadEquipos (2):');
        console.error(error);
      });
  };

  const EquipoItem = ({ id, desc, mar, mod, int, no, ide, notas, acc, tot, archivos }) => {
    let item = (
      <View
        style={{
          elevation: 3,
          backgroundColor: 'white',
          margin: 5,
          justifyContent: 'space-between',
          padding: 3,
          borderRadius: 10,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 9, padding: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Descripción: </Text>
            </View>
            <View>
              <Text>{desc}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Marca: </Text>
              </View>
              <Text>{mar}</Text>
            </View>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Modelo: </Text>
              <Text>{mod}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Intervalo: </Text>
              </View>
              <View>
                <Text>{int}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>No. de Serie: </Text>
              </View>
              <View>
                <Text numberOfLines={1} ellipsizeMode='tail'>
                  {no}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Identificador: </Text>
              </View>
              <View>
                <Text>{ide}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Notas: </Text>
              </View>
              <View>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ paddingRight: 40 }}>
                  {notas.length < 1 ? 'Sin notas' : notas}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Accesorios: </Text>
            </View>
            {acc.length > 0 ? (
              <View>
                <Text>{acc.join(', ')}</Text>
              </View>
            ) : (
              <View>
                <Text>Sin accesorios</Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#EEE', marginLeft: 2 }}>
          {tot == 0 ? (
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' }}
              onPress={() =>
                navigation.navigate('Subir archivos del equipo', {
                  idequipovale: id,
                  foliotmpp: route.params.foliotmpp,
                  descripcion: desc,
                  marca: mar,
                  modelo: mod,
                })
              }>
              <MaterialIcons name='upload-file' size={24} color='#DDD' />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' }}
              onPress={() =>
                navigation.navigate('Subir archivos del equipo', {
                  idequipovale: id,
                  foliotmpp: route.params.foliotmpp,
                  descripcion: desc,
                  marca: mar,
                  modelo: mod,
                })
              }>
              <MaterialIcons name='upload-file' size={24} color='#DDD' />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' }}
            onPress={() =>
              Alert.alert('Editar recepción de equipo', '¿Deseas editar el equipo?', [
                { text: 'Cancelar' },
                { text: 'Confirmar', onPress: () => editEquipoDatos(id) },
              ])
            }>
            <MaterialIcons name='edit' size={22} color='#DDD' />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() =>
              Alert.alert('Eliminar recepción de equipo', '¿Esta seguro de eliminar la recepción del equipo?', [
                { text: 'Salir' },
                { text: 'Confirmar', onPress: () => deleteEquipo(id) },
              ])
            }>
            <AntDesign name='close' size={22} color='#DDD' />
          </TouchableOpacity>
        </View>
      </View>
    );
    return item;
  };

  const deleteEquipo = async (id) => {
    let data = new FormData();
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    data.append('funcion', 'borrarRecepcion');
    data.append('foliotmp', foliotmp);
    data.append('idequipovale', id);
    await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'Surgió un problema al intentar eliminar el equipo');
        } else if (response == 1001) {
          cerrarSesion();
          return;
        } else if (response[0].exito == 1) {
          Alert.alert('¡Importante!', 'Se ha eliminado el equipo correctamente');
          loadEquipos();
        } else {
          Alert.alert('¡Importante!', 'Se ha tenido un problema al intentar eliminar el equipo');
        }
      })
      .catch((error) => {
        console.log('deleteEquipo (2):');
        console.error(error);
      });
  };

  const editEquipoDatos = async (id) => {
    let data = new FormData();
    data.append('funcion', 'obtenerDatosEquipoEditar');
    data.append('idequipovale', id);
  
    try {
      const response = await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
        method: 'POST',
        body: data,
      });
  
      const result = await response.json();
  
      if (result && Array.isArray(result) && result.length > 0) {
        const equipoData = result[0];
  
        navigation.navigate('Editar Equipo', {
          descripcion: equipoData.descripcion,
          marca: equipoData.marca,
          modelo: equipoData.modelo,
          intervalo: equipoData.intervalo,
          noserie: equipoData.noserie,
          identificador: equipoData.identificador,
          notas: equipoData.notas,
          observaciones: equipoData.observaciones,
          idequipovale: id,
        });
      } else {
        Alert.alert('Error', 'No se pudieron obtener los datos del equipo.');
      }
    } catch (error) {
      console.error('Error al obtener datos del equipo:', error);
      Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
    }
  };
/*
  const editEquipoPruebas = async (id) => {
    let data = new FormData();
    //data.append('token', token);
    //data.append('idusuario', idUsuario);
    //data.append('esporapp', 1);
    data.append('funcion', 'obtenerDatosEquipoEditar');  // Función correcta para obtener datos
    data.append('idequipovale', id);
  
    try {
      const response = await fetch(baseUrl + 'ERP/php/app_v2_ws_recepcion_funciones.php', {
        method: 'POST',
        body: data,
      });
  
      const result = await response.json(); // Parseamos directamente a JSON
  
      if (result == null) {
        console.log('Respuesta vacía del servidor');
        Alert.alert('¡Importante!', 'Surgió un problema al intentar obtener los datos del equipo');
      } else if (result == 1001) {
        cerrarSesion();
      } else if (Array.isArray(result) && result.length > 0) {
        // Aquí asumimos que la respuesta es un arreglo con los datos del equipo
        const equipoData = result[0]; // Accedemos a los primeros datos si es un arreglo
        console.log('Datos del equipo:', equipoData);
      } else {
        // Si no es un arreglo o hay algún otro problema, mostramos un mensaje de error
        Alert.alert('¡Importante!', 'Surgió un problema al obtener los datos del equipo');
      }
    } catch (error) {
      console.log('Error al obtener datos del equipo:', error);
    }
  };
*/
  const onRefreshh = React.useCallback(async () => {
    setIsRefreshingg(true);
    await loadEquipos();
    setIsRefreshingg(false);
  });

  const displayRegisterForm = () => {
    loadCheckBoxes();
    setIsRegistering(true);
    //Reinicializar form
    setDescripcion('');
    setMarca('');
    setModelo('');
    setIntervalo('');
    setNoserie('');
    setIde('');
    setNotas('');
    setObservaciones('');
    setArrCheckBox('');
    setOtrosAccesorios('');
    //Fin
  };

  const loadCheckBoxes = async () => {
    let data = new FormData();
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    await fetch(baseUrl + 'ERP/php/app_v2_ws_get_accesorios_equipos.php', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'No se encuentran accesorios registrados');
        } else if (response.length > 0) {
          var arre = [];
          for (let i = 0; i < response.length; i++) {
            let element = { ['chk_accesorio_' + response[i].idaccesorio]: false };
            arre = Object.assign({}, arre, element);
          }
          setArrCheckBox(arre);
          setCheckBoxes(response);
        } else {
          Alert.alert('¡Importante!', 'Surgio un error al intentar consultar los accesorios');
        }
      })
      .catch((error) => {
        console.log('loadCheckBoxes (1):');
        console.error(error);
      });
  };

  const registerEquipo = async () => {
    if (descripcion.length < 1) {
      Alert.alert('¡Importante!', 'El campo de descripción no puede ser vacio');
    } else if (marca.length < 1) {
      Alert.alert('¡Importante!', 'El campo de marca no puede ser vacio');
    } else if (modelo.length < 1) {
      Alert.alert('¡Importante!', 'El campo de modelo no puede ser vacio');
    } else if (intervalo.length < 1) {
      Alert.alert('¡Importante!', 'El campo de intervalo no puede ser vacio');
    } else if (noserie.length < 1) {
      Alert.alert('¡Importante!', 'El campo de número de serie no puede ser vacio');
    } else if (ide.length < 1) {
      Alert.alert('¡Importante!', 'El campo de identificador no puede ser vacio');
    } else {
      let data = new FormData();
      data.append('token', token);
      data.append('idusuario', idUsuario);
      data.append('esporapp', 1);
      data.append('foliotmp', foliotmp);
      data.append('descripcion', descripcion);
      data.append('marca', marca);
      data.append('modelo', modelo);
      data.append('intervalo', intervalo);
      data.append('noserie', noserie);
      data.append('ide', ide);
      data.append('observaciones', observaciones);
      data.append('notas', notas);
      data.append('accesorios', JSON.stringify(arrCheckBox));
      data.append('txtOtrosAccesorios', otrosAccesorios);
      await fetch(baseUrl + 'ERP/php/app_ws_guardar_equipo_vale.php', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          if (response == null) {
            Alert.alert('¡Importante!', 'Se ha tenido un problema al intentar registrar el equipo', [{ text: 'Intentar despues' }]);
            setIsRegistering(false);
            loadEquipos();
          } else if (response[0].error == 1001) {
            cerrarSesion();
            return;
          } else if (response[0].exito == 1) {
            Alert.alert('¡Registro exitoso!', 'Se ha registrado el equipo correctamente');
            setIsRegistering(false);
            loadEquipos();
          } else {
            Alert.alert('¡Importante!', 'Se ha tenido un problema al intentar registrar el equipo', [{ text: 'Intentar despues' }]);
          }
        })
        .catch((error) => {
          console.log('registerEquipo (2):');
          console.error(error);
        });
    }
  };

  //Funciones del form 4
  const loadNotes = async () => {
    let data = new FormData();
    data.append('tipo', 'R');
    data.append('esensitio', forma == 'SERVICIO EN SITIO' ? '1' : '0');
    await fetch(baseUrl + 'ERP/php/apps_ws_notas_recepcion.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        let notes = response;
        setMisNotas(notes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOK = async (signature) => {
    setIsSavedSign(true);
    let imageUri = signature.replace('data:image/png;base64,', '');
    let hoy = new Date();
    let hora = hoy.getHours() + '_' + hoy.getMinutes() + '_' + hoy.getSeconds();
    try {
      //This creates a temp uri file so there's no neeed to download an image_source to get a URI Path
      const uri = FileSystem.cacheDirectory + hora + 'signature.png';
      await FileSystem.writeAsStringAsync(uri, imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      //At this point the URI 'file://...' has our base64 image data and now i can upload it with no "Network request failed" or share the URI as you wish
      setSign(uri);
    } catch (e) {
      console.log('*Error*');
      console.log(e);
    }
  };

  const handleEmpty = () => {
    //
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: #004667;
      color: #FFF;
    }`;

  //Subir todos los datos
  const uploadData = async () => {
    let data = new FormData();
    data.append('token', token);
    data.append('idusuario', idUsuario);
    data.append('foliotmp', foliotmp);
    data.append('hdenviarcliente', 1);
    data.append('hdYaConFirma', 1);
    forma != 'MENSAJERIA'
      ? data.append('nombre_archivo_firma', {
          uri: signature,
          name: idUsuario + '_' + foliotmp + '_firma.jpg',
          type: 'image/jpeg',
        })
      : data.append('nombre_archivo_firma', 'NA');
    data.append('selServicioEnSitio', selServicioEnSitio);
    data.append('idcliente', cliente);
    data.append('selContactoCliente', contacto);
    data.append('variable_tmp', foliotmp);
    data.append('forma', forma);
    data.append('m_quienrecibe', m_quienrecibe);
    data.append('m_quienenvia', m_quienenvia);
    data.append('m_mensajeria', m_mensajeria);
    data.append('m_guia', m_guia);
    data.append('epr_quienentrega', epr_quienentrega);
    data.append('epr_quienrecibe', epr_quienrecibe);
    data.append('dimensiones', dimensiones);
    data.append('peso', peso);
    data.append('otrocorreo', otraDireccionCorreo);
    data.append('es_nueva_recepcion', 1);
    data.append('fue_por_vale', 1);
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_guardar.php', {
      method: 'POST',
      body: data,
      header: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          Alert.alert('¡Importante!', 'Hubo un error al intentar subir la recepción');
        } else if ((response != null || response == undefined) && response[0].error == 1001) {
          cerrarSesion();
          return;
        } else if (response == 1001) {
          cerrarSesion();
          return;
        } else if (response[0].exito == 1) {
          Alert.alert('¡Registro exitoso!', 'Se ha registrado la recepción de equipo(s) correctamente', [
            { text: 'Aceptar', onPress: () => navigation.navigate('Principal') },
          ]);
        } else {
          Alert.alert('¡Importante!', 'Hubo un error al intentar subir la recepción');
        }
      })
      .catch((error) => {
        console.log('uploadData (1): ');
        console.log(error);
      });
  };

  const uploadSure = () => {
    if (isSavedSing == true && signature != null) {
      Alert.alert('¡Registrar Vale Recepción!', '¿Desea enviar el registro de la recepción de equipo(s)?', [
        { text: 'No' },
        { text: 'Aceptar', onPress: () => uploadData() },
      ]);
    } else if (isSavedSing == false) {
      Alert.alert('¡Importante!', 'Realice la firma para poder subir él vale de recepción de equipo(s)');
    } else {
      Alert.alert('¡Importante!', 'Surgió un error al intentar subir la recepción');
    }
  };

  //Dropdown
  const getSuggestions = useCallback(async (q) => {
    //terminar
    searchAClient(q);
    let data = new FormData();
    data.append('token', route.params.tokenusu);
    data.append('idusuario', route.params.idusu);
    data.append('esporapp', 1);
    data.append('term', q);

    if (typeof q !== 'string' || q.length < 2) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    const response = await fetch(baseUrl + 'ERP/php/app_ws_get_clientes.php', {
      method: 'POST',
      body: data,
    });
    const items = await response.json();
    if (items != null && items.error == 1001) {
      setSuggestionsList(null);
    } else if (items == null) {
      setSuggestionsList(null);
      Alert.alert('¡Importante!', 'No hay registros de clientes con la busquedad <' + q + '>');
    } else if (items.length > 0) {
      const suggestions = items.map((item) => ({
        id: item.idcliente,
        title: item.c_razonsocial,
      }));
      setSuggestionsList(suggestions);
    } else {
      setSuggestionsList(null);
    }
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSubModule}>VALE RECEPCIÓN</Text>
      </View>
      {!isRegistering && (
        <View style={styles.bottomTitleContainer}>
          {visualizedForm != 1 ? (
            <TouchableOpacity
              onPress={() => navigationForm('L')}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }}>
              <AntDesign name='left' size={24} color='white' />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }} />
          )}
          <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>{titleForm}</Text>
          </View>
          {visualizedForm != 4 ? (
            <TouchableOpacity
              onPress={() => navigationForm('R')}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }}>
              <AntDesign name='right' size={24} color='white' />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }}></View>
          )}
        </View>
      )}
      <View style={styles.container}>
        {visualizedForm == 1 && (
          <>
            <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#ffac44', fontWeight: 'bold' }}>NOTA: </Text>
              <Text>* Datos obligatorios </Text>
            </View>
            <ScrollView keyboardShouldPersistTaps='handled'>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 30 }}>
                <AntDesign name='doubleright' size={14} color='#003667' />
                <Text style={{ color: '#003667', fontWeight: 'bold' }}> DATOS DEL CLIENTE</Text>
              </View>

              <Text>Cliente: * </Text>
              <AutocompleteDropdown
                ref={searchRef}
                controller={(controller) => {
                  dropdownController.current = controller;
                }}
                dataSet={suggestionsList}
                onChangeText={getSuggestions}
                onSelectItem={(item) => {
                  item && setSelectedItem(item.id);
                  item && pickAClient(item.id);
                }}
                debounce={600}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                loading={loading}
                useFilter={false}
                textInputProps={{
                  placeholder: 'Cliente',
                  autoCorrect: false,
                  autoCapitalize: 'none',
                  style: {
                    borderRadius: 15,
                    backgroundColor: '#FFF',
                    color: '#000',
                    paddingLeft: 10,
                    paddingRight: 15,
                    borderWidth: 1,
                    borderColor: 'lightgray',
                  },
                }}
                rightButtonsContainerStyle={{
                  right: 5,
                  height: 30,
                  top: 10,
                  alignSelfs: 'center',
                  backgroundColor: 'transparent',
                }}
                inputContainerStyle={{
                  backgroundColor: 'transparent',
                }}
                suggestionsListContainerStyle={{
                  backgroundColor: '#383b42',
                }}
                containerStyle={{ flexShrink: 1 }}
                renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
                ChevronIconComponent={<Feather name='x-circle' size={18} color='#fff' />}
                ClearIconComponent={<Feather name='chevron-down' size={20} color='#fff' />}
                inputHeight={50}
                showChevron={false}
                //  showClear={false}
              />
              <Text style={{ marginTop: 10 }}>Contacto: * </Text>
              <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 15, marginBottom: 10 }}>
                <Picker selectedValue={contacto} onValueChange={(value) => setAContact(value)}>
                  <Picker.Item style={{ fontSize: 14 }} label='Seleccione un contacto' value='Ninguno' />
                  {contactos.map((item) => (
                    <Picker.Item style={{ fontSize: 14 }} label={item.contacto} value={item.idcontacto} key={item.idcontacto} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                <Text>Correo eléctronico: </Text>
                <Text style={{ fontWeight: 'bold' }}>{correo}</Text>
              </View>
              <Text style={{ marginTop: 10 }}>Forma recepción del equipo: * </Text>
              <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 15, marginBottom: 10 }}>
                <Picker selectedValue={forma} onValueChange={(value) => setForma(value)}>
                  <Picker.Item style={{ fontSize: 14 }} label='ENTREGA PERSONAL CLIENTE' value='ENTREGA PERSONAL CLIENTE' />
                  <Picker.Item style={{ fontSize: 14 }} label='MENSAJERÍA' value='MENSAJERIA' />
                  <Picker.Item style={{ fontSize: 14 }} label='RECOLECCIÓN' value='RECOLECCION' />
                  <Picker.Item style={{ fontSize: 14 }} label='SERVICIO EN SITIO' value='SERVICIO EN SITIO' />
                </Picker>
              </View>
              <>
                {forma == 'MENSAJERIA' ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                      <AntDesign name='doubleright' size={14} color='#003667' />
                      <Text style={{ color: '#003667', fontWeight: 'bold' }}> MENSAJERIA</Text>
                    </View>
                    <Text style={{ marginTop: 7 }}>¿Quién recibe?: </Text>
                    <View style={{ flex: 6 }}>
                      <Text style={{ fontWeight: 'bold' }}>{m_quienrecibe}</Text>
                    </View>
                    <Text style={{ marginTop: 10 }}>¿Quién envía?: * </Text>
                    <View style={{ flex: 6 }}>
                      <TextInput
                        style={styles.textInput}
                        placeholder='Nombre de la persona'
                        value={m_quienenvia}
                        onChangeText={(val) => setM_quienenvia(val)}
                      />
                    </View>
                    <Text style={{ marginTop: 10 }}>Empresa mensajeria: * </Text>
                    <View style={{ flex: 6 }}>
                      <TextInput style={styles.textInput} placeholder='Empresa mensajeria' value={m_mensajeria} onChangeText={(val) => setM_mensajeria(val)} />
                    </View>
                    <Text style={{ marginTop: 10 }}>No. guía: * </Text>
                    <View style={{ flex: 6 }}>
                      <TextInput style={styles.textInput} placeholder='Número de guía' value={m_guia} onChangeText={(val) => setM_guia(val)} />
                    </View>
                    <Text style={{ marginTop: 10 }}>Dimensiones: * </Text>
                    <View style={{ flex: 6 }}>
                      <TextInput style={styles.textInput} placeholder='Dimensiones' value={dimensiones} onChangeText={(val) => setDimensiones(val)} />
                    </View>
                    <Text style={{ marginTop: 10 }}>Peso: * </Text>
                    <View style={{ flex: 6, marginBottom: 10 }}>
                      <TextInput style={styles.textInput} placeholder='Peso (kg)' value={peso} onChangeText={(val) => setPeso(val)} />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 0, alignItems: 'center' }}>
                      <Text>¿Enviar copia a correo? </Text>
                      <BouncyCheckbox fillColor='#003667' isChecked={otroCorreo} onPress={() => setOtroCorreo(!otroCorreo)} />
                    </View>
                    {otroCorreo ? (
                      <>
                        <Text style={{ marginTop: 10 }}>Enviar copia a: *</Text>
                        <View style={{ flex: 6, marginBottom: 25 }}>
                          <TextInput
                            style={styles.textInput}
                            placeholder='Dirección de correo'
                            value={otraDireccionCorreo}
                            keyboardType='email-address'
                            onChangeText={(val) => setOtraDireccionCorreo(val)}
                          />
                        </View>
                      </>
                    ) : (
                      <View style={{ marginBottom: 30 }} />
                    )}
                  </>
                ) : (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                      <AntDesign name='doubleright' size={14} color='#003667' />
                      <Text style={{ color: '#003667', fontWeight: 'bold' }}> RECEPCIÓN</Text>
                    </View>
                    <Text style={{ marginTop: 10 }}>¿Quién entrega?: *</Text>
                    <View style={{ flex: 6 }}>
                      <TextInput
                        style={styles.textInput}
                        placeholder='Nombre de la persona'
                        value={epr_quienentrega}
                        onChangeText={(val) => setEpr_quienentrega(val)}
                      />
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                      <Text style={{}}>¿Quién recibe?:</Text>
                      <Text style={{ fontWeight: 'bold' }}> {epr_quienrecibe}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                      <Text>¿Enviar copia a correo? </Text>
                      <BouncyCheckbox fillColor='#003667' isChecked={otroCorreo} onPress={() => setOtroCorreo(!otroCorreo)} />
                    </View>
                    {otroCorreo ? (
                      <>
                        <Text style={{ marginTop: 10 }}>Enviar copia a: *</Text>
                        <View style={{ flex: 6, marginBottom: 25 }}>
                          <TextInput
                            style={styles.textInput}
                            placeholder='Dirección de correo'
                            value={otraDireccionCorreo}
                            keyboardType='email-address'
                            onChangeText={(val) => setOtraDireccionCorreo(val)}
                          />
                        </View>
                      </>
                    ) : (
                      <View style={{ marginBottom: 30 }} />
                    )}
                  </>
                )}
              </>
            </ScrollView>
          </>
        )}
        {visualizedForm == 2 && (
          <>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <AntDesign name='doubleright' size={14} color='#003667' />
                <Text style={{ color: '#003667', fontWeight: 'bold' }}> ARCHIVOS GENERALES PARA LA RECEPCIÓN</Text>
              </View>
              <TouchableOpacity
                onPress={() => pickAFile()}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  paddingVertical: 8,
                  borderRadius: 3,
                }}>
                <MaterialIcons name='attach-file' size={50} color='white' />
                <Text style={{ color: 'white' }}> SELECCIONAR ARCHIVO </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pickAnImage()}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  paddingVertical: 8,
                  borderRadius: 3,
                }}>
                <Entypo name='images' size={50} color='white' />
                <Text style={{ color: 'white' }}> SELECCIONAR IMAGEN </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => takeAPhoto()}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  paddingVertical: 8,
                  borderRadius: 3,
                }}>
                <MaterialCommunityIcons name='camera' size={50} color='white' />
                <Text style={{ color: 'white' }}> TOMAR FOTOGRAFÍA </Text>
              </TouchableOpacity>
              {file.type == 'success' ? (
                <>
                  {file.mimeType.includes('image') ? (
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
                        <TextInput
                          style={styles.textInput}
                          placeholder='Descripción'
                          value={descripciónArchivoGeneral}
                          onChangeText={(val) => setDescripciónArchivoGeneral(val)}
                        />
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text>Previsualización: </Text>
                      </View>
                      <View style={{ marginBottom: 3, justifyContent: 'center', alignItems: 'center', width: '100%', height: 150 }}>
                        <Image source={{ uri: file.uri }} resizeMode='contain' style={{ width: '100%', height: '100%' }} />
                      </View>
                      <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Archivo: </Text>
                        <Text>{file.name}</Text>
                      </View>
                    </View>
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
                        <TextInput
                          style={styles.textInput}
                          placeholder='Descripción'
                          value={descripciónArchivoGeneral}
                          onChangeText={(val) => setDescripciónArchivoGeneral(val)}
                        />
                      </View>
                      <View style={{ marginBottom: 3 }}>
                        <Text style={{ fontWeight: 'bold' }}>Archivo: </Text>
                        <Text>{file.name}</Text>
                      </View>
                    </View>
                  )}
                </>
              ) : (
                <></>
              )}
              {file.type == 'success' && (
                <TouchableOpacity
                  onPress={() => uploadFile()}
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
              <View>
                {files.length > 0 ? (
                  <>
                    <FlatList
                      data={files}
                      renderItem={({ item }) => (
                        <FileItem
                          id={item.idvalearchivo}
                          datafile={item.uri}
                          name={item.name}
                          descripcion={item.descripcion}
                        />
                      )}
                      keyExtractor={(item) => item.idvalearchivo}
                    />
                    </>
                ) : (
                  <View
                    style={{
                      paddingVertical: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Text>¡No hay archivos cargados!</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
        {visualizedForm == 3 && (
          <>
            {isRegistering && (
              <TouchableOpacity
                onPress={() => setIsRegistering(false)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#003667',
                  borderRadius: 5,
                  alignSelf: 'flex-start',
                  padding: 5,
                  marginBottom: 5,
                }}>
                <Feather name='arrow-left-circle' size={20} color='white' />
                <Text style={{ color: 'white' }}> Regresar</Text>
              </TouchableOpacity>
            )}
            {isRegistering && (
              <View style={{ flexDirection: 'row', alignContent: 'center', marginBottom: 10 }}>
                <Text style={{ color: '#ffac44', fontWeight: 'bold' }}>NOTA: </Text>
                <Text>* Datos obligatorios </Text>
              </View>
            )}

            <View>
              {isRegistering ? (
                <ScrollView>
                  <>
                    <Text>Descripción: *</Text>
                    <TextInput style={styles.textInput} placeholder='Descripción' value={descripcion} onChangeText={(val) => setDescripcion(val)} />
                    <Text>Marca: *</Text>
                    <TextInput style={styles.textInput} placeholder='Marca' value={marca} onChangeText={(val) => setMarca(val)} />
                    <Text>Modelo: *</Text>
                    <TextInput style={styles.textInput} placeholder='Modelo' value={modelo} onChangeText={(val) => setModelo(val)} />
                    <Text>Intervalo: *</Text>
                    <TextInput style={styles.textInput} placeholder='Intervalo' value={intervalo} onChangeText={(val) => setIntervalo(val)} />
                    <Text>No. de serie: *</Text>
                    <TextInput style={styles.textInput} placeholder='No. de serie' value={noserie} onChangeText={(val) => setNoserie(val)} />
                    <Text>Identificador: *</Text>
                    <TextInput style={styles.textInput} placeholder='Identificador' value={ide} onChangeText={(val) => setIde(val)} />
                    <Text>Notas: </Text>
                    <TextInput style={styles.textInput} placeholder='Notas' value={notas} onChangeText={(val) => setNotas(val)} />
                    <Text>Observaciones: </Text>
                    <TextInput style={styles.textInput} placeholder='Observaciones' value={observaciones} onChangeText={(val) => setObservaciones(val)} />
                  </>
                  <>
                    <Text>Accesorios: </Text>
                    {checkBoxes.map((item, index) => (
                      <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', paddingLeft: 5 }} key={index}>
                        <BouncyCheckbox
                          fillColor='#003667'
                          isChecked={arrCheckBox['chk_accesorio_' + item.idaccesorio]}
                          onPress={(val) => setArrCheckBox({ ...arrCheckBox, ['chk_accesorio_' + item.idaccesorio]: val })}
                        />
                        <Text>{item.accesorio}</Text>
                      </View>
                    ))}
                  </>
                  <Text>Otros accesorios:</Text>
                  <TextInput style={styles.textInput} placeholder='Otro accesorio' value={otrosAccesorios} onChangeText={(val) => setOtrosAccesorios(val)} />
                  <TouchableOpacity
                    style={{
                      marginVertical: 10,
                      marginBottom: 65,
                      paddingVertical: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#003667',
                      borderRadius: 5,
                    }}
                    onPress={() => registerEquipo()}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'normal',
                        fontSize: 17,
                      }}>
                      REGISTRAR EQUIPO
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <AntDesign name='doubleright' size={14} color='#003667' />
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}> RECEPCIÓN DE EQUIPOS</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => displayRegisterForm()}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#003667',
                      paddingVertical: 10,
                      borderRadius: 3,
                    }}>
                    <AntDesign name='form' size={20} color='white' />
                    <Text style={{ color: 'white' }}> AGREGAR EQUIPO</Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <AntDesign name='doubleright' size={14} color='#003667' />
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}> Equipos cargados </Text>
                    {equipos.length > 0 && <Text style={{ color: '#003667', fontWeight: 'bold' }}>({equipos.length})</Text>}
                  </View>
                  <View style={{ height: '84%' }}>
                    {equipos.length > 0 ? (
                      <>
                        <FlatList
                          data={equipos}
                          renderItem={({ item }) => {
                            return (
                              <EquipoItem
                                id={item.idequipovale}
                                desc={item.descripcion}
                                mar={item.marca}
                                mod={item.modelo}
                                int={item.intervalo}
                                no={item.noserie}
                                ide={item.identificador}
                                notas={item.notas}
                                acc={item.accesorios}
                                tot={item.totalarchivos}
                                arc={item.archivos_equipo}
                                key={item.idequipovale}
                              />
                            );
                          }}
                          keyExtractor={(item) => item.idequipovale.toString()}
                          refreshControl={<RefreshControl onRefresh={onRefreshh} refreshing={isRefreshingg} />}
                          ListFooterComponent={<View style={{ marginVertical: 20 }} />}
                        />
                      </>
                    ) : (
                      <View
                        style={{
                          paddingVertical: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                        }}>
                        <Text>¡No hay equipos cargados!</Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </>
        )}
        {visualizedForm == 4 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <AntDesign name='doubleright' size={18} color='#003667' />
              <Text style={{ color: '#003667', fontWeight: 'bold', fontSize: 18 }}> CONFIRMACIÓN</Text>
            </View>
            {isSigning != false && (
              <View style={{ flexDirection: 'row-reverse' }}>
                <TouchableOpacity
                  onPress={() => setIsSigning(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#003667',
                    borderRadius: 5,
                    alignSelf: 'flex-start',
                    padding: 5,
                    marginBottom: 5,
                  }}>
                  <Feather name='arrow-left-circle' size={20} color='white' />
                  <Text style={{ color: 'white' }}> Ver vale</Text>
                </TouchableOpacity>
              </View>
            )}
            {isSigning == false ? (
              <ScrollView>
                <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 8, marginHorizontal: 5, marginTop: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <AntDesign name='doubleright' size={14} color='#003667' />
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}> DATOS GENERALES</Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Cliente: </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>
                      {clienteSearch}
                    </Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Contacto: </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>
                      {nombreContacto}
                    </Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Correo: </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>
                      {correo}
                    </Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Forma de recepción: </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>
                      {forma}
                    </Text>
                  </View>
                  {forma != 'MENSAJERIA' ? (
                    <>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Entrega: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {epr_quienentrega}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Recibe: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {epr_quienrecibe}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Recibe: </Text>
                        <Text>{m_quienrecibe}</Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Envía: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {m_quienenvia}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Empresa mensajeria: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {m_mensajeria}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Número de guía: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {m_guia}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Dimensiones: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {dimensiones}
                        </Text>
                      </View>
                      <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Peso: </Text>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {peso}
                        </Text>
                      </View>
                    </>
                  )}
                  {otroCorreo && (
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Con copia a correo: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {otraDireccionCorreo}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 8, marginHorizontal: 5, marginTop: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <AntDesign name='doubleright' size={14} color='#003667' />
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}> ARCHIVOS GENERALES </Text>
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}>({files.length})</Text>
                  </View>
                  {files.length > 0 ? (
                    <>
                      {files.map((item, index) => (
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            marginBottom: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          key={index + 1}
                          onPress={() => Linking.openURL('https://sgi.midelab.com/ERP/archivos_recepcion/' + item.archivo)}>
                          {item.archivo.split('.').pop() == 'png' || item.archivo.split('.').pop() == 'jpg' || item.archivo.split('.').pop() == 'jpeg' ? (
                            <Image
                              source={{ uri: 'https://sgi.midelab.com/ERP/archivos_recepcion/' + item.archivo }}
                              style={{ width: 30, height: 30, margin: 2, borderRadius: 4 }}
                            />
                          ) : (
                            <>
                              <AntDesign name='file1' size={30} color='lightgray' />
                            </>
                          )}
                          <View style={{ flex: 12 }}>
                            <Text style={{ color: 'black', fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>
                              {item.archivo}
                            </Text>
                            <Text style={{ color: 'gray', textAlign: 'justify' }}>Descripción: {item.descripcion}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <Text>No se registraron archivos generales</Text>
                  )}
                </View>
                <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 12, marginHorizontal: 5, marginTop: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <AntDesign name='doubleright' size={14} color='#003667' />
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}> EQUIPOS </Text>
                    <Text style={{ color: '#003667', fontWeight: 'bold' }}>({equipos.length})</Text>
                  </View>
                  {equipos.length > 0 ? (
                    <>
                      {equipos.map((item, index) => (
                        <View style={{ marginBottom: 10 }} key={index + 1}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                            <Text style={{ color: '#99c221', fontWeight: 'bold' }}> Equipo </Text>
                            <Text style={{ color: '#99c221', fontWeight: 'bold' }}>{index + 1}</Text>
                          </View>
                          <View style={{ borderWidth: 2, borderColor: '#E1EBF3', padding: 3, paddingLeft: 5, borderRadius: 3 }}>
                            <Text style={{ fontWeight: 'bold' }}>Descripción: </Text>
                            <Text>{item.descripcion}</Text>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Marca: </Text>
                                <Text>{item.marca}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Modelo: </Text>
                                <Text>{item.modelo}</Text>
                              </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>Intervalo: </Text>
                                <Text>{item.intervalo}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>No. de Serie: </Text>
                                <Text>{item.noserie}</Text>
                              </View>
                            </View>

                            <Text style={{ fontWeight: 'bold' }}>Identificador: </Text>
                            <Text>{item.identificador}</Text>
                            <Text style={{ fontWeight: 'bold' }}>Notas: </Text>
                            <Text>{item.notas.length < 1 ? 'No se registraron notas' : item.notas}</Text>
                            {item.accesorios.length > 0 ? (
                              <>
                                <Text style={{ fontWeight: 'bold' }}>Accesorios: </Text>
                                <Text>{item.accesorios.join(', ')}</Text>
                              </>
                            ) : (
                              <>
                                <Text style={{ fontWeight: 'bold' }}>Accesorios: </Text>
                                <Text>No se registraron accesorios</Text>
                              </>
                            )}
                            {item.archivos_equipo.length > 0 ? (
                              <>
                                <Text style={{ fontWeight: 'bold' }}>Archivos: </Text>
                                {item.archivos_equipo.map((item, index) => (
                                  <TouchableOpacity
                                    style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}
                                    key={index + 1}
                                    onPress={() => Linking.openURL('https://sgi.midelab.com/ERP/archivos_recepcion/' + item.archivo)}>
                                    {item.archivo.split('.').pop() == 'png' ||
                                    item.archivo.split('.').pop() == 'jpg' ||
                                    item.archivo.split('.').pop() == 'jpeg' ? (
                                      <Image
                                        source={{ uri: 'https://sgi.midelab.com/ERP/archivos_recepcion/' + item.archivo }}
                                        style={{ width: 30, height: 30, margin: 2, borderRadius: 4 }}
                                      />
                                    ) : (
                                      <AntDesign name='file1' size={30} color='lightgray' />
                                    )}
                                    <View style={{ flex: 12 }}>
                                      <Text style={{ color: 'black', fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>
                                        {item.archivo}
                                      </Text>
                                      <Text style={{ color: 'gray' }}>{item.descripcion}</Text>
                                    </View>
                                  </TouchableOpacity>
                                ))}
                              </>
                            ) : (
                              <>
                                <Text style={{ fontWeight: 'bold' }}>No tiene archivos registrados</Text>
                              </>
                            )}
                          </View>
                        </View>
                      ))}
                    </>
                  ) : (
                    <Text>No se registraron equipos</Text>
                  )}
                </View>
                {misNotas.length > 1 ? (
                  <>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                      onPress={() => setShowingNotes(!showingNotes)}>
                      <Text style={{ fontWeight: 'bold', color: '#003667' }}>NOTAS:</Text>
                      {showingNotes ? (
                        <MaterialIcons name='arrow-drop-up' size={24} color='black' />
                      ) : (
                        <MaterialIcons name='arrow-drop-down' size={24} color='black' />
                      )}
                    </TouchableOpacity>
                    {showingNotes ? (
                      <>
                        {misNotas.map((item, key) => {
                          return (
                            <Text style={{ textAlign: 'justify', marginBottom: 5 }} key={key + 1}>
                              {key + 1}. {item}
                            </Text>
                          );
                        })}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {forma == 'MENSAJERIA' ? (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('¡Registrar Vale Recepción!', '¿Desea enviar el registro de la recepción de equipo(s)?', [
                        { text: 'No' },
                        { text: 'Aceptar', onPress: () => uploadData() },
                      ]);
                    }}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#003667',
                      paddingVertical: 10,
                      borderRadius: 3,
                    }}>
                    <FontAwesome5 name='file-signature' size={20} color='white' />
                    <Text style={{ color: 'white' }}> CONFIRMAR Y SUBIR</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsSigning(true)}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#003667',
                      paddingVertical: 10,
                      borderRadius: 3,
                    }}>
                    <FontAwesome5 name='file-signature' size={20} color='white' />
                    <Text style={{ color: 'white' }}> CONFIRMAR Y FIRMAR</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            ) : (
              <>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                  {isSavedSing ? (
                    <>
                      <Text>Previsualización de firma:</Text>
                      <View style={styles.preview}>
                        {signature ? <Image resizeMode={'contain'} style={{ width: '100%', height: '100%' }} source={{ uri: signature }} /> : null}
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                          onPress={() => setIsSavedSign(false)}
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#003667',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 3,
                            marginLeft: 10,
                          }}>
                          <Feather name='save' size={20} color='white' />
                          <FontAwesome5 name='file-signature' size={20} color='white' />
                          <Text style={{ color: 'white' }}> EDITAR FIRMA </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => uploadSure()}
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#99c221',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 3,
                            marginRight: 10,
                          }}>
                          <Feather name='save' size={20} color='white' />
                          <Text style={{ color: 'white' }}> ACEPTAR Y GUARDAR</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text>Realice su firma:</Text>
                      <Signature onOK={handleOK} onEmpty={handleEmpty} descriptionText='' clearText='Limpiar' confirmText='Confirmar' webStyle={style} />
                    </>
                  )}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  titleContainer: {
    height: 50,
    paddingHorizontal: 10,
    borderTopWidth: 1 / 2,
    borderColor: 'lightgray',
    backgroundColor: '#003667',
    paddingVertical: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  bottomTitleContainer: {
    flexDirection: 'row',
    height: 35,
    borderTopWidth: 1 / 2,
    borderColor: 'lightgray',
    backgroundColor: '#99c221',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 10,
    height: '100%',
  },
  titleSubModule: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 15,
    backgroundColor: '#FFF',
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  preview: {
    width: '100%',
    height: 400,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewText: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#69B2FF',
    width: 120,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SubMenu3Screen;
