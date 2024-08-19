import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-paper';
import { auth, db } from '../firebaseConfig';
import { sendEmailVerification, signOut } from "firebase/auth";
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Estilo from './estilo';
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Home = () => {
  const [loadingTela, setLoadingTela] = useState(true);
  const [loadingVerificarEmail, setLoadingVerificarEmail] = useState(false);
  const [usuarioFirestore, setUsuarioFirestore] = useState({});
  const [url, setUrl] = useState('');
  const router = useRouter();
  const user = auth.currentUser;
  const storage = getStorage();

  const getUsuarioFirestore = async () => {
    try {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsuarioFirestore(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTela(false);
    }
  }

  const getImagem = async () => {
    try {
      const url = await getDownloadURL(ref(storage, 'banner.jpeg'));
      setUrl(url);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsuarioFirestore();
    getImagem();
  }, []);

  const handleVerificarEmail = async () => {
    try {
      setLoadingVerificarEmail(true);
      await sendEmailVerification(auth.currentUser);
      setLoadingVerificarEmail(false);
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
      {loadingTela ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text>UID: {user.uid}</Text>
          <Text>Display Name: {user.displayName}</Text>
          <Text>E-mail: {user.email}</Text>
          <Text>E-mail Verified: {user.emailVerified.toString()}</Text>
          <Text>Phone Number: {user.phoneNumber}</Text>
          <Text>Photo URL: {user.photoURL}</Text>
          <Text>Nome Completo: {usuarioFirestore.nomeCompleto}</Text>
          <View style={styles.links}>
            <Link href='/atualizarPerfil' style={Estilo.link}>Atualizar Perfil</Link>
            <Link href='/tarefas' style={Estilo.link}>Tarefas</Link>
          </View>
          <Button mode='contained' onPress={handleVerificarEmail} loading={loadingVerificarEmail} disabled={user.emailVerified}>Verificar E-mail</Button>
          <Button mode='contained' onPress={handleSair}>Sair</Button>
          <Image source={{uri: url}} style={{width: 312, height: 211}}/>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  links: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default Home;