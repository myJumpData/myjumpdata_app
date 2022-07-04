import NetInfo from '@react-native-community/netinfo';
import * as React from 'react';
import {AppState, AppStateStatus, Platform, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import App from './app/App';
import LoadingScreen from './app/components/LoadingScreen';
import {Colors} from './app/Constants';
import StoreProvider from './app/redux/StoreProvider';

const queryClient = new QueryClient();

export default function Main() {
  const isDarkMode = useColorScheme() === 'dark';

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        let s = false;
        if (state.isConnected === true) {
          s = true;
        }
        setOnline(s);
      });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <React.Suspense fallback={<LoadingScreen />}>
          <StoreProvider>
            <App />
          </StoreProvider>
        </React.Suspense>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
