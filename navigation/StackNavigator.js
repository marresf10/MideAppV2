import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

//Librerias Externas para el funcionamiento de la aplicación
import * as SecureStore from 'expo-secure-store';

//Screens de la aplicación
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import PantallaInicioDatos from '../screens/PantallaInicioDatos';
import EditEquipoScreen from '../screens/EditEquipoScreen';

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
          options={({ navigation }) => ({
            title: 'Inicio de sesión',
            gesturesEnabled: false,
            headerStyle: {
              backgroundColor: '#003767',
            },
            headerTitleStyle: {
              color: '#FFF',
            },
            headerTintColor: 'white',
            // Aquí se añade el icono en el headerRight
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('PantallaInicioDatos')}
                style={{ marginRight: 20 }}
              >
                <MaterialIcons name="assignment" size={24} color="#FFF" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
            name="PantallaInicioDatos"
            component={PantallaInicioDatos}
            options={{ headerShown: false }}
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
          name="Editar Equipo"
          component={EditEquipoScreen}
          options={({ navigation }) => ({
            title: 'Editar Equipo',
            gesturesEnabled: true,
            headerStyle: {
              backgroundColor: '#99c221',
            },
            headerTitleStyle: {
              color: '#FFF',
              fontWeight: 'bold',
            },
            headerTintColor: 'white',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Inicio');
                }}>
                <Text style={{ color: '#FFF', marginRight: 20, fontSize: 15 }}>Cancelar</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack(); // Navega hacia atrás
                }}>
                <Text style={{ color: '#FFF', marginLeft: 20, fontSize: 15 }}>Volver</Text>
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
