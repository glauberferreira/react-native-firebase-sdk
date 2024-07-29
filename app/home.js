import { View, Text } from 'react-native'
import { Button } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { sendEmailVerification, signOut } from "firebase/auth";
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  const handleVerificarEmail = async () => {
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      setLoading(false);
    } catch (error) {
      console.error(error.code);
      console.error(error.message);      
    }
  }

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
      <Text>UID: {user.uid}</Text>
      <Text>Display Name: {user.displayName}</Text>
      <Text>E-mail: {user.email}</Text>
      <Text>E-mail Verified: {user.emailVerified.toString()}</Text>
      <Text>Phone Number: {user.phoneNumber}</Text>
      <Text>Photo URL: {user.photoURL}</Text>
      <Link href='/atualizarPerfil'>Atualizar Perfil</Link>
      <Button mode='contained' onPress={handleVerificarEmail} loading={loading} disabled={user.emailVerified}>Verificar E-mail</Button>
      <Button mode='contained' onPress={handleSair}>Sair</Button>
    </View>
  )
}

export default Home;