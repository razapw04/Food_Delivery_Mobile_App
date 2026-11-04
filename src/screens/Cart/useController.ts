import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCart} from '../../context/CartContext';
import {useCatalog} from '../../context/CatalogContext';
import {useLocation} from '../../context/LocationContext';
import {useOrder} from '../../context/OrderContext';
import type {RootStackParamList} from '../../types/navigation';

const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

type CartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

const useController = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const {items, itemCount, cartTotal, updateQuantity, removeItem, clearCart} =
    useCart();
  const {deliveryAddress, isLocating} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {popularMenuItems} = useCatalog();

  const isPickup = orderMode === 'pickup';
  const headerLabel = isPickup ? 'Pickup from' : 'Deliver to';
  const headerValue = isPickup
    ? selectedBranch?.name ?? 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

  const handleBack = () => {
    navigation.navigate('Menu');
  };

  const handleEditItem = (productId: string) => {
    navigation.navigate('ProductDetail', {itemId: productId});
  };

  const openProduct = (itemId: string) => {
    navigation.navigate('ProductDetail', {itemId});
  };

  const goToMenu = () => {
    navigation.navigate('Menu');
  };

  const goToPlaceOrder = () => {
    navigation.navigate('PlaceOrder');
  };

  return {
    items,
    itemCount,
    cartTotal,
    formatPrice,
    headerLabel,
    headerValue,
    suggestedProducts: popularMenuItems,
    handleBack,
    handleEditItem,
    openProduct,
    goToMenu,
    goToPlaceOrder,
    updateQuantity,
    removeItem,
    clearCart,
  };
};

export default useController;
