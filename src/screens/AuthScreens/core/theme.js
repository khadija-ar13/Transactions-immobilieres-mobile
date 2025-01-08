import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000080', // Bleu marine pour le texte
    primary: '#0000FF', // Bleu pur pour la couleur principale
    secondary: '#87CEEB', // Bleu ciel pour les éléments secondaires
    error: '#4682B4', // Bleu acier pour les erreurs (optionnel, non traditionnel)
  },
}
