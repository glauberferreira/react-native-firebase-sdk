import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Estilo from '../estilo';

const Id = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [tarefa, setTarefa] = useState({});

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
                setTarefa(docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTarefa();
    }, []);

    return (
        <View>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <Text>Título: {tarefa.titulo}</Text>
                    <Text>Descrição: {tarefa.descricao}</Text>
                </>
            )}
            <Link href='/tarefas' style={Estilo.link}>Voltar</Link>
        </View>
    )
}

export default Id;