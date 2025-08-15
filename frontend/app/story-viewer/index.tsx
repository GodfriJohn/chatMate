import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

const StoryViewerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);
  
  // Sample story data - in real app, this would come from props/params
  const storyData = {
    user: Array.isArray(params.user) ? params.user[0] : (params.user || 'John Doe'),
    avatar: Array.isArray(params.avatar) ? params.avatar[0] : (params.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'),
    stories: [
      {
        id: 1,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop',
        duration: 5000,
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=800&fit=crop',
        duration: 5000,
        timestamp: '1 hour ago'
      },
      {
        id: 3,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=800&fit=crop',
        duration: 5000,
        timestamp: '30 minutes ago'
      }
    ]
  };

  const currentStory = storyData.stories[currentStoryIndex];

  useEffect(() => {
    if (!isPaused) {
      // Reset progress
      progress.setValue(0);
      
      // Start progress animation
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: currentStory?.duration || 5000,
        useNativeDriver: false,
      });

      animation.start(({ finished }) => {
        if (finished && !isPaused) {
          nextStory();
        }
      });

      return () => {
        animation.stop();
      };
    }
  }, [currentStoryIndex, isPaused]);

  const nextStory = () => {
    if (currentStoryIndex < storyData.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // End of stories, go back
      router.back();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      router.back();
    }
  };

  const handleTap = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = width;
    
    if (locationX < screenWidth / 2) {
      // Tapped left side - previous story
      previousStory();
    } else {
      // Tapped right side - next story
      nextStory();
    }
  };

  const handleLongPress = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleReply = () => {
    Alert.alert(
      'Reply to Story',
      'Send a message about this story?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => {
          console.log('Open chat to reply');
          router.back();
        }}
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Story',
      'Share this story with others?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share story') }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={true} />
      
      {/* Story Content */}
      <TouchableOpacity
        style={styles.storyContainer}
        activeOpacity={1}
        onPress={handleTap}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
      >
        {currentStory?.type === 'image' ? (
          <Image 
            source={{ uri: currentStory.url }} 
            style={styles.storyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={80} color="#FFFFFF" />
            <Text style={styles.videoText}>Video Story</Text>
          </View>
        )}
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
      </TouchableOpacity>

      <SafeAreaView style={styles.safeArea}>
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {storyData.stories.map((_, index) => (
            <View key={index} style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: index === currentStoryIndex 
                      ? progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        })
                      : index < currentStoryIndex ? '100%' : '0%'
                  }
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {storyData.avatar ? (
              <Image source={{ uri: storyData.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitials}>{getInitials(storyData.user)}</Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{storyData.user}</Text>
              <Text style={styles.storyTime}>{currentStory?.timestamp}</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setIsPaused(!isPaused)}>
              <Ionicons 
                name={isPaused ? "play" : "pause"} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
            <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Tap Instructions */}
        {isPaused && (
          <View style={styles.pausedOverlay}>
            <Text style={styles.pausedText}>Story Paused</Text>
            <Text style={styles.instructionText}>Tap to continue</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: width,
    height: height,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  videoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 50,
    gap: 4,
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  storyTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  pausedOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  pausedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default StoryViewerScreen;