import { Platform } from 'react-native';
import { usePatientStore } from '@/store/patient-store';
import { useTestStore } from '@/store/test-store';
import { useReportStore } from '@/store/report-store';
import { useInvoiceStore } from '@/store/invoice-store';
import { useHospitalStore } from '@/store/hospital-store';

// Function to export all data as JSON
export const exportData = async (): Promise<boolean> => {
  try {
    // Get all data from stores
    const patients = usePatientStore.getState().patients;
    const tests = useTestStore.getState().tests;
    const reports = useReportStore.getState().reports;
    const invoices = useInvoiceStore.getState().invoices;
    const hospitalDetails = useHospitalStore.getState().details;

    // Create a JSON object with all data
    const data = {
      patients,
      tests,
      reports,
      invoices,
      hospitalDetails,
      exportDate: new Date().toISOString(),
      version: '1.0.0', // Add version for future compatibility
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    if (Platform.OS === 'web') {
      // For web, create a download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medlab_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } else {
      // For mobile, we would use Share API or file system
      console.log('Export functionality for mobile not implemented');
      // In a real app, you might use:
      // import * as Sharing from 'expo-sharing';
      // import * as FileSystem from 'expo-file-system';
      // const fileUri = FileSystem.documentDirectory + 'medlab_data.json';
      // await FileSystem.writeAsStringAsync(fileUri, jsonString);
      // await Sharing.shareAsync(fileUri);
      return true;
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

// Function to import data from JSON
export const importData = async (jsonString: string): Promise<boolean> => {
  try {
    // Parse the JSON string
    const data = JSON.parse(jsonString);

    // Validate the data structure
    if (!data.patients || !data.tests || !data.reports || !data.invoices) {
      throw new Error('Invalid data format: Missing required data collections');
    }

    // Get the store setters
    const patientStore = usePatientStore.getState();
    const testStore = useTestStore.getState();
    const reportStore = useReportStore.getState();
    const invoiceStore = useInvoiceStore.getState();
    const hospitalStore = useHospitalStore.getState();

    // Update all stores with the imported data
    patientStore.setPatients(data.patients);
    testStore.setTests(data.tests);
    reportStore.setReports(data.reports);
    invoiceStore.setInvoices(data.invoices);
    
    // If hospital details are included in the import, update them too
    if (data.hospitalDetails) {
      hospitalStore.updateDetails(data.hospitalDetails);
    }

    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};