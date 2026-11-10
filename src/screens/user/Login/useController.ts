import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  clearRememberMe,
  getRememberMe,
  saveRememberMe,
} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const useController = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const saved = await getRememberMe();
      if (!saved || cancelled) {
        return;
      }
      setEmail(saved.email);
      setPassword(saved.password);
      setRememberMe(true);
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (rememberMe) {
      await saveRememberMe({email: trimmedEmail, password});
    } else {
      await clearRememberMe();
    }

    navigation.reset({
      index: 0,
      routes: [{name: result.homeRoute}],
    });
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return {
    email,
    password,
    rememberMe,
    showPassword,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    toggleRememberMe: () => setRememberMe(prev => !prev),
    toggleShowPassword: () => setShowPassword(prev => !prev),
    handleLogin,
    goToSignup,
    goToForgotPassword,
  };
};

export default useController;
