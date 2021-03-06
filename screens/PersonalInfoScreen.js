import { Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, VStack, Box, HStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({ startDate: new Date("May 12, 2001") });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Users", auth.currentUser.uid),
      (user) => {
        let userDb = user.data();
        userDb.startDate = new Date(userDb.startDate.seconds * 1000);
        setUser(userDb);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView bg="colors.bg" height="100%">
      <Box marginTop="10%" marginBottom="10%">
        <HStack justifyContent="space-between">
          <Pressable onPress={() => navigation.navigate("Home")}>
            <MaterialIcons name="home" size={50} color="#9067C6" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Profile")}>
            <MaterialIcons name="person" color="#9067C6" size={50} />
          </Pressable>
        </HStack>
        <Text fontSize="5xl" color="colors.text" textAlign="center">
          Personal Info
        </Text>
      </Box>
      <VStack space={4} alignItems="center" bg="colors.bg">
        <Box
          w="100%"
          h="10"
          bg="colors.bg"
          rounded="md"
          borderWidth="2px"
          borderColor="colors.text"
          shadow={3}
          justifyContent="center"
        >
          <Text fontSize="xl" color="colors.text" marginLeft="10px">
            Height: {user.height || 0} in.
          </Text>
        </Box>
        <Box
          w="100%"
          h="10"
          bg="colors.bg"
          rounded="md"
          borderWidth="2px"
          borderColor="colors.text"
          shadow={3}
          justifyContent="center"
        >
          <Text fontSize="xl" color="colors.text" marginLeft="10px">
            Weight: {user.weight} lbs.
          </Text>
        </Box>
        <Box
          w="100%"
          h="10"
          bg="colors.bg"
          rounded="md"
          borderWidth="2px"
          borderColor="colors.text"
          shadow={3}
          justifyContent="center"
        >
          <Text fontSize="xl" color="colors.text" marginLeft="10px">
            Age: {user.age} years
          </Text>
        </Box>
        <Box
          w="100%"
          h="10"
          bg="colors.bg"
          rounded="md"
          borderWidth="2px"
          borderColor="colors.text"
          shadow={3}
          justifyContent="center"
        >
          <Text fontSize="xl" color="colors.text" marginLeft="10px">
            Account Made:{" "}
            {JSON.stringify(user.startDate.getMonth() + 1) +
              "/" +
              JSON.stringify(user.startDate.getDate()) +
              "/" +
              JSON.stringify(user.startDate.getFullYear())}
          </Text>
        </Box>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default PersonalInfoScreen;
