import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LineupAPI, URLFixer } from '../services/api/SupabaseClient';
import { supabase } from '../services/api/SupabaseClient';

export function SupabaseTest() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Get the Supabase URL for reference
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'Not found';
      setSupabaseUrl(url);
      
      // Test 1: Try to fetch lineups
      const lineups = await LineupAPI.getMapLineups('dust2');
      setTestResult(`✅ Connected! Found ${lineups?.length || 0} lineups for dust2`);
      
      // Test 2: Log the data
      console.log('Supabase test data:', lineups);
      
      // Test 3: Check if URLs are working
      if (lineups && lineups.length > 0) {
        const firstLineup = lineups[0];
        console.log('First lineup video URL:', firstLineup.videoUrl);
        console.log('First lineup thumbnail URL:', firstLineup.thumbnailUrl);
        
        // Test if the URLs contain the correct project reference
        const correctUrl = url.replace('https://', '').replace('.supabase.co', '');
        if (firstLineup.videoUrl && firstLineup.videoUrl.includes('your-project')) {
          setTestResult(`⚠️ URLs need updating! Current: ${firstLineup.videoUrl}\nCorrect project: ${correctUrl}`);
        }
      }
      
    } catch (error) {
      console.error('Supabase test error:', error);
      setTestResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fixUrls = async () => {
    setIsLoading(true);
    setTestResult('Fixing URLs...');
    
    try {
      const result = await URLFixer.fixPlaceholderUrls();
      setTestResult(`✅ URLs fixed! Updated ${result.updatedCount || 0} lineups`);
      
      // Test the connection again to show the fixed data
      setTimeout(() => {
        testConnection();
      }, 1000);
      
    } catch (error) {
      console.error('Error fixing URLs:', error);
      setTestResult(`❌ Failed to fix URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      <Text style={styles.result}>{testResult}</Text>
      {supabaseUrl && (
        <Text style={styles.urlInfo}>
          Supabase URL: {supabaseUrl}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Testing...' : 'Test Again'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.fixButton]} 
          onPress={fixUrls}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Fixing...' : 'Fix URLs'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  result: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 15,
  },
  urlInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
  },
  fixButton: {
    backgroundColor: '#FF6B35',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
