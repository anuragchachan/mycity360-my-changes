import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {http} from '../shared/lib';
import {AuthContext} from '../context/AuthContext';

export default function SubCategory({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const {categoryID, categoryName, isPrice} = route.params;
  const {logout} = useContext(AuthContext);

  const getSubCategories = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const subCategoriesRespData = await http.get(
        `category/user/?category_id=${categoryID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (
        subCategoriesRespData.results &&
        subCategoriesRespData.results.length > 0
      ) {
        const subCategories = subCategoriesRespData.results.map(category => ({
          id: category.id.toString(),
          name: category.name,
        }));
        setSubCategoryData(subCategories);
      } else {
        navigation.replace('QuestionsScreen', {
          categoryID: categoryID,
          subCategoryID: categoryID,
          isPrice: isPrice,
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      } else {
        Alert.alert(
          'ERROR',
          'Something went wrong, Unable to Fetch Sub Categories',
          [
            {
              text: 'OK',
            },
          ],
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubCategories();
  }, []);

  const CARD_HEIGHT = 50;
  const getSubCategoryCardLayout = (_, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          height: CARD_HEIGHT,
          borderBottomColor: '#999',
          borderBottomWidth: 0.5,
          justifyContent: 'center',
        }}
        onPress={() =>
          navigation.navigate('QuestionsScreen', {
            categoryID: categoryID,
            subCategoryID: item.id,
            isPrice: isPrice,
          })
        }>
        <Text
          allowFontScaling={false}
          style={{fontSize: 16, color: '#222', marginLeft: 10}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcon name="arrow-back" color={'#333'} size={28} />
        </TouchableOpacity>

        <Text allowFontScaling={false} style={styles.headingText}>
          {categoryName}
        </Text>
      </View>
      <View style={styles.subCategorySection}>
        <FlatList
          data={subcategoryData}
          renderItem={renderSubCategory}
          getItemLayout={getSubCategoryCardLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flex: 0.5,
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    gap: 20,
  },
  headingText: {fontSize: 18, color: '#111'},
  subCategorySection: {flex: 8},
});
