import AsyncStorage from '@react-native-community/async-storage';

getToken = async () =>{
   let value = await AsyncStorage.getItem('token');
   return value;
}

export default getToken;