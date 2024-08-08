import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router';
import Estilo from '../estilo';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { List } from 'react-native-paper';

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [tarefas, setTarefas] = useState([]);
    const user = auth.currentUser;

    /**
     * https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
     * 
     * Regra com as permissões necessárias para o funcionamento.
     * 
     * A leitura de tarefas é permitida para usuários logados e apenas para as suas próprias tarefas.
     *  match /tarefas/{id} {
     *      allow read: if request.auth != null && request.auth.uid == resource.data.idUsuario;
     *  }    
     */
    const getAllTarefas = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, "tarefas"), where("idUsuario", "==", user.uid)));
            let array = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTarefas(array);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllTarefas();
    }, []);

    return (
        <View>
            <Link style={Estilo.link} href='/tarefas/create'>Criar</Link>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={tarefas}
                    renderItem={({ item }) => (
                        <List.Item title={item.titulo} description={item.descricao} />
                    )}
                />
            )}
        </View>
    )
}

export default Index;