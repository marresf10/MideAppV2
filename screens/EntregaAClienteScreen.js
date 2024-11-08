import React, { useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

//Exportación de url para servicios
import { baseUrl } from '../configuration/database';

import { Picker } from '@react-native-picker/picker';
import { AntDesign, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Signature from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';

var OSfiltradas = [];
var OSfiltradastotal = [];

const EntregaAClienteScreen = ({ navigation, route }) => {
  //Datos para la navegación
  const [titleForm, setTitleForm] = useState('DATOS DE CLIENTE');
  const [visualizedForm, setVisualizedForm] = useState(1);
  //Datos del usuario
  const [token, setToken] = useState(route.params.tokenusu);
  const [idUsuario, setIdUsuario] = useState(route.params.idusu);
  //Dropdown de cliente
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const searchRef = useRef(null);
  //Datos de cliente
  const [idCliente, setIdCliente] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [clientData, setClientData] = useState({ alias: 'null' });
  const [clientOS, setClientOS] = useState([]);
  //ListadoDeOrdenes
  const [isRefreshing, setIsRefreshing] = useState(false);
  //Datos de entrega
  const [rdFormaEntrega, setRdFormaEntrega] = useState('');
  //Forma a mensajeria
  const [txtEmpresa, setTxtEmpresa] = useState('');
  const [txtNoGuia, setTxtNoGuia] = useState('');
  const [txtQuienEnvia, setTxtQuienEnvia] = useState('');
  //Forma a Entrega personal cliente
  const [txtNombreEntrega, setTxtNombreEntrega] = useState('');
  const [txtNombreEntregaRecibe, setTxtNombreEntregaRecibe] = useState('');
  //Forma recolección
  const [txtRecoQuienEntrega, setTxtRecoQuienEntrega] = useState('');
  const [txtRecoQuienRecibe, setTxtRecoQuienRecibe] = useState('');
  const [rdEnviarCorreo, setRdEnviarCorreo] = useState(false);
  const [signature, setSign] = useState(null);
  const [isSavedSign, setIsSavedSign] = useState(false);

  //CheckBox
  const [chkboxes, setChkboxes] = useState([]);

  //Dropdown
  const getSuggestions = useCallback(async (q) => {
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
    if (items != null && items[0].error == 1001) {
      setClientData({ alias: 'null' });
      setClientOS([]);
      setSuggestionsList(null);
    } else if (items == null) {
      setClientData({ alias: 'null' });
      setSuggestionsList(null);
      setClientOS([]);
      Alert.alert('¡Importante!', 'No hay registros de clientes con la busquedad <' + q + '>');
    } else if (items.length > 0) {
      const suggestions = items.map((item) => ({
        id: item.idcliente,
        title: item.c_razonsocial,
      }));
      setSuggestionsList(suggestions);
    } else {
      setSuggestionsList(null);
      setClientData({ alias: 'null' });
    }
    setLoading(false);
  }, []);

  const pickAClient = (idclient) => {
    let findLabel = suggestionsList.find((o) => o.id == idclient);
    setIdCliente(idclient);
    setCliente(findLabel.title);
    searchClientData(idclient);
  };

  const searchClientData = async (id) => {
    let data = new FormData();
    data.append('nombre_funcion', 'datos_cliente');
    data.append('idcliente', id);
    await fetch(baseUrl + 'ERP/php/app_recepcion_entrega_cliente.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        //console.log(response);
        if (response == null) {
          setClientData({ alias: 'null' });
        } else if (Array.isArray(response) && response[0].alias == 'null') {
          setClientData({ alias: 'null' });
          Alert.alert('¡Importante!', 'Surgió un error al consultar los datos del cliente');
        } else if (Array.isArray(response) && response[0].alias != null) {
          setClientData(response);
          searchClientOS(id);
        } else {
          alert('Error', JSON.stringify(response));
          setClientData({ alias: 'null' });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const searchClientOS = async (id) => {
    let data = new FormData();
    data.append('nombre_funcion', 'mostrarOSEntrega');
    data.append('idcliente', id);
    await fetch(baseUrl + 'ERP/php/app_recepcion_entrega_cliente.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          setClientOS([]);
        } else if (Array.isArray(response) && response.length == 0) {
          setClientOS([]);
          //Alert.alert('¡Importante!', 'Surgió un error al consultar los datos del cliente');
        } else if (Array.isArray(response) && response.length > 0) {
          let newState = response.map((obj) => {
            return { ...obj, seleccionado: false };
          });
          setClientOS(newState);
          //setClientOS(response);
          var OStemporal = [];
          for (let i = 0; i < response.length; i++) {
            let chbox = { ['chk_iddos_' + response[i].idosdetalle]: false };
            OStemporal = Object.assign({}, OStemporal, chbox);
          }
          setChkboxes(OStemporal);
        } else {
          Alert.alert('¡Oh no!', 'Surgio un error, porfavor contacte al administrador');
          setClientOS([]);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const verOSdeCliente = (hayOS) => {
    if (hayOS) {
      navigationForm('R');
      //navigation.navigate('Ordenes de servicio', { idusu: route.params.idusu, tokenusu: route.params.tokenusu, idcliente: idCliente });
    } else if (!hayOS) {
      Alert.alert('No se puede visualizar', 'El cliente no cuenta con ordenes de servicio');
    } else {
      Alert.alert('¡Oh no!', 'Surgio un error, porfavor contacte al administrador');
    }
  };

  const showOS = (iddetalle, val) => {
    setChkboxes({ ...chkboxes, ['chk_iddos_' + iddetalle]: val });
    let newState = clientOS.map((obj) => {
      if (obj.idosdetalle == iddetalle) {
        return { ...obj, seleccionado: val };
      }

      return obj;
    });

    setClientOS(newState);
  };

  const Ordenes = (props) => {
    let element = (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.bkgHeader}>
            <View style={styles.pddnHeader}>
              <Text style={styles.txtWhite} numberOfLines={1} ellipsizeMode='tail'>
                Folio: {props.idosdetalle}
              </Text>
            </View>
            <View style={styles.pddnHeader}>
              <Text style={styles.txtClientCard} numberOfLines={1} ellipsizeMode='tail'>
                {props.folio}
              </Text>
            </View>
          </View>
          <View style={styles.tchUploadEvidences}>
            <Checkbox
              style={styles.checkbox}
              value={chkboxes['chk_iddos_' + props.idosdetalle]}
              onValueChange={(val) => showOS(props.idosdetalle, val) /*setChkboxes({ ...chkboxes, ['chk_iddos_' + props.idosdetalle]: val })*/}
            />
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Contacto
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.contacto}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Marca
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.marca}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Modelo
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.modelo}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Equipo
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.equipo}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                No. de serie
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.noserie}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Identificación
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.identificacion}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                ¿Credito?
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.tienecredito}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                ¿Se puede entregar?
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.sepuedeentregar}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Sin costo
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.negrita}>
                {props.essincosto_print}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );

    return element;
  };

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await searchClientOS(idCliente);
    setIsRefreshing(false);
  });

  const navigationForm = (navigateTo) => {
    if (navigateTo == 'R') {
      if (visualizedForm == 1) {
        if (clientOS.length == 0) {
          Alert.alert('¡Importante!', 'Seleccione un cliente con OS disponibles');
          return;
        } else {
          setTitleForm('ORDENES DE SERVICIO');
          setVisualizedForm(2);
        }
      } else if (visualizedForm == 2) {
        if (filtrarOS() == true) {
          setTitleForm('DATOS DE ENTREGA');
          setVisualizedForm(3);
        } else {
          Alert.alert('¡Importante!', 'Seleccione alguna orden de servicio');
        }
      } else if (visualizedForm == 3) {
        if (rdFormaEntrega == 'MENSAJERIA') {
          if (txtEmpresa == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la empresa ');
          } else if (txtNoGuia == '') {
            Alert.alert('¡Importante!', 'Introduzca el múmero de guía ');
          } else if (txtQuienEnvia == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la persona que envía ');
          } else {
            setTitleForm('CONFIRMAR DATOS');
            setVisualizedForm(4);
          }
        } else if (rdFormaEntrega == 'ENTREGA PERSONAL CLIENTE') {
          if (txtNombreEntrega == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la persona que entrega ');
          } else if (txtNombreEntregaRecibe == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la persona que recibe ');
          } else {
            setTitleForm('CONFIRMAR DATOS');
            setVisualizedForm(4);
          }
        } else if (rdFormaEntrega == 'RECOLECCION') {
          if (txtRecoQuienEntrega == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la persona que entrega ');
          } else if (txtRecoQuienRecibe == '') {
            Alert.alert('¡Importante!', 'Introduzca el nombre de la persona que recibe');
          } else {
            setTitleForm('CONFIRMAR DATOS');
            setVisualizedForm(4);
          }
        } else {
          Alert.alert('¡Importante!', 'R. Error al navegar');
        }
      } else if (visualizedForm == 4) {
        setTitleForm('FIRMA');
        setVisualizedForm(5);
      } else {
        Alert.alert('¡Importante!', 'R. Error al navegar');
      }
    } else if (navigateTo == 'L') {
      if (visualizedForm == 5) {
        setTitleForm('CONFIRMAR DATOS');
        setVisualizedForm(4);
      } else if (visualizedForm == 4) {
        setTitleForm('DATOS DE ENTREGA');
        setVisualizedForm(3);
      } else if (visualizedForm == 3) {
        setTitleForm('ORDENES DE SERVICIO');
        setVisualizedForm(2);
      } else if (visualizedForm == 2) {
        setTitleForm('DATOS DE CLIENTE');
        setVisualizedForm(1);
      } else {
        Alert.alert('¡Importante!', 'L. Error al navegar');
      }
    } else {
      Alert.alert('¡Importante!', 'Error al navegar');
    }
  };

  const cambiarFormaDeEntrega = (forma) => {
    setRdFormaEntrega(forma);
    if (forma == 'MENSAJERIA') {
      setTxtNombreEntrega('');
      setTxtNombreEntregaRecibe('');

      setTxtRecoQuienEntrega('');
      setTxtRecoQuienRecibe('');
    } else if (forma == 'ENTREGA PERSONAL CLIENTE') {
      setTxtEmpresa('');
      setTxtNoGuia('');
      setTxtQuienEnvia('');

      setTxtRecoQuienEntrega('');
      setTxtRecoQuienRecibe('');
    } else if (forma == 'RECOLECCION') {
      setTxtEmpresa('');
      setTxtNoGuia('');
      setTxtQuienEnvia('');

      setTxtNombreEntrega('');
      setTxtNombreEntregaRecibe('');
    } else if (forma == 'Ninguno') {
      Alert.alert('¡Importante!', 'Seleccione otra forma de entrega');
    } else {
      Alert.alert('¡Surgió un error al seleccionar la forma de entrega!', 'Vuelva a intentar seleccionar la forma de entrega');
    }
  };

  const filtrarOS = () => {
    OSfiltradas = [];
    OSfiltradastotal = [];
    let entries = Object.entries(chkboxes);
    let element;
    let element2;
    for (const [key, value] of Object.entries(chkboxes)) {
      if (`${value}` == 'true') {
        element = { [`${key}`]: `${value}` };
        OSfiltradas.push(element);
      }
      element2 = { [`${key}`]: `${value}` };
      OSfiltradastotal.push(element2);
    }
    //console.log(OSfiltradas);
    //console.log(OSfiltradastotal);
    if (OSfiltradas.length >= 1) {
      return true;
    } else {
      return false;
    }
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

  const uploadData = async () => {
    let data = new FormData();
    data.append('idusuario', idUsuario);
    data.append('HDicliente', idCliente);
    data.append('esporapp', 1);
    data.append('rdFormaEntrega', rdFormaEntrega);
    //Forma mensajeria
    data.append('txtEmpresa', txtEmpresa);
    data.append('txtNoGuia', txtNoGuia);
    data.append('txtQuienEnvia', txtQuienEnvia);
    //Forma entrega personal cliente
    data.append('txtNombreEntrega', txtNombreEntrega);
    data.append('txtNombreEntregaRecibe', txtNombreEntregaRecibe);
    //Forma recolección
    data.append('txtRecoQuienEntrega', txtRecoQuienEntrega);
    data.append('txtRecoQuienRecibe', txtRecoQuienRecibe);
    //Enviar correo
    data.append('rdEnviarCorreo', rdEnviarCorreo);
    data.append('rdEnviarCorreo', rdEnviarCorreo);
    let miobjecto = [];
    /*
    for (let i = 0; i < OSfiltradas.length; i++) {
      let elem = { [Object.keys(OSfiltradas[i])]: 1 };
      //Object.keys(OSfiltradas[index]);
      //let elem = { ['chk_iddos_' + OSfiltradas[i].idosdetalle]: 1 };
      miobjecto = Object.assign({}, miobjecto, elem);
    }*/
    for (let i = 0; i < OSfiltradas.length; i++) {
      data.append(Object.keys(OSfiltradas[i]) + '', 1);
    }
    data.append('firma', {
      uri: signature,
      name: idUsuario + '_' + idCliente + '_firma.jpg',
      type: 'image/jpeg',
    });
    //console.log(miobjecto);
    //console.log(OSfiltradas);
    //data.append('OS', JSON.stringify(miobjecto));
    //OSfiltradas;
    //console.log(OSfiltradas);
    console.log('Datos que yo envió');
    console.log(JSON.stringify(data));
    await fetch(baseUrl + 'ERP/php/entregas_cmd.php', {
      method: 'POST',
      body: data,
      header: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        /*console.log('Datos que recibo:');
        console.log(response);*/
        //
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
        console.log('Error subir datos: ');
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSubModule}>ENTREGA A CLIENTE {isSavedSign}</Text>
      </View>
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
        {visualizedForm != 5 ? (
          <TouchableOpacity
            onPress={() => navigationForm('R')}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }}>
            <AntDesign name='right' size={24} color='white' />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#99c221', height: '100%' }}></View>
        )}
      </View>
      <View style={styles.container}>
        {visualizedForm == 1 && (
          <>
            <View style={styles.titleWithIcon}>
              <AntDesign name='doubleright' size={14} color='#003667' />
              <Text style={styles.txtTitleWithIcon}> SELECCIONAR CLIENTE: </Text>
            </View>
            <Text>Cliente: *</Text>
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
                style: styles.dropdown,
              }}
              rightButtonsContainerStyle={styles.btnDropdown}
              inputContainerStyle={styles.inputContainerStyle}
              suggestionsListContainerStyle={styles.dropdownList}
              containerStyle={styles.flexShrink}
              renderItem={(item, text) => (
                <Text style={styles.itemTitle}>
                  {item.id} - {item.title}
                </Text>
              )}
              ChevronIconComponent={<Feather name='x-circle' size={18} color='#003667' />}
              ClearIconComponent={<Feather name='chevron-down' size={20} color='#003667' />}
              inputHeight={50}
              showChevron={false}
            />
            {clientData.alias != 'null' && (
              <View style={{ borderWidth: 2, borderColor: '#E1EBF3', borderRadius: 3, marginTop: 5, backgroundColor: '#FBFBFB' }}>
                <View>
                  <View style={{ padding: 3, paddingLeft: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>DATOS DEL CLIENTE</Text>
                  </View>
                  <View style={{ padding: 3, paddingLeft: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>Alias: </Text>
                      </View>
                      <View>
                        <Text>{clientData[0].alias}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>Razón social: </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} ellipsizeMode='tail'>
                          {clientData[0].razonsocial}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>Teléfono(s): </Text>
                      </View>
                      <View>
                        <Text>{clientData[0].telefonos}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>Dirección: </Text>
                      </View>
                      <View>
                        <Text>{clientData[0].direccion}</Text>
                        <Text>{clientData[0].direccion2}</Text>
                        <Text>{clientData[0].cp}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      borderTopWidth: 2,
                      borderColor: '#E1EBF3',
                      backgroundColor: '#699CC6',
                      padding: 5,
                      paddingVertical: 9,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => verOSdeCliente(clientOS.length > 0)}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      {clientOS.length > 0 ? (
                        <Text style={{ fontWeight: 'bold' }}>Ver ordenes de servicio</Text>
                      ) : (
                        <Text style={{ fontWeight: 'bold' }}>Sin ordenes de servicio</Text>
                      )}
                    </View>
                    <View>{clientOS.length > 0 && <AntDesign name='doubleright' size={18} color='black' />}</View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
        {visualizedForm == 2 && (
          <>
            <View style={styles.screenTitle}>
              <AntDesign name='doubleright' size={14} color='#003667' />
              <Text style={styles.listTitle}> ORDENES DE SERVICIO PARA ENTREGA: </Text>
              {clientOS.length > 0 && <Text style={styles.listTitle}>({clientOS.length})</Text>}
            </View>
            {Array.isArray(clientOS) && clientOS.length ? (
              <>
                <FlatList
                  data={clientOS}
                  renderItem={({ item, key }) => {
                    return (
                      <Ordenes
                        idosdetalle={item.idosdetalle}
                        folio={item.folio}
                        contacto={item.contacto}
                        tienecredito={item.tienecredito}
                        essincosto_print={item.essincosto_print}
                        sepuedeentregar={item.sepuedeentregar}
                        marca={item.marca}
                        modelo={item.modelo}
                        noserie={item.noserie}
                        identificacion={item.identificacion}
                        equipo={item.equipo}
                      />
                    );
                  }}
                  keyExtractor={(item, key) => key.toString()}
                  refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
                  ListFooterComponent={<View style={styles.flatlistEnd} />}
                />
              </>
            ) : (
              <View style={styles.alinearTexto}>
                <Text>¡No hay OS del cliente!</Text>
              </View>
            )}
          </>
        )}
        {visualizedForm == 3 && (
          <>
            <View style={styles.screenTitle}>
              <AntDesign name='doubleright' size={14} color='#003667' />
              <Text style={styles.listTitle}> DATOS DE ENTREGA: </Text>
            </View>
            <Text style={{ marginTop: 1 }}>Forma de entrega: * </Text>
            <View style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5 }}>
              <Picker selectedValue={rdFormaEntrega} onValueChange={(value) => cambiarFormaDeEntrega(value)}>
                <Picker.Item style={{ fontSize: 14 }} label='Seleccione metodo de entrega' value='Ninguno' />
                <Picker.Item style={{ fontSize: 14 }} label={'Mensajeria'} value={'MENSAJERIA'} />
                <Picker.Item style={{ fontSize: 14 }} label={'Entrega personal al cliente'} value={'ENTREGA PERSONAL CLIENTE'} />
                <Picker.Item style={{ fontSize: 14 }} label={'Recolección'} value={'RECOLECCION'} />
              </Picker>
            </View>
            {rdFormaEntrega == 'MENSAJERIA' && (
              <>
                <Text style={{ marginTop: 10 }}>Empresa: * </Text>
                <View>
                  <TextInput style={styles.textInput} placeholder='Empresa' value={txtEmpresa} onChangeText={(val) => setTxtEmpresa(val)} />
                </View>
                <Text style={{ marginTop: 10 }}>No. de guía: * </Text>
                <View>
                  <TextInput style={styles.textInput} placeholder='No. de guía' value={txtNoGuia} onChangeText={(val) => setTxtNoGuia(val)} />
                </View>
                <Text style={{ marginTop: 10 }}>¿Quién envía?: * </Text>
                <View>
                  <TextInput style={styles.textInput} placeholder='Nombre de la persona' value={txtQuienEnvia} onChangeText={(val) => setTxtQuienEnvia(val)} />
                </View>
              </>
            )}
            {rdFormaEntrega == 'ENTREGA PERSONAL CLIENTE' && (
              <>
                <Text style={{ marginTop: 10 }}>¿Quién entrega?: * </Text>
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Nombre de la persona'
                    value={txtNombreEntrega}
                    onChangeText={(val) => setTxtNombreEntrega(val)}
                  />
                </View>
                <Text style={{ marginTop: 10 }}>¿Quién recibe?: * </Text>
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Nombre de la persona'
                    value={txtNombreEntregaRecibe}
                    onChangeText={(val) => setTxtNombreEntregaRecibe(val)}
                  />
                </View>
              </>
            )}
            {rdFormaEntrega == 'RECOLECCION' && (
              <>
                <Text style={{ marginTop: 10 }}>¿Quién entrega?: * </Text>
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Nombre de la persona'
                    value={txtRecoQuienEntrega}
                    onChangeText={(val) => setTxtRecoQuienEntrega(val)}
                  />
                </View>
                <Text style={{ marginTop: 10 }}>¿Quién recibe?: * </Text>
                <View>
                  <TextInput
                    style={styles.textInput}
                    placeholder='Nombre de la persona'
                    value={txtRecoQuienRecibe}
                    onChangeText={(val) => setTxtRecoQuienRecibe(val)}
                  />
                </View>
              </>
            )}
            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
              <Text>Enviar correo a cliente: </Text>
              <BouncyCheckbox fillColor='#003667' isChecked={rdEnviarCorreo} onPress={() => setRdEnviarCorreo(!rdEnviarCorreo)} />
            </View>
          </>
        )}
        {visualizedForm == 4 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
                paddingLeft: 5,
                paddingTop: 5,
                borderBottomWidth: 1,
                paddingBottom: 5,
                borderColor: '#F5F5F5',
              }}>
              <AntDesign name='doubleright' size={18} color='#003667' />
              <Text style={styles.listTitle}> CONFIRMACIÓN</Text>
            </View>
            <ScrollView>
              <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 8, marginHorizontal: 5, marginTop: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <AntDesign name='doubleright' size={14} color='#003667' />
                  <Text style={{ color: '#003667', fontWeight: 'bold' }}> DATOS DE CLIENTE</Text>
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Alias: </Text>
                  <Text numberOfLines={1} ellipsizeMode='tail'>
                    {clientData[0].alias}
                  </Text>
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Cliente: </Text>
                  <Text numberOfLines={1} ellipsizeMode='tail'>
                    {idCliente + ' | ' + clientData[0].razonsocial}
                  </Text>
                </View>
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Teléfono(s): </Text>
                  <Text numberOfLines={1} ellipsizeMode='tail'>
                    {clientData[0].telefonos}
                  </Text>
                </View>
              </View>
              <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 8, marginHorizontal: 5, marginTop: 5 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }} onPress={() => alert(JSON.stringify(clientOS))}>
                  <AntDesign name='doubleright' size={14} color='#003667' />
                  <Text style={{ color: '#003667', fontWeight: 'bold' }}> OS A ENTREGAR </Text>
                  <Text style={{ color: '#003667', fontWeight: 'bold' }}>({OSfiltradas.length})</Text>
                </TouchableOpacity>
                {OSfiltradas.length > 0 ? (
                  <>
                    {clientOS.map(
                      (item, index) =>
                        item.seleccionado == true && (
                          <View style={{ marginBottom: 10 }} key={index + 1}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                              <Text style={{ color: '#99c221', fontWeight: 'bold' }}> Orden de servicio </Text>
                              <Text style={{ color: '#99c221', fontWeight: 'bold' }}>{item.folio}</Text>
                            </View>
                            <View style={{ borderWidth: 2, borderColor: '#E1EBF3', padding: 3, paddingLeft: 5, borderRadius: 3 }}>
                              <Text style={{ fontWeight: 'bold' }}>Contacto: </Text>
                              <Text>{item.contacto}</Text>
                              <Text style={{ fontWeight: 'bold' }}>Equipo: </Text>
                              <Text>{item.equipo}</Text>
                              <Text style={{ fontWeight: 'bold' }}>Marca: </Text>
                              <Text>{item.marca}</Text>
                              <Text style={{ fontWeight: 'bold' }}>Modelo: </Text>
                              <Text>{item.modelo}</Text>
                            </View>
                          </View>
                        )
                    )}
                  </>
                ) : (
                  <Text>No se añadieron OS a entregar</Text>
                )}
              </View>
              <View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 3, padding: 5, marginBottom: 8, marginHorizontal: 5, marginTop: 5 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }} onPress={() => alert(JSON.stringify(clientOS))}>
                  <AntDesign name='doubleright' size={14} color='#003667' />
                  <Text style={{ color: '#003667', fontWeight: 'bold' }}> ENTREGA </Text>
                </TouchableOpacity>
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>Forma de entrega: </Text>
                  <Text numberOfLines={1} ellipsizeMode='tail'>
                    {rdFormaEntrega}
                  </Text>
                </View>
                {rdFormaEntrega == 'MENSAJERIA' && (
                  <>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Empresa: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtEmpresa}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>No. de guía: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtNoGuia}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Persona que envía: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtQuienEnvia}
                      </Text>
                    </View>
                  </>
                )}
                {rdFormaEntrega == 'ENTREGA PERSONAL CLIENTE' && (
                  <>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Persona que entrega: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtNombreEntrega}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Persona que recibe: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtNombreEntregaRecibe}
                      </Text>
                    </View>
                  </>
                )}
                {rdFormaEntrega == 'RECOLECCION' && (
                  <>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Persona que entrega: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtRecoQuienEntrega}
                      </Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontWeight: 'bold' }}>Persona que recibe: </Text>
                      <Text numberOfLines={1} ellipsizeMode='tail'>
                        {txtRecoQuienRecibe}
                      </Text>
                    </View>
                  </>
                )}
                {rdEnviarCorreo == 1 && (
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Envío correo a cliente: </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail'>
                      Si
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ marginVertical: 60 }}></View>
            </ScrollView>
          </>
        )}
        {visualizedForm == 5 && (
          <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
              {isSavedSign ? (
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
                        marginRight: 10,
                      }}>
                      <FontAwesome5 name='file-signature' size={20} color='white' />
                      <Text style={{ color: 'white' }}> EDITAR FIRMA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => uploadData()}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#99c221',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 3,
                        marginLeft: 10,
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
    backgroundColor: '#003667', //#0a2f4e
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
  titleSubModule: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    padding: 10,
    height: '100%',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  txtTitleWithIcon: {
    color: '#003667',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dropdown: {
    borderRadius: 5,
    backgroundColor: '#FBFBFB',
    color: '#000',
    paddingLeft: 10,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  btnDropdown: {
    right: 5,
    height: 30,
    top: 10,
    backgroundColor: 'transparent',
  },
  dropdownList: {
    backgroundColor: '#383b42',
  },
  chkboxPlatillo: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  inputTitle: {
    marginTop: 10,
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 10,
  },
  card: {
    backgroundColor: '#003667',
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
  flatlistEnd: {
    marginVertical: 65,
  },
  inputContainerStyle: {
    backgroundColor: 'transparent',
  },
  flexShrink: {
    flexShrink: 1,
  },
  itemTitle: {
    color: '#fff',
    padding: 15,
  },
  screenTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    color: '#003667',
    fontWeight: 'bold',
  },
  alinearTexto: {
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  preview: {
    width: '100%',
    height: 400,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default EntregaAClienteScreen;
