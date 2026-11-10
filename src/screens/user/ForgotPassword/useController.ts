import {useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {resetLocalPassword} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const useController = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    const result = await resetLocalPassword({
      email: trimmedEmail,
      newPassword: password,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    Alert.alert(
      'Password updated',
      'Your local password was reset. You can log in with the new password.',
      [
        {
          text: 'Go to Login',
          onPress: () => navigation.navigate('Login'),
        },
      ],
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    setConfirmPassword,
    toggleShowPassword: () => setShowPassword(prev => !prev),
    toggleShowConfirmPassword: () => setShowConfirmPassword(prev => !prev),
    handleReset,
    goBack,
    goToLogin,
  };
};

export default useController;
