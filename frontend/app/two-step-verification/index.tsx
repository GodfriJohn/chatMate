import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TwoStepVerificationScreen = () => {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState(1); // 1: setup, 2: enter PIN, 3: confirm PIN, 4: recovery email
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleEnable2FA = () => {
    if (isEnabled) {
      Alert.alert(
        'Disable Two-Step Verification',
        'Are you sure you want to disable two-step verification? This will make your account less secure.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => {
              setIsEnabled(false);
              setStep(1);
              setPin('');
              setConfirmPin('');
              setRecoveryEmail('');
            }
          }
        ]
      );
    } else {
      setStep(2);
    }
  };

  const handlePinSubmit = () => {
    if (pin.length !== 6) {
      Alert.alert('Error', 'PIN must be 6 digits long');
      return;
    }
    setStep(3);
  };

  const handleConfirmPin = () => {
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }
    setStep(4);
  };

  const handleComplete = () => {
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid recovery email address');
      return;
    }
    
    setIsEnabled(true);
    Alert.alert(
      'Success',
      'Two-step verification has been enabled successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderSetupStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.setupContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={80} color="#007AFF" />
            </View>
            <Text style={styles.setupTitle}>Enable Two-Step Verification</Text>
            <Text style={styles.setupDescription}>
              Add an extra layer of security to your account. You'll need to enter a 6-digit PIN in addition to your password when signing in.
            </Text>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                <Text style={styles.benefitText}>Protects your account from unauthorized access</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                <Text style={styles.benefitText}>Secure even if your password is compromised</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                <Text style={styles.benefitText}>Easy to use with recovery options</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleEnable2FA}>
              <Text style={styles.primaryButtonText}>Enable Two-Step Verification</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Create Your PIN</Text>
            <Text style={styles.setupDescription}>
              Choose a 6-digit PIN that you'll remember. You'll need this PIN every time you sign in.
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter 6-digit PIN"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              textAlign="center"
            />
            
            <TouchableOpacity 
              style={[styles.primaryButton, pin.length !== 6 && styles.disabledButton]} 
              onPress={handlePinSubmit}
              disabled={pin.length !== 6}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Confirm Your PIN</Text>
            <Text style={styles.setupDescription}>
              Enter your PIN again to confirm it.
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm 6-digit PIN"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              textAlign="center"
            />
            
            <TouchableOpacity 
              style={[styles.primaryButton, confirmPin.length !== 6 && styles.disabledButton]} 
              onPress={handleConfirmPin}
              disabled={confirmPin.length !== 6}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Recovery Email</Text>
            <Text style={styles.setupDescription}>
              Provide a recovery email address. This will help you regain access to your account if you forget your PIN.
            </Text>
            
            <TextInput
              style={styles.emailInput}
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              placeholder="Enter recovery email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
              <Text style={styles.primaryButtonText}>Complete Setup</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderEnabledView = () => {
    return (
      <View style={styles.enabledContainer}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="shield-checkmark" size={40} color="#34C759" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Two-Step Verification Enabled</Text>
              <Text style={styles.statusSubtitle}>Your account is protected</Text>
            </View>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="key-outline" size={24} color="#007AFF" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Change PIN</Text>
                <Text style={styles.optionSubtitle}>Update your 6-digit PIN</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="mail-outline" size={24} color="#007AFF" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Recovery Email</Text>
                <Text style={styles.optionSubtitle}>Update recovery options</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name="time-outline" size={24} color="#007AFF" />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Recent Activity</Text>
                <Text style={styles.optionSubtitle}>View recent sign-in attempts</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.disableButton} onPress={handleEnable2FA}>
          <Text style={styles.disableButtonText}>Disable Two-Step Verification</Text>
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Two-Step Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {isEnabled ? renderEnabledView() : renderSetupStep()}
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
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  setupContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: 40,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  setupDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
  pinInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
    width: '80%',
    backgroundColor: '#F9F9F9',
  },
  emailInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 32,
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
  },
  enabledContainer: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  disableButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  disableButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});

export default TwoStepVerificationScreen;