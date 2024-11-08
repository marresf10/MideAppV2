import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

import { NavigationActions } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const TomarFotoScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const ref = useRef(null);
  const [isCameraShowing, setIsCameraShowing] = useState(false);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    askingForCameraPermissions();
  }, []);

  const askingForCameraPermissions = () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  };

  const _takePhoto = async () => {
    let photo = await ref.current.takePictureAsync();
    //console.debug(photo);
    _storeUriImage(JSON.stringify(photo));
    navigation.navigate('Almacén');
  };

  const _storeUriImage = async (uri) => {
    try {
      await SecureStore.setItemAsync('uriPhoto', uri);
    } catch (error) {
      console.log('StoreImage: ' + error);
    }
  };

  const cameraOn = () => {
    if (hasPermission == null) {
      console.log('null');
      askingForCameraPermissions();
    } else if (hasPermission === false) {
      console.log('false');
      askingForCameraPermissions();
    } else {
      setIsCameraShowing(true);
    }
  };

  const turnOnFlash = () => {
    if (type === Camera.Constants.Type.back) {
      setType(Camera.Constants.Type.front);
      setFlash(Camera.Constants.FlashMode.off);
    } else {
      setType(Camera.Constants.Type.back);
    }
  };

  if (hasPermission === null) {
    return <Text>Cargando</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Camera style={{ width: '100%', aspectRatio: 3 / 4 }} type={type} ref={ref} flashMode={flash}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        />
      </Camera>
      <View style={{ flex: 1, flexDirection: 'row', width: '100%', marginTop: 20, padding: 5, justifyContent: 'space-evenly' }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: '#282828',
            borderRadius: 500,
            padding: 18,
            alignItems: 'center',
            alignSelf: 'center',
            transform: [type == Camera.Constants.Type.back ? { rotateX: '180deg' } : { rotateX: '0deg' }],
          }}
          onPress={() => {
            turnOnFlash();
          }}>
          <MaterialIcons name='flip-camera-android' size={25} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderRadius: 500,
            alignItems: 'center',
            marginHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: '#282828',
            alignSelf: 'center',
            padding: 20,
          }}
          onPress={_takePhoto}>
          <MaterialCommunityIcons name='camera' size={30} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[flash === Camera.Constants.FlashMode.off ? styles.btnFlashOff : styles.btnFlashOn]}
          onPress={() => {
            setFlash(
              flash === Camera.Constants.FlashMode.off && type === Camera.Constants.Type.back
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            );
          }}>
          <Ionicons name='flashlight' size={25} color='white' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnFlashOff: {
    borderRadius: 500,
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#282828',
    alignSelf: 'center',
    padding: 18,
  },
  btnFlashOn: {
    borderRadius: 500,
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#003667',
    alignSelf: 'center',
    padding: 18,
  },
});

export default TomarFotoScreen;
