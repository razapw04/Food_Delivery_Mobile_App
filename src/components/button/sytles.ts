import { StyleSheet } from 'react-native';
import { colors, layout, typography } from '../../theme';

export const styles = StyleSheet.create({
  button: {
    width: layout.buttonWidth,
    height: layout.buttonHeight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  buttonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  content: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
   },
   iconContainer: { 
     borderRadius: 16, 
     backgroundColor: colors.iconBackground,
      alignItems: 'center', 
      justifyContent: 'center', 
    }, icon: {
       width: 32,
        height: 32,
         resizeMode: 'contain', 
        },
});