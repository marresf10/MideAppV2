import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';

//BaseURL
import { baseUrl } from '../configuration/database';

//LibreriasExternasAExpo
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { TabRouter } from 'react-navigation';

const LoginScreen = (props) => {
  const [email, setEmail] = useState(''); //artturo.alarcon@gmail.com
  const [password, setPassword] = useState(''); //Artur04l4rc0n
  //Datos unicos del dispositivo
  const [manufacturer, setManufacturer] = useState(Device.manufacturer);
  const [model, setModel] = useState(Device.modelName);
  const [deviceName, setDeviceName] = useState(Device.deviceName);
  const [os, setOs] = useState(Device.osName);
  //Datos de localización
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    askForPermissions();
  }, []);

  const askForPermissions = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Los permisos para acceder a la localización fueron denegados');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (e) {
      console.log(e);
    }
  };

  const _storeToken = async (token) => {
    try {
      await SecureStore.setItemAsync('token', token);
    } catch (error) {
      console.log(error);
    }
  };

  const _storeIdUsuario = async (idUsuario) => {
    try {
      await SecureStore.setItemAsync('idUsuario', idUsuario);
    } catch (error) {
      console.log(error);
    }
  };

  const _storeNombreUsuario = async (name) => {
    try {
      await SecureStore.setItemAsync('nombreUsuario', name);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    if (email == null || email == '') {
      Alert.alert('¡Importante!', 'Introduzca su correo electrónico para iniciar sesión', [{ text: 'Aceptar' }]);
    } else if (!email.includes('@') || !email.substr(email.indexOf('@')).includes('.')) {
      Alert.alert('¡Importante!', 'El correo electrónico debe contener un dominio', [{ text: 'Aceptar' }]);
    } else if (password == null || password == '') {
      Alert.alert('¡Importante!', 'Introduzca una contraseña para iniciar sesión', [{ text: 'Aceptar' }]);
    } else if (errorMsg == 'Los permisos para acceder a la localización fueron denegados' || location == null) {
      Alert.alert('¡Importante!', 'Es necesario que otorgue permisos de ubicación a la aplicación para poder acceder', [
        { text: 'Cancelar', onPress: () => null, style: 'cancel' },
        { text: 'Pedir permisos', onPress: () => askForPermissions() },
      ]);
    } else {
      const data = new FormData();
      data.append('rfc', 'MMI0403087C4');
      data.append('email', email);
      data.append('password', password);
      data.append('esporapp', 1);
      data.append('cel_sistema', os);
      data.append('cel_marca', manufacturer);
      data.append('cel_modelo', model);
      data.append('cel_nombre', deviceName);
      data.append('geo_latitud', location.coords.latitude);
      data.append('geo_longitud', location.coords.longitude);
      data.append('version_app', '1.0.1');
      //console.log(JSON.stringify(data));
      await fetch(baseUrl + 'ERP/php/acceso_cmd.php', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          //console.log(response);
          if (response.existe == 1) {
            _storeToken(response.token);
            _storeIdUsuario(response.idusuario);
            _storeNombreUsuario(response.nombreusuario);
            setEmail('');
            setPassword('');
            props.navigation.navigate('Principal');
          } else if (response.existe == 0) {
            Alert.alert('¡Importante!', 'El usuario no tiene permisos para acceder');
          } else if (response.error == 600) {
            Alert.alert('¡Importante!', 'No se reconoce este dispositivo');
          } else if (response.error == 700) {
            Alert.alert('¡Importante!', 'Los datos introducidos no son correctos');
          } else if (response.error == 800) {
            Alert.alert('¡Importante!', 'Existe una nueva versión, por favor actualice a la ultima versión de la aplicación');
          } else {
            Alert.alert('¡Importante!', 'El servicio no se encuentra disponible');
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ height: 100, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/mide.png')} resizeMode='contain' style={{ height: 144, width: 144 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>SGI APP</Text>
          <Text style={styles.subtitle}>Inicia sesión con tu cuenta del SGI</Text>
          <Text style={styles.TextInputLabel}>Correo electrónico:</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Correo electrónico'
            value={email}
            onChangeText={(email) => setEmail(email)}
            keyboardType='email-address'
          />
          <Text style={styles.TextInputLabel}>Contraseña:</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Contraseña'
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity style={styles.btnLogin} onPress={() => login()}>
            <Text style={styles.txtLogin}>Iniciar</Text>
          </TouchableOpacity>
          <Text style={{ color: 'gray', marginTop: 10 }}>V 1.0.1</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  SVGContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 90,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 40,
  },
  loginButtonContainer: {
    marginTop: 50,
    flex: 20,
    marginVertical: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 40,
    color: '#003667',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 30,
  },
  TextInputLabel: {
    fontWeight: '200',
    color: 'black',
    fontSize: 17,
    marginTop: 10,
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 10,
    width: '100%',
  },
  btnLogin: {
    backgroundColor: '#003667',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  txtLogin: {
    fontSize: 18,
    color: '#fff',
  },
});

export default LoginScreen;
