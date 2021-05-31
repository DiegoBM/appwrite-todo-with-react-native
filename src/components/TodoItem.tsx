import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import AppText from '../components/AppText';
import sdk, {
  collectionId,
  useAbortableRequest,
  SDKAbortedRequestError,
  TodoDocumentType,
} from '../utils/sdk';

type TodoItemProps = {
  todo: TodoDocumentType;
  onRefresh: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({todo, onRefresh}) => {
  const [checked, setChecked] = useState(todo.isComplete);
  const abortableRequest = useAbortableRequest();

  const handleValueChange = async (newValue: boolean) => {
    setChecked(newValue);

    try {
      const newTodo = {...todo, isComplete: newValue};
      await abortableRequest(
        sdk.database.updateDocument(
          collectionId,
          todo.$id,
          newTodo,
          todo.$permissions.read,
          todo.$permissions.write,
        ),
      );
      onRefresh();
    } catch (error) {
      if (!(error instanceof SDKAbortedRequestError)) {
        Alert.alert('Error Updating Todo', error.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await abortableRequest(
        sdk.database.deleteDocument(collectionId, todo.$id),
      );
      onRefresh();
    } catch (error) {
      if (!(error instanceof SDKAbortedRequestError)) {
        Alert.alert('Error Deleting Todo', error.message);
      }
    }
  };

  return (
    <View style={styles.todoItem}>
      <View style={styles.dataContainer}>
        <CheckBox
          style={styles.checkbox}
          boxType="square"
          value={checked}
          onValueChange={handleValueChange}
        />
        <View style={styles.contentContainer}>
          <AppText style={todo.isComplete ? [styles.completed] : []}>
            {todo.content}
          </AppText>
        </View>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <AppText style={styles.deleteIcon}>❌</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.select({android: 0, ios: 5}),
  },
  dataContainer: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    ...Platform.select({
      android: {},
      ios: {
        marginRight: 10,
        width: 18,
        height: 18,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  deleteIcon: {
    fontSize: 14,
    lineHeight: 32,
    width: 32,
    textAlign: 'center',
  },
});

export default TodoItem;
