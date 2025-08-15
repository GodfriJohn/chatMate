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
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 3; // 3 columns with padding

const StoryArchiveScreen = () => {
  const router = useRouter();
  
  const [selectedTab, setSelectedTab] = useState('archive');
  const [archivedStories] = useState([
    {
      id: 1,
      date: '2024-01-15',
      stories: [
        { id: 1, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop', time: '2:30 PM' },
        { id: 2, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop', time: '3:45 PM' },
        { id: 3, type: 'video', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop', time: '5:20 PM', duration: '0:15' },
      ]
    },
    {
      id: 2,
      date: '2024-01-14',
      stories: [
        { id: 4, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=150&h=150&fit=crop', time: '10:15 AM' },
        { id: 5, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop', time: '4:30 PM' },
      ]
    },
    {
      id: 3,
      date: '2024-01-13',
      stories: [
        { id: 6, type: 'video', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop', time: '1:20 PM', duration: '0:30' },
        { id: 7, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop', time: '6:45 PM' },
        { id: 8, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop', time: '8:30 PM' },
        { id: 9, type: 'image', thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=150&h=150&fit=crop', time: '9:15 PM' },
      ]
    },
  ]);

  const [highlights] = useState([
    {
      id: 1,
      title: 'Vacation 2024',
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
      storyCount: 8,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'Food Adventures',
      cover: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=150&h=150&fit=crop',
      storyCount: 12,
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      title: 'Weekend Vibes',
      cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&h=150&fit=crop',
      storyCount: 5,
      createdAt: '2023-12-28'
    },
  ]);

  const handleStoryPress = (story: any) => {
    console.log('View story:', story.id);
    // Navigate to story viewer
  };

  const handleHighlightPress = (highlight: any) => {
    console.log('View highlight:', highlight.title);
    // Navigate to highlight viewer
  };

  const handleCreateHighlight = () => {
    Alert.alert(
      'Create Highlight',
      'Select stories to add to a new highlight',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Select Stories', onPress: () => console.log('Select stories for highlight') }
      ]
    );
  };

  const handleDeleteStory = (storyId: number) => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete story:', storyId) }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const renderStoryItem = (story: any) => (
    <TouchableOpacity
      key={story.id}
      style={styles.storyThumbnail}
      onPress={() => handleStoryPress(story)}
      onLongPress={() => handleDeleteStory(story.id)}
    >
      <Image source={{ uri: story.thumbnail }} style={styles.thumbnailImage} />
      
      {story.type === 'video' && (
        <View style={styles.videoOverlay}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
          {story.duration && (
            <Text style={styles.videoDuration}>{story.duration}</Text>
          )}
        </View>
      )}
      
      <View style={styles.storyTime}>
        <Text style={styles.timeText}>{story.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHighlightItem = (highlight: any) => (
    <TouchableOpacity
      key={highlight.id}
      style={styles.highlightItem}
      onPress={() => handleHighlightPress(highlight)}
    >
      <Image source={{ uri: highlight.cover }} style={styles.highlightCover} />
      <Text style={styles.highlightTitle} numberOfLines={2}>{highlight.title}</Text>
      <Text style={styles.highlightCount}>{highlight.storyCount} stories</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story Archive</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#1C1C1E" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'archive' && styles.activeTab]}
            onPress={() => setSelectedTab('archive')}
          >
            <Text style={[styles.tabText, selectedTab === 'archive' && styles.activeTabText]}>
              Archive
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'highlights' && styles.activeTab]}
            onPress={() => setSelectedTab('highlights')}
          >
            <Text style={[styles.tabText, selectedTab === 'highlights' && styles.activeTabText]}>
              Highlights
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {selectedTab === 'archive' ? (
            <View style={styles.archiveContent}>
              {archivedStories.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="archive-outline" size={80} color="#C7C7CC" />
                  <Text style={styles.emptyTitle}>No Archived Stories</Text>
                  <Text style={styles.emptySubtitle}>
                    Your expired stories will appear here automatically
                  </Text>
                </View>
              ) : (
                archivedStories.map((dayGroup) => (
                  <View key={dayGroup.id} style={styles.dayGroup}>
                    <Text style={styles.dateHeader}>{formatDate(dayGroup.date)}</Text>
                    <View style={styles.storiesGrid}>
                      {dayGroup.stories.map(renderStoryItem)}
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.highlightsContent}>
              <TouchableOpacity style={styles.createHighlight} onPress={handleCreateHighlight}>
                <View style={styles.createHighlightIcon}>
                  <Ionicons name="add" size={32} color="#007AFF" />
                </View>
                <Text style={styles.createHighlightText}>New Highlight</Text>
              </TouchableOpacity>

              <View style={styles.highlightsGrid}>
                {highlights.map(renderHighlightItem)}
              </View>

              {highlights.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="star-outline" size={80} color="#C7C7CC" />
                  <Text style={styles.emptyTitle}>No Highlights</Text>
                  <Text style={styles.emptySubtitle}>
                    Create highlights to save your favorite stories
                  </Text>
                </View>
              )}
            </View>
          )}
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
  moreButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  archiveContent: {
    paddingHorizontal: 20,
  },
  dayGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storyThumbnail: {
    width: itemWidth,
    height: itemWidth * 1.6,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  videoDuration: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  storyTime: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  highlightsContent: {
    paddingHorizontal: 20,
  },
  createHighlight: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  createHighlightIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createHighlightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightItem: {
    width: itemWidth,
    marginBottom: 16,
    alignItems: 'center',
  },
  highlightCover: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: itemWidth / 2,
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  highlightCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

export default StoryArchiveScreen;