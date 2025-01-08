import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const AnnonceCard = ({ annonce }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>ID: {annonce.id}</Text>
            <Text>Type de bien: {annonce.type_bien}</Text>
            <Text>Delai: {annonce.delai} Jour (s)</Text>
            <Text>Prix: {annonce.prix_bien} Dhs</Text>
            <Text>Surface: {annonce.surface} m²</Text>
            <Text>Type d'opération: {annonce.type_operation}</Text>
            <Text>Etat: {annonce.etat}</Text>
            <Text>Statut: {annonce.statut}</Text>
            <Text>Description: {annonce.description}</Text>
            {annonce.photo && typeof annonce.photo === 'string' && annonce.photo.split(';').map((url, index) => (
                <Image key={index} source={{ uri: url }} style={styles.image} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 10,
    },
});

export default AnnonceCard;