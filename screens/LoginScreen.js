import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';

// BaseURL
import { baseUrl } from '../configuration/database';

// LibreriasExternasAExpo
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [manufacturer, setManufacturer] = useState(Device.manufacturer);
  const [model, setModel] = useState(Device.modelName);
  const [deviceName, setDeviceName] = useState(Device.deviceName);
  const [os, setOs] = useState(Device.osName);
  const [deviceId, setDeviceId] = useState(Device.osBuildId);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    askForPermissions();
    fetchDeviceId();
  }, []);

  const fetchDeviceId = () => {
    try {
      const id = `${Device.manufacturer}-${Device.modelName}-${Device.osBuildId || Device.osInternalBuildId}`;
      setDeviceId(id);
      console.log("Device ID:", id);
    } catch (error) {
      console.error("Error fetching device ID:", error);
    }
  };

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
      data.append('email', email);
      data.append('password', password);
      data.append('deviceId', deviceId);
      data.append('geo_latitud', location.coords.latitude);
      data.append('geo_longitud', location.coords.longitude);

      console.log("EMAIL: " + email);
      console.log("PASSWORD: " + password);
      //console.log("SISTEMA OPERATIVO: " + os);
      //console.log("MARCA: " + manufacturer);
      //console.log("MODELO: " + model);
      //console.log("NOMBRE DISPOSITIVO: " + deviceName);
      console.log("DEVICE ID LOG: " + deviceId);
      await fetch(baseUrl + 'ERP/php/app_v2_acceso_cmd.php', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
          if (response.existe == 100) {
            _storeToken(response.token);
            console.log("TOKEN: "+response.token);
            _storeIdUsuario(response.idusuario);
            console.log("IDUSUARIO: "+response.idusuario);
            _storeNombreUsuario(response.nombreusuario);
            console.log("NOMBRE USUARIO: "+response.nombreusuario)
            setEmail('');
            setPassword('');
            props.navigation.navigate('Principal');
          } else if (response.existe == 0) {
            Alert.alert('¡Importante!', 'El usuario no tiene permisos para acceder');
          } else if (response.error == 700) {
            Alert.alert('¡Importante!', 'No se reconoce este dispositivo');
          } else if (response.error == 600) {
            Alert.alert('¡Importante!', 'Los datos introducidos no son correctos');
          } else {
            Alert.alert('¡Importante!', 'El servicio no se encuentra disponible');
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 100, marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../assets/mide.png')} resizeMode='contain' style={{ height: 144, width: 144 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>SGI APP</Text>
        <Text style={styles.subtitle}>Inicia sesión con tu cuenta</Text>
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
        <Text style={styles.versiontext}>App Version: 2.0.0</Text>
      </View>
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.btnLogin} onPress={() => login()}>
          <Text style={styles.txtLogin}>Iniciar sesión </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 90,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  loginButtonContainer: {
    flex: 20,
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#003667',
    fontWeight: 'bold',
    width: '100%',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#8c8c8c',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  versiontext: {
    fontSize: 15,
    textAlign: 'center',
    color: '#8c8c8c',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  TextInputLabel: {
    fontWeight: '200',
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 30,
    backgroundColor: '#FFF',
    padding: 18,
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
  },
  btnLogin: {
    backgroundColor: '#003667',
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  txtLogin: {
    fontSize: 18,
    color: '#fff',
  },
});
