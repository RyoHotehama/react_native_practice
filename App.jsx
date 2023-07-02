import { Button, FlatList, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState, useCallback } from 'react';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight;

export default function App() {
  const [items, setItems] = useState(
    {
      todo: [],
      currentIndex: 0,
      inputText: '',
    }
  );

  const handleChange = useCallback((text) => {
    setItems((prevItems) => ({
      ...prevItems,
      inputText: text,
    }));
  }, [])

  const onAddItem = useCallback(() => {
    setItems((prevItems) => {
      const title = items.inputText
      if (title === '') {
        return prevItems
      }
      const index = prevItems.currentIndex + 1
      const newTodo = { index: index, title: title, done: false}
      if (prevItems.todo) {
        const todo = [...prevItems.todo, newTodo]
        return {
          todo: todo,
          currentIndex: index,
          inputText: ''
        }
      }
      const todo = [newTodo]
      return {
        todo: todo,
        currentIndex: index,
        inputText: ''
      }
    })
  }, [items])

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
        <Text>Filterがここに配置されます</Text>
      </View>
      <FlatList
        style={styles.todolist}
        data={items.todo}
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
