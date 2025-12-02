import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigations/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SplashScreen"
>;

type Props = {
  navigation: NavigationProp;
};

export default function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>

      {/* Top Right Buttons */}
      <View style={styles.topRightButtons}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>Smart fashion, confident style!</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dad3aff6",
    alignItems: "center",
    justifyContent: "center",
  },

  topRightButtons: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },

  // Style nút: bo tròn, viền mỏng, minimal style
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  btnText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "900",
  },

  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 160,
    height: 160,
    marginBottom: 15,

    borderRadius: 25,
    marginRight: 12,
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
  },
});
