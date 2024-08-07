import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { auth, db } from '../firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

const AtualizarPerfil = () => {
    const user = auth.currentUser;
    const [nomeExibicao, setNomeExibicao] = useState(user.displayName);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAtualizarPerfil = async () => {
        try {
            setLoading(true);
            await updateProfile(user, { displayName: nomeExibicao });
            await setDoc(doc(db, "usuarios", user.uid), {
                nomeCompleto: nomeCompleto
            });
            setLoading(false);
            router.replace('/home');
        } catch (error) {
            console.error(error.code);
            console.error(error.message);
            setLoading(false);
        }
    }

    return (
        <View>
            <TextInput label="Nome Exibição" value={nomeExibicao} onChangeText={setNomeExibicao} placeholder='Nome Exibição' />
            <TextInput label="Nome Completo" value={nomeCompleto} onChangeText={setNomeCompleto} placeholder='Nome Completo' />
            <Button mode='contained' onPress={handleAtualizarPerfil} loading={loading}>Atualizar Perfil</Button>
        </View>
    )
}

export default AtualizarPerfil;