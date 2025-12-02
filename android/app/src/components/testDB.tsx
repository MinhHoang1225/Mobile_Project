import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { resetDatabase } from '../database/db';
SQLite.enablePromise(true);

export default function TestDB() {
  const [tables, setTables] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadTables = async () => {
      try {
        const db = await SQLite.openDatabase({
          name: 'myDatabase.db',
          location: 'default',
        });

        setStatus('DB opened');

        db.transaction(tx => {
          tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
            [],
            (_, results) => {
              const list = [];
              const rows = results.rows;
              for (let i = 0; i < rows.length; i++) {
                list.push(rows.item(i).name);
              }
              setTables(list);
            },
            (_, error) => {
              console.log('Query error:', error);
              return true;
            }
          );
        });
      } catch (err) {
        console.error(err);
        setStatus('Error: ' + err);
      }
    };

    loadTables();
  }, []);

  return (
    <View>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📌 Tables in Database</Text>
      <Text>Status: {status}</Text>

      {tables.map((table, idx) => (
        <Text key={idx} style={styles.item}>
          {table}
        </Text>
      ))}


    </ScrollView>
    
      <Button
  title="Reset Database"
  onPress={async () => {
    await resetDatabase();
  }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  item: { fontSize: 16, marginVertical: 2 },
});
