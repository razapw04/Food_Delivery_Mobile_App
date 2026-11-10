import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFavorites} from '../../../context/FavoritesContext';
import type {RootStackParamList} from '../../../types/navigation';

type FavoritesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Favorites'
>;

const useController = () => {
  const navigation = useNavigation<FavoritesNavigationProp>();
  const {favoriteItems, toggleFavorite} = useFavorites();

  const goBack = () => {
    navigation.goBack();
  };

  const openProduct = (itemId: string) => {
    navigation.navigate('ProductDetail', {itemId});
  };

  return {
    favoriteItems,
    toggleFavorite,
    goBack,
    openProduct,
  };
};

export default useController;
