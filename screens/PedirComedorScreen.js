import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Card, CheckBox, Icon } from 'react-native-elements';

//Librerias externas
import * as SecureStore from 'expo-secure-store';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { baseUrl } from '../configuration/database';
import PoliticasComedorScreen from './PoliticasComedorScreen';

const PedirComedorScreen = ({ navigation }) => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [screenLoaded, setScreenLoaded] = useState(false);
  const [menu, setMenu] = useState(null);
  const [puedePedir, setPuedePedir] = useState(null);
  const [isTerminosAceptados, setIsTerminosAceptados] = useState(null);
  //Precio
  const [costoMenu, setCostoMenu] = useState('00.00');
  const [montoDescontar, setMontoDescontar] = useState('00.00');
  //Comentarios
  const [comentarios, setComentarios] = useState('');
  //Menu
  const [menu0, setMenu0] = useState(null);
  const [menu1, setMenu1] = useState(null);
  const [menu2, setMenu2] = useState(null);
  const [menu3, setMenu3] = useState(null);
  const [menu4, setMenu4] = useState(null);
  const [menu5, setMenu5] = useState(null);
  //Platillo
  const [sopa, setSopa] = useState(null);
  const [guiso, setGuiso] = useState(null);
  const [guarnicion1, setGuarnicion1] = useState(null);
  const [guarnicion2, setGuarnicion2] = useState(null);
  const [agua, setAgua] = useState(null);
  const [complemento, setComplemento] = useState(null);

  useEffect(() => {
    loadSessionData();
    loadPlatillos();
    loadPrecios();
  }, []);

  useEffect(() => {
    validaPedir();
    acceptedTyP();
  }, [idUsuario]);

  const loadSessionData = async () => {
    let id = await SecureStore.getItemAsync('idUsuario');
    setIdUsuario(id);
  };

  const loadPrecios = async () => {
    let data = new FormData();
    data.append('tipoMovimiento', 'costocomida');
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        setCostoMenu(response[0]);
        setMontoDescontar(response[1]);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const validaPedir = async () => {
    let data = new FormData();
    data.append('tipoMovimiento', 'validarPedir');
    data.append('idusuario', idUsuario);
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        setPuedePedir(response);
        setScreenLoaded(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const acceptedTyP = async () => {
    let data = new FormData();
    data.append('tipoMovimiento', 'aceptopoliticascomedor');
    data.append('idusuario', idUsuario);
    data.append('esporapp', 1);
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == 1) {
          //No hace nada.
        } else if ((data._parts[1][1] === null) != true && response == 0) {
          Alert.alert('¡Aceptar terminos y condiciones!', 'Debe de acesptar terminos y condiciones', [
            { text: 'Aceptar', onPress: () => acceptTyP() },
            { text: 'Ver politicas', onPress: () => navigationToPolicies() },
          ]);
          setIsTerminosAceptados(response);
        } else if ((data._parts[1][1] === null) != false && response == 0) {
        } else {
          Alert.alert('Error', 'Surgio algún error');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const acceptTyP = async () => {
    let data = new FormData();
    data.append('tipoMovimiento', 'aceptarPoliticas');
    data.append('idusuario', idUsuario);
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == 1) {
          Alert.alert('¡Terminos aceptados!', 'Se han aceptado los terminos de comedor');
        } else {
          Alert.alert('Error', 'Surgio algún error');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const navigationToPolicies = async () => {
    navigation.navigate('Politicas de comedor');
  };

  const loadPlatillos = async () => {
    let data = new FormData();
    data.append('esporapp', 1);
    await fetch(baseUrl + 'ERP/php/app_ws_comedor_consulta_platillos_dia.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        setMenu(response);
        for (let i = 0; i < response.length; i++) {
          var menuTemporal = [];
          for (let j = 0; j < response[i].platillos.length; j++) {
            let element = { [response[i].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
          switch (i) {
            case 0:
              setMenu0(menuTemporal);
              break;
            case 1:
              setMenu1(menuTemporal);
              break;
            case 2:
              setMenu2(menuTemporal);
              break;
            case 3:
              setMenu3(menuTemporal);
              break;
            case 4:
              setMenu4(menuTemporal);
              break;
            case 5:
              setMenu5(menuTemporal);
              break;
            default:
              null;
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const retrieveDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today;
  };

  const retrieveHour = () => {
    let today = new Date();
    let hour = today.getHours();
    return hour;
  };

  const selectPlatillo = (categoria, idPlatillo, platillo) => {
    let menuTemporal = [];
    switch (categoria) {
      case 0:
        for (let j = 0; j < menu[0].platillos.length; j++) {
          let element;
          if ([menu[0].platillos[j].platillo] == platillo) {
            element = { [menu[0].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[0].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu0(menuTemporal);
        setSopa(idPlatillo);
        break;
      case 1:
        for (let j = 0; j < menu[1].platillos.length; j++) {
          let element;
          if ([menu[1].platillos[j].platillo] == platillo) {
            element = { [menu[1].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[1].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu1(menuTemporal);
        setGuiso(idPlatillo);
        break;
      case 2:
        for (let j = 0; j < menu[2].platillos.length; j++) {
          let element;
          if ([menu[2].platillos[j].platillo] == platillo) {
            element = { [menu[2].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[2].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu2(menuTemporal);
        setGuarnicion1(idPlatillo);
        break;
      case 3:
        for (let j = 0; j < menu[3].platillos.length; j++) {
          let element;
          if ([menu[3].platillos[j].platillo] == platillo) {
            element = { [menu[3].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[3].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu3(menuTemporal);
        setGuarnicion2(idPlatillo);
        break;
      case 4:
        for (let j = 0; j < menu[4].platillos.length; j++) {
          let element;
          if ([menu[4].platillos[j].platillo] == platillo) {
            element = { [menu[4].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[4].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu4(menuTemporal);
        setAgua(idPlatillo);
        break;
      case 5:
        for (let j = 0; j < menu[5].platillos.length; j++) {
          let element;
          if ([menu[5].platillos[j].platillo] == platillo) {
            element = { [menu[5].platillos[j].platillo]: true };
            menuTemporal = Object.assign({}, menuTemporal, element);
          } else {
            element = { [menu[5].platillos[j].platillo]: false };
            menuTemporal = Object.assign({}, menuTemporal, element);
          }
        }
        setMenu5(menuTemporal);
        setComplemento(idPlatillo);
        break;
      default:
        Alert.alert('¡Error!', 'Surgió un error al intentar seleccionar el platillo');
    }
  };

  const checkPlatillos = () => {
    if (sopa == null) {
      Alert.alert('¡Importante!', 'Seleccione una sopa');
    } else if (guiso == null) {
      Alert.alert('¡Importante!', 'Seleccione un guiso');
    } else if (guarnicion1 == null) {
      Alert.alert('¡Importante!', 'Seleccione la guarnición 1');
    } else if (guarnicion2 == null) {
      Alert.alert('¡Importante!', 'Seleccione la guarnición 2');
    } else if (agua == null) {
      Alert.alert('¡Importante!', 'Seleccione el sabor de agua');
    } else if (complemento == null) {
      Alert.alert('¡Importante!', 'Seleccione un complemento');
    } else {
      Alert.alert(
        'PEDIDO COMEDOR DEL DIA ' + retrieveDate(),
        'Sopa: ' +
          sopa.platillo +
          '\n' +
          'Guiso: ' +
          guiso.platillo +
          '\n' +
          'Guarnición 1: ' +
          guarnicion1.platillo +
          '\n' +
          'Guarnición 2: ' +
          guarnicion2.platillo +
          '\n' +
          'Agua: ' +
          agua.platillo +
          '\n' +
          'Complemento: ' +
          complemento.platillo +
          '\n' +
          'Comentarios: ' +
          (comentarios.length < 1 ? 'Sin comentarios' : comentarios),
        [{ text: 'Editar pedido' }, { text: 'Confirmar', onPress: () => realizarPedidoComedor() }]
      );
    }
  };

  const realizarPedidoComedor = async () => {
    let data = new FormData();
    data.append('esporapp', 1);
    data.append('idusuario', idUsuario);
    data.append('idsopa', sopa.idcomedorplatillodia);
    data.append('idguiso', guiso.idcomedorplatillodia);
    data.append('idguarnicion', guarnicion1.idcomedorplatillodia);
    data.append('idguarnicion2', guarnicion2.idcomedorplatillodia);
    data.append('idcomplemento', complemento.idcomedorplatillodia);
    data.append('idagua', agua.idcomedorplatillodia);
    data.append('tipoMovimiento', 'enviarPedido');
    data.append('comentarios', comentarios);
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        //Alert.alert('¡Pedido Realizado!', 'Pedido enviado con éxito! \npedido:\n' + JSON.stringify(response));
        if (response == 9999) {
          Alert.alert('¡Error al pedir!', 'Surgió un error al realizar el pedido!');
        } else if (response == 0) {
          Alert.alert('¡Error al pedir!', 'Surgió un error al realizar el pedido!');
        } else if (response == 1) {
          Alert.alert('¡Pedido Realizado!', 'Pedido enviado con éxito!', [{ text: 'Aceptar', onPress: () => navigation.navigate('Principal') }]);
        } else {
          Alert.alert('¡Error al pedir!', 'Surgió un error al intentar realizar el pedido!');
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (!screenLoaded) {
    return (
      <SafeAreaView style={styles.screenLoaded}>
        <ActivityIndicator color='#003667' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSubModule}>REALIZAR PEDIDO</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.titleWithIcon}>
          <AntDesign name='doubleright' size={14} color='#003667' />
          <Text style={styles.txtTitleWithIcon}> Solicitud de comedor para el día de hoy: {retrieveDate()}</Text>
        </View>
        <View>
          <View style={styles.containerToRight}>
            <Text style={styles.txtBlueMideColor}>Costo del menú: </Text>
            <Text style={styles.txtBlueMideColorAndBold}>$ {costoMenu}</Text>
          </View>
          <View style={styles.containerToRight}>
            <Text style={styles.txtBlueMideColor}>Monto a descontar: </Text>
            <Text style={styles.txtBlueMideColorAndBold}>$ {montoDescontar}</Text>
          </View>
          <TouchableOpacity style={styles.containerToRight} onPress={() => navigationToPolicies()}>
            <Text style={styles.txtBlueMideColorAndUnderline}>Ver politicas</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Card containerStyle={styles.txtCardTitle}>
            <Card.Title style={styles.txtCardTitle}>SOPAS</Card.Title>
            <Card.Divider />
            {menu != null && menu0 != null && (
              <>
                {menu[0].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu0[item.platillo]}
                      onPress={() => selectPlatillo(0, menu[0].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Card>
            <Card.Title style={styles.txtCardTitle}>GUISOS</Card.Title>
            <Card.Divider />
            {menu != null && menu1 != null && (
              <>
                {menu[1].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu1[item.platillo]}
                      onPress={() => selectPlatillo(1, menu[1].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Card>
            <Card.Title style={styles.txtCardTitle}>GUARNICIÓN 1</Card.Title>
            <Card.Divider />
            {menu != null && menu2 != null && (
              <>
                {menu[2].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu2[item.platillo]}
                      onPress={() => selectPlatillo(2, menu[2].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Card>
            <Card.Title style={styles.txtCardTitle}>GUARNICIÓN 2</Card.Title>
            <Card.Divider />
            {menu != null && menu3 != null && (
              <>
                {menu[3].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu3[item.platillo]}
                      onPress={() => selectPlatillo(3, menu[3].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Card>
            <Card.Title style={styles.txtCardTitle}>AGUAS</Card.Title>
            <Card.Divider />
            {menu != null && menu4 != null && (
              <>
                {menu[4].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu4[item.platillo]}
                      onPress={() => selectPlatillo(4, menu[4].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Card>
            <Card.Title style={styles.txtCardTitle}>COMPLEMENTO</Card.Title>
            <Card.Divider />
            {menu != null && menu5 != null && (
              <>
                {menu[5].platillos.map((item, key) => {
                  return (
                    <CheckBox
                      containerStyle={styles.chkboxPlatillo}
                      title={item.platillo}
                      checkedIcon={<Icon name='radio-button-checked' color='#003667' size={25} />}
                      uncheckedIcon={<Icon name='radio-button-unchecked' color='#003667' size={25} />}
                      checked={menu5[item.platillo]}
                      onPress={() => selectPlatillo(5, menu[5].platillos[key], item.platillo)}
                      key={key}
                    />
                  );
                })}
              </>
            )}
          </Card>
          <Text style={styles.inputTitle}>Comentarios: </Text>
          <TextInput multiline style={styles.textInput} placeholder='Comentarios' value={comentarios} onChangeText={(val) => setComentarios(val)} />
          {puedePedir == '1' ? (
            <>
              {retrieveHour() < 11 ? (
                <TouchableOpacity
                  onPress={() => {
                    checkPlatillos();
                  }}
                  style={styles.btnPedido}>
                  <MaterialCommunityIcons name='food-fork-drink' size={20} color='white' />
                  <Text style={styles.txtWhite}> REALIZAR PEDIDO COMEDOR</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.btnPedidoRealizado}>
                  <AntDesign name='exclamationcircle' size={18} color='white' />
                  <Text style={styles.txtWhite}> Fuera de horario para realizar el pedido</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.btnPedidoRealizado}>
              <AntDesign name='exclamationcircle' size={18} color='white' />
              <Text style={styles.txtWhite}> El servicio de comedor ya ha sido enviado.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenLoaded: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
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
  titleSubModule: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    padding: 5,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  txtTitleWithIcon: {
    color: '#003667',
    fontWeight: 'bold',
    fontSize: 15,
  },
  containerToRight: {
    flexDirection: 'row',
  },
  txtBlueMideColor: {
    color: '#003667',
  },
  txtBlueMideColorAndUnderline: {
    color: '#003667',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  txtBlueMideColorAndBold: {
    color: '#003667',
    fontWeight: 'bold',
  },
  tableHeaderComida: {
    backgroundColor: '#699CC6',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txtWhiteColorAndBold: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  txtCardTitle: {
    color: '#699CC6',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  chkboxPlatillo: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  btnPedido: {
    elevation: 5,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003667',
    paddingVertical: 10,
    borderRadius: 3,
  },
  btnPedidoRealizado: {
    elevation: 5,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 3,
  },
  inputTitle: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  txtWhite: {
    color: 'white',
  },
});

export default PedirComedorScreen;
