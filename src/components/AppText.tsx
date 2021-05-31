import React from 'react';
import {StyleSheet, Text, Platform, TextProps} from 'react-native';

const AppText: React.FC<TextProps> = ({children, style, ...rest}) => {
  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({ios: 'Avenir', android: 'System'}),
    fontSize: 18,
  },
});

export default AppText;
