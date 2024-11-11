import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as Device from 'expo-device';

const PantallaInicioDatos = ({ navigation }) => {
  const email = "user@example.com";
  const password = "yourPassword";

  const [os, setOs] = useState("Cargando...");
  const [manufacturer, setManufacturer] = useState("Cargando...");
  const [model, setModel] = useState("Cargando...");
  const [deviceName, setDeviceName] = useState("Cargando...");
  const [deviceId, setDeviceId] = useState("Cargando...");
  const [deviceBuild, setDeviceBuild] = useState("Cargando...");

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const osName = Device.osName || "N/A";
        const manufacturerName = Device.manufacturer || "N/A";
        const modelName = Device.modelName || "N/A";
        const name = Device.deviceName || "N/A";
        const id = `${manufacturerName}-${modelName}-${Device.osBuildId || Device.osInternalBuildId || "defaultId"}`;

        setOs(osName);
        setManufacturer(manufacturerName);
        setModel(modelName);
        setDeviceName(name);
        setDeviceId(id);
        setDeviceBuild(Device.osBuildId || "N/A");

        console.log("Device ID obtenido:", id);
      } catch (error) {
        console.error("Error al obtener el Device ID:", error);
        setDeviceId("No disponible");
      }
    };
    fetchDeviceInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 100, marginBottom: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../assets/mide.png')} resizeMode='contain' style={{ height: 144, width: 144 }} />
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>  Sistema Operativo:</Text>
        <Text style={styles.sublabel}>{os}</Text>
        <Text style={styles.label}>  Marca:</Text>
        <Text style={styles.sublabel}>{manufacturer}</Text>
        <Text style={styles.label}>  Modelo:</Text>
        <Text style={styles.sublabel}>{model}</Text>
        <Text style={styles.label}>  Nombre Dispositivo:</Text>
        <Text style={styles.sublabel}> {deviceName}</Text>
        <Text style={styles.label}>  Device ID:</Text>
        <Text style={styles.sublabel}>{deviceId}</Text>
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.buttonText}>     Volver     </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContainer: {
    marginBottom: 50,
  },
  label: {
    backgroundColor: '#003767',
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 20,
    color: '#333',
    color: '#FFFFFF',
  },
  sublabel: {
    fontSize: 15,
    marginBottom: 15,
    marginTop: 0,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#003767',
    padding: 15,
    marginTop: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default PantallaInicioDatos;
