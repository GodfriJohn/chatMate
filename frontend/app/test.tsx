import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';  // Adjust if needed

export default function TestSupabase() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log('Testing Supabase connection...');
      
      // Test the messages table specifically
      const { data, error } = await supabase
        .from('messages')  // Using your actual table name
        .select('*')
        .limit(5);

      console.log('Supabase response:', { data, error });
      console.log('Data length:', data?.length);
      console.log('Error details:', error);

      if (error) {
        console.error('Supabase error:', error);
        setError(`${error.message} (Code: ${error.code}, Details: ${error.details})`);
      } else {
        setData(data || []);
        console.log('Data set to state:', data);
      }

      setLoading(false);
    }

    // Also test if we can even access the table structure
    async function testTableAccess() {
      try {
        const { data: countData, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true });
        
        console.log('Table access test:', { countData, countError });
        
        if (countError) {
          console.log('Cannot access table:', countError.message);
        } else {
          console.log('Table is accessible');
        }
      } catch (e) {
        console.log('Table access failed:', e);
      }
    }

    fetchData();
    testTableAccess();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading data from Supabase...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Supabase Data</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data && <Text style={styles.data}>{JSON.stringify(data, null, 2)}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  error: { color: 'red', marginBottom: 20 },
  data: { fontFamily: 'monospace' },
});
