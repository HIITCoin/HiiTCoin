import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Input,
  Box,
  Button,
  Center,
  Text,
  HStack,
  FormControl,
  Select,
  CheckIcon,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import {
  secondToMinutesAndSeconds,
  minSecToSeconds,
  addNewWorkout,
} from "../misc/helperFunctions";

const NewWorkout = ({ route }) => {
  let [rounds, setRounds] = React.useState("");
  let [name, setName] = React.useState("");
  let [roundRest, setRoundRest] = React.useState({ minutes: "", seconds: "" });
  let [exercises, setExercises] = React.useState([]);

  console.log("ROUTE PARAMS", route.params);

  const validate = (data) => {
    if (data.exercises.length === 0) {
      alert("Please add an exercise!, we talked about this already");
      return false;
    }
    if (data.name.length === 0) {
      alert("Please fill out the name field, we talked about this already");
      return false;
    }
    if (data.roundRest == 0) {
      alert("Please add a rest time, we talked about this already");
      return false;
    }
    if (!data.rounds) {
      alert("Please add rounds, we talked about this already");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (route.params) {
      if (!isNaN(route.params.state.roundRest)) {
        route.params.state.roundRest = secondToMinutesAndSeconds(
          route.params.state.roundRest
        );
        route.params.state.exercises.map((exercise) => {
          exercise.duration = secondToMinutesAndSeconds(exercise.duration);
          exercise.rest = secondToMinutesAndSeconds(exercise.rest);
        });
      }
    }
    if (route.params) {
      setRounds(String(route.params.state.rounds));
      setName(route.params.state.name);
      setRoundRest(route.params.state.roundRest);
      setExercises(route.params.state.exercises);
    }
  }, [route.params]);
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params) {
      setRounds(String(route.params.state.rounds));
      setName(route.params.state.name);
      setRoundRest(route.params.state.roundRest);
      setExercises(route.params.state.exercises);
    }
  }, []);

  let optionsArr = [];

  for (let i = 1; i <= 30; ++i) {
    optionsArr.push(i);
  }

  const handleNewExercise = (index) => {
    const state = {
      rounds,
      name,
      roundRest,
      exercises,
    };
    navigation.navigate("CreateEditExercise", { state: state, index: index });
  };

  const handleSubmitWorkout = async () => {
    exercises.map((exercise) => {
      exercise.duration = Number(minSecToSeconds(exercise.duration));
      exercise.rest = Number(minSecToSeconds(exercise.rest));
      exercise.sets = Number(exercise.sets);
      exercise.reps = Number(exercise.reps);
    });

    let newWorkout = {
      exercises,
      name,
      roundRest: Number(minSecToSeconds(roundRest)),
      rounds: Number(rounds),
    };

    validate(newWorkout);
    await addNewWorkout(newWorkout);
    navigation.navigate("Workouts");
  };

  return (
    <KeyboardAwareScrollView
      style={{ height: "150%", backgroundColor: "#1B1B3A" }}
    >
      {route.params === undefined ? (
        <KeyboardAvoidingView
          bg="colors.bg"
          height="150%"
          // behavior={behavior}
        >
          <Box marginTop="10%" alignSelf="center">
            <Text fontSize="5xl" color="colors.text">
              Create Workout
            </Text>
          </Box>
          <Box alignSelf="center">
            <FormControl isRequired marginTop="0%">
              <FormControl.Label
                marginBottom="0%"
                _text={{
                  bold: true,
                  ml: 5,
                  color: "colors.text",
                }}
              >
                Name
              </FormControl.Label>
              <Input
                mx="3"
                placeholder="Name"
                w="75%"
                maxWidth="300px"
                variant="rounded"
                margin="2"
                color="colors.other"
                value={name}
                onChangeText={(name) => setName(name)}
              />
            </FormControl>
            <Center alignContent="center">
              <Box w="3/4" maxWidth="300px" width="100%">
                <FormControl isRequired>
                  <FormControl.Label
                    marginBottom="0%"
                    _text={{
                      bold: true,
                      ml: 2,
                      color: "colors.text",
                    }}
                  >
                    Rounds
                  </FormControl.Label>
                  <Select
                    placeholder={rounds}
                    value={rounds || ""}
                    minWidth="200"
                    color={"white"}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={(num) => setRounds(String(num))}
                  >
                    {optionsArr.map((num) => (
                      <Select.Item key={num} label={num + ""} value={num} />
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Center>
            <FormControl isRequired>
              <FormControl.Label>
                <Text bold="true" color="colors.text" ml="25%" marginTop={4}>
                  Rest Between Rounds
                </Text>
              </FormControl.Label>
              <HStack width="40%" space={2} marginTop="3">
                <Input
                  mx="1"
                  placeholder="Minutes"
                  w="100%"
                  variant="rounded"
                  margin="2"
                  color="colors.other"
                  value={roundRest.minutes}
                  keyboardType="numeric"
                  onChangeText={(mins) => {
                    setRoundRest({
                      minutes: String(mins),
                      seconds: roundRest.seconds,
                    });
                  }}
                />
                <Input
                  mx="1"
                  placeholder="Seconds"
                  w="100%"
                  variant="rounded"
                  margin="2"
                  color="colors.other"
                  value={roundRest.seconds}
                  keyboardType="numeric"
                  onChangeText={(secs) => {
                    setRoundRest({
                      minutes: roundRest.minutes,
                      seconds: String(secs),
                    });
                  }}
                />
              </HStack>
            </FormControl>
          </Box>
          <Box alignItems="center">
            {exercises.map((exercise, index) => (
              <Button
                key={index}
                onPress={() => handleNewExercise(index)}
                w="80%"
                h="150"
                data-val={index}
                bg="colors.bg"
                rounded="md"
                borderWidth="2px"
                borderColor="colors.text"
                shadow={3}
                alignContent="center"
                marginTop="4"
              >
                <Text fontSize="18" color="colors.text" lineHeight="25">
                  <Text fontWeight="bold">{exercise.name}</Text> {"\n"}{" "}
                  <Text fontWeight="bold">S:</Text>
                  {exercise.sets} <Text fontWeight="bold"> {"      "}R:</Text>
                  {exercise.reps} {"\n"} <Text fontWeight="bold">D:</Text>{" "}
                  <Text fontWeight="bold"> {"   "}Min:</Text>
                  {exercise.duration.minutes}
                  <Text mx="1" fontWeight="bold">
                    {"   "}Sec:
                  </Text>
                  {exercise.duration.seconds}
                  {"\n"}
                  <Text fontWeight="bold">Rest:</Text>{" "}
                  <Text fontWeight="bold">{"    "}Min:</Text>{" "}
                  {exercise.rest.minutes}
                  <Text fontWeight="bold">{"   "}Sec:</Text>{" "}
                  {exercise.rest.seconds}
                </Text>
              </Button>
            ))}
          </Box>
          <Box marginHorizontal={50} display={"flex"} flexDirection="row">
            <Button
              width="60%"
              backgroundColor={"colors.text"}
              flex={1}
              margin={5}
              onPress={() => handleNewExercise()}
            >
              Add Exercise
            </Button>
          </Box>
          <Box marginHorizontal={50} display={"flex"} flexDirection="row">
            <Button
              width="60%"
              flex={1}
              backgroundColor={"colors.text"}
              margin={5}
              onPress={handleSubmitWorkout}
            >
              Create Workout
            </Button>
          </Box>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView
          bg="colors.bg"
          height="150%"
          // behavior={behavior}
        >
          <Box marginTop="20%" alignSelf="center">
            <Text fontSize="5xl" color="colors.text">
              Edit Workout
            </Text>
          </Box>
          <Box alignSelf="center">
            <FormControl isRequired marginTop="0%">
              <FormControl.Label
                marginBottom="0%"
                _text={{
                  bold: true,
                  ml: 5,
                  color: "colors.text",
                }}
              >
                Name
              </FormControl.Label>
              <Input
                mx="3"
                placeholder="Name"
                w="75%"
                maxWidth="300px"
                variant="rounded"
                margin="2"
                color="colors.other"
                value={name}
                onChangeText={(name) => setName(name)}
              />
            </FormControl>
            <Center alignContent="center">
              <Box w="3/4" maxWidth="300px" width="100%">
                <FormControl isRequired>
                  <FormControl.Label
                    marginBottom="0%"
                    _text={{
                      bold: true,
                      ml: 2,
                      color: "colors.text",
                    }}
                  >
                    Rounds
                  </FormControl.Label>
                  <Select
                    placeholder={rounds}
                    value={rounds || ""}
                    minWidth="200"
                    color={"white"}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={(num) => setRounds(String(num))}
                  >
                    {optionsArr.map((num) => (
                      <Select.Item key={num} label={num + ""} value={num} />
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Center>
            <FormControl isRequired>
              <FormControl.Label>
                <Text bold="true" color="colors.text" ml="25%" marginTop={4}>
                  Rest Between Rounds
                </Text>
              </FormControl.Label>
              <HStack width="40%" space={2} marginTop="3">
                <Input
                  mx="1"
                  placeholder="Minutes"
                  w="100%"
                  variant="rounded"
                  margin="2"
                  color="colors.other"
                  value={roundRest.minutes}
                  keyboardType="numeric"
                  onChangeText={(mins) => {
                    setRoundRest({
                      minutes: String(mins),
                      seconds: roundRest.seconds,
                    });
                  }}
                />
                <Input
                  mx="1"
                  placeholder="Seconds"
                  w="100%"
                  variant="rounded"
                  margin="2"
                  color="colors.other"
                  value={roundRest.seconds}
                  keyboardType="numeric"
                  onChangeText={(secs) => {
                    setRoundRest({
                      minutes: roundRest.minutes,
                      seconds: String(secs),
                    });
                  }}
                />
              </HStack>
            </FormControl>
          </Box>
          <Box alignItems="center">
            {exercises.map((exercise, index) => (
              <Button
                key={index}
                onPress={() => handleNewExercise(index)}
                w="80%"
                h="150"
                data-val={index}
                bg="colors.bg"
                rounded="md"
                borderWidth="2px"
                borderColor="colors.text"
                shadow={3}
                alignContent="center"
                marginTop="4"
              >
                <Text fontSize="18" color="colors.text" lineHeight="25">
                  <Text fontWeight="bold">{exercise.name}</Text> {"\n"}{" "}
                  <Text fontWeight="bold">S:</Text>
                  {exercise.sets} <Text fontWeight="bold"> {"      "}R:</Text>
                  {exercise.reps} {"\n"} <Text fontWeight="bold">D:</Text>{" "}
                  <Text fontWeight="bold"> {"   "}Min:</Text>
                  {exercise.duration.minutes}
                  <Text mx="1" fontWeight="bold">
                    {"   "}Sec:
                  </Text>
                  {exercise.duration.seconds}
                  {"\n"}
                  <Text fontWeight="bold">Rest:</Text>{" "}
                  <Text fontWeight="bold">{"    "}Min:</Text>{" "}
                  {exercise.rest.minutes}
                  <Text fontWeight="bold">{"   "}Sec:</Text>{" "}
                  {exercise.rest.seconds}
                </Text>
              </Button>
            ))}
          </Box>
          <Box marginHorizontal={50} display={"flex"} flexDirection="row">
            <Button
              width="60%"
              flex={1}
              margin={5}
              backgroundColor={"colors.text"}
              onPress={() => handleNewExercise()}
            >
              Add Exercise
            </Button>
          </Box>
          <Box marginHorizontal={50} display={"flex"} flexDirection="row">
            <Button
              width="60%"
              flex={1}
              backgroundColor={"colors.text"}
              margin={5}
              onPress={handleSubmitWorkout}
            >
              Edit Workout
            </Button>
          </Box>
        </KeyboardAvoidingView>
      )}
    </KeyboardAwareScrollView>
  );
};

export default NewWorkout;
