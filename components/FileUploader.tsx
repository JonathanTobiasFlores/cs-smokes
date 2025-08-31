import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { SupabaseStorageService } from '../services/storage/SupabaseStorageService';

const storageService = new SupabaseStorageService();

interface Props {
  onUploadComplete: (url: string, type: 'video' | 'thumbnail' | 'gif') => void;
  type: 'video' | 'thumbnail' | 'gif';
  lineupId: string;
}

export function FileUploader({ onUploadComplete, type, lineupId }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      await uploadFile(file, 'video');
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video file');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.Image],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      await uploadFile(asset, type);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image file');
    }
  };

  const uploadFile = async (file: any, fileType: string) => {
    setIsUploading(true);
    
    try {
      const fileName = storageService.generateFileName(file.name || 'file', lineupId);
      let url: string;

      if (fileType === 'video') {
        url = await storageService.uploadVideo(file, fileName);
      } else if (fileType === 'thumbnail') {
        url = await storageService.uploadThumbnail(file, fileName);
      } else {
        url = await storageService.uploadGif(file, fileName);
      }

      onUploadComplete(url, type);
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePress = () => {
    if (type === 'video') {
      pickVideo();
    } else {
      pickImage();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploading]}
        onPress={handlePress}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Upload {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploading: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
