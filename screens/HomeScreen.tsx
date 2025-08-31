// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MapCard } from '../components/MapCard';
import { maps } from '../data/lineups';
import { theme } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>CS2 Lineups</Text>
        <Text style={styles.subtitle}>Master your utility usage</Text>
      </View>

      <FlatList
        data={maps.filter(map => map.active)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.mapList}
        columnWrapperStyle={styles.mapRow}
        renderItem={({ item }) => (
          <MapCard
            map={item}
            onPress={() => navigation.navigate('MapDetail', { 
              mapId: item.id, 
              mapName: item.displayName 
            })}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  mapList: {
    padding: theme.spacing.md,
  },
  mapRow: {
    justifyContent: 'space-between',
  },
});