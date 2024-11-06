import React, { useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";

const fetchLostObjects = async (setList) => {
  try {
    const response = await fetch(
      "https://data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=10"
    );
    const data = await response.json();
    setList(data.records);
  } catch (error) {
    console.error("Error fetching data: ", error);
    alert("Error fetching data. Please try again.");
  }
};

const KivAppA = () => {
  const [list, setList] = useState([]);

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={() => fetchLostObjects(setList)}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Fetch Lost Objects</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={(item) => item.recordid}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
            <Text>Objet: {item.fields.gc_obo_nature_c}</Text>
            <Text>Lieu: {item.fields.gc_obo_gare_origine_r_name}</Text>
            <Text>Date: {item.fields.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default KivAppA;
