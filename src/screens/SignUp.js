import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import DropDown from '../shared/components/DropDown';
import {useNavigation} from '@react-navigation/native';
import {http} from '../shared/lib';

const delay = delayInms => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

export default function SignUp() {
  const navigation = useNavigation();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const getLocations = async () => {
    setIsLoading(true);
    try {
      let respData = await http({
        method: 'GET',
        url: 'location/public/?isactive=true',
      });

      const locationsData = respData.map(location => ({
        key: location.id.toString(),
        value: location.name,
      }));
      console.log(locationsData);
      setLocations(locationsData);
    } catch (error) {
      console.log('Something went wrong while fetching locations' + error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getLocations();
  }, []);

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <CustomButton btnType="back" onpress={() => navigation.goBack()} />
          </View>

          <View style={styles.registerFormContainer}>
            <Text style={styles.registerFormHeading}>Register</Text>
            <View style={styles.nameInputContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginLeft: '10%'},
                ]}
                placeholder="First Name"
              />
              <TextInput
                placeholder="Last Name"
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginRight: '10%'},
                ]}
              />
            </View>

            <TextInput
              placeholder="Enter Mobile Number"
              style={[styles.input, styles.inputCommon]}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter you email"
              style={[styles.input, styles.inputCommon]}
              autoCapitalize={'none'}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Enter your password"
              secureTextEntry={true}
              autoCapitalize={'none'}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Confirm password"
              secureTextEntry={true}
              autoCapitalize={'none'}
            />
            <DropDown placeholder="Select Location" locationArray={locations} />
            <DropDown
              placeholder="Select Area"
              dataArr={['India', 'America', 'Russia', 'Japan', 'China']}
            />
            <CustomButton
              btnTitle={'Sign Up'}
              onpress={() => navigation.navigate('VerifyOtp')}
              style={styles.registerBtn}
              icon="arrow-forward"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    flex: 1,
  },
  header: {flex: -1},

  registerFormContainer: {
    flex: 4,
    justifyContent: 'flex-start',
    marginTop: '4%',
  },
  registerFormHeading: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FF8C00',
    textAlign: 'center',
  },

  input: {
    width: '76%',
    marginTop: '3%',
    marginHorizontal: '12%',
  },
  inputCommon: {
    backgroundColor: '#efefef',
    borderRadius: 20,
    padding: 10,
    elevation: 5, //Android Only
    shadowRadius: 5, // IOS Only
  },
  registerBtn: {
    marginTop: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '3%',
  },
  nameInput: {
    width: '36%',
  },
});
