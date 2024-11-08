import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, ActivityIndicator, Alert, FlatList, RefreshControl, TouchableOpacity } from 'react-native';

//Exportación de url para servicios
import { baseUrl } from '../configuration/database';

import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Dimensions } from 'react-native';

import Checkbox from 'expo-checkbox';

const OrdenesDeServicioScreen = ({ navigation, route }) => {
  const Ordenes = (props) => {
    let element = (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.bkgHeader}>
            <View style={styles.pddnHeader}>
              <Text style={styles.txtWhite} numberOfLines={1} ellipsizeMode='tail'>
                Folio:
              </Text>
            </View>
            <View style={styles.pddnHeader}>
              <Text style={styles.txtClientCard} numberOfLines={1} ellipsizeMode='tail'>
                {props.folio}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.tchUploadEvidences} onPress={() => pruebaFake()}>
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Contacto
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.contacto}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Marca
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.marca}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Modelo
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.modelo}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Equipo
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.equipo}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                No. de serie
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.noserie}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Identificación
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.identificacion}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                ¿Credito?
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.tienecredito}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                ¿Se puede entregar?
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.sepuedeentregar}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Sin costo
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.negrita}>
                {props.essincosto_print}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );

    return element;
  };

  const pruebaFake = () => {
    alert('Agregado');
    setAgregado(!agregado);
  };

  const searchClientOS = async (id) => {
    let data = new FormData();
    data.append('nombre_funcion', 'mostrarOSEntrega');
    data.append('idcliente', id);
    await fetch(baseUrl + 'ERP/php/app_recepcion_entrega_cliente.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        //console.log(response);
        if (response == null) {
          setClientOS({ contacto: 'null' });
        } else if (Array.isArray(response) && response[0].contacto == 'null') {
          setClientOS({ contacto: 'null' });
          Alert.alert('¡Importante!', 'Surgió un error al consultar los datos del cliente');
        } else if (Array.isArray(response) && response[0].contacto != null) {
          setClientOS(response);
        } else {
          alert('Error', JSON.stringify(response));
          setClientOS({ contacto: 'null' });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await searchClientOS(idCliente);
    setIsRefreshing(false);
  });

  return (
    <SafeAreaView style={styles.screen}>
      <Text>id: {route.params.idusu}</Text>
      <Text>token: {route.params.tokenusu}</Text>
      <Text>id de cliente: {route.params.idcliente}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  checkbox: {
    margin: 8,
  },
});

export default OrdenesDeServicioScreen;
