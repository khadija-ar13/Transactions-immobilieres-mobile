import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { Layout, Text, themeColor, useTheme } from "react-native-rapi-ui";
import AuthContext from '../../AuthContext';


const ITEMS_PER_PAGE = 50;

export default function ({ navigation }) {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Mes Demandes',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);


    const { user } = useContext(AuthContext);
    const { isDarkmode } = useTheme();
    const [region, setRegion] = useState(null);
    const [annonces, setAnnonces] = useState([]);
    const [selectedAnnonce, setSelectedAnnonce] = useState(annonces[0]);
    const [allAnnonces, setAllAnnonces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMap, setShowMap] = useState(true);



    useFocusEffect(
        React.useCallback(() => {
            fetchAnnouncements();
            getLocation();
        }, [])
    );

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`http://192.168.57.43:3002/demandes/citoyen/${user.id}`);
            //const response = await fetch(`http://192.168.43.59:3002/annonces/Annonceur/${user.id}`);

            let data = await response.json();
            console.log(data);
            console.log(`Fetched ${data.length} items.`);


            // Adjust the structure of the markers
            data = data.map(marker => ({
                id: marker.annonce.id,
                coordinate: {
                    latitude: marker.annonce.latitude ? parseFloat(marker.annonce.latitude) : 0,
                    longitude: marker.annonce.longitude ? parseFloat(marker.annonce.longitude) : 0,
                },
                type_bien: marker.annonce.type_bien,
                surface: marker.annonce.surface,
                prix_bien: marker.annonce.prix_bien,
                date_annonce: marker.annonce.date_annonce,
                statut: marker.annonce.statut,
                type_operation: marker.annonce.type_operation,
                description: marker.annonce.description,
                motif_rejet: marker.annonce.motif_rejet,
                delai: marker.annonce.delai,
                etat: marker.annonce.etat,
                intermediaire_id: marker.annonce.intermediaire_id,
                photo: marker.annonce.photo,
                justificatif: marker.annonce.justificatif,
                demande_id: marker.id,
            }));

            setAllAnnonces(data);
            setAnnonces(data.slice(0, ITEMS_PER_PAGE));
            if (!selectedAnnonce) setSelectedAnnonce(data[0]); // Set the first announcement as selected
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndReached = () => {
        const nextPage = currentPage;
        const nextSetOfAnnonces = allAnnonces.slice(nextPage * ITEMS_PER_PAGE, (nextPage + 1) * ITEMS_PER_PAGE);

        if (nextSetOfAnnonces.length > 0) {
            setAnnonces(oldAnnonces => [...oldAnnonces, ...nextSetOfAnnonces]);
            setCurrentPage(nextPage + 1);
        }
    };


    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };


    const handleAnnonceSelect = (annonce) => {
        setSelectedAnnonce(annonce);
    };



    return (
        <Layout>

            {showMap && (
                <MapView
                    style={{ flex: 0.65 }}
                    region={
                        selectedAnnonce
                            ? {
                                latitude: selectedAnnonce.coordinate.latitude,
                                longitude: selectedAnnonce.coordinate.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }
                            : {
                                latitude: 0,
                                longitude: 0,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }
                    }
                >
                    {allAnnonces.map((annonce) => (
                        <Marker
                            key={annonce.id}
                            coordinate={annonce.coordinate}
                            description={annonce.description}
                        >
                            <Image
                                source={require("./../../../assets/real-estate.png")}
                                style={{
                                    width: 35,
                                    height: 35
                                }}
                            />
                        </Marker>
                    ))}
                </MapView>
            )}

            <View style={styles.container}>
                <FlatList
                    data={annonces}
                    keyExtractor={(item, index) => item.id || String(index)} // Use index as a fallback
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleAnnonceSelect(item)}>
                            <View style={styles.card}>
                                <Image
                                    style={styles.image}
                                    source={
                                        item.photo && item.photo.split(';')[0]
                                            ? { uri: item.photo.split(';')[0] }
                                            : { uri: 'https://www.maisons-du-nord.fr/uploads/images/5ac5df322f55c5aa689f79a101_mdn-realisation-maison-noyelle-sous-bellone.jpg' }
                                    }
                                />

                                <View style={styles.container}>

                                    <View style={styles.iconTextContainer}>
                                        <Text style={styles.title2}>Type de bien: </Text>
                                        <Text style={styles.normalText}>{item.type_bien}</Text>
                                    </View>
                                    <View style={styles.iconTextContainer}>
                                        <Text style={styles.title2}>Operation: </Text>
                                        <Text style={styles.normalText}>{item.type_operation}</Text>
                                    </View>

                                    <View style={styles.iconTextContainer}>
                                        <Text style={styles.title2}>Surface: </Text>
                                        <Text style={styles.normalText}>{item.surface} m²</Text>
                                    </View>
                                    <View style={styles.iconTextContainer}>
                                        <Text style={styles.title2}>Prix: </Text>
                                        <Text style={styles.normalText}>{item.prix_bien} Dhs</Text>
                                    </View>

                                </View>

                                <Button
                                    title="Détails"
                                    onPress={() => navigation.navigate('DetailsMyDemande', { annonce: item })}
                                    buttonStyle={{ backgroundColor: 'yellowgreen' }} // Change the background color
                                    titleStyle={{ color: 'white' }} // Change the text color
                                    containerStyle={{ width: '80%', alignSelf: 'center' }} // Change the width and align the button to the center
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={21} // Try increasing this value
                />
            </View>





            <View style={{
                flexDirection: 'row',
                bottom: 0,
                width: '100%',
                height: 40,
                alignItems: 'center',
                justifyContent: 'space-around',
                backgroundColor: '#fff',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderTopWidth: 0.5,
                borderTopColor: 'black',
            }}>
                <TouchableOpacity onPress={() => setShowMap(!showMap)}>
                    <Ionicons
                        name={showMap ? "list-outline" : "map-outline"}
                        size={24}
                        color={isDarkmode ? themeColor.white100 : "#191921"}
                    />
                </TouchableOpacity>
            </View>

        </Layout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 10,
        marginTop: 10,
    },
    card: {
        padding: 20,
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    title2: {
        color: 'yellowgreen',
        fontWeight: 'bold',
    },
    boldText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    normalText: {
        fontSize: 15,
    },


    suggestionsContainer: {
        maxHeight: 200, // Set a fixed height to make the list scrollable
        backgroundColor: 'white', // Set the background color as needed
        borderColor: 'gray', // Optional: border color
        borderWidth: 1, // Optional: border width
        borderRadius: 5, // Optional: border radius
        // Add other styling as needed
    },
    dropdown: {
        margin: 15,

        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "white",
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

    autocompleteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },

    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
});