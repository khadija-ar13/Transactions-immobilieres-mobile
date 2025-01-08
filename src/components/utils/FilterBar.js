import React from "react";
import { View, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function FilterBar({ setTypeDeBien, setPrix, setSurface }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      
      <Picker
        style={{ flex: 1 }}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        <Picker.Item label="appartement" value="appartement" />
        <Picker.Item label="villa" value="villa" />
        <Picker.Item label="duplex" value="duplex" />
      </Picker>

      <TextInput
        placeholder="Prix"
        style={{ flex: 1 }}
        onChangeText={(text) => setPrix(text)}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Surface"
        style={{ flex: 1 }}
        onChangeText={(text) => setSurface(text)}
        keyboardType="numeric"
      />
    </View>
  );
}