import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function App() {
  const [email, setEmail] = useState('glauber.ferreira@ifal.edu.br')
  const [senha, setSenha] = useState('')

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
      // ..
    });    
  }

  return (
    <View style={styles.container}>
      <TextInput label="E-mail" value={email} onChangeText={setEmail} placeholder='E-mail'/>
      <TextInput label="Senha" value={senha} onChangeText={setSenha} placeholder='Senha' secureTextEntry/>
      <Button mode='contained' onPress={handleLogin}>Login</Button>
      <Button mode='contained'>Login com o Google</Button>
      <View style={styles.links}>
        <Link href='/'>Cadastrar</Link>
        <Link href='/'>Esqueci a Senha</Link>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
