import { View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

const Create = () => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = auth.currentUser;

    /**
     * https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
     * 
     * Regra com as permissões necessárias para o funcionamento.
     * 
     * Qualquer usuário logado pode criar uma tarefa.
     *  match /tarefas/{id} {
     *      allow create: if request.auth != null;
     *  }    
     */
    const handleCriar = async () => {
        try {
            setLoading(true);
            await addDoc(collection(db, "tarefas"), {
                // Os nomes do lado esquerdo (key) serão usados para armazenar o dado no Firestore.
                // Lado direito (value) é o valor que será armazenado. Apontam para um state ou valor fixo.
                titulo: titulo,
                descricao: descricao,
                concluida: false, // Por padrão, todas as tarefas são criadas não concluídas.
                idUsuario: user.uid
            });
            router.replace('/tarefas');
        } catch (error) {
            console.error(error.code);
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <TextInput label="Título" value={titulo} onChangeText={setTitulo} />
            <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} />
            <Button mode='contained' onPress={handleCriar} loading={loading}>Criar</Button>
        </View>
    )
}

export default Create;