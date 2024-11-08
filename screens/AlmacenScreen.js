import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, SectionList, TouchableOpacity } from 'react-native';

import { SimpleLineIcons, FontAwesome5, FontAwesome, AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

//Navegación drawer
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';

//Screens con los navigator
import ValeRecepcionScreen from './ValeRecepcionScreen';
import EntregaAClienteScreen from './EntregaAClienteScreen';
import EvidenciasDeEntregaScreen from './EvidenciasDeEntregaScreen';

const Drawer = createDrawerNavigator();

var menu = [
  {
    title: 'Equipos',
    data: [
      { title: 'Vale recepción', link: 'Vale recepción' },
      { title: 'Evidencias de entrega', link: 'Evidencias de entrega' },
      { title: 'Entrega a cliente', link: 'Entrega a cliente' },
    ],
  },
  {
    title: 'Regresar',
    data: [{ title: 'Menu principal', link: 'Principal' }],
  },
];

//{ title: 'Entrega a cliente', link: 'Entrega a cliente' },

const DrawerContent = (props) => (
  <View>
    <SectionList
      sections={menu}
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
            onPress={async () => {
              let id = await SecureStore.getItemAsync('idUsuario');
              let tok = await SecureStore.getItemAsync('token');
              let hoy = new Date();
              let fecha = hoy.getFullYear() + ('0' + (hoy.getMonth() + 1)).slice(-2) + ('0' + hoy.getDate()).slice(-2);
              let hora = ('0' + hoy.getHours()).slice(-2) + ('0' + hoy.getMinutes()).slice(-2) + ('0' + hoy.getSeconds()).slice(-2);
              if (item.link == 'Vale recepción') {
                props.navigation.navigate(item.link, { foliotmpp: id + fecha + hora + '', idusu: id, tokenusu: tok });
              } else {
                props.navigation.navigate(item.link, { idusu: id, tokenusu: tok });
              }
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

//Fragmento para utilizar el menu por default de navigation
/* 
<DrawerItemList {...props} />
*/

function Inicio({ navigation }) {
  useEffect(() => {
    //navigation.openDrawer();
    navigationToVale();
  }, []);

  const navigationToVale = async () => {
    let id = await SecureStore.getItemAsync('idUsuario');
    let tok = await SecureStore.getItemAsync('token');
    const navigateTo = navigation.addListener('focus', () => {
      let hoy = new Date();
      let fecha = hoy.getFullYear() + ('0' + (hoy.getMonth() + 1)).slice(-2) + ('0' + hoy.getDate()).slice(-2);
      let hora = ('0' + hoy.getHours()).slice(-2) + ('0' + hoy.getMinutes()).slice(-2) + ('0' + hoy.getSeconds()).slice(-2);
      navigation.navigate('Vale recepción', { foliotmpp: id + fecha + hora + '', idusu: id, tokenusu: tok });
    });

    return navigateTo;
  };

  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const AlmacenScreen = ({ navigation }) => {
  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    let id = await SecureStore.getItemAsync('idUsuario');
    let tok = await SecureStore.getItemAsync('token');

    let hoy = new Date();
    let fecha = hoy.getFullYear() + ('0' + (hoy.getMonth() + 1)).slice(-2) + ('0' + hoy.getDate()).slice(-2);
    let hora = ('0' + hoy.getHours()).slice(-2) + ('0' + hoy.getMinutes()).slice(-2) + ('0' + hoy.getSeconds()).slice(-2);

    const jumpToAction = DrawerActions.jumpTo('Vale recepción', { foliotmpp: id + fecha + hora + '', idusu: id, tokenusu: tok });

    navigation.dispatch(jumpToAction);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <SimpleLineIcons name='menu' size={21} color='#FFF' style={{ padding: 10 }} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />
      ),
    });
  }, []);

  //Fragmentos que servia para cargar menus
  /*
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
  */

  return (
    <Drawer.Navigator drawerContent={DrawerContent}>
      <Drawer.Screen name='Inicio' component={Inicio} options={{ drawerIcon: () => <FontAwesome5 name='home' size={20} color='#000' />, headerShown: false }} />
      <Drawer.Screen
        name='Vale recepción'
        component={ValeRecepcionScreen}
        options={{ unmountOnBlur: true, drawerIcon: () => <FontAwesome5 name='arrow-alt-circle-up' size={20} color='#000' />, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Drawer.Screen
        name='Evidencias de entrega'
        component={EvidenciasDeEntregaScreen}
        options={{ unmountOnBlur: true, drawerIcon: () => <FontAwesome5 name='arrow-alt-circle-up' size={20} color='#000' />, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Drawer.Screen
        name='Entrega a cliente'
        component={EntregaAClienteScreen}
        options={{ unmountOnBlur: true, drawerIcon: () => <FontAwesome5 name='arrow-alt-circle-up' size={20} color='#000' />, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
    </Drawer.Navigator>
  );
};

export default AlmacenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F9F9F9',
    flexDirection: 'column',
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
  menus: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 2,
  },
  menu: {
    flex: 1,
    elevation: 10,
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#699cc6',
  },
  menuImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
