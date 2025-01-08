import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

function EditAnnonce({ route, navigation }) {
    const { annonce } = route.params;
    const [type_bien, setType_bien] = useState(annonce.type_bien);
    const [prix_bien, setPrix_bien] = useState(annonce.prix_bien);
    const [surface, setSurface] = useState(annonce.surface);
    const [type_operation, setType_operation] = useState(annonce.type_operation);
    const [description, setDescription] = useState(annonce.description);

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [operationTypes, setOperationTypes] = useState([]);

    const fetchPropertyTypes = async () => {
        try {
            const response = await fetch("http://192.168.57.43:3002/biens");
            const data1 = await response.json();
            setPropertyTypes(data1);
            console.log('propertyTypes: ', data1);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOperationTypes = async () => {
        try {
            const response = await fetch("http://192.168.57.43:3002/operations");
            const data2 = await response.json();
            setOperationTypes(data2);
            console.log('operationTypes: ', data2);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchPropertyTypes();
        fetchOperationTypes();


        navigation.setOptions({
            headerTitle: 'Editer l\'annonce',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);


    const handleSubmit = async () => {
        try {
            const updateResponse = await fetch(`http://192.168.57.43:3002/annonces/${annonce.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    type_bien,
                    prix_bien,
                    surface,
                    type_operation,
                    description,
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Annonce updated successfully');
            //navigation.goBack();
            navigation.navigate('MyAnnonces')
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update annonce');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Modifier une annonce</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Type de bien:</Text>
                            <Picker
                                selectedValue={type_bien}
                                onValueChange={(itemValue) => setType_bien(itemValue)}
                                style={styles.input}
                            >
                                {propertyTypes.map((item, index) => (
                                    <Picker.Item key={index} label={item.type} value={item.type} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Type d'opération:</Text>
                            <Picker
                                selectedValue={type_operation}
                                onValueChange={(itemValue) => setType_operation(itemValue)}
                                style={styles.input}
                            >
                                {operationTypes.map((item, index) => (
                                    <Picker.Item key={index} label={item.type} value={item.type} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Prix:</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Prix"
                                value={prix_bien.toString()}
                                onChangeText={setPrix_bien}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Surface:</Text>
                            <TextInput
                                style={styles.input2}
                                placeholder="Surface_bien"
                                value={surface.toString()}
                                onChangeText={setSurface}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description:</Text>
                            <TextInput
                                style={[styles.inputDescription, { height: 100, width: 300 }]}
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.twoButtonContainer}>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.textStyle}>Modifier</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#f44336" }}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.textStyle}>Retourner</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    inputDescription: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 10,
        marginVertical: 10,
        width: '100%',
        borderRadius: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 10,
        borderRadius: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 100,
        marginLeft: 40,
        marginRight: 40,
        marginTop: 30,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4CAF50',
    },
    twoButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginRight: 10,
    },
    input2: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default EditAnnonce;