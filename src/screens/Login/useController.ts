import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types/navigation';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const useController = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter email and password.');
      return;
    }

    setError('');
    navigation.replace('Home');
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return {
    email,
    password,
    error,
    setEmail,
    setPassword,
    handleLogin,
    goToSignup,
  };
};

export default useController;
