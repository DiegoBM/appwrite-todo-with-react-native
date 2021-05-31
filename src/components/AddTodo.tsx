import React, {useState, useContext} from 'react';
import {StyleSheet, View, TextInput, Alert, Platform} from 'react-native';

import sdk, {
  collectionId,
  useAbortableRequest,
  SDKAbortedRequestError,
} from '../utils/sdk';
import AuthContext from '../components/AuthContext';

type AddTodoProps = {
  onRefresh: () => void;
};

const AddTodo: React.FC<AddTodoProps> = ({onRefresh}) => {
  const [value, setValue] = useState('');
  const authContext = useContext(AuthContext);
  const abortableRequest = useAbortableRequest();

  const handleSubmit = async () => {
    const $id = authContext.user?.$id;

    if (value !== '') {
      setValue('');

      try {
        await abortableRequest(
          sdk.database.createDocument(
            collectionId,
            {content: value, isComplete: false},
            [`user:${$id}`],
            [`user:${$id}`],
          ),
        );
        onRefresh();
      } catch (error) {
        if (!(error instanceof SDKAbortedRequestError)) {
          Alert.alert('Error Creating Todo', error.message);
        }
      }
    }
  };

  return (
    <View style={[styles.card, styles.separation]}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder="🤔  What to do today?"
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  separation: {
    marginBottom: 30,
  },
  input: {
    ...Platform.select({
      android: {},
      ios: {
        paddingHorizontal: Platform.select({android: 0, ios: 5}),
        paddingVertical: Platform.select({android: 0, ios: 15}),
      },
    }),
  },
});

export default AddTodo;
