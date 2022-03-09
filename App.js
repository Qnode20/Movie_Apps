import 'react-native-gesture-handler';
import React from 'react';
import AppLoading from 'expo-app-loading';
import navigation from './config/navigation';
import MoviesList from './Screens/MoviesList';
import { LogBox, Easing } from 'react-native';
import MoviesListDetails from './Screens/MoviesListDetails';
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  SourceSansPro_400Regular_Italic,
  SourceSansPro_700Bold,
} from '@expo-google-fonts/source-sans-pro';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
} from '@expo-google-fonts/playfair-display';
LogBox.ignoreAllLogs(true);

const Stack = createSharedElementStackNavigator();
const options = {
  gestureEnabled: false,
  headerBackTitleVisible: false,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 1400, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: 'timing',
      config: { duration: 400, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    SourceSansPro_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MoviesList"
        screenOptions={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: false,
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'PlayfairDisplay_400Regular',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen name="Latest Movies" component={MoviesList} />
        {navigation.map((item) => (
          <Stack.Screen
            key={item.name}
            name={item.name}
            component={item.component}
          />
        ))}
        <Stack.Screen
          name="MoviesListDetails"
          component={MoviesListDetails}
          options={() => options}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
