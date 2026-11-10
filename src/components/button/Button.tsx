import React, {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {styles} from './sytles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  iconDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: FC<ButtonProps> = ({
  title,
  onPress,
  icon,
  iconDisabled = false,
  style,
}) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.buttonText}>{title}</Text>

        {!iconDisabled && icon && (
          <View style={styles.iconContainer}>
            <Image source={icon} style={styles.icon} />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Button;
