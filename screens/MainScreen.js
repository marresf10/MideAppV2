import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menus}>
        <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Almacén')}>
          <Image
            style={styles.menuImage}
            source={{
              uri: 'https://sgi.midelab.com/ERP/images/ICON_ALMACEN.png',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Comedor')}>
          <Image
            style={styles.menuImage}
            source={{
              uri: 'https://sgi.midelab.com/ERP/images/ICON_COMEDOR.png',
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/*
<TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Comedor')}>
  <Image
    style={styles.menuImage}
    source={{
      uri: 'https://sgi.midelab.com/ERP/images/ICON_COMEDOR.png',
    }}
  />
</TouchableOpacity>
*/

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F9F9F9',
    flexDirection: 'column',
  },
  menus: {
    flexDirection: 'row',
    width: width,
    aspectRatio: 2,
  },
  menu: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
  },
  menuImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
