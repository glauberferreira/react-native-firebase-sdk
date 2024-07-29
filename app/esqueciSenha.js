import { View } from 'react-native'
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';

const EsqueciSenha = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEsqueciSenha = async () => {
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setLoading(false)
            router.replace('/');
        } catch (error) {
            console.error(error.code);
            console.error(error.message);
        }
    }

    return (
        <View>
            <TextInput label="E-mail" value={email} onChangeText={setEmail} placeholder='E-mail' keyboardType='email-address' />
            <Button mode='contained' onPress={handleEsqueciSenha} loading={loading}>Esqueci a Senha</Button>
        </View>
    )
}

export default EsqueciSenha;