import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../context/AuthContext';
import type {RootStackParamList} from '../../types/navigation';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const useController = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(trimmedEmail, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigation.replace('MainTabs');
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    handleLogin,
    goToSignup,
  };
};

export default useController;
