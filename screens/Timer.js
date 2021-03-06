import { Pressable, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  VStack,
  Box,
  HStack,
  Center,
  Modal,
  Button,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createOrSubmitHistory } from "../misc/helperFunctions";

/* CUSTOM HOOK */
const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// const workout = {
//   name: "testworkout",
//   exercises: [
//     {
//       name: "Leg Press",
//       basePoints: 10,
//       bodyPart: "legs",
//       difficulty: 3,
//       duration: 4,
//       reps: 8,
//       sets: 2,
//       rest: 2,
//     },
//     {
//       name: "Chest Press",
//       basePoints: 10,
//       bodyPart: "chest",
//       difficulty: 2,
//       duration: 8,
//       reps: 4,
//       sets: 3,
//       rest: 5,
//     },
//   ],
//   rounds: 3,
//   roundRest: 10,
// };

const Timer = ({ route }) => {
  const navigation = useNavigation();
  if (!route.params) {
    navigation.navigate("Home");
  }

  const workout = route.params.workout;

  const [myWorkout, setMyWorkout] = useState(workout);
  const [exerName, setExerName] = useState("Quick Timer");
  const [exerSets, setExerSets] = useState(workout.exercises.sets);
  const [exerReps, setExerReps] = useState(workout.exercises.reps);
  const [rounds, setRounds] = useState(workout.rounds);
  const [timerOn, setTimerOn] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [restToggle, setRestToggle] = useState(false); // start with exercise then switch to rest
  const [roundRest, setRoundRest] = useState(false);
  const [exerIndex, setExerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    console.log("initial Loading");
    setNextWorkout();
  }, []);

  useInterval(
    async () => {
      for (let i = seconds; i === 0; i--) {
        let currentExercise;
        if (roundRest) {
          setRoundRest(false);
          if (i > 0) {
            setSeconds(i - 1);
            continue; // stop here
          }
          // we set to seconds to rest but dont let them elapse
          currentExercise = myWorkout.exercises[0];
          await setExerIndex(0);
        }
      }

      if (seconds > 0) {
        setSeconds(seconds - 1);
        return; // stop here
      }

      let currentExercise = myWorkout.exercises[exerIndex];
      if (restToggle) {
        // if we're resting, then set seconds to duration and switch restToggle afterwards
        setSeconds(currentExercise.duration);
        setRestToggle(!restToggle);
      } else {
        // if we're exercising, then set seconds to rest AND (decrease sets OR change exercise and switch off timer)
        setSeconds(currentExercise.rest);
        if (exerSets > 1) {
          setExerSets((sets) => sets - 1); // we can set to 1, that is our LAST set. When we are AT 1, the next "set" moves to the next workout
          setRestToggle(!restToggle);
        } else {
          setExerIndex(exerIndex + 1);
          setTimerOn(false); // stop timer (THIS TRIGGERS THIS HOOK TO RUN AGAIN)
        }
      }
    },
    timerOn ? 1000 : null
  );

  useEffect(() => {
    if (exerIndex < myWorkout.exercises.length) setNextWorkout();
    else {
      // if no more exercises left AND there are more rounds...
      if (rounds > 1) {
        // ...then let the user roundRest and then loop them again thru exercises
        setRounds((rounds) => rounds - 1);
        setSeconds(myWorkout.roundRest);
        setRoundRest(true);
        setExerName("Next round in:");
        setTimerOn(true); // this will trigger the useInterval to run again
      } else {
        setSeconds(0);
        setExerName("Done! Good job!");
        setExerReps(0);
        setExerSets(0);
        //get workout object workout
        //prodce popup that asks if user wants to submit workout
        //if so submit it no matter what redirect to home
        setShowModal(true);
      }
    }
  }, [exerIndex]);

  function setNextWorkout() {
    if (restToggle) setRestToggle(false);
    setExerName(myWorkout.exercises[exerIndex].name);
    setExerSets(myWorkout.exercises[exerIndex].sets);
    setExerReps(myWorkout.exercises[exerIndex].reps);
    setSeconds(myWorkout.exercises[exerIndex].duration);
  }

  // convert seconds left => , hours, minutes, seconds
  const clockify = () => {
    let hours = Math.floor(seconds / 60 / 60);
    let mins = Math.floor((seconds / 60) % 60);
    let secs = Math.floor(seconds % 60);
    let displayHours = hours < 10 ? `0${hours}` : hours;
    let displayMinutes = mins < 10 ? `0${mins}` : mins;
    let displaySeconds = secs < 10 ? `0${secs}` : secs;
    return { displayHours, displayMinutes, displaySeconds };
  };

  if (showModal)
    return (
      <Example
        workout={workout}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    );

  return (
    <KeyboardAvoidingView bg="colors.bg" height="100%">
      <Box
        marginTop="10%"
        marginBottom="1%"
        bg="colors.bg"
        height={height / 10}
      >
        <Text fontSize={height / 12} color="colors.text" textAlign="center">
          Timer
        </Text>
      </Box>
      <VStack space={1} alignItems="center" bg="colors.bg">
        <Box
          w="100%"
          h={height / 7}
          bg="colors.bg"
          my="1%"
          py="1%"
          justifyContent="center"
        >
          <Text
            fontSize={restToggle ? "4xl" : "5xl"}
            numberOfLines={1}
            color="colors.other"
            textAlign="center"
          >
            {restToggle ? "Rest! Next set in:" : exerName}
          </Text>
        </Box>
        <Box w="100%" h={height / 10} bg="colors.bg" justifyContent="center">
          <Text fontSize="5xl" color="colors.other" textAlign="center">
            Sets left: {exerSets}
          </Text>
        </Box>
        <Box w="100%" h={height / 10} bg="colors.bg" justifyContent="center">
          <Text fontSize="5xl" color="colors.other" textAlign="center">
            Reps: {exerReps}
          </Text>
        </Box>
        <Box
          width={width}
          h={height / 4}
          bg="colors.bg"
          justifyContent="center"
        >
          <Text
            fontSize={height / 6}
            width="100%"
            color="colors.other"
            textAlign="center"
          >
            {clockify().displayMinutes}:{clockify().displaySeconds}
          </Text>
        </Box>
        <HStack justifyContent="space-between" space={9}>
          <Box>
            {!timerOn ? (
              <Pressable onPress={() => setTimerOn(true)}>
                <FontAwesome name="play" size={100} color="green" />
              </Pressable>
            ) : (
              <Pressable onPress={() => setTimerOn(false)}>
                <FontAwesome name="pause" size={100} color="yellow" />
              </Pressable>
            )}
          </Box>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <FontAwesome name="stop" size={100} color="red" />
          </Pressable>
        </HStack>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default Timer;

const Example = (props) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = async () => {
    setLoading(true);
    await createOrSubmitHistory(props.workout);
    props.setShowModal(false);
    navigation.navigate("Home");
  };
  return (
    <Center bg="colors.bg">
      <Modal
        bg="colors.bg"
        isOpen={props.showModal}
        onClose={() => props.setShowModal(false)}
      >
        <Modal.Content bgColor={"amber.300"} maxWidth="66%">
          <Modal.Header color="colors.text">
            Do you want to submit this workout?
          </Modal.Header>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  props.setShowModal(false);
                  navigation.navigate("Home");
                }}
              >
                No
              </Button>
              {loading ? (
                <Button bgColor={"colors.text"} isLoading>
                  Yes
                </Button>
              ) : (
                <Button
                  bgColor={"colors.text"}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  Yes
                </Button>
              )}
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
