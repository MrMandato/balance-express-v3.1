import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AppBar from "../components/AppBar";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Firebase from "../database/Firebase";
import { useEffect, useState } from "react";
import { ListItem } from "react-native-elements";

export default function UserListScreen() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    Firebase.db.collection("users").onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.docs.forEach((doc) => {
        const { ci, nombre, apellido, ruta } = doc.data();
        users.push({
          id: doc.id,
          ci,
          nombre,
          apellido,
          ruta,
        });
      });

      setUsers(users);
    });
  }, []);

  return (
    <View style={styles.appScreenContainer}>
      <StatusBar style="light" />
      <AppBar barName="Clientes" />
      <View style={styles.addClientContainer}>
        <TouchableOpacity
          style={styles.addClientButton}
          onPress={() => navigation.navigate("AddUser")}
        >
          <AntDesign name="adduser" size={30} color="black" />
        </TouchableOpacity>
        <ScrollView style={styles.scrollContainer}>
          {users.map((user) => {
            return (
              <ListItem
                containerStyle={styles.listItemContainer}
                key={user.id}
                onPress={() =>
                  navigation.navigate("UserDetails", {
                    userId: user.id,
                  })
                }
              >
                <ListItem.Chevron color="#000" size={25} />
                <ListItem.Content>
                  <ListItem.Title style={styles.textItem}>
                    {user.nombre} {user.apellido}
                  </ListItem.Title>
                  <ListItem.Subtitle>{user.ci}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appScreenContainer: {
    flex: 1,
  },
  addClientContainer: {
    backgroundColor: "#aed6f1",
    height: "100%",
    padding: 10,
  },
  addClientButton: {
    backgroundColor: "#5dade2",
    alignSelf: "center",
    padding: 10,
    borderRadius: 15,
    position: "absolute",
    bottom: 100,
    right: 25,
    zIndex: 1,
  },
  scrollContainer: {
    marginHorizontal: 35,
  },
  listItemContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    marginTop: 5,
  },
});
