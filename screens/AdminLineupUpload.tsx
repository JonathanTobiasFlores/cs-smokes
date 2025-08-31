// src/screens/AdminLineupUpload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../services/api/SupabaseClient';
import { Ionicons } from '@expo/vector-icons';

type AdminLineupUploadNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: AdminLineupUploadNavigationProp;
}

export function AdminLineupUpload({ navigation }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mapId: '',
    type: 'smoke',
    side: 'T',
    difficulty: 'easy',
    throwType: 'normal',
    startCallout: '',
    endCallout: '',
    tags: '',
  });

  // File states
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [gifFile, setGifFile] = useState<any>(null);

  // Pick video file
  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoFile(result.assets[0]);
        Alert.alert('Success', `Video selected: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  // Pick thumbnail image
  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setThumbnailFile(result.assets[0]);
        Alert.alert('Success', 'Thumbnail selected');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick thumbnail');
    }
  };

  // Pick GIF file
  const pickGif = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/gif',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setGifFile(result.assets[0]);
        Alert.alert('Success', `GIF selected: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick GIF');
    }
  };

  // Upload everything
  const uploadLineup = async () => {
    // Validation
    if (!formData.name || !formData.mapId) {
      Alert.alert('Error', 'Please fill in name and select a map');
      return;
    }

    if (!videoFile && !gifFile) {
      Alert.alert('Error', 'Please select at least a video or GIF');
      return;
    }

    if (!thumbnailFile) {
      Alert.alert('Error', 'Please select a thumbnail');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Starting upload...');

    try {
      // Generate unique filenames
      const timestamp = Date.now();
      const lineupId = `${formData.mapId}_${timestamp}`;
      
      let videoUrl = null;
      let gifUrl = null;
      let thumbnailUrl = null;

      // 1. Upload Video (if selected)
      if (videoFile) {
        setUploadProgress('Uploading video...');
        const videoName = `${lineupId}.mp4`;
        
        // Convert to blob
        const videoResponse = await fetch(videoFile.uri);
        const videoBlob = await videoResponse.blob();
        
        const { data: videoData, error: videoError } = await supabase.storage
          .from('lineup-videos')
          .upload(videoName, videoBlob, {
            contentType: 'video/mp4',
            cacheControl: '3600',
          });

        if (videoError) throw videoError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('lineup-videos')
          .getPublicUrl(videoName);
        
        videoUrl = publicUrl;
      }

      // 2. Upload GIF (if selected)
      if (gifFile) {
        setUploadProgress('Uploading GIF...');
        const gifName = `${lineupId}.gif`;
        
        const gifResponse = await fetch(gifFile.uri);
        const gifBlob = await gifResponse.blob();
        
        const { data: gifData, error: gifError } = await supabase.storage
          .from('lineup-gifs')
          .upload(gifName, gifBlob, {
            contentType: 'image/gif',
            cacheControl: '3600',
          });

        if (gifError) throw gifError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('lineup-gifs')
          .getPublicUrl(gifName);
        
        gifUrl = publicUrl;
      }

      // 3. Upload Thumbnail
      setUploadProgress('Uploading thumbnail...');
      const thumbName = `${lineupId}_thumb.jpg`;
      
      const thumbResponse = await fetch(thumbnailFile.uri);
      const thumbBlob = await thumbResponse.blob();
      
      const { data: thumbData, error: thumbError } = await supabase.storage
        .from('lineup-thumbnails')
        .upload(thumbName, thumbBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (thumbError) throw thumbError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('lineup-thumbnails')
        .getPublicUrl(thumbName);
      
      thumbnailUrl = publicUrl;

      // 4. Get map ID from slug
      setUploadProgress('Saving to database...');
      const { data: mapData, error: mapError } = await supabase
        .from('maps')
        .select('id')
        .eq('slug', formData.mapId)
        .single();

      if (mapError) throw mapError;

      // 5. Insert lineup into database
      const { data: lineupData, error: lineupError } = await supabase
        .from('lineups')
        .insert({
          map_id: mapData.id,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          side: formData.side,
          difficulty: formData.difficulty,
          throw_type: formData.throwType,
          start_position: { 
            callout: formData.startCallout,
            x: 0,
            y: 0 
          },
          end_position: { 
            callout: formData.endCallout,
            x: 0,
            y: 0 
          },
          video_url: videoUrl,
          gif_url: gifUrl,
          thumbnail_url: thumbnailUrl,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          is_pro: false,
          views: 0,
        })
        .select()
        .single();

      if (lineupError) throw lineupError;

      Alert.alert(
        'Success!', 
        `Lineup "${formData.name}" uploaded successfully!`,
        [
          { text: 'Add Another', onPress: () => resetForm() },
          { text: 'View Lineups', onPress: () => navigation.navigate('Home') }
        ]
      );

      resetForm();

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      mapId: '',
      type: 'smoke',
      side: 'T',
      difficulty: 'easy',
      throwType: 'normal',
      startCallout: '',
      endCallout: '',
      tags: '',
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setGifFile(null);
  };

  const maps = [
    'dust2', 'mirage', 'inferno', 'nuke', 
    'overpass', 'ancient', 'anubis', 'vertigo'
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Upload New Lineup</Text>

      {/* Map Selection */}
      <Text style={styles.label}>Select Map *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mapScroll}>
        {maps.map(map => (
          <TouchableOpacity
            key={map}
            style={[
              styles.mapButton,
              formData.mapId === map && styles.mapButtonActive
            ]}
            onPress={() => setFormData({...formData, mapId: map})}
          >
            <Text style={[
              styles.mapButtonText,
              formData.mapId === map && styles.mapButtonTextActive
            ]}>
              {map.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lineup Name */}
      <Text style={styles.label}>Lineup Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Xbox Smoke from T Spawn"
        placeholderTextColor="#666"
        value={formData.name}
        onChangeText={text => setFormData({...formData, name: text})}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe when and how to use this lineup"
        placeholderTextColor="#666"
        multiline
        numberOfLines={3}
        value={formData.description}
        onChangeText={text => setFormData({...formData, description: text})}
      />

      {/* Utility Type */}
      <Text style={styles.label}>Utility Type</Text>
      <View style={styles.buttonRow}>
        {['smoke', 'flash', 'molotov', 'grenade'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              formData.type === type && styles.typeButtonActive
            ]}
            onPress={() => setFormData({...formData, type})}
          >
            <Ionicons 
              name={
                type === 'smoke' ? 'cloud' :
                type === 'flash' ? 'flash' :
                type === 'molotov' ? 'flame' : 'radio-button-on'
              } 
              size={20} 
              color={formData.type === type ? '#FFF' : '#666'} 
            />
            <Text style={[
              styles.typeText,
              formData.type === type && styles.typeTextActive
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Side Selection */}
      <Text style={styles.label}>Side</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.sideButton, formData.side === 'T' && styles.sideButtonT]}
          onPress={() => setFormData({...formData, side: 'T'})}
        >
          <Text style={styles.sideButtonText}>Terrorist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sideButton, formData.side === 'CT' && styles.sideButtonCT]}
          onPress={() => setFormData({...formData, side: 'CT'})}
        >
          <Text style={styles.sideButtonText}>Counter-Terrorist</Text>
        </TouchableOpacity>
      </View>

      {/* Positions */}
      <Text style={styles.label}>Start Position Callout *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., T Spawn"
        placeholderTextColor="#666"
        value={formData.startCallout}
        onChangeText={text => setFormData({...formData, startCallout: text})}
      />

      <Text style={styles.label}>End Position Callout *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Xbox"
        placeholderTextColor="#666"
        value={formData.endCallout}
        onChangeText={text => setFormData({...formData, endCallout: text})}
      />

      {/* Media Upload Section */}
      <Text style={styles.sectionTitle}>Media Files</Text>
      
      {/* Video Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
        <Ionicons name="videocam" size={24} color="#666" />
        <View style={styles.uploadTextContainer}>
          <Text style={styles.uploadButtonText}>
            {videoFile ? '✅ Video Selected' : 'Select Video (MP4)'}
          </Text>
          {videoFile && (
            <Text style={styles.fileName}>{videoFile.name}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Thumbnail Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickThumbnail}>
        <Ionicons name="image" size={24} color="#666" />
        <View style={styles.uploadTextContainer}>
          <Text style={styles.uploadButtonText}>
            {thumbnailFile ? '✅ Thumbnail Selected' : 'Select Thumbnail *'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* GIF Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickGif}>
        <Ionicons name="images" size={32} color="#666" />
        <View style={styles.uploadTextContainer}>
          <Text style={styles.uploadButtonText}>
            {gifFile ? '✅ GIF Selected' : 'Select GIF (Optional)'}
          </Text>
          {gifFile && (
            <Text style={styles.fileName}>{gifFile.name}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Preview */}
      {thumbnailFile && (
        <View style={styles.preview}>
          <Text style={styles.label}>Thumbnail Preview:</Text>
          <Image source={{ uri: thumbnailFile.uri }} style={styles.previewImage} />
        </View>
      )}

      {/* Upload Button */}
      <TouchableOpacity 
        style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
        onPress={uploadLineup}
        disabled={isUploading}
      >
        {isUploading ? (
          <View>
            <ActivityIndicator color="#FFF" />
            <Text style={styles.submitButtonText}>{uploadProgress}</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>Upload Lineup</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mapScroll: {
    flexGrow: 0,
  },
  mapButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  mapButtonActive: {
    backgroundColor: '#FF6B35',
  },
  mapButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  mapButtonTextActive: {
    color: '#FFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  typeText: {
    color: '#666',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  typeTextActive: {
    color: '#FFF',
  },
  sideButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  sideButtonT: {
    backgroundColor: '#C9A961',
  },
  sideButtonCT: {
    backgroundColor: '#5B92C9',
  },
  sideButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  fileName: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  preview: {
    marginTop: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 50,
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