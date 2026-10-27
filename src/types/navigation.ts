export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Branches: undefined;
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
  Explore: undefined;
  Menu: undefined;
  OrderHistory: undefined;
  Branches: undefined;
  ChooseLocation: undefined;
  AddAddress: undefined;
  ProductDetail: {itemId: string};
  Cart: undefined;
};
