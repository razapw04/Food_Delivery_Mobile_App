export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Menu: undefined;
  Orders: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  OnboardingOne: undefined;
  LocationAccess: undefined;
  MainTabs: undefined | {screen?: keyof MainTabParamList};
  /** Kept for deep links / older navigations — prefer MainTabs */
  Home: undefined;
  Search: undefined;
  Menu: undefined;
  OrderHistory: undefined;
  Branches: undefined;
  ChooseLocation: undefined;
  AddAddress: undefined;
};
