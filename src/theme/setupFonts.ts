import {Text, TextInput} from 'react-native';
import {fontFamily} from './typography';

type TextWithDefaults = typeof Text & {
  defaultProps?: {style?: object | object[]};
};

type TextInputWithDefaults = typeof TextInput & {
  defaultProps?: {style?: object | object[]};
};

/** Apply Inter (SF Pro–like sans) to all Text & TextInput by default. */
export const setupFonts = () => {
  const TextComponent = Text as TextWithDefaults;
  const TextInputComponent = TextInput as TextInputWithDefaults;

  TextComponent.defaultProps = {
    ...TextComponent.defaultProps,
    style: [{fontFamily}, TextComponent.defaultProps?.style],
  };

  TextInputComponent.defaultProps = {
    ...TextInputComponent.defaultProps,
    style: [{fontFamily}, TextInputComponent.defaultProps?.style],
  };
};
