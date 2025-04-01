import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useHospitalStore } from '@/store/hospital-store';
import colors from '@/constants/colors';

interface HospitalHeaderProps {
  compact?: boolean;
  showLogo?: boolean;
}

export default function HospitalHeader({ compact = false, showLogo = true }: HospitalHeaderProps) {
  const { details } = useHospitalStore();

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {showLogo && details.logo && (
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: details.logo }} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.hospitalName}>{details.name}</Text>
        
        {!compact && (
          <Text style={styles.address}>{details.address}</Text>
        )}
        
        <View style={styles.contactRow}>
          <Text style={styles.contactText}>
            Phone: {details.phone}
            {details.email ? ` | Email: ${details.email}` : ''}
            {details.website && !compact ? ` | Website: ${details.website}` : ''}
          </Text>
        </View>
        
        {!compact && details.registrationNumber && (
          <Text style={styles.registrationText}>
            Reg. No: {details.registrationNumber}
            {details.taxId ? ` | ${details.taxId}` : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  compactContainer: {
    padding: 8,
    marginBottom: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactRow: {
    marginBottom: 2,
  },
  contactText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  registrationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});