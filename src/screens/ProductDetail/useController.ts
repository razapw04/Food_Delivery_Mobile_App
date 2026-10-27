import {useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCart} from '../../context/CartContext';
import {useLocation} from '../../context/LocationContext';
import {useOrder} from '../../context/OrderContext';
import type {RootStackParamList} from '../../types/navigation';
import {getMenuItemById} from '../Menu/model';

type VariationKey = 'regular' | 'large';

type Topping = {
  id: string;
  name: string;
  price: number;
};

export const TOPPINGS: Topping[] = [
  {id: 'cheese', name: 'Extra Cheese', price: 99},
  {id: 'jalapeno', name: 'Jalapeños', price: 49},
  {id: 'olives', name: 'Olives', price: 79},
  {id: 'mushroom', name: 'Mushroom', price: 89},
];

const parsePriceValue = (price: string) =>
  Number(price.replace(/[^\d]/g, '')) || 0;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

type ProductDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const useController = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const {deliveryAddress, isLocating} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {addItem} = useCart();

  const item = getMenuItemById(route.params.itemId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] =
    useState<VariationKey | null>(null);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);

  const isPickup = orderMode === 'pickup';
  const headerLabel = isPickup ? 'Pickup from' : 'Deliver to';
  const headerValue = isPickup
    ? selectedBranch?.name ?? 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

  const stickyBottomPad = Math.max(insets.bottom, 16) + 8;

  const variations = useMemo(() => {
    if (!item) {
      return [];
    }
    const regularValue = parsePriceValue(item.price);
    const largeValue = Math.round(regularValue * 1.35);
    return [
      {
        key: 'regular' as const,
        label: 'Regular',
        price: formatPrice(regularValue),
        value: regularValue,
      },
      {
        key: 'large' as const,
        label: 'Large',
        price: formatPrice(largeValue),
        value: largeValue,
      },
    ];
  }, [item]);

  const selectedVariationOption =
    variations.find(v => v.key === selectedVariation) ?? null;

  const toppingsTotal = TOPPINGS.filter(topping =>
    selectedToppingIds.includes(topping.id),
  ).reduce((sum, topping) => sum + topping.price, 0);

  const unitPrice = (selectedVariationOption?.value ?? 0) + toppingsTotal;
  const totalPrice = unitPrice * quantity;
  /** Base product price stays fixed; Add button uses totalPrice. */
  const displayPrice = item?.price ?? '';

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenCart = () => {
    navigation.navigate('Cart');
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const selectVariation = (key: VariationKey) => {
    setSelectedVariation(key);
    setSelectedToppingIds([]);
  };

  const toggleTopping = (id: string) => {
    setSelectedToppingIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToBag = () => {
    if (!item || !selectedVariationOption) {
      Alert.alert('Select variation', 'Please choose a variation first.');
      return;
    }

    const selectedToppings = TOPPINGS.filter(topping =>
      selectedToppingIds.includes(topping.id),
    ).map(topping => topping.name);

    addItem({
      productId: item.id,
      name: item.name,
      image: item.image,
      variation: selectedVariationOption.label,
      toppings: selectedToppings,
      unitPrice,
      quantity,
    });

    navigation.navigate('Cart');
  };

  return {
    item,
    headerLabel,
    headerValue,
    stickyBottomPad,
    isFavorite,
    quantity,
    selectedVariation,
    selectedToppingIds,
    variations,
    selectedVariationOption,
    toppings: TOPPINGS,
    displayPrice,
    totalPrice,
    formatPrice,
    handleBack,
    handleOpenCart,
    toggleFavorite,
    selectVariation,
    toggleTopping,
    decreaseQuantity,
    increaseQuantity,
    handleAddToBag,
  };
};

export default useController;
