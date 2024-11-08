import React, { useState, useEffect } from 'react';

import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Linking, FlatList, RefreshControl } from 'react-native';
import { Octicons } from '@expo/vector-icons';

//Configuración
import { baseUrl } from '../configuration/database';

//Librerias de la screen
import * as SecureStore from 'expo-secure-store';

const PoliticasComedorScreen = ({ navigation, route }) => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    let data = new FormData();
    data.append('tipoMovimiento', 'mostrarPoliticasComedor');
    await fetch(baseUrl + 'ERP/php/comedor_cmd_funciones.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        setPolicies(response);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSubModule}>POLITICAS DE COMEDOR</Text>
      </View>
      <ScrollView style={styles.container}>
        {policies != null && (
          <>
            {policies.map((item, key) => {
              return (
                <View style={styles.policyItem} key={key}>
                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.orden}</Text>
                  </View>
                  <View style={{ flex: 11 }}>
                    <Text style={{ textAlign: 'justify' }}>{item.politica}</Text>
                  </View>
                </View>
              );
            })}
            <View style={{ padding: 10 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
    padding: 10,
    paddingRight: 20,
    paddingBottom: 20,
  },
  policyItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default PoliticasComedorScreen;
