import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native';

//Configuración
import { baseUrl } from '../configuration/database';

import { Picker } from '@react-native-picker/picker';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';

//Autocomplete clientes
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Dimensions } from 'react-native';

const EvidenciasDeEntregaScreen = ({ navigation, route }) => {
  const [anio, setAnio] = useState();
  const [anios, setAnios] = useState([]);
  //Dale
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const searchRef = useRef(null);
  const [idCliente, setIdCliente] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [OS, setOS] = useState([]);

  useEffect(() => {
    getFecha();
  }, []);

  const loadOS = async (id, año) => {
    let data = new FormData();
    data.append('tipoMovimiento', 'mostrarPoliticasComedor');
    data.append('idcliente', id);
    if (typeof año == 'undefined') {
      data.append('anio_filtro', anio);
    } else {
      data.append('anio_filtro', año);
    }
    await fetch(baseUrl + 'ERP/php/app_entrega_cliente_evidencia.php', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response == null) {
          //nada
        } else if (Array.isArray(response) && response.length > 1) {
          setOS(response);
        } else {
          alert('Error', JSON.stringify(response));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const Evidencias = (props) => {
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
                {props.folio} {props.idosdetalle}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.tchUploadEvidences}
            onPress={() =>
              navigation.navigate('Evidencia de OS', {
                idOS: props.idosdetalle,
                folio: props.folio,
                descripcion: props.descripcion,
                marca: props.marca,
                modelo: props.modelo,
                intervalo: props.intervalo,
                noserie: props.noserie,
                identificacion: props.identificacion,
                fechaentregalab: props.fechaentregalab,
                fechaentregacliente: props.fechaentregacliente,
                estatus: props.estatus,
              })
            }>
            <MaterialIcons name='upload-file' size={30} color='#DDD' />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Descripción
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.descripcion}
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
                Intervalo
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.intervalo}
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
                Entrega a laboratorio
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.fechaentregalab}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine3}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Entrega a cliente
              </Text>
            </View>
            <View style={styles.cardLine4}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {props.fechaentregacliente}
              </Text>
            </View>
          </View>
          <View style={styles.flxRight}>
            <View style={styles.cardLine1}>
              <Text numberOfLines={1} ellipsizeMode='tail'>
                Estado
              </Text>
            </View>
            <View style={styles.cardLine2}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.negrita}>
                {props.estatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );

    return element;
  };

  const getFecha = () => {
    let fecha = new Date().getFullYear();
    const codigo = [];
    for (let i = fecha; i >= 2021; i--) {
      codigo.push({ fecha: i + '' });
    }
    setAnios(codigo);
    setAnio(fecha);
  };

  //Dropdown
  const getSuggestions = useCallback(async (q) => {
    let data = new FormData();
    data.append('token', route.params.tokenusu);
    data.append('idusuario', route.params.idusu);
    data.append('esporapp', 1);
    data.append('term', q);
    if (typeof q !== 'string' || q.length < 2) {
      setSuggestionsList(null);
      setOS([]);
      return;
    }
    setLoading(true);
    const response = await fetch(baseUrl + 'ERP/php/app_ws_get_clientes.php', {
      method: 'POST',
      body: data,
    });
    const items = await response.json();
    if (items != null && items[0].error == 1001) {
      setSuggestionsList(null);
    } else if (items == null) {
      setSuggestionsList(null);
      setOS([]);
      Alert.alert('¡Importante!', 'No hay registros de clientes con la busquedad <' + q + '>');
    } else if (items.length > 0) {
      const suggestions = items.map((item) => ({
        id: item.idcliente,
        title: item.c_razonsocial,
      }));
      setSuggestionsList(suggestions);
    } else {
      setSuggestionsList(null);
      setOS([]);
    }
    setLoading(false);
  }, []);

  const pickAClient = (idclient) => {
    let findLabel = suggestionsList.find((o) => o.id == idclient);
    setIdCliente(idclient);
    setCliente(findLabel.title);
    loadOS(idclient);
  };

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await loadOS(idCliente);
    setIsRefreshing(false);
  });

  const setAnioAndSearch = (año) => {
    setAnio(año);
    if (idCliente != null) {
      loadOS(idCliente, año);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSubModule}>EVIDENCIAS ENTREGA</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.txtLabel}>Año: </Text>
        <View style={styles.labelContainer}>
          <Picker selectedValue={anio} onValueChange={(val) => setAnioAndSearch(val)}>
            {anios.map((item) => (
              <Picker.Item style={styles.txtPicker} label={item.fecha} value={item.fecha} key={item.fecha} />
            ))}
          </Picker>
        </View>
        <Text style={styles.txtLabel}>Cliente: </Text>
        <AutocompleteDropdown
          ref={searchRef}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedItem(item.id);
            item && pickAClient(item.id);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: 'Cliente',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: styles.autoCompleteItem,
          }}
          rightButtonsContainerStyle={styles.rgtBtnAutoComplete}
          inputContainerStyle={styles.inputContainerStyle}
          suggestionsListContainerStyle={styles.suggestions}
          containerStyle={styles.flexShrink}
          renderItem={(item, text) => <Text style={styles.itemTitle}>{item.title}</Text>}
          ChevronIconComponent={<Feather name='x-circle' size={18} color='#FFF' />}
          ClearIconComponent={<Feather name='chevron-down' size={20} color='black' />}
          inputHeight={50}
          showChevron={false}
        />
        <View style={styles.screenTitle}>
          <AntDesign name='doubleright' size={14} color='#003667' />
          <Text style={styles.listTitle}> Ordenes de servicio: </Text>
          {OS.length > 0 && <Text style={styles.listTitle}>({OS.length})</Text>}
        </View>
      </View>

      {Array.isArray(OS) && OS.length > 0 ? (
        <>
          <FlatList
            data={OS}
            renderItem={({ item, key }) => {
              return (
                <Evidencias
                  idosdetalle={item.idosdetalle}
                  folio={item.folio}
                  descripcion={item.descripcion}
                  marca={item.marca}
                  modelo={item.modelo}
                  intervalo={item.intervalo}
                  noserie={item.noserie}
                  identificacion={item.identificacion}
                  fechaentregalab={item.fechaentregalab}
                  fechaentregacliente={item.fechaentregacliente}
                  estatus={item.estatus}
                />
              );
            }}
            keyExtractor={(item, key) => key.toString()}
            refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
            ListFooterComponent={<View style={styles.flatlistEnd} />}
          />
        </>
      ) : (
        <View style={styles.alinearTexto}>
          <Text>¡No hay registros de OS!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenLoaded: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: 5,
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
  txtPicker: {
    fontSize: 14,
  },
  labelContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#003667',
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardHeader: {
    flex: 6,
    flexDirection: 'row',
  },
  bkgHeader: {
    flex: 8,
    backgroundColor: '#003667',
    padding: 3,
    borderWidth: 0,
    borderColor: '#003667',
  },
  pddnHeader: {
    paddingLeft: 3,
  },
  txtClientCard: {
    color: 'white',
    fontWeight: 'bold',
  },
  txtWhite: {
    color: 'white',
  },
  tchUploadEvidences: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#003667',
    borderWidth: 0,
    borderColor: '#003667',
  },
  cardContent: {
    flex: 19,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  flxRight: {
    flexDirection: 'row',
  },
  cardLine1: {
    flex: 2,
    backgroundColor: '#EFEFEF',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine2: {
    flex: 4,
    backgroundColor: '#FEFEFE',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine3: {
    flex: 2,
    backgroundColor: '#DDDDDD',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  cardLine4: {
    flex: 4,
    backgroundColor: '#EDEDED',
    paddingLeft: 3,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  flatlistEnd: {
    marginVertical: 20,
  },
  autoCompleteItem: {
    borderRadius: 5,
    backgroundColor: '#FFF',
    color: '#000',
    paddingLeft: 10,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  rgtBtnAutoComplete: {
    right: 5,
    height: 30,
    top: 10,
    backgroundColor: 'transparent',
  },
  suggestions: {
    backgroundColor: '#383b42',
  },
  inputContainerStyle: {
    backgroundColor: 'transparent',
  },
  flexShrink: {
    flexShrink: 1,
  },
  itemTitle: {
    color: '#fff',
    padding: 15,
  },
  screenTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    color: '#003667',
    fontWeight: 'bold',
  },
  negrita: {
    fontWeight: 'bold',
  },
  alinearTexto: {
    alignItems: 'center',
  },
});

export default EvidenciasDeEntregaScreen;
