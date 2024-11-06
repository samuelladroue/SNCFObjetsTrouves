import React, { useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";

function req(method, baseURL, path, fun = function (j) {}) {
  if (baseURL.charAt(baseURL.length - 1) != "/") {
    baseURL = baseURL + "/";
  }
  if (path.length > 0 && path.charAt(0) == "/") {
    path = path.substr(1);
  }

  const url = new URL(path, baseURL);
  console.log(url);
  let body = null;

  let headers;

  headers = new Headers();

  fetch(url, {
    method: method,
    headers: headers,
    body: body,
  })
    .then((res) => {
      console.log("res status : ", res.status);
      if (!res.ok) {
        throw Error(res.statusText);
      }
      if (res.status == "200") {
        return res.json();
      }
      return res;
    })
    .then(fun)
    .catch((err) => alert(err));
}

const KivAppA = () => {
  const [list, setList] = useState([]);

  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          req(
            "GET",
            "https://data.sncf.com",
            "/api/explore/v2.1/catalog/datasets/objets-trouves-restitution/records",
            (res) => setList(res.results)
          );
        }}
      >
        <Text>Start</Text>
      </TouchableOpacity>

      {/* Liste des resultats */}
      <KeyValues style={{ flex: 1 }} display={list} />
    </View>
  );
};

const KeyValues = (props) => {
  return (
    <FlatList
      data={props.display}
      renderItem={({ item, index: n }) => (
        <Text style={{ fontSize: 30 }}>
          {"Item " +
            n +
            " is (" +
            item.gc_obo_nature_c +
            " at " +
            item.gc_obo_gare_origine_r_name +
            ", " +
            item.date +
            ")"}
        </Text>
      )}
      keyExtractor={(item) => item.date}
    />
  );
};
export default KivAppA;
