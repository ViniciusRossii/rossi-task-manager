import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons, Feather } from '@expo/vector-icons'

import AppLoading from 'expo-app-loading';

export default function Tasks() {

    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')

    const [isReady, setIsReady] = useState(false)

    const taskListRef = useRef()

    useEffect(() => {
        async function saveTasks() {
            try {
                await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
            }
            catch (error) {
                console.warn(error)
            }
        }
        
        saveTasks()
    }, [tasks])

    async function loadTasks() {
        try {
            const savedTasks = await AsyncStorage.getItem('tasks')
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks))
            }
        }
        catch (error) {
            console.warn(error)
        }
    }

    function addTask() {
        if (!newTask.trim()) return
        if (tasks.includes(newTask)) return

        setTasks([...tasks, newTask])
        setNewTask('')
        Keyboard.dismiss()
    }

    function removeTask(item) {
        Alert.alert(
            'Remove Task',
            'Are you sure?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { return }
                },
                {
                    text: 'Ok',
                    onPress: () => { setTasks(tasks.filter(task => task !== item)) }
                }
            ]
        )
    }

    if (!isReady) {
        return (
            <AppLoading
            startAsync={loadTasks}
            onFinish={() => setIsReady(true)}
            onError={console.warn}
            />
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.tasksContainer}>
                <FlatList
                    ref={taskListRef}
                    data={tasks}
                    onContentSizeChange={() => taskListRef.current.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.taskContainer}>
                                <Text style={styles.taskName}>{item}</Text>
                                <TouchableOpacity onPress={() => removeTask(item)} style={styles.deleteButton}>
                                    <Feather name="trash-2" color="#fff" size={24} />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    keyExtractor={(item) => item}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput style={styles.inputTask} maxLength={50} value={newTask} onChangeText={text => setNewTask(text)} />
                <TouchableOpacity style={styles.addButton} onPress={addTask}>
                    <Ionicons name="add" color="#fff" size={30} />
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" backgroundColor="#A1B5D8" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A1B5D8',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    tasksContainer: {
        width: '100%',
        flex: 1,
        marginTop: 30
    },
    inputContainer: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderColor: '#ddd',
        borderTopWidth: 1
    },
    inputTask: {
        height: 50,
        width: '80%',
        backgroundColor: '#dfdfdf',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    addButton: {
        height: 50,
        width: 50,
        backgroundColor: '#235789',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 70,
        marginBottom: 5,
        justifyContent: 'space-around',
    },
    taskName: {
        fontSize: 18,
        backgroundColor: '#dfdfdf',
        maxHeight: '100%',
        width: '80%',
        padding: 10,
        borderRadius: 10,
        flexWrap: 'wrap'
    },
    deleteButton: {
        height: 50,
        width: 50,
        backgroundColor: '#ED1C24',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});
