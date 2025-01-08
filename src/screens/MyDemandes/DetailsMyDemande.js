import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';



function DetailsMyDemande({ route, navigation }) {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Détails de la demande',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);

    const { annonce } = route.params;
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleDelete = () => {
        /*if (annonce.statut === "RESERVEE") {
            alert('Suppression est annulée car l\'annonce de cette demande est réservée par un intermédiaire');
            return;
        }*/

        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr(e) de vouloir supprimer cette demande ?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        try {
                            const deleteResponse = await fetch(`http://192.168.57.43:3002/demandes/${annonce.demande_id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                },
                            });

                            if (!deleteResponse.ok) {
                                throw new Error('Network response was not ok');
                            }

                            alert('Demande supprimée avec succès');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error:', error);
                            alert('Failed to delete annonce');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const images = annonce.photo ? annonce.photo.split(';').map(url => ({ url })) : [];

    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.card}>

                    <View style={styles.container}>
                        <View style={styles.iconTextContainer}>
                            <Text style={styles.title}>Type de bien: </Text>
                            <Text style={styles.normalText}>{annonce.type_bien}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={styles.title}>Operation: </Text>
                            <Text style={styles.normalText}>{annonce.type_operation}</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={styles.title}>Surface: </Text>
                            <Text style={styles.normalText}>{annonce.surface} m²</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={styles.title}>Prix: </Text>
                            <Text style={styles.normalText}>{annonce.prix_bien} Dhs</Text>
                        </View>
                        <View style={styles.iconTextContainer}>
                            <Text style={styles.title}>Description: </Text>
                            <Text style={styles.normalText}>{annonce.description}</Text>
                        </View>
                    </View>



                    {annonce.photo && annonce.photo.split(';').map((url, index) => (
                        <TouchableOpacity key={index} onPress={() => { setImageViewerVisible(true); setCurrentImageIndex(index); }}>
                            <Image source={{ uri: url }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Supprimer" onPress={handleDelete} color="yellowgreen" />
                    <Button title="Retourner" onPress={() => navigation.goBack()} color="yellowgreen" />
                </View>
            </ScrollView>

            <Modal
                isVisible={isImageViewerVisible}
                style={{ width: '100%', height: '100%', margin: 0 }}
            >
                <ImageViewer
                    imageUrls={images}
                    index={currentImageIndex}
                    enableSwipeDown={true}
                    onSwipeDown={() => setImageViewerVisible(false)}
                    renderHeader={() => (
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => setImageViewerVisible(false)}>
                            <Icon name="close" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    card: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 10,
    },
    title: {
        color: 'yellowgreen',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 10,
    },

    normalText: {
        flexShrink: 1,
    },
    iconTextContainer: {
        flexDirection: 'row',
    },
});

export default DetailsMyDemande;