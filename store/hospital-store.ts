import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HospitalDetails {
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  registrationNumber?: string;
  taxId?: string;
  logo?: string;
  footer?: string;
  bankDetails?: string;
}

interface HospitalState {
  details: HospitalDetails;
  updateDetails: (details: Partial<HospitalDetails>) => void;
  resetDetails: () => void;
}

// Default hospital details
const defaultHospitalDetails: HospitalDetails = {
  name: 'MedLab Diagnostics',
  address: '123 Healthcare Avenue, Medical District, City',
  phone: '+1 (555) 123-4567',
  email: 'info@medlabdiagnostics.com',
  website: 'www.medlabdiagnostics.com',
  registrationNumber: 'MED-LAB-12345',
  taxId: 'TAX-ID-67890',
  logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200&auto=format&fit=crop',
  footer: 'Thank you for choosing MedLab Diagnostics. For any queries, please contact our customer support.',
};

export const useHospitalStore = create<HospitalState>()(
  persist(
    (set) => ({
      details: { ...defaultHospitalDetails },
      
      updateDetails: (newDetails) => {
        set((state) => ({
          details: {
            ...state.details,
            ...newDetails,
          },
        }));
      },
      
      resetDetails: () => {
        set({
          details: { ...defaultHospitalDetails },
        });
      },
    }),
    {
      name: 'hospital-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);