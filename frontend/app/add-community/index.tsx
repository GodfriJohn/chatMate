import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock contacts data (same as contacts page)
const mockContacts = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    status: 'online',
  },
  {
    id: '2',
    name: 'Bob Smith',
    phone: '+1 (555) 987-6543',
    avatar: null,
    status: 'offline',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'online',
  },
  {
    id: '4',
    name: 'Diana Prince',
    phone: '+1 (555) 321-0987',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
  },
  {
    id: '5',
    name: 'Edward Wilson',
    phone: '+1 (555) 654-3210',
    avatar: null,
    status: 'online',
  },
  {
    id: '6',
    name: 'Fiona Davis',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
  },
];

const AddCommunityScreen = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Helper function to generate avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#FF9500', '#FF2D92', '#30D158', '#5856D6',
      '#FF6482', '#FF9F0A', '#32D74B', '#007AFF', '#5AC8FA',
      '#FFCC00', '#FF3B30', '#34C759', '#AF52DE', '#FF9500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockContacts;
    }
    
    return mockContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSelectGroupIcon = () => {
    Alert.alert(
      'Select Group Icon',
      'Choose how to set the group icon',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Gallery', onPress: () => console.log('Choose from gallery') }
      ]
    );
  };

  const toggleMemberSelection = (contactId: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    const selectedContacts = mockContacts.filter(contact => 
      selectedMembers.includes(contact.id)
    );

    Alert.alert(
      'Create Group',
      `Create "${groupName}" with ${selectedMembers.length} member(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            console.log('Creating group:', {
              name: groupName,
              icon: groupIcon,
              members: selectedContacts
            });
            router.back();
          }
        }
      ]
    );
  };

  const renderContactItem = ({ item }: { item: typeof mockContacts[0] }) => {
    const isSelected = selectedMembers.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.contactItem, isSelected && styles.selectedContactItem]}
        onPress={() => toggleMemberSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.contactLeft}>
          <View style={styles.contactAvatar}>
            {item.avatar ? (
              <Image 
                source={{ uri: item.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: getAvatarColor(item.name) }]}>
                <Text style={styles.avatarInitials}>{getInitials(item.name)}</Text>
              </View>
            )}
            {item.status === 'online' && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
        </View>
        
        <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedMember = (contactId: string) => {
    const contact = mockContacts.find(c => c.id === contactId);
    if (!contact) return null;

    return (
      <View key={contactId} style={styles.selectedMember}>
        <View style={styles.selectedMemberAvatar}>
          {contact.avatar ? (
            <Image 
              source={{ uri: contact.avatar }} 
              style={styles.selectedMemberAvatarImage}
            />
          ) : (
            <View style={[styles.selectedMemberAvatarFallback, { backgroundColor: getAvatarColor(contact.name) }]}>
              <Text style={styles.selectedMemberAvatarInitials}>{getInitials(contact.name)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.selectedMemberName}>{contact.name.split(' ')[0]}</Text>
        <TouchableOpacity 
          style={styles.removeMemberButton}
          onPress={() => toggleMemberSelection(contactId)}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Community</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Group Info Section */}
          <View style={styles.groupInfoSection}>
            <View style={styles.groupInfoHeader}>
              <Text style={styles.sectionTitle}>Group Information</Text>
            </View>
            
            {/* Group Icon */}
            <TouchableOpacity 
              style={styles.groupIconContainer}
              onPress={handleSelectGroupIcon}
            >
              <View style={styles.groupIconPlaceholder}>
                {groupIcon ? (
                  <Image source={{ uri: groupIcon }} style={styles.groupIconImage} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={32} color="#8E8E93" />
                    <Text style={styles.groupIconText}>Add Group Icon</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Group Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter group name..."
                placeholderTextColor="#8E8E93"
                value={groupName}
                onChangeText={setGroupName}
                maxLength={50}
              />
              <Text style={styles.characterCount}>{groupName.length}/50</Text>
            </View>
          </View>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <View style={styles.selectedMembersSection}>
              <Text style={styles.sectionTitle}>
                Selected Members ({selectedMembers.length})
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.selectedMembersList}
                contentContainerStyle={styles.selectedMembersContent}
              >
                {selectedMembers.map(renderSelectedMember)}
              </ScrollView>
            </View>
          )}

          {/* Add Members Section */}
          <View style={styles.addMembersSection}>
            <Text style={styles.sectionTitle}>Add Members</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#8E8E93" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  placeholderTextColor="#8E8E93"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Contacts List */}
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.createButton,
              (!groupName.trim() || selectedMembers.length === 0) && styles.createButtonDisabled
            ]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
          >
            <Ionicons name="people" size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create Community</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  headerRight: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  
  // Group Info Section
  groupInfoSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingVertical: 20,
  },
  groupInfoHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  groupIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  groupIconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  groupIconImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  groupIconText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },

  // Selected Members Section
  selectedMembersSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingVertical: 16,
  },
  selectedMembersList: {
    marginTop: 12,
  },
  selectedMembersContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  selectedMember: {
    alignItems: 'center',
    position: 'relative',
  },
  selectedMemberAvatar: {
    position: 'relative',
  },
  selectedMemberAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedMemberAvatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMemberAvatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedMemberName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1C1C1E',
    marginTop: 4,
    textAlign: 'center',
  },
  removeMemberButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  // Add Members Section
  addMembersSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
    marginRight: 8,
  },

  // Contact Item
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedContactItem: {
    backgroundColor: '#F0F8FF',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#8E8E93',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E5E5EA',
    marginLeft: 72,
  },

  // Create Button
  createButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddCommunityScreen;