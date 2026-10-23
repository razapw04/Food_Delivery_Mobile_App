import React, {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import { styles } from './sytles';


interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  iconDisabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  onPress,
  icon,
  iconDisabled = false,
}) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}>
      
      <View style={styles.content}>
        <Text style={styles.buttonText}>
          {title}
        </Text>

        {!iconDisabled && icon && (
          <View style={styles.iconContainer}>
            <Image
              source={icon}
              style={styles.icon}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Button;
