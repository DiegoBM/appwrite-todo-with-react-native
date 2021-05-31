import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Button, Image, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import sdk from '../utils/sdk';
import AppText from '../components/AppText';
import AuthContext, {AppUserType} from '../components/AuthContext';

const ReactIcon: React.FC = () => (
  <Image
    style={styles.reactIcon}
    source={require('../assets/images/react.png')}
  />
);
const AppwriteIcon: React.FC = () => (
  <Image
    style={styles.appwriteIcon}
    source={require('../assets/images/appwrite.png')}
  />
);

const SplashScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const getAccount = async () => {
      if (loading) {
        // Note: Update the loading state before changing the context to avoid
        // unnecesary re-renders and re-executions of this effect
        try {
          // We can't go back from this screen so it'd be pointless to make it
          // cancellable, since the component won't be unmounted until we leave
          // the application
          const userData = await sdk.account.get<AppUserType>();
          setLoading(false);
          authContext.signIn(userData);
        } catch (error) {
          setLoading(false);
          authContext.signOut();
        }
      }
    };

    getAccount();
  }, [loading, authContext, setLoading]);

  return (
    <View style={styles.screen}>
      <AppText style={[styles.section, styles.header3]}>Introducing</AppText>
      <AppText style={[styles.header1]}>toTooooDoooo</AppText>
      <AppText style={[styles.section, styles.header2]}>
        A Simple To-do App built with <AppwriteIcon /> Appwrite and{' '}
        <ReactIcon /> React Native
      </AppText>
      {loading ? (
        <ActivityIndicator size="large" color="#206fce" />
      ) : (
        <View style={styles.button}>
          <Button
            title="Get Started"
            disabled={loading}
            onPress={() => navigation.navigate('Application')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 32,
  },
  header1: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 30,
  },
  header3: {
    fontSize: 20,
  },
  button: {
    width: '60%',
    height: 40,
  },
  reactIcon: {
    width: 23,
    height: 20,
  },
  appwriteIcon: {
    width: 30,
    height: 20,
  },
});

export default SplashScreen;
