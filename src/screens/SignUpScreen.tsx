import React, {useState, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppwriteOauth from 'react-native-appwrite-oauth';

import AuthContext, {AppUserType} from '../components/AuthContext';
import sdk, {
  useGithub,
  useAbortableRequest,
  SDKAbortedRequestError,
} from '../utils/sdk';
import AppText from '../components/AppText';

const SignUpScreen: React.FC = () => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const abortableRequest = useAbortableRequest();

  const handleLink = (): void => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    try {
      const user = await abortableRequest<AppUserType>(
        sdk.account.create<AppUserType>(email, password, name),
      );
      await sdk.account.createSession(email, password);
      authContext.signIn(user);
    } catch (error) {
      if (!(error instanceof SDKAbortedRequestError)) {
        Alert.alert('Sign Up Error', error.message);
      }
    }
  };

  const handleOAuthSuccess = useCallback(async () => {
    setAuthenticating(false);
    try {
      const user = await abortableRequest<AppUserType>(
        sdk.account.get<AppUserType>(),
      );
      authContext.signIn(user);
    } catch (error) {
      if (!(error instanceof SDKAbortedRequestError)) {
        Alert.alert('Error Getting Account Data', error.message);
      }
    }
  }, [authContext, abortableRequest]);

  const handleOAuthFailure = useCallback((message: string) => {
    setAuthenticating(false);
    Alert.alert('OAuth Error', message);
  }, []);

  const isDisabled = (): boolean =>
    name === '' || email === '' || password === '';

  return (
    <View style={styles.screen}>
      <AppText style={styles.heading}>Sign Up</AppText>
      <AppText>
        Already have an account?{' '}
        <AppText style={styles.link} onPress={handleLink}>
          Login
        </AppText>
      </AppText>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Name"
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, styles.lastItem]}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <View style={styles.button}>
        <Button
          title="Sign Up"
          disabled={isDisabled()}
          onPress={handleSignUp}
        />
      </View>
      {useGithub ? (
        <>
          <AppwriteOauth
            sdk={sdk}
            authenticating={authenticating}
            provider="github"
            scopes={['user:email']}
            onSuccess={handleOAuthSuccess}
            onFailure={handleOAuthFailure}
          />
          <View style={styles.button}>
            <Button
              title="Github Sign In"
              onPress={() => setAuthenticating(true)}
            />
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  input: {
    fontSize: 18,
    marginTop: 15,
    borderBottomWidth: 1,
    width: '80%',
    ...Platform.select({
      android: {},
      ios: {
        paddingHorizontal: 5,
        paddingVertical: 10,
      },
    }),
  },
  lastItem: {
    marginBottom: 25,
  },
  button: {
    marginBottom: 10,
  },
});

export default SignUpScreen;
