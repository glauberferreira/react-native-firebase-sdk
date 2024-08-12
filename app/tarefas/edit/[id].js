import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Edit = () => {
    const { id } = useLocalSearchParams();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [concluida, setConcluida] = useState(false);
    const [loadingTela, setLoadingTela] = useState(true);
    const [loadingEditar, setLoadingEditar] = useState(false);
    const router = useRouter();

    /**
     * https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
     * 
     * Regra com as permissões necessárias para o funcionamento.
     * 
     * A leitura de uma tarefa é permitida para usuários logados e apenas para as suas próprias tarefas.
     *  match /tarefas/{id} {
     *      allow read: if request.auth != null && request.auth.uid == resource.data.idUsuario;
     *  }    
     */
    const getTarefa = async () => {
        try {
            const docRef = doc(db, "tarefas", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let tarefa = docSnap.data();
                setTitulo(tarefa.titulo);
                setDescricao(tarefa.descricao);
                setIdUsuario(tarefa.idUsuario);
                setConcluida(tarefa.concluida);
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingTela(false);
        }
    };

    useEffect(() => {
        getTarefa();
    }, []);

    /**
     * https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
     * 
     * Regra com as permissões necessárias para o funcionamento.
     * 
     * A edição de tarefas é permitida para usuários logados e apenas para as suas próprias tarefas.
     *  match /tarefas/{id} {
     *      allow update: if request.auth != null && request.auth.uid == resource.data.idUsuario;
     *  }    
     */
    const handleEditar = async () => {
        try {
            setLoadingEditar(true);
            await setDoc(doc(db, "tarefas", id), {
                titulo: titulo,
                descricao: descricao,
                concluida: concluida,
                idUsuario: idUsuario
            });
            router.replace('/tarefas');
        } catch (error) {
            console.error(error.code);
            console.error(error.message);
        } finally {
            setLoadingEditar(false);
        }
    }

    return (
        <View>
            {loadingTela ? (
                <ActivityIndicator />
            ) : (
                <>
                    <TextInput label="Título" value={titulo} onChangeText={setTitulo} />
                    <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox status={concluida ? 'checked' : 'unchecked'} onPress={() => {
                            setConcluida(!concluida);
                        }} />
                        <Text>Concluída</Text>
                    </View>
                    <Button mode='contained' onPress={handleEditar} loading={loadingEditar}>Editar</Button>
                </>
            )}
        </View>
    )
}

export default Edit;