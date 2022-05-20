import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Input,
  Box,
  Icon,
  Button,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "../firebase";
import { useNavigation } from "@react-navigation/core";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const behavior = Platform.OS === "ios" ? "position" : "padding";
  const offsetKeyBoard = Platform.OS === "ios" ? 5 : 0;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate("Signup");
      }
    });
  };

  const handleSignIn = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("Welcome back", user.email, user.uid);
    } catch (error) {
      alert(error.message);
    }
  };
  //if user is logged in navigate to home
  return (
    <KeyboardAwareScrollView>
      <KeyboardAvoidingView
        height="350%"
        bg="colors.bg"
        behavior={behavior}
        keyboardVerticalOffset={offsetKeyBoard} //when keyboard slides up it won't cover the input field and users will see what they type
      >
        <Box alignSelf="center">
          <Text fontSize="6xl" color="colors.text">
            HiiTCoin
          </Text>
        </Box>
        <Box alignSelf="center">
          <Input
            mx="3"
            placeholder="Email"
            w="75%"
            maxWidth="300px"
            variant="rounded"
            margin="2"
            marginTop="30%"
            color="colors.other"
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            mx="3"
            placeholder="Password"
            w="75%"
            maxWidth="300px"
            secureTextEntry
            variant="rounded"
            margin="2"
            color="colors.other"
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="vpn-key" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </Box>
        <Box justifyContent="center" display="flex" flexDirection="row">
          <Button
            backgroundColor={"colors.text"}
            onPress={handleSignIn}
            flex={1}
            _text={{ fontSize: "xl" }}
          >
            Login
          </Button>
          <Button
            backgroundColor={"colors.text"}
            onPress={handleSignUp}
            flex={1}
            _text={{ fontSize: "xl" }}
          >
            Sign Up
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
