// App.tsx
import React, { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load essential assets
        await Asset.loadAsync([
          require('./assets/maps/de_dust2.jpg'),
        ]);
        
        // Warm up image cache
        Image.prefetch([
          'https://cdn.example.com/essential-lineup-1.jpg',
        ]);
        
      } finally {
        setIsReady(true);
      }
    }
    
    prepare();
  }, []);

  if (!isReady) return null;
  
  return <AppNavigator />;
}