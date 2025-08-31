// src/screens/AdminUploadScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../services/api/SupabaseClient';

export const AdminUploadScreen: React.FC = () => {
  const [lineupData, setLineupData] = useState({
    name: '',
    mapId: 'dust2',
    type: 'smoke',
    side: 'T',
    difficulty: 'easy',
    startCallout: '',
    endCallout: '',
    description: '',
  });
  
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });
    
    if (!result.canceled) {
      setVideoFile(result.assets[0]);
    }
  };

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [16, 9],
    });
    
    if (!result.canceled) {
      setThumbnailFile(result.assets[0]);
    }
  };

  const uploadLineup = async () => {
    if (!videoFile || !thumbnailFile) {
      Alert.alert('Error', 'Please select both video and thumbnail');
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate unique filenames
      const timestamp = Date.now();
      const videoName = `${lineupData.mapId}_${timestamp}.mp4`;
      const thumbName = `${lineupData.mapId}_${timestamp}_thumb.jpg`;

      // Upload video
      const videoBlob = await fetch(videoFile.uri).then(r => r.blob());
      const { data: videoData, error: videoError } = await supabase.storage
        .from('lineup-videos')
        .upload(videoName, videoBlob);

      if (videoError) throw videoError;

      // Upload thumbnail
      const thumbBlob = await fetch(thumbnailFile.uri).then(r => r.blob());
      const { data: thumbData, error: thumbError } = await supabase.storage
        .from('lineup-thumbnails')
        .upload(thumbName, thumbBlob);

      if (thumbError) throw thumbError;

      // Get public URLs
      const videoUrl = supabase.storage
        .from('lineup-videos')
        .getPublicUrl(videoName).data.publicUrl;
      
      const thumbnailUrl = supabase.storage
        .from('lineup-thumbnails')
        .getPublicUrl(thumbName).data.publicUrl;

      // Insert lineup data
      const { error: dbError } = await supabase
        .from('lineups')
        .insert({
          ...lineupData,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          start_position: { callout: lineupData.startCallout },
          end_position: { callout: lineupData.endCallout },
        });

      if (dbError) throw dbError;

      Alert.alert('Success', 'Lineup uploaded successfully!');
      
      // Reset form
      setLineupData({
        name: '',
        mapId: 'dust2',
        type: 'smoke',
        side: 'T',
        difficulty: 'easy',
        startCallout: '',
        endCallout: '',
        description: '',
      });
      setVideoFile(null);
      setThumbnailFile(null);
      
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload New Lineup</Text>

      <TextInput
        style={styles.input}
        placeholder="Lineup Name"
        placeholderTextColor="#666"
        value={lineupData.name}
        onChangeText={text => setLineupData({...lineupData, name: text})}
      />

      {/* Map Selection */}
      <View style={styles.buttonRow}>
        {['dust2', 'mirage', 'inferno', 'nuke'].map(map => (
          <TouchableOpacity
            key={map}
            style={[
              styles.selectButton,
              lineupData.mapId === map && styles.selectButtonActive
            ]}
            onPress={() => setLineupData({...lineupData, mapId: map})}
          >
            <Text style={styles.selectButtonText}>{map}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Media Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Text style={styles.uploadButtonText}>
          {videoFile ? '✅ Video Selected' : '📹 Select Video'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={pickThumbnail}>
        <Text style={styles.uploadButtonText}>
          {thumbnailFile ? '✅ Thumbnail Selected' : '🖼️ Select Thumbnail'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
        onPress={uploadLineup}
        disabled={isUploading}
      >
        <Text style={styles.submitButtonText}>
          {isUploading ? 'Uploading...' : 'Upload Lineup'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  selectButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#FF6B35',
  },
  selectButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});