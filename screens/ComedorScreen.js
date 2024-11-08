import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, SectionList, TouchableOpacity } from 'react-native';
import { SimpleLineIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { baseUrl } from '../configuration/database';
import * as SecureStore from 'expo-secure-store';

//Navegación drawer
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';

//Screens con los navigator
import PedirComedorScreen from './PedirComedorScreen';
import PoliticasComedorScreen from './PoliticasComedorScreen';

const Drawer = createDrawerNavigator();

var submenus = [
  {
    title: 'Comedor',
    data: [
      { title: 'Politicas de comedor', link: 'Politicas de comedor' },
      { title: 'Pedir comedor', link: 'Realizar pedido' },
    ],
  },
  {
    title: 'Regresar',
    data: [{ title: 'Menu principal', link: 'Principal' }],
  },
];

//{ title: 'Mis pedidos', link: 'Inicio' },

const DrawerContent = (props) => (
  <View>
    <SectionList
      sections={submenus}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
              marginVertical: 5,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingVertical: 7,
              borderRadius: 5,
            }}
            onPress={() => {
              props.navigation.navigate(item.link);
              //Aqui manda datos
            }}>
            <Text style={styles.subMenuSubTitle}>{item.title}</Text>
          </TouchableOpacity>
        );
      }}
      renderSectionHeader={({ section }) => (
        <View style={{ flexDirection: 'row', marginLeft: 5 }}>
          <FontAwesome name='caret-right' size={24} color='black' />
          <Text style={styles.subMenuTitle}>{section.title}</Text>
        </View>
      )}
      keyExtractor={(item, index) => item + index}
      style={styles.flatlist}
    />
  </View>
);

function Inicio({ navigation }) {
  useEffect(() => {
    //navigation.openDrawer();
    navigationToPolicies();
  }, []);

  const navigationToPolicies = async () => {
    const navigateTo = navigation.addListener('focus', () => {
      navigation.navigate('Politicas de comedor');
    });

    return navigateTo;
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <Text>Esta es la pantalla de Comedor - Inicio</Text>
    </SafeAreaView>
  );
}

const ComedorScreen = ({ navigation }) => {
  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    let id = await SecureStore.getItemAsync('idUsuario');
    idUsuario = id;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <SimpleLineIcons name='menu' size={21} color='#FFF' style={{ padding: 10 }} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />
      ),
    });
  }, []);

  useEffect(() => {
    onLoadSideBar();
  }, [navigation.setOptions]);

  const onLoadSideBar = async () => {
    const data = new FormData();
    data.append('ses_idsubsistema', ' ');
    data.append('idusuario', ' ');
    await fetch(baseUrl + 'ERP/php/ws_app_menu.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        //submenus = response;
      })
      .catch((error) => console.log(error));
  };

  return (
    <Drawer.Navigator drawerContent={DrawerContent}>
      <Drawer.Screen name='Inicio' component={Inicio} options={{ drawerIcon: () => <FontAwesome5 name='home' size={20} color='#000' />, headerShown: false }} />
      <Drawer.Screen
        name='Realizar pedido'
        component={PedirComedorScreen}
        options={{
          drawerIcon: () => <FontAwesome5 name='user' size={20} color='#000' />,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name='Politicas de comedor'
        component={PoliticasComedorScreen}
        options={{
          drawerIcon: () => <FontAwesome5 name='user' size={20} color='#000' />,
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default ComedorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlist: {
    backgroundColor: '#FFF',
    flexGrow: 0,
    height: '90%',
  },
  subMenuTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 5,
    marginVertical: 3,
  },
  subMenuSubTitle: {
    marginLeft: 30,
    color: 'gray',
  },
});
