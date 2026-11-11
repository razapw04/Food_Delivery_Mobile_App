import type {NavigatorScreenParams} from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Branches: undefined;
  Orders: undefined;
};

export type CashierTabParamList = {
  CashierOrders: undefined;
  CashierPOS: {openOrderId?: string} | undefined;
  CashierOrderHistory: undefined;
  CashierSales: undefined;
  CashierInventory: undefined;
};

export type KitchenTabParamList = {
  KitchenOrders: undefined;
  KitchenHistory: undefined;
  KitchenSales: undefined;
  KitchenInventory: undefined;
};

export type AdminTabParamList = {
  AdminRevenue: undefined;
  AdminLiveSales: undefined;
  AdminBranches: undefined;
  AdminOrders: undefined;
  AdminAdmins: undefined;
  AdminProducts: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OnboardingOne: undefined;
  LocationAccess: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
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
  Profile: undefined;
  Feedback: undefined;
  ContactUs: undefined;
  AdminTabs: NavigatorScreenParams<AdminTabParamList> | undefined;
  AdminProductForm: {productId?: string} | undefined;
  AdminAdminForm: {email?: string; role?: 'manager' | 'cashier' | 'kitchen'} | undefined;
  AdminOrders: undefined;
  AdminBranchForm:
    | {
        branchId?: string;
        latitude?: number;
        longitude?: number;
        pickedAddress?: string;
        locationConfirmed?: boolean;
      }
    | undefined;
  AdminBranchMapPick:
    | {
        branchId?: string;
        latitude?: number;
        longitude?: number;
        addressHint?: string;
      }
    | undefined;
  AdminPriceApprovals: undefined;
  AdminInventoryRequests: undefined;
  AdminPriceRequest: {productId: string};
  AdminTopSelling:
    | {
        branchId?: string;
        period?: 'today' | 'week' | 'month' | 'year' | 'custom';
      }
    | undefined;
  CashierTabs: NavigatorScreenParams<CashierTabParamList> | undefined;
  KitchenTabs: NavigatorScreenParams<KitchenTabParamList> | undefined;
  /** Kept for older navigations — prefer KitchenTabs */
  KitchenOrders: undefined;
};
