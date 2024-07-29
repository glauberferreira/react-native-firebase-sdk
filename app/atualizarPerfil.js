import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { updateProfile } from 'firebase/auth';

const AtualizarPerfil = () => {
    const user = auth.currentUser;
    const [nome, setNome] = useState(user.displayName);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAtualizarPerfil = async () => {
        try {
            setLoading(true);
            await updateProfile(user, { displayName: nome });
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
            <TextInput label="Nome" value={nome} onChangeText={setNome} placeholder='Nome' />
            <Button mode='contained' onPress={handleAtualizarPerfil} loading={loading}>Atualizar Perfil</Button>
        </View>
    )
}

export default AtualizarPerfil;