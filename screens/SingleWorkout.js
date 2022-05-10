import { StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Input,
  Box,
  Icon,
  Button,
  Center,
  flex,
  Text,
  keyboardDismissHandlerManager,
  Pressable,
  Badge,
  Spacer,
  Flex,
  HStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import { TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native';

const SingleWorkout = ({ route }) => {
  let workout = route.params.workout;

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView bg="colors.bg" height="100%" behavior="padding">
          <Box marginTop="5%" alignSelf="center">
            <Text fontSize="6xl" color="colors.text">
              {workout.name}
            </Text>
          </Box>
          <Button
            alignSelf="center"
            marginTop="5%"
            shadow="3"
            bg="colors.text"
            p="5"
            rounded="8"
            width="80%"
          >
            <Text
              alignSelf="center"
              color="white"
              fontWeight="medium"
              fontSize="4xl"
            >
              Begin Workout
            </Text>
          </Button>
          <Button
            alignSelf="center"
            marginTop="5%"
            shadow="3"
            bg="colors.text"
            p="5"
            rounded="8"
            width="80%"
          >
            <Text alignSelf="center" color="white" fontSize="4xl">
              Edit Workout
            </Text>
          </Button>
          <Box
            marginTop="5%"
            alignSelf="center"
            bg="colors.red"
            p="9"
            rounded="xl"
            width="80%"
          >
            <Text
              alignSelf="center"
              color="white"
              fontWeight="medium"
              fontSize="4xl"
            >
              Rounds: {workout.rounds}
            </Text>
          </Box>
          {workout.exercises.map((exercise) => (
            <Box
              alignSelf="center"
              marginTop="5%"
              alignSelf="center"
              shadow="3"
              bg="colors.red"
              p="5"
              rounded="xl"
              width="80%"
            >
              <Text
                alignSelf="center"
                color="white"
                fontWeight="medium"
                fontSize="4xl"
              >
                {exercise.name}:{'\n'}Sets: {exercise.sets}
                {'\n'}Reps: {exercise.reps}
                {'\n'}Duration: {exercise.duration}
                {'\n'}Rest: {exercise.rest}
              </Text>
            </Box>
          ))}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default SingleWorkout;