import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router';
import Estilo from '../estilo';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { IconButton, List } from 'react-native-paper';

const Tarefa = ({ id, titulo, descricao, setDeletedDate }) => {
    const [loading, setLoading] = useState(false);

    /**
     * https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents
     * 
     * Regra com as permissões necessárias para o funcionamento.
     * 
     * A exclusão de tarefas é permitida para usuários logados e apenas para as suas próprias tarefas.
     *  match /tarefas/{id} {
     *      allow delete: if request.auth != null && request.auth.uid == resource.data.idUsuario;
     *  }    
     */
    const handleDeleteTarefa = async (id) => {
        try {
            setLoading(true);
            await deleteDoc(doc(db, "tarefas", id));
            setDeletedDate(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <List.Item
            title={titulo}
            description={descricao}
            right={props => <IconButton {...props} icon='delete' iconColor='red' loading={loading} onPress={() => handleDeleteTarefa(id)} />} />
    )
}

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [tarefas, setTarefas] = useState([]);
    const [deletedDate, setDeletedDate] = useState(null);
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
    }, [deletedDate]);

    return (
        <View>
            <Link style={Estilo.link} href='/tarefas/create'>Criar</Link>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={tarefas}
                    renderItem={({ item }) => (
                        <Tarefa id={item.id} titulo={item.titulo} descricao={item.descricao} setDeletedDate={setDeletedDate} />
                    )}
                />
            )}
            <Link style={Estilo.link} href='/home'>Home</Link>
        </View>
    )
}

export default Index;