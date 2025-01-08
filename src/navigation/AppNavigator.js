import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import Home from "../screens/Home";
import AllAnnonces from "../screens/AllAnnonceScreens/AllAnnonces";
import DetailsScreen from '../screens/AllAnnonceScreens/DetailsScreen';
import AjouterAnnonce from "../screens/AjouterAnnonce";
import Profile from "../screens/Profile";
import Demande from "../screens/MyDemandes/Demande";
import DetailsMyDemande from '../screens/MyDemandes/DetailsMyDemande';
import MyAnnonces from "../screens/MyAnnonceScreens/MyAnnonces";
import DetailsMyAnnonces from '../screens/MyAnnonceScreens/DetailsMyAnnonces';
import EditAnnonce from '../screens/MyAnnonceScreens/EditAnnonce';

import StartScreen from "../screens/AuthScreens/screens/StartScreen";
import LoginScreen from "../screens/AuthScreens/screens/LoginScreen";
import RegisterScreen from "../screens/AuthScreens/screens/RegisterScreen";
import ResetPasswordScreen from "../screens/AuthScreens/screens/ResetPasswordScreen";
import Dashboard from "../screens/AuthScreens/screens/Dashboard";



const MainStack = createNativeStackNavigator();
const Main = () => {
  const navigation = useNavigation();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="person-outline" size={25} color={"#000000"} />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <Menu>
            <MenuTrigger>
              <Icon name="menu-outline" size={25} color={"#000000"} />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{ backgroundColor: '#f5f5f5' }}
            >
              <MenuOption onSelect={() => navigation.navigate('Home')}>
                <View style={styles.optionContainer}>
                  <Icon name="home-outline" size={20} color={"#000000"} />
                  <Text style={styles.optionText}>Acceuil</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('AjouterAnnonce')}>
                <View style={styles.optionContainer}>
                  <Icon name="add-circle-outline" size={20} color={"#000000"} />
                  <Text style={styles.optionText}>Ajouter Annonce</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('Demande')}>
                <View style={styles.optionContainer}>
                  <Icon name="list-outline" size={20} color={"#000000"} />
                  <Text style={styles.optionText}>Mes Demandes</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('MyAnnonces')}>
                <View style={styles.optionContainer}>
                  <Icon name="megaphone-outline" size={20} color={"#000000"} />
                  <Text style={styles.optionText}>Mes Annonces</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('AllAnnonces')}>
                <View style={styles.optionContainer}>
                  <Icon name="grid-outline" size={20} color={"#000000"} />
                  <Text style={styles.optionText}>Voir les Annonces</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ),
      }}
      initialRouteName="StartScreen"
    >
      <MainStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <MainStack.Screen name="Home" component={Home} />

      <MainStack.Screen name="AllAnnonces" component={AllAnnonces} />
      <MainStack.Screen name="Details" component={DetailsScreen} />

      <MainStack.Screen name="MyAnnonces" component={MyAnnonces} />
      <MainStack.Screen name="DetailsMyAnnonces" component={DetailsMyAnnonces} />
      <MainStack.Screen name="EditAnnonce" component={EditAnnonce} />

      <MainStack.Screen name="Demande" component={Demande} />
      <MainStack.Screen name="DetailsMyDemande" component={DetailsMyDemande} />

      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="AjouterAnnonce" component={AjouterAnnonce} />
    </MainStack.Navigator>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});


export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};