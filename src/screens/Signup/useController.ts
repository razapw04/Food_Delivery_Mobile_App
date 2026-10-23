import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types/navigation';

type SignupNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

const useController = () => {
  const navigation = useNavigation<SignupNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    navigation.replace('Home');
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    error,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSignup,
    goToLogin,
  };
};

export default useController;
