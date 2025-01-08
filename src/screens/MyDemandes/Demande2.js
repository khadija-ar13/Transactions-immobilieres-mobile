import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Icon, Input } from "react-native-elements";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import Modal from "react-native-modal";
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


    const [isModalVisible, setModalVisible] = useState(true);
    const [filterValues, setFilterValues] = useState({
        minPrix: null,
        maxPrix: null,
        minSurface: null,
        maxSurface: null,
        typeBien: null,
        operationType: null,
        communeId: null,
    });

    const fetchAnnouncementsByFilter = async (filterQuery) => {
        try {
            const response = await fetch("http://192.168.43.59:3002/annonces/filtre_intermediaire", {
                method: "POST", // Use POST method for sending filter queries
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filterQuery),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log(data); // Corrected: Replaced comma with semicolon
            console.log(`Fetched ${data.length} items.`); // Add this line

            // Adjust the structure of the markers
            data = data.map(marker => ({
                id: marker.id,
                coordinate: {
                    latitude: marker.latitude ? parseFloat(marker.latitude) : 0,
                    longitude: marker.longitude ? parseFloat(marker.longitude) : 0,
                },
                type_bien: marker.type_bien,
                surface: marker.surface,
                prix_bien: marker.prix_bien,
                date_annonce: marker.date_annonce,
                statut: marker.statut,
                type_operation: marker.type_operation,
                description: marker.description,
                motif_rejet: marker.motif_rejet,
                delai: marker.delai,
                etat: marker.etat,
                intermediaire_id: marker.intermediaire_id,
                photo: marker.photo,
                justificatif: marker.justificatif,
            }));

            setAllAnnonces(data);
            setAnnonces(data.slice(0, ITEMS_PER_PAGE));
            // if (!selectedAnnonce) setSelectedAnnonce(data[0]);
            setSelectedAnnonce(data[0]); // Set the first announcement as selected

        } catch (error) {
            console.error("Error fetching announcements:", error.message);
        }
    };



    // Change the initialization of propertyTypeValue and operationTypeValue to arrays
    const [propertyTypeValue, setPropertyTypeValue] = useState("");

    const [operationTypeValue, setOperationTypeValue] = useState("");

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [operationTypes, setOperationTypes] = useState([]);

    const fetchPropertyTypes = async () => {
        try {
            const response = await fetch("http://192.168.43.59:3002/biens");
            const data1 = await response.json();
            setPropertyTypes(data1);
            //console.log(data1);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOperationTypes = async () => {
        try {
            const response = await fetch("http://192.168.43.59:3002/operations");
            const data2 = await response.json();
            setOperationTypes(data2);
            console.log(operationTypes);
        } catch (error) {
            console.error(error);
        }
    };

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: "blue" }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };


    //Function to fetch commune suggestions
    const fetchCommuneSuggestions = async (query) => {
        try {
            const response = await fetch(
                `http://192.168.43.59:3002/communes/search/${query}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            setCommuneData(data);

        } catch (error) {
            console.error("Error fetching communes:", error.message);
        }
    };



    useFocusEffect(
        React.useCallback(() => {
            fetchPropertyTypes();
            fetchOperationTypes();

           // fetchAnnouncementsByFilter(filterValues);

            fetchAnnouncements();
            getLocation();
        }, [])
    );

    /*useFocusEffect(
        React.useCallback(() => {
            fetchPropertyTypes();
            fetchOperationTypes();
            if (Object.keys(filterValues).length === 0) {
                fetchAnnouncements();
            }
            getLocation();
        }, [filterValues])
    );*/


    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`http://192.168.43.59:3002/demandes/citoyen/${user.id}`);
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



    // Part filter
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleFilterSubmit = () => {
        // Handle filter form submission logic here
        console.log("Filter Values:", filterValues);
        toggleModal(); // Close the modal after submission
        fetchAnnouncementsByFilter(filterValues); // Fetch annonces with the filter values
    };

    const [hideResults, setHideResults] = useState(false);


    const [communeInput, setCommuneInput] = useState('');
    const [communeData, setCommuneData] = useState([]);

    const [showSuggestions, setShowSuggestions] = useState(false);

    // Function to update suggestions
    const updateCommuneSuggestions = async (text) => {
        setCommuneInput(text);
        if (text.length > 0) {
            setShowSuggestions(true);
            await fetchCommuneSuggestions(text);
        } else {
            setShowSuggestions(false);
        }
    };
    // Function to handle selection of a commune
    const handleCommuneSelect = (item) => {
        setCommuneInput(item.commune); // Set the selected commune in the input
        setFilterValues({ ...filterValues, communeId: item.id }); // Add it to filterValues
        setShowSuggestions(false); // Hide the suggestions
    };
    // Autocomplete component
    const Autocomplete = () => (
        <View>
            <Input
                label="Commune"
                placeholder="Type to search..."
                value={communeInput}
                onChangeText={updateCommuneSuggestions}
            />
            {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={communeData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleCommuneSelect(item)}>
                                <Text style={styles.autocompleteItem}>{item.commune}</Text>
                            </TouchableOpacity>
                        )}
                        scrollEnabled={true}
                    />
                </View>
            )}
        </View>
    );


    const handleClearFilter = () => {
        setFilterValues({
            minPrix: null,
            maxPrix: null,
            minSurface: null,
            maxSurface: null,
            typeBien: null,
            operationType: null,
            communeId: null,
        });
        setPropertyTypeValue(""); // Reset property type dropdown
        setOperationTypeValue(""); // Reset operation type dropdown
        setCommuneInput(""); // Reset commune input field
        setShowSuggestions(false); // Hide suggestions if they are being shown
    };
    // Part filter



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

                                <Text style={styles.boldText}>Statut: {item.statut}</Text>
                                <Text style={styles.normalText}>Etat: {item.etat}</Text>
                                <Text style={styles.normalText}>Type: {item.type_bien}</Text>
                                <Text style={styles.normalText}>Surface: {item.surface} m²</Text>
                                <Text style={styles.normalText}>Prix: {item.prix_bien} Dhs</Text>
                                <Text style={styles.normalText}>Description: {item.description}</Text>

                                <Button
                                    title="Détails"
                                    onPress={() => navigation.navigate('DetailsMyDemande', { annonce: item })}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={21} // Try increasing this value
                />
            </View>


            <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, padding: 20 }}>
                    <FlatList
                        data={[{ key: 'modalContent' }]} // Dummy data
                        renderItem={() => (
                            <>
                                <Text h4 style={{ marginBottom: 20 }}>
                                    Filter Properties
                                </Text>

                                <Autocomplete />

                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={propertyTypes}
                                    search
                                    maxHeight={300}
                                    labelField="type" // Use "type" as both label and value
                                    valueField="type"
                                    placeholder={!isFocus ? "Choisir le type de Bien" : "..."}
                                    searchPlaceholder="Search..."
                                    value={propertyTypeValue}
                                    onFocus={() => {
                                        setIsFocus(true);
                                        //CloseAutoComplete();
                                    }}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(item) => {
                                        setPropertyTypeValue(item.type);
                                        setFilterValues({ ...filterValues, typeBien: item.type });
                                        setIsFocus(false);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color={isFocus ? "blue" : "white"}
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                />
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={operationTypes}
                                    search
                                    maxHeight={300}
                                    labelField="type" // Use "type" as both label and value
                                    valueField="type"
                                    placeholder={!isFocus ? "Choisir le type d'Opération" : "..."}
                                    searchPlaceholder="Search..."
                                    value={operationTypeValue}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(item) => {
                                        setOperationTypeValue(item.type);
                                        setFilterValues({ ...filterValues, operationType: item.type });
                                        setIsFocus(false);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color={isFocus ? "blue" : "white"}
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                />
                                <Input
                                    label="Prix Min"
                                    placeholder="Enter Prix Min"
                                    value={filterValues.minPrix}
                                    inputStyle={{ color: 'white' }} // Set the color of the typed text

                                    onChangeText={(value) =>
                                        setFilterValues({ ...filterValues, minPrix: value })
                                    }
                                />
                                <Input
                                    label="Prix Max"
                                    placeholder="Enter Prix Max"
                                    inputStyle={{ color: 'white' }} // Set the color of the typed text

                                    value={filterValues.maxPrix}
                                    onChangeText={(value) =>
                                        setFilterValues({ ...filterValues, maxPrix: value })
                                    }
                                />
                                <Input
                                    label="Surface Min"
                                    placeholder="Enter Surface Max"
                                    inputStyle={{ color: 'white' }} // Set the color of the typed text

                                    value={filterValues.minSurface}
                                    onChangeText={(value) =>
                                        setFilterValues({ ...filterValues, minSurface: value })
                                    }
                                />
                                <Input
                                    label="Surface Max"
                                    placeholder="Enter Surface Max"
                                    inputStyle={{ color: 'white' }} // Set the color of the typed text

                                    value={filterValues.maxSurface}
                                    onChangeText={(value) =>
                                        setFilterValues({ ...filterValues, maxSurface: value })
                                    }
                                />

                                <View style={{ marginTop: 10 }}>
                                    <Button
                                        title="Vider le filtre"
                                        onPress={handleClearFilter}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Button
                                        title="Appliquer le filtre"
                                        onPress={handleFilterSubmit}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Button
                                        title="Cancel"
                                        onPress={toggleModal}
                                    />
                                </View>
                            </>
                        )}
                    />
                </View>
            </Modal>


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
                <TouchableOpacity onPress={toggleModal}>
                    <Icon
                        name="filter"
                        type="font-awesome"
                        color={isDarkmode ? themeColor.white100 : "#191921"}
                        size={20}
                        style={{ marginRight: 15 }}
                    />
                </TouchableOpacity>
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
        backgroundColor: '#f5f5f5',
    },
    card: {
        padding: 10,
        margin: 10,
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
    },
    boldText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    normalText: {
        marginTop: 5,
        fontSize: 16,
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
    icon: {
        marginRight: 5,
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
});