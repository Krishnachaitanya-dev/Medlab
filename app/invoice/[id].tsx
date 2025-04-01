import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Share, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { useInvoiceStore } from '@/store/invoice-store';
import { usePatientStore } from '@/store/patient-store';
import { useTestStore } from '@/store/test-store';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import HospitalHeader from '@/components/HospitalHeader';
import { Calendar, User, IndianRupee, CreditCard, Share2, Printer } from 'lucide-react-native';
import { generateInvoice } from '@/utils/print';
import { useHospitalStore } from '@/store/hospital-store';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getInvoiceById, updatePaymentStatus } = useInvoiceStore();
  const { getPatientById } = usePatientStore();
  const { getTestById } = useTestStore();
  const { details: hospitalDetails } = useHospitalStore();
  const [isPrinting, setIsPrinting] = useState(false);

  const invoice = getInvoiceById(id as string);
  
  if (!invoice) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Invoice not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="outline"
          style={styles.backButton}
        />
      </View>
    );
  }

  const patient = getPatientById(invoice.patientId);
  
  if (!patient) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Patient data not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          variant="outline"
          style={styles.backButton}
        />
      </View>
    );
  }

  // Get test details for each test in the invoice
  const tests = invoice.tests.map(testId => getTestById(testId)).filter(Boolean);

  // Format date
  const formattedDate = new Date(invoice.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleMarkAsPaid = () => {
    Alert.alert(
      'Mark as Paid',
      'Select payment method:',
      [
        {
          text: 'Cash',
          onPress: () => updatePaymentStatus(invoice.id, 'Paid', 'Cash'),
        },
        {
          text: 'Card',
          onPress: () => updatePaymentStatus(invoice.id, 'Paid', 'Card'),
        },
        {
          text: 'UPI',
          onPress: () => updatePaymentStatus(invoice.id, 'Paid', 'UPI'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handlePrintInvoice = () => {
    if (Platform.OS === 'web') {
      setIsPrinting(true);
      try {
        // Prepare invoice data for printing
        const invoiceData = {
          id: invoice.id,
          date: invoice.createdAt,
          patientName: patient.name,
          patientId: patient.id,
          status: invoice.status,
          items: tests.map(test => ({
            description: test?.name || 'Unknown Test',
            code: test?.id || '',
            price: test?.price || 0,
            quantity: 1
          })),
          paymentMethod: invoice.paymentMethod,
          paymentTerms: 'Due on receipt',
          totalAmount: invoice.totalAmount
        };
        
        generateInvoice(invoiceData);
      } catch (error) {
        console.error('Error printing invoice:', error);
        Alert.alert('Error', 'Failed to print invoice');
      } finally {
        setIsPrinting(false);
      }
    } else {
      Alert.alert('Print Invoice', 'This feature is only available on web.');
    }
  };

  const handleShareInvoice = async () => {
    try {
      const invoiceText = `
${hospitalDetails.name}
${hospitalDetails.address}
Phone: ${hospitalDetails.phone}
${hospitalDetails.email ? `Email: ${hospitalDetails.email}` : ''}

INVOICE

Invoice #: ${invoice.id.replace('i', '')}
Date: ${formattedDate}
Patient: ${patient.name}
Status: ${invoice.status}

Tests:
${tests.map(test => `${test?.name} - ₹${test?.price.toFixed(2)}`).join('\n')}

Total Amount: ₹${invoice.totalAmount.toFixed(2)}
Payment Method: ${invoice.paymentMethod || 'Not paid yet'}

${hospitalDetails.footer || 'This is a computer-generated invoice. No signature is required.'}
      `;
      
      await Share.share({
        message: invoiceText,
        title: `${hospitalDetails.name} - Invoice`,
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: `Invoice #${invoice.id.replace('i', '')}`,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Print"
                onPress={handlePrintInvoice}
                variant="outline"
                size="small"
                style={styles.headerButton}
                loading={isPrinting}
                icon={<Printer size={16} color={colors.primary} />}
              />
              <Button
                title="Share"
                onPress={handleShareInvoice}
                variant="outline"
                size="small"
                style={styles.headerButton}
                icon={<Share2 size={16} color={colors.primary} />}
              />
            </View>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View id="invoice-content" style={styles.invoiceContent}>
          {/* Hospital Header */}
          <HospitalHeader />
          
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.invoiceTitle}>Invoice #{invoice.id.replace('i', '')}</Text>
              <StatusBadge status={invoice.status} size="medium" />
            </View>
            <Text style={styles.invoiceDate}>
              <Calendar size={14} color={colors.textSecondary} style={styles.iconInline} /> {formattedDate}
            </Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Patient Information</Text>
            
            <View style={styles.infoRow}>
              <User size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{patient.name}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <User size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age & Gender</Text>
                <Text style={styles.infoValue}>{patient.age} years, {patient.gender}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tests</Text>
            
            {tests.map((test, index) => (
              <View key={index} style={styles.testItem}>
                <View style={styles.testHeader}>
                  <Text style={styles.testName}>{test?.name || 'Unknown Test'}</Text>
                  <Text style={styles.testPrice}>₹{test?.price.toFixed(2) || '0.00'}</Text>
                </View>
                <Text style={styles.testCategory}>{test?.category || 'Unknown Category'}</Text>
              </View>
            ))}
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{invoice.totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Information</Text>
            
            <View style={styles.infoRow}>
              <IndianRupee size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{invoice.status}</Text>
              </View>
            </View>
            
            {invoice.paymentMethod && (
              <View style={styles.infoRow}>
                <CreditCard size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Payment Method</Text>
                  <Text style={styles.infoValue}>{invoice.paymentMethod}</Text>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>{hospitalDetails.footer}</Text>
          </View>
        </View>

        {(invoice.status === 'Pending' || invoice.status === 'Due') && (
          <Button
            title="Mark as Paid"
            onPress={handleMarkAsPaid}
            style={styles.payButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  invoiceContent: {
    // This is the container that will be printed
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  invoiceDate: {
    fontSize: 14,
    color: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInline: {
    marginRight: 4,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 8,
    borderColor: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  testItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  testPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  testCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  payButton: {
    marginBottom: 24,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    minWidth: 120,
  },
});