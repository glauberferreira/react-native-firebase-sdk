import { View, Text } from 'react-native'
import { Button } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  const handleSair = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error(error.code);
      console.error(error.message);
    }
  }

  return (
    <View>
      <Text>Home</Text>
      <Button mode='contained' onPress={handleSair}>Sair</Button>
    </View>
  )
}

export default Home;