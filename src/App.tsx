import 'react-native-gesture-handler';
import React, {useState, useContext, useMemo} from 'react';
import {Alert, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import sdk from './utils/sdk';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import TodosScreen from './screens/TodosScreen';
import AppText from './components/AppText';
import AuthContext, {
  AppUserType,
  AuthContextType,
} from './components/AuthContext';

const SplashStack = createStackNavigator();
const ApplicationStack = createStackNavigator();

const Application: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await sdk.account.deleteSession('current');
      authContext.signOut();
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  return (
    <ApplicationStack.Navigator>
      {authContext.user === null ? (
        <>
          <ApplicationStack.Screen name="Login" component={LoginScreen} />
          <ApplicationStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <ApplicationStack.Screen
          name="Todos"
          component={TodosScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleSignOut}>
                <AppText>Logout 👋</AppText>
              </TouchableOpacity>
            ),
          }}
        />
      )}
    </ApplicationStack.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState<AppUserType | null>(null);
  const authContext: AuthContextType = useMemo(
    () => ({
      user,
      signIn: loggedInUser => setUser(loggedInUser),
      signOut: async () => setUser(null),
    }),
    [user, setUser],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <SplashStack.Navigator initialRouteName="Splash">
          <SplashStack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <SplashStack.Screen
            name="Application"
            component={Application}
            options={{headerShown: false}}
          />
        </SplashStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default App;
