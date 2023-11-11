import '@src/languages/i18n';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import useSetupApp from '@src/hooks/useSetupApp';
import { useActiveUserContext } from '@src/context/userContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Main() {
  const isDBLoadingComplete = useSetupApp();
  const { activeUser } = useActiveUserContext();

  if (isDBLoadingComplete) {
    SplashScreen.hideAsync();
    if (activeUser) {
      return <Redirect href="/homeScreen" />;
    } else {
      return <Redirect href="/loginScreen" />;
    }
  }

  if (!isDBLoadingComplete) {
    //Todo: add loading screen
    return null;
  }
}
