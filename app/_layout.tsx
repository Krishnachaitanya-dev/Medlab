import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/auth-store";
import { usePatientStore } from "@/store/patient-store";
import { useTestStore } from "@/store/test-store";
import { useReportStore } from "@/store/report-store";
import { useInvoiceStore } from "@/store/invoice-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Initialize all stores to ensure data is loaded
  const { fetchPatients } = usePatientStore();
  const { fetchTests } = useTestStore();
  const { fetchReports } = useReportStore();
  const { fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    // Load all data when the app starts
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchPatients(),
          fetchTests(),
          fetchReports(),
          fetchInvoices()
        ]);
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="patient/[id]" options={{ title: "Patient Details" }} />
      <Stack.Screen name="register-patient" options={{ title: "Register Patient" }} />
      <Stack.Screen name="test/[id]" options={{ title: "Test Details" }} />
      <Stack.Screen name="report/[id]" options={{ title: "Report Details" }} />
      <Stack.Screen name="invoice/[id]" options={{ title: "Invoice Details" }} />
    </Stack>
  );
}