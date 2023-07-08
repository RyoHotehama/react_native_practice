import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight;

const TODO = '@todoapp.todo';

export default function App() {
  useEffect(() => {
    loadTodo()
  }, [])

  const loadTodo = useCallback(async() => {
    try {
      const todoString = await AsyncStorage.getItem(TODO)
      if (todoString) {
        const todo = JSON.parse(todoString)
        const currentIndex = todo.length
        setItems((prevItems) => ({
          ...prevItems,
          todo: todo,
          currentIndex: currentIndex
        }));
      }
    } catch (e) {
      console.log(e)
    }
  }, [])
  const [items, setItems] = useState(
    {
      todo: [],
      currentIndex: 0,
      inputText: '',
      filterText: '',
    }
  );

  const saveTodo = useCallback(async(todo) => {
    try {
      const todoString = JSON.stringify(todo)
      await AsyncStorage.setItem(TODO, todoString)
    } catch (e) {
      console.log(e)
    }
  }, [])

  const handleChange = useCallback((text) => {
    setItems((prevItems) => ({
      ...prevItems,
      inputText: text,
    }));
  }, [])

  const handleFilterChange = useCallback((text) => {
    setItems((prevItems) => ({
      ...prevItems,
      filterText: text || '',
    }));
  }, [])

  const onAddItem = useCallback(() => {
    setItems((prevItems) => {
      const title = prevItems.inputText
      if (title === '') {
        return prevItems;
      }
      const index = prevItems.currentIndex + 1;
      const newTodo = { index: index, title: title, done: false };
      const todo = [...prevItems.todo, newTodo];
      saveTodo(todo);
      return {
        ...prevItems,
        todo: todo,
        currentIndex: index,
        inputText: ''
      };
    });
  }, []);

  const filterText = items.filterText
  let filteredTodo = items.todo;
  if (filterText !== '') {
    filteredTodo = filteredTodo.filter(t => t.title && t.title.includes(filterText));
}

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.title}</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.filter}>
        <TextInput
          onChangeText={handleFilterChange}
          value={items.filterText}
          style={styles.inputText}
          placeholder='Type filter text'
        />
      </View>
      <FlatList
        style={styles.todolist}
        data={filteredTodo}
        renderItem={renderItem}
        keyExtractor={(item) => 'todo_' + item.index}
      />
      <View style={styles.input}>
        <TextInput
          onChangeText={handleChange}
          value={items.inputText}
          style={styles.inputText}
        />
        <TouchableOpacity onPress={onAddItem} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1,
  },
  input: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  inputText: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#841584',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
