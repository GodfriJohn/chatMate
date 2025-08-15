import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StoriesScreen = () => {
  const router = useRouter();
  
  const [stories] = useState([
    {
      id: 1,
      user: 'My Story',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      isMyStory: true,
      hasStory: true,
      storyCount: 3,
      lastUpdate: '2 hours ago',
      stories: [
        { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', timestamp: '2 hours ago' },
        { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', timestamp: '1 hour ago' },
        { id: 3, type: 'video', url: '', timestamp: '30 minutes ago' },
      ]
    },
    {
      id: 2,
      user: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      isMyStory: false,
      hasStory: true,
      storyCount: 2,
      lastUpdate: '1 hour ago',
      isViewed: false,
    },
    {
      id: 3,
      user: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      isMyStory: false,
      hasStory: true,
      storyCount: 1,
      lastUpdate: '3 hours ago',
      isViewed: true,
    },
    {
      id: 4,
      user: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face',
      isMyStory: false,
      hasStory: true,
      storyCount: 4,
      lastUpdate: '5 hours ago',
      isViewed: false,
    },
    {
      id: 5,
      user: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      isMyStory: false,
      hasStory: true,
      storyCount: 1,
      lastUpdate: '8 hours ago',
      isViewed: true,
    },
  ]);

  const handleCreateStory = () => {
    Alert.alert(
      'Create Story',
      'Choose how to create your story',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Text Story', onPress: () => console.log('Create text story') }
      ]
    );
  };

  const handleViewStory = (story: any) => {
    if (story.isMyStory) {
      // Navigate to my story view with options to delete, view who saw it, etc.
      router.push({
        pathname: '../../story-viewer/',
        params: {
          user: story.user,
          avatar: story.avatar || '',
          isMyStory: 'true'
        }
      });
    } else {
      // Navigate to story viewer
      router.push({
        pathname: '../../story-viewer/',
        params: {
          user: story.user,
          avatar: story.avatar || '',
          isMyStory: 'false'
        }
      });
    }
  };

  const handleStorySettings = () => {
    router.push('../../story-settings/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
      '#5AC8FA', '#FFCC00', '#FF2D92', '#5856D6', '#32D74B'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const StoryAvatar = ({ story }: { story: any }) => {
    if (story.avatar) {
      return (
        <View style={[
          styles.avatarContainer,
          story.hasStory && !story.isViewed && !story.isMyStory && styles.unviewedBorder,
          story.hasStory && story.isViewed && !story.isMyStory && styles.viewedBorder,
          story.isMyStory && styles.myStoryBorder
        ]}>
          <Image 
            source={{ uri: story.avatar }} 
            style={styles.avatar}
            onError={() => console.log('Avatar image failed to load')}
          />
          {story.isMyStory && (
            <TouchableOpacity style={styles.addButton} onPress={handleCreateStory}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    return (
      <View style={[
        styles.avatarContainer,
        styles.avatarFallback,
        { backgroundColor: getAvatarColor(story.user) },
        story.hasStory && !story.isViewed && !story.isMyStory && styles.unviewedBorder,
        story.hasStory && story.isViewed && !story.isMyStory && styles.viewedBorder,
        story.isMyStory && styles.myStoryBorder
      ]}>
        <Text style={styles.avatarInitials}>{getInitials(story.user)}</Text>
        {story.isMyStory && (
          <TouchableOpacity style={styles.addButton} onPress={handleCreateStory}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stories</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleStorySettings}>
            <Ionicons name="settings-outline" size={24} color="#1C1C1E" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* My Story Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Story</Text>
            
            {stories.filter(story => story.isMyStory).map((story) => (
              <TouchableOpacity 
                key={story.id}
                style={styles.storyItem}
                onPress={() => handleViewStory(story)}
              >
                <StoryAvatar story={story} />
                
                <View style={styles.storyInfo}>
                  <Text style={styles.storyUser}>{story.user}</Text>
                  <Text style={styles.storyTime}>
                    {story.hasStory ? `${story.storyCount} stories • ${story.lastUpdate}` : 'Tap to add story'}
                  </Text>
                </View>
                
                {story.hasStory && (
                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction} onPress={handleCreateStory}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="camera" size={24} color="#007AFF" />
                </View>
                <Text style={styles.quickActionText}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction} onPress={handleCreateStory}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="images" size={24} color="#007AFF" />
                </View>
                <Text style={styles.quickActionText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickAction} onPress={handleCreateStory}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="text" size={24} color="#007AFF" />
                </View>
                <Text style={styles.quickActionText}>Text</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Stories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Stories</Text>
            
            {stories.filter(story => !story.isMyStory).map((story) => (
              <TouchableOpacity 
                key={story.id}
                style={styles.storyItem}
                onPress={() => handleViewStory(story)}
              >
                <StoryAvatar story={story} />
                
                <View style={styles.storyInfo}>
                  <Text style={styles.storyUser}>{story.user}</Text>
                  <Text style={styles.storyTime}>{story.lastUpdate}</Text>
                </View>
                
                <View style={styles.storyStatus}>
                  {!story.isViewed && (
                    <View style={styles.newIndicator}>
                      <Text style={styles.newText}>New</Text>
                    </View>
                  )}
                  <Text style={styles.storyCount}>{story.storyCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Story Privacy Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>About Stories</Text>
                <Text style={styles.infoText}>
                  Stories disappear after 24 hours. Only your contacts can see your stories.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  storyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unviewedBorder: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  viewedBorder: {
    borderWidth: 3,
    borderColor: '#E5E5EA',
  },
  myStoryBorder: {
    borderWidth: 3,
    borderColor: '#34C759',
  },
  addButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storyInfo: {
    flex: 1,
  },
  storyUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  storyTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  storyStatus: {
    alignItems: 'flex-end',
  },
  newIndicator: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  newText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  storyCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  moreButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginTop: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 18,
  },
});

export default StoriesScreen;