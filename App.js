import React, { useState, useEffect } from "react";
import { FlatList, View, Text, TouchableOpacity, TextInput } from "react-native";

const fetchLostObjects = async (page, setList, setTotalPages, year, month, day) => {
  try {
    // Construire la requête avec les filtres
    let filterQuery = "";
    if (year) filterQuery += `&refine.date=${year}`;
    if (month) filterQuery += `-${month}`;
    if (day) filterQuery += `-${day}`;

    const response = await fetch(
      `https://data.sncf.com/api/records/1.0/search/?dataset=objets-trouves-restitution&q=&rows=100&start=${
        page * 100
      }${filterQuery}`
    );

    if (!response.ok) throw new Error("Erreur avec la récupération des données.");

    const data = await response.json();
    setList(data.records || []);
    const totalRecords = data.nhits || 0;
    setTotalPages(Math.ceil(totalRecords / 100));
  } catch (error) {
    console.error("Error fetching data: ", error);
    alert("Une erreur s'est produite lors de la récupération des données.");
  }
};

const KivAppA = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    fetchLostObjects(page, setList, setTotalPages, year, month, day);
  }, [page, year, month, day]);

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Section de filtres */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Filtrer par :</Text>
        <TextInput
          placeholder="Année (ex : 2024)"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <TextInput
          placeholder="Mois (ex : 01 pour Janvier)"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <TextInput
          placeholder="Jour (ex : 15)"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <TouchableOpacity
          onPress={() => setPage(0)} // Revenir à la première page après un filtre
          style={{
            backgroundColor: "#007AFF",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Appliquer le Filtre</Text>
        </TouchableOpacity>
      </View>

      {/* Liste paginée */}
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
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>Aucun objet trouvé.</Text>
        }
      />

      {/* Contrôles de pagination */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={page === 0}
          style={{
            backgroundColor: page === 0 ? "#ccc" : "#007AFF",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            flex: 1,
            marginRight: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Page Précédente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          style={{
            backgroundColor: page === totalPages - 1 ? "#ccc" : "#007AFF",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            flex: 1,
            marginLeft: 5,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Page Suivante</Text>
        </TouchableOpacity>
      </View>

      {/* Page actuelle */}
      <Text style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}>
        Page {page + 1} sur {totalPages}
      </Text>
    </View>
  );
};

export default KivAppA;
