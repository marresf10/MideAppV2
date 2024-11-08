import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';

//Librerias Externas para el funcionamiento de la aplicación
import * as SecureStore from 'expo-secure-store';

//Screens de la aplicación
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';

//Screens del modulo de almacen
import AlmacenScreen from '../screens/AlmacenScreen';
import ArchivosPorEquipoScreen from '../screens/ArchivosPorEquipoScreen';
import EvidenciaOSScreen from '../screens/EvidenciaOSScreen';

//Screens del modulo de comedor
import ComedorScreen from '../screens/ComedorScreen';
import OrdenesDeServicioScreen from '../screens/OrdenesDeServicioScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Stack.Navigator>
        <Stack.Screen
          name='Inicio'
          component={LoginScreen}
          options={{
            title: 'Inicio de sesión',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#003767',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name='Principal'
          component={MainScreen}
          options={({ navigation }) => ({
            title: 'Principal',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#003767',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Almacén'
          component={AlmacenScreen}
          options={({ navigation }) => ({
            title: 'Almacén',
            headerStyle: {
              backgroundColor: '#003767',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Comedor'
          component={ComedorScreen}
          options={({ navigation }) => ({
            title: 'Comedor',
            headerStyle: {
              backgroundColor: '#003767',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Subir archivos del equipo'
          component={ArchivosPorEquipoScreen}
          options={({ navigation }) => ({
            title: 'Subir archivos del equipo',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#99c221',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Evidencia de OS'
          component={EvidenciaOSScreen}
          options={({ navigation }) => ({
            title: 'Evidencia de OS',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#003667',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name='Ordenes de servicio'
          component={OrdenesDeServicioScreen}
          options={({ navigation }) => ({
            title: 'Ordenes de servicio',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#003667',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await SecureStore.deleteItemAsync('token');
                    await SecureStore.deleteItemAsync('idUsuario');
                    await SecureStore.deleteItemAsync('nombreUsuario');
                  } catch (error) {
                    console.log(error);
                  }
                  navigation.popToTop('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cerrar sesión</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
