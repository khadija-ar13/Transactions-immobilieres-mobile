import React, { useEffect, useState } from "react";
import { Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";
import {
  SectionContent,
  Text,
} from "react-native-rapi-ui";
import Icon from 'react-native-vector-icons/Ionicons';
import Background from '../screens/AuthScreens/components/BackgroundAcceuil';

export default function ({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Acceuil',
      headerStyle: {
        backgroundColor: '#f5f5f5', // Fond gris clair
      },
      headerTintColor: '#1E90FF', // Texte bleu
    });
  }, [navigation]);

  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Liste des photos
  const photos = [
    { id: '1', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/1704445296747?alt=media&token=a6c7c99b-2a0d-4037-8e3b-9e49f1a8221c' },
    { id: '2', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/1704408409787?alt=media&token=c8c6bdfd-3c21-4df6-ac48-43e07925e95d' },
    { id: '3', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/1704406798104?alt=media&token=05cdff38-7a29-4499-8ff2-56557cb28450' },
    { id: '4', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/1704406798107?alt=media&token=b6b04c9a-0239-40a0-a138-a4b1d4c0626b' },
    { id: '5', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/41.jpg?alt=media&token=b52713d6-86bb-4c94-903e-09392a866762' },
    { id: '6', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/46.jpg?alt=media&token=e9504500-255d-445a-a3c0-8f459ccb2cf9' },
    { id: '7', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/34.jpg?alt=media&token=82a4767d-b690-4103-81d3-35d56182b5d8' },
    { id: '8', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/37.jpg?alt=media&token=8f0282dd-41b5-4310-8d91-dbf3ee3d191c' },
    { id: '9', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/47.jpg?alt=media&token=53144fe9-aca9-4a53-8c78-414f56a577c5' },
    { id: '10', uri: 'https://firebasestorage.googleapis.com/v0/b/fir-stockagetransactions2.appspot.com/o/43.jpg?alt=media&token=7ff3f6da-d08d-4cd8-a8b6-503059dd6e62' },
  ];
  const images = photos.map(photo => ({ url: photo.uri }));

  return (
    <View style={styles.background}>
      <ScrollView>
        <SectionContent>
          <Text fontWeight="bold" style={styles.title}>
            Bienvenue sur ImmoTrack !
          </Text>
          <Text style={styles.subtitleBlack}>
            Que vous soyez un particulier à la recherche de la maison de vos rêves, un investisseur cherchant de nouvelles opportunités, ou un professionnel de l'immobilier, notre plateforme offre une solution complète et intuitive pour simplifier chaque étape du processus immobilier.
          </Text>
          <Text style={styles.subtitle}>
            Consultez notre album photo :
          </Text>
          <View style={styles.photoAlbum}>
            {photos.map((photo, index) => (
              <TouchableOpacity key={photo.id} onPress={() => { setImageViewerVisible(true); setCurrentImageIndex(index); }}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
              </TouchableOpacity>
            ))}
          </View>
        </SectionContent>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL("https://example.com")}
      >
        <Text style={styles.buttonText}>Accéder à la page web</Text>
      </TouchableOpacity>

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
  background: {
    flex: 1,
     backgroundColor: '#D3D3D3', // Fond gris clair
    padding: 10,
  },
  title: {
    textAlign: "center",
    color: '#1E90FF', // Texte bleu
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    color: '#1E90FF', // Texte bleu
  },
  subtitleBlack: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    color: '#000000', // Grand texte en noir
  },
  photoAlbum: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  photo: {
    width: 130,
    height: 130,
    margin: 5,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#1E90FF', // Bouton bleu
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texte blanc sur le bouton
    fontSize: 16,
  },
});