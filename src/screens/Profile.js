import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
	Avatar,
	Layout,
	Section,
	SectionContent,
	Text,
} from "react-native-rapi-ui";
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../AuthContext';


export default function ({ navigation }) {
	const { user, setUser } = useContext(AuthContext);

	const onLogoutPressed = () => {
		setUser(null);
		navigation.reset({
			index: 0,
			routes: [{ name: 'StartScreen' }],
		});
	};

	const CustomButton = ({ onPress, backgroundColor, iconName, title, style }) => (
		<TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }, style]}>
			<View style={styles.buttonContent}>
				<Icon name={iconName} size={20} color="#fff" />
				<Text style={styles.buttonText}>{title}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<Layout>
			<View style={styles.container}>
				<Section style={styles.section}>
					<SectionContent style={styles.sectionContent}>
						<Avatar
							source={{ uri: '' }}
							size="xl"
							shape="rounded"
							style={styles.avatar}
						/>
						<Text style={styles.name}>{user.nom} {user.prenom}</Text>
						<Text style={styles.email}>{user.email}</Text>
						<Text style={styles.fonction}>Étudiant en 3ème année filière SI/SIG</Text>


						<CustomButton
							onPress={() => {
								// navigation.navigate("EditProfileScreen");
							}}
							backgroundColor={'#4682b4'}
							iconName="pencil"
							title="Editer le profile"
							style={{ marginTop: 30 }}
						/>

						<CustomButton
							onPress={onLogoutPressed}
							backgroundColor={'#ff6347'}
							iconName="sign-out"
							title="Se déconnecter"
						/>

					</SectionContent>
				</Section>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: '#f5f5f5',
	},
	section: {
		width: '90%',
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 5,
	},
	sectionContent: {
		paddingTop: 70,
	},
	avatar: {
		alignSelf: 'center',
		marginTop: -50,
		marginBottom: 20,
		borderWidth: 4,
		borderColor: '#fff',
	},
	name: {
		textAlign: "center",
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
		color: 'yellowgreen'
	},
	email: {
		marginTop: 20,
		textAlign: "center",
		fontSize: 16,
		color: '#666',
		marginBottom: 20,
	},
	fonction: {
        textAlign: "center",
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
	button: {
		padding: 10,
		borderRadius: 20,
		width: '60%',
		alignSelf: 'center',
		marginBottom: 20,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
	},
});