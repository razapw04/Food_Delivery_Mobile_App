import {Text, TextInput} from 'react-native';
import {fontFamily, typography} from './typography';

type TextWithDefaults = typeof Text & {
  defaultProps?: {
    style?: object | object[];
    maxFontSizeMultiplier?: number;
  };
};

type TextInputWithDefaults = typeof TextInput & {
  defaultProps?: {
    style?: object | object[];
    maxFontSizeMultiplier?: number;
  };
};

/** Apply Inter + sane font scaling defaults to all Text & TextInput. */
export const setupFonts = () => {
  const TextComponent = Text as TextWithDefaults;
  const TextInputComponent = TextInput as TextInputWithDefaults;

  TextComponent.defaultProps = {
    ...TextComponent.defaultProps,
    maxFontSizeMultiplier: typography.maxFontSizeMultiplier,
    style: [{fontFamily}, TextComponent.defaultProps?.style],
  };

  TextInputComponent.defaultProps = {
    ...TextInputComponent.defaultProps,
    maxFontSizeMultiplier: typography.maxFontSizeMultiplier,
    style: [{fontFamily}, TextInputComponent.defaultProps?.style],
  };
};
