import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

const countries = [
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
];

export default function Login() {
  const router = useRouter();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // State
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showCountryModal, setShowCountryModal] = useState(false);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    return digits;
  };

  const handlePhoneNumberChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setPhoneNumber(formattedNumber);
  };

  const selectCountry = (country: any) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  const skipLogin = () => {
    router.replace('/dashboard');
  };

  const sendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setShowOtpInput(true);
        setResendTimer(60);
        Alert.alert(
          'OTP Sent',
          `We've sent a 6-digit code to ${fullPhoneNumber}. Please enter it below.`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otpCode,
        type: 'sms',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        // Success - navigate to dashboard
        router.replace('/dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0) return;
    await sendOTP();
  };

  const goBack = () => {
    if (showOtpInput) {
      setShowOtpInput(false);
      setOtpCode('');
    } else {
      router.back();
    }
  };

  const renderCountryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => selectCountry(item)}
    >
      <Text style={styles.countryItemFlag}>{item.flag}</Text>
      <Text style={styles.countryItemName}>{item.country}</Text>
      <Text style={styles.countryItemCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Fixed Header with Back Button */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton} onPress={skipLogin}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>
              {showOtpInput ? 'Verify Your Number' : 'Enter Your Phone'}
            </Text>
            <Text style={styles.subtitle}>
              {showOtpInput
                ? `We've sent an SMS with a 6-digit code to\n${selectedCountry.code} ${phoneNumber}`
                : 'Please confirm your country code and enter your phone number.'}
            </Text>
          </Animated.View>

          {/* Input Section */}
          <Animated.View
            style={[
              styles.inputSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {!showOtpInput ? (
              /* Phone Input */
              <>
                {/* Country Selector */}
                <TouchableOpacity 
                  style={styles.countrySelector}
                  onPress={() => setShowCountryModal(true)}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                  <Text style={styles.countryName}>{selectedCountry.country}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {/* Phone Input */}
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Phone number"
                    placeholderTextColor="#8E8E93"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="numeric"
                    maxLength={15}
                    autoFocus
                  />
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                  style={[styles.actionButton, !phoneNumber.trim() && styles.actionButtonDisabled]}
                  onPress={sendOTP}
                  disabled={!phoneNumber.trim() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.actionButtonText}>SEND CODE</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              /* OTP Input */
              <>
                {/* OTP Input */}
                <View style={styles.otpContainer}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="- - - - - -"
                    placeholderTextColor="#8E8E93"
                    value={otpCode}
                    onChangeText={(text) => setOtpCode(text.replace(/\D/g, ''))}
                    keyboardType="numeric"
                    maxLength={6}
                    textAlign="center"
                    autoFocus
                  />
                </View>

                {/* Resend OTP */}
                <TouchableOpacity
                  style={styles.resendContainer}
                  onPress={resendOTP}
                  disabled={resendTimer > 0}
                >
                  <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                  </Text>
                </TouchableOpacity>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[styles.actionButton, otpCode.length !== 6 && styles.actionButtonDisabled]}
                  onPress={verifyOTP}
                  disabled={otpCode.length !== 6 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.actionButtonText}>VERIFY & CONTINUE</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.footerText}>
              {showOtpInput
                ? "Didn't receive the code? Check your spam folder or try again."
                : 'Standard messaging rates may apply.'}
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCountryModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  skipButtonText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  titleSection: {
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 50,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  countryFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '600',
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#8E8E93',
  },
  phoneInputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    marginBottom: 30,
  },
  phoneInput: {
    padding: 18,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  otpContainer: {
    marginBottom: 25,
  },
  otpInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    padding: 25,
    fontSize: 28,
    color: '#1C1C1E',
    letterSpacing: 12,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#8E8E93',
  },
  actionButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  actionButtonDisabled: {
    backgroundColor: '#C7C7CC',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  countryItemFlag: {
    fontSize: 20,
    marginRight: 15,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  countryItemCode: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
});