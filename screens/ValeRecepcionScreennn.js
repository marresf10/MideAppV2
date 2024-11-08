import React, { useState, useEffect } from 'react';

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

  const navigationForm = (navigateTo) => {
    if (navigateTo == 'R') {
      if (visualizedForm == 1) {
        if (correo == 'ejemplocorreo@gmail.com') {
          Alert.alert('¡Importante!', 'LLene los campos de cliente para poder navegar a la siguiente sección');
          return;
        } else if (
          forma == 'MENSAJERIA' &&
          (m_quienrecibe.length < 1 || m_quienenvia.length < 1 || m_mensajeria.length < 1 || setM_guia.length < 1 || dimensiones.length < 1 || peso.length < 1)
        ) {
          Alert.alert('¡Importante!', 'LLene los campos de mensajeria para poder navegar a la siguiente sección');
          return;
        } else if (forma != 'MENSAJERIA' && (epr_quienentrega.length < 1 || epr_quienrecibe.length < 1)) {
          Alert.alert('¡Importante!', 'LLene los campos de recepción para poder navegar a la siguiente sección');
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
        if (isRegistering) {
          return Alert.alert('¡Importante!', 'Es necesario terminar de registrar el equipo para poder navegar a la siguiente sección');
        } else if (equipos.length == 0) {
          return Alert.alert('¡Importante!', 'Registre un equipo para poder navegar a la siguiente sección');
        }
        setTitleForm('CONFIRMAR DATOS');
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
    let findLabel = clientes.find((o) => o.idcliente == idclient);

    setCliente(idclient);
    setClienteSearch(findLabel.c_razonsocial);
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
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
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

  const pickAFile = async () => {
    setDescripciónArchivoGeneral('');
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
  };

  const pickAnImage = async () => {
    setDescripciónArchivoGeneral('');
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

  const takeAPhoto = async () => {
    setDescripciónArchivoGeneral('');
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

  const uploadFile = async () => {
    if (file == null || file == '' || file.uri == null || file.type == 'cancel') {
      Alert.alert('¡Importante!', 'Seleccione un archivo');
    } else if (descripciónArchivoGeneral.length < 1) {
      Alert.alert('¡Importante!', 'El campo de descripción se encuentra vació');
    } else {
      setUploading(true);
      let data = new FormData();
      data.append('foliotmp', foliotmp);
      data.append('esporapp', '1');
      data.append('archivo_recepcion', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      });
      data.append('archivo_descripcion_recepcion', descripciónArchivoGeneral);
      data.append('token', token);
      data.append('idusuario', idUsuario);
      await fetch(baseUrl + 'ERP/php/ap_ws_recepcion_upload_archivos_recepcion.php', {
        method: 'POST',
        body: data,
        header: {
          'content-type': 'multipart/form-data',
        },
      })
        .then((res) => res.json())
        .then((response) => {
          setUploading(false);
          if (response == null) {
            Alert.alert('¡Importante!', 'El archivo no se puede subir');
          } else if (response[0].exito == '1' && response[0].error == 0) {
            setFile({ uri: null, type: 'cancelled' });
            setDescripciónArchivoGeneral('');
            loadFiles();
            Alert.alert('¡Importante!', 'El archivo se ha subido correctamente');
          } else if (response[0].exito == 0) {
            Alert.alert('¡Importante!', 'El archivo no se ha podido subir');
          } else {
            Alert.alert('¡Importante!', 'Ocurrio un error al intentar subir el archivo');
          }
        })
        .catch((error) => {
          console.log('uploadFile (1):');
          console.log(error);
        });
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
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
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

  const FileItem = ({ id, datafile, descripcion }) => {
    let ext = datafile.split('.').pop();
    let filename = datafile.replace(/\.[^/.]+$/, '');
    let item = (
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
            <Text style={{ color: 'gray', textAlign: 'justify' }}>Tipo de archivo: {ext.toUpperCase()}</Text>
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
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
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
              <MaterialIcons name='upload-file' size={24} color='#003667' />
            </TouchableOpacity>
          )}

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
    await fetch(baseUrl + 'ERP/php/app_ws_recepcion_funciones.php', {
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
    await fetch(baseUrl + 'ERP/php/app_ws_get_accesorios_equipos.php', {
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
    forma == 'MENSAJERIA'
      ? data.append('nombre_archivo_firma', {
          uri: signature,
          name: idUsuario + '_' + foliotmp + '_firma.jpg',
          type: 'image/jpeg',
        })
      : data.append('nombre_archivo_firma', {
          uri: 'https://thumbs.dreamstime.com/b/black-not-applicable-icon-isolated-white-background-vector-illustration-202346321.jpg',
          name: idUsuario + '_' + foliotmp + '_firma.jpg',
          type: 'image/jpeg',
        });
    data.append('selServicioEnSitio', selServicioEnSitio); //forma == 'SERVICIO EN SITIO' ? '1' : '0'
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
        } else if (response[0].error == 1001) {
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
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <AntDesign name='doubleright' size={14} color='#003667' />
                <Text style={{ color: '#003667', fontWeight: 'bold' }}> DATOS DEL CLIENTE</Text>
              </View>
              <Text>Cliente: *</Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 6 }}>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Cliente'
                    value={clienteSearch}
                    onPressIn={() => searchAClient('')}
                    onChangeText={(val) => searchAClient(val)}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderWidth: 0,
                    borderColor: 'lightgray',
                    borderRadius: 5,
                    marginLeft: 2,
                    backgroundColor: '#699CC6',
                  }}
                  onPress={() => searchClients()}>
                  <MaterialIcons name='person-search' size={30} color='#FFF' />
                </TouchableOpacity>
              </View>
              {clientes.length > 0 ? (
                <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, marginBottom: 10 }}>
                  <Picker selectedValue={cliente} onValueChange={(value) => pickAClient(value)}>
                    <Picker.Item style={{ fontSize: 14 }} label='Seleccione un cliente' value='Ninguno' />
                    {clientes.map((item) => (
                      <Picker.Item style={{ fontSize: 14 }} label={item.idcliente + ' | ' + item.c_razonsocial} value={item.idcliente} key={item.idcliente} />
                    ))}
                  </Picker>
                </View>
              ) : null}
              <Text style={{ marginTop: 10 }}>Contacto: * </Text>
              <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, marginBottom: 10 }}>
                <Picker selectedValue={contacto} onValueChange={(value) => setAContact(value)}>
                  <Picker.Item style={{ fontSize: 14 }} label='Seleccione un contacto' value='Ninguno' />
                  {contactos.map((item) => (
                    <Picker.Item style={{ fontSize: 14 }} label={item.contacto} value={item.idcontacto} key={item.idcontacto} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                <Text>Correo: </Text>
                <Text style={{ fontWeight: 'bold' }}>{correo}</Text>
              </View>
              <Text style={{ marginTop: 10 }}>Forma recepción del equipo: * </Text>
              <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, marginBottom: 10 }}>
                <Picker selectedValue={forma} onValueChange={(value) => setForma(value)}>
                  <Picker.Item style={{ fontSize: 14 }} label='ENTREGA PERSONAL CLIENTE' value='ENTREGA PERSONAL CLIENTE' />
                  <Picker.Item style={{ fontSize: 14 }} label='MENSAJERIA' value='MENSAJERIA' />
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
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
                  marginBottom: 10,
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
                  marginBottom: 10,
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
                      renderItem={({ item, key }) => {
                        return <FileItem id={item.idvalearchivo} datafile={item.archivo} descripcion={item.descripcion} key={key} />;
                      }}
                      keyExtractor={(item) => item.idvalearchivo.toString()}
                      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
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
                          <FontAwesome5 name='file-signature' size={20} color='white' />
                          <Text style={{ color: 'white' }}> EDITAR FIRMA</Text>
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
    height: 35,
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
    borderRadius: 5,
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