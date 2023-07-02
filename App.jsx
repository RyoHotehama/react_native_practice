import { FlatList, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight;

export default function App() {
  const [items] = useState(
    {
      todo: [
        {index: 1, title: '原稿を書く', done: false},
        {index: 2, title: '犬の散歩をする', done: false},
      ],
      currentIndex: 2
    }
  );
  return (
    <View style={styles.container}>
      <View style={styles.filter}>
        <Text>Filterがここに配置されます</Text>
      </View>
      <ScrollView style={styles.todolist}>
        <FlatList
          data={items.todo}
          renderItem={({item}) => <Text>{item.title}</Text>}
          keyExtractor={(item) => 'todo_' + item.index}
        />
      </ScrollView>
      <View style={styles.input}>
        <Text>テキスト入力がここに配置されます</Text>
      </View>
    </View>
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
    height: 30,
  },
});
