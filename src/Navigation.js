import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
// Screens
import UserListScreen from "./screens/UserListScreen";
import AddUserScreen from "./screens/AddUserScreen";
import UserDetailsScreen from "./screens/UserDetailsScreen";
import AddLoanScreen from "./screens/AddLoanScreen";
// Icons
import Entypo from "@expo/vector-icons/Entypo";

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="UserLists"
        component={UserListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddUser"
        component={AddUserScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddLoan"
        component={AddLoanScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#5dade2",
      }}
    >
      <Tab.Screen
        name="UserList"
        component={MyStack}
        options={{
          tabBarLabel: "Inicio",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
