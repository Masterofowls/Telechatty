import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { TelegramColors } from '@/constants/telegram-theme';
import { getAvatarPublicUrl, supabase } from '@/lib/supabase';

type AvatarProps = {
  userId: string;
  avatarPath?: string | null;
  name?: string | null;
  size?: number;
  editable?: boolean;
  isDark?: boolean;
  onUploaded?: (path: string) => void;
};

function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Avatar({
  userId,
  avatarPath,
  name,
  size = 48,
  editable = false,
  isDark = false,
  onUploaded,
}: AvatarProps) {
  const [uploading, setUploading] = useState(false);
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;
  const uri = getAvatarPublicUrl(avatarPath);

  async function handlePickImage() {
    if (!editable) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo library access to upload an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    try {
      setUploading(true);
      const asset = result.assets[0];
      const extension = asset.uri.split('.').pop() ?? 'jpg';
      const filePath = `${userId}/${Date.now()}.${extension}`;
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: asset.mimeType ?? 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      onUploaded?.(filePath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      Alert.alert('Avatar upload failed', message);
    } finally {
      setUploading(false);
    }
  }

  const content = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
      ]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{getInitials(name)}</Text>
    </View>
  );

  if (!editable) {
    return content;
  }

  return (
    <Pressable onPress={handlePickImage} disabled={uploading}>
      {content}
      {uploading ? (
        <View style={[styles.overlay, { width: size, height: size, borderRadius: size / 2 }]}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : (
        <Text style={[styles.hint, { color: colors.primary }]}>Tap to change photo</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000066',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
  },
});
