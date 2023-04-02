import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../shared/components/CustomButton';
import DropDown from '../shared/components/DropDown';
import {useNavigation} from '@react-navigation/native';
import {http} from '../shared/lib';

export default function SignUp() {
  const navigation = useNavigation();
  const [locationData, setLocationData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getLocations = async () => {
    setIsLoading(true);
    try {
      let locationRespdata = await http({
        method: 'GET',
        url: 'location/public/?isactive=true',
      });

      const locations = locationRespdata.map(location => ({
        key: location.id.toString(),
        value: location.name,
      }));
      console.log(selectedLocation);
      setLocationData(locations);
    } catch (error) {
      console.log('Something went wrong while fetching locations' + error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getLocations();
  }, []);

  const getAreas = async location => {
    try {
      let areaRespData = await http({
        method: 'GET',
        url: `area/public/?location_id=${location.key}`,
      });

      const areas = areaRespData.map(area => ({
        key: area.id.toString(),
        value: area.name,
      }));
      console.log(areas);
      setAreaData(areas);
      setIsDisabled(false);
    } catch (error) {
      console.log('Something went wrong while fetching area' + error);
    }
  };

  const setLocation = async location => {
    setSelectedLocation(location);
    getAreas(location);
  };
  const setArea = async area => {
    setSelectedArea(area);
  };

  formData = () => {
    dataObject = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: mobileNumber,
      password: password,
      area: {id: selectedArea.key},
    };
    return dataObject;
  };
  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}></View>

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
                onChangeText={firstname => {
                  setFirstName(firstname);
                }}
              />
              <TextInput
                placeholder="Last Name"
                style={[
                  styles.nameInput,
                  styles.inputCommon,
                  {marginRight: '10%'},
                ]}
                onChangeText={lastname => {
                  setLastName(lastname);
                }}
              />
            </View>
            <TextInput
              placeholder="Enter Mobile Number"
              style={[styles.input, styles.inputCommon]}
              keyboardType="numeric"
              onChangeText={mobileNumber => {
                setMobileNumber(mobileNumber);
              }}
            />
            <TextInput
              placeholder="Enter you email"
              style={[styles.input, styles.inputCommon]}
              autoCapitalize={'none'}
              keyboardType="email-address"
              onChangeText={email => {
                setEmail(email);
              }}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Enter your password"
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={password => {
                setPassword(password);
              }}
            />
            <TextInput
              style={[styles.input, styles.inputCommon]}
              placeholder="Confirm password"
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={confirmPassword => {
                setConfirmPassword(confirmPassword);
              }}
            />
            <DropDown
              placeholder="Select Location"
              dataArray={locationData}
              selectedDataHandler={location => setLocation(location)}
              isDisabled={false}
            />
            <DropDown
              placeholder="Select Area"
              dataArray={areaData}
              isDisabled={isDisabled}
              selectedDataHandler={area => setArea(area)}
            />
            {/* navigation.navigate('VerifyOtp') */}
            <CustomButton
              btnTitle={'Sign Up'}
              onpress={() => {
                let dataD = formData();
                console.log(dataD);
              }}
              style={styles.registerBtn}
              icon="arrow-forward"
            />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 1,
                }}>
                Already Registered?{' '}
                <Text style={{color: '#FA8C00'}}>Login</Text>
              </Text>
            </TouchableOpacity>
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
  header: {flex: 0.5},

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
