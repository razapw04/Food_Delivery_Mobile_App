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
  ForgotPassword: undefined;
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
  PlaceOrder: undefined;
  CardPayment: {
    amount: number;
    deliveryInstructions?: string;
  };
  Voucher: undefined;
  Favorites: undefined;
  SavedAddresses: undefined;
  Notifications: undefined;
  AdminOrders: undefined;
  AdminProducts: undefined;
  AdminProductForm: {productId?: string} | undefined;
  AdminRevenue: undefined;
  AdminAdmins: undefined;
  AdminAdminForm: {email?: string} | undefined;
  AdminPriceRequest: {productId: string};
  AdminPriceApprovals: undefined;
};
