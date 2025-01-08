import React, { useState } from 'react';
import AuthContext from './src/AuthContext';
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "react-native-rapi-ui";
import { Provider } from 'react-native-paper';
import { theme } from './src/screens/AuthScreens/core/theme';
import { MenuProvider } from 'react-native-popup-menu';


export default function App() {
  const [user, setUser] = useState(null);

  return (
    <MenuProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <Provider theme={theme}>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </Provider>
      </AuthContext.Provider>
    </MenuProvider>
  );
}
