import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, []);

  return null; // or you can add a loading spinner here
}
