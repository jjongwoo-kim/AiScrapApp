import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getScraps } from '../utils/storage';

const ScrapListScreen = () => {
  const [scraps, setScraps] = useState([]);

  useEffect(() => {
    const loadScraps = async () => {
      const data = await getScraps();
      setScraps(data);
    };
    loadScraps();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.url}>{item.url}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={scraps}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemContainer: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8 },
  url: { fontWeight: 'bold', marginBottom: 4 },
  content: { marginBottom: 4 },
  date: { fontSize: 10, color: '#888' }
});

export default ScrapListScreen;
