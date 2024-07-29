import { Alert, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import { useState } from 'react';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validarSenha = (senha1, senha2) => {
    var validada = false;
    if(senha1 !== senha2){
        Alert.alert('Senhas divergentes', 'As duas senhas estão com conteúdos diferentes. Para realizar o cadastro, é preciso que elas sejam iguais.');
    } else if(senha1.length < 6) {
        Alert.alert('Senha fraca', 'A senha deve ter no mínimo 6 caracteres.');
    } else {
        validada = true;
    }
    return validada;
  }

  const handleCadastrar = async () => {
    try {
        const validada = validarSenha(senha, repetirSenha);
        if(validada) {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, senha);
            setLoading(false);
            router.replace('/home');
        }
    } catch (error) {
        console.error(error.code);
        console.error(error.message);
        setLoading(false);
    }
  }
  
  return (
    <View>
      <TextInput label="E-mail" value={email} onChangeText={setEmail} placeholder='E-mail' keyboardType='email-address'/>
      <TextInput label="Senha" value={senha} onChangeText={setSenha} placeholder='Senha' secureTextEntry/>
      <TextInput label="Repetir Senha" value={repetirSenha} onChangeText={setRepetirSenha} placeholder='Repetir Senha' secureTextEntry/>
      <Button mode='contained' onPress={handleCadastrar} loading={loading}>Cadastrar</Button>
    </View>
  )
}

export default Cadastro