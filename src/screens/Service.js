/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import {React, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {ActivityIndicator} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';

export default function Home({navigation}) {
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {logout} = useContext(AuthContext);

  const getServices = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const servicesRespData = await http.get('service/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const services = servicesRespData.map(service => ({
        key: service.id.toString(),
        code: service.code,
        title: service.name,
        icon: service.icon,
        description: service.description,
        phone: service.phone,
        images: service.images,
        serviceID: service.id,
      }));
      setServicesData(services);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert('ERROR', 'Something went wrong, we are working on it', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const numColumns = 3;
  const CARD_HEIGHT = 90;
  const getServiceCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });
  const formatData = (services, num) => {
    const numberOfFullRows = Math.floor(services.length / num);
    let numberOfItemsLastRow = services.length - numberOfFullRows * num;
    while (numberOfItemsLastRow !== num && numberOfItemsLastRow !== 0) {
      services.push({key: `blank-${numberOfItemsLastRow}`, empty: true});
      numberOfItemsLastRow++;
    }
    return services;
  };

  const renderServiceList = ({item}) => (
    <Pressable
      style={{
        height: CARD_HEIGHT,
        flex: 4,
        marginTop: 30,
      }}
      disabled={item.empty ? true : false}
      onPress={() =>
        navigation.navigate('ServiceDescription', {
          serviceDetails: {
            title: item.title,
            description: item.description,
            phone: item.phone,
            images: item.images,
            serviceID: item.serviceID,
            code: item.code,
          },
        })
      }>
      {item.empty ? (
        ''
      ) : (
        <View style={{flex: 2}}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={{uri: item.icon, width: 55, height: 55}} />
          </View>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 14,
                color: '#111',
              }}>
              {item.title}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.btnSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: '#BFBFBF',
              marginLeft: '5%',
              width: '40%',
              height: '80%',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 20, color: '#111'}}>
              Ads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Service')}
            style={{
              marginRight: '5%',
              backgroundColor: '#FA8C00',
              width: '40%',
              height: '80%',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 20, color: '#111'}}>
              Services
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.serviceListSection}>
        <FlatList
          data={formatData(servicesData, numColumns)}
          renderItem={renderServiceList}
          getItemLayout={getServiceCardLayout}
          numColumns={numColumns}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.5,
  },
  btnSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serviceListSection: {
    flex: 6,
  },
});
