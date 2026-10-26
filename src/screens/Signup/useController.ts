import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../context/AuthContext';
import type {RootStackParamList} from '../../types/navigation';

type SignupNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;
const PHONE_REGEX = /^\+?[\d\s-]{10,15}$/;

const useController = () => {
  const navigation = useNavigation<SignupNavigationProp>();
  const {signup} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => {
      if (!prev[field]) {
        return prev;
      }
      const next = {...prev};
      delete next[field];
      return next;
    });
    if (formError) {
      setFormError('');
    }
  };

  const validate = (): boolean => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const errors: FieldErrors = {};

    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (!NAME_REGEX.test(trimmedName)) {
      errors.name = 'Name can only contain letters, spaces, and hyphens.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!trimmedPhone) {
      errors.phone = 'Mobile number is required.';
    } else {
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        errors.phone = 'Mobile number must be 10 to 15 digits.';
      } else if (!PHONE_REGEX.test(trimmedPhone)) {
        errors.phone = 'Please enter a valid mobile number.';
      }
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      errors.password = 'Password must include letters and numbers.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    setFormError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    navigation.replace('Login');
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    name,
    email,
    phone,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    isSubmitting,
    setName: (value: string) => {
      setName(value);
      clearFieldError('name');
    },
    setEmail: (value: string) => {
      setEmail(value);
      clearFieldError('email');
    },
    setPhone: (value: string) => {
      setPhone(value);
      clearFieldError('phone');
    },
    setPassword: (value: string) => {
      setPassword(value);
      clearFieldError('password');
      if (confirmPassword) {
        clearFieldError('confirmPassword');
      }
    },
    setConfirmPassword: (value: string) => {
      setConfirmPassword(value);
      clearFieldError('confirmPassword');
    },
    handleSignup,
    goToLogin,
  };
};

export default useController;
