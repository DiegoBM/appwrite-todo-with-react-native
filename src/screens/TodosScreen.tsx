import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, Alert} from 'react-native';

import AppText from '../components/AppText';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import sdk, {
  collectionId,
  useAbortableRequest,
  SDKAbortedRequestError,
  TodoDocumentListType,
  TodoDocumentType,
} from '../utils/sdk';

const fetchTodos = async (
  abortableRequest: <T>(request: Promise<T>) => Promise<T>,
  setTodos: (value: TodoDocumentType[]) => void,
) => {
  try {
    const todos = await abortableRequest<TodoDocumentListType>(
      sdk.database.listDocuments<TodoDocumentListType>(collectionId),
    );
    setTodos(todos.documents);
  } catch (error) {
    if (!(error instanceof SDKAbortedRequestError)) {
      Alert.alert('Error Fetching Todos', error.message);
    }
  }
};

const TodosScreen: React.FC = () => {
  const [todos, setTodos] = useState<TodoDocumentType[]>([]);
  const abortableRequest = useAbortableRequest();

  useEffect(() => {
    fetchTodos(abortableRequest, setTodos);
  }, [abortableRequest, setTodos]);

  const handleRefresh = () => fetchTodos(abortableRequest, setTodos);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <AppText style={[styles.separation, styles.header1]}>📝</AppText>
      <AppText style={[styles.header1]}>toTooooDoooos</AppText>
      <AddTodo onRefresh={handleRefresh} />
      {todos.map(todo => (
        <TodoItem key={todo.$id} todo={todo} onRefresh={handleRefresh} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separation: {
    marginBottom: 30,
  },
  header1: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TodosScreen;
