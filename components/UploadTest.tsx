import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { FileUploader } from './FileUploader';
import { SupabaseStorageService } from '../services/storage/SupabaseStorageService';

const storageService = new SupabaseStorageService();

export function UploadTest() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    type: string;
    timestamp: string;
  }>>([]);

  const handleUploadComplete = (url: string, type: 'video' | 'thumbnail' | 'gif') => {
    const newFile = {
      url,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    
    Alert.alert(
      'Upload Success!',
      `${type} uploaded successfully!\nURL: ${url.substring(0, 50)}...`,
      [
        { text: 'Copy URL', onPress: () => console.log('URL:', url) },
        { text: 'OK' }
      ]
    );
  };

  const testPublicUrl = async () => {
    try {
      // Test getting a public URL (replace with actual file name)
      const testUrl = storageService.getPublicUrl('lineup-videos', 'test-file.mp4');
      Alert.alert('Test URL', `Generated URL: ${testUrl}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate test URL');
    }
  };

  const listFiles = async () => {
    try {
      const files = await storageService.listFiles('lineup-videos');
      Alert.alert('Files in bucket', `Found ${files.length} files:\n${files.join('\n')}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to list files');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload System Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Video</Text>
        <FileUploader
          type="video"
          lineupId="test-lineup-123"
          onUploadComplete={handleUploadComplete}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Thumbnail</Text>
        <FileUploader
          type="thumbnail"
          lineupId="test-lineup-123"
          onUploadComplete={handleUploadComplete}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload GIF</Text>
        <FileUploader
          type="gif"
          lineupId="test-lineup-123"
          onUploadComplete={handleUploadComplete}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Functions</Text>
        <Text style={styles.testButton} onPress={testPublicUrl}>
          Test Public URL Generation
        </Text>
        <Text style={styles.testButton} onPress={listFiles}>
          List Files in Bucket
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uploaded Files</Text>
        {uploadedFiles.length === 0 ? (
          <Text style={styles.emptyText}>No files uploaded yet</Text>
        ) : (
          uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Text style={styles.fileType}>{file.type}</Text>
              <Text style={styles.fileUrl}>{file.url.substring(0, 40)}...</Text>
              <Text style={styles.fileTime}>{file.timestamp}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  fileItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  fileType: {
    fontWeight: '600',
    color: '#007AFF',
  },
  fileUrl: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  fileTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});
