import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Vibration,
} from 'react-native';
import Constants from 'expo-constants';
import { PropType } from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 45,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
  },
  timer: {
    fontSize: 50,
    fontWeight: 'bold',
    paddingBottom: 20,
    paddingStart: 50,
  },
  options: {
    alignSelf: 'flex-start',
    paddingStart: 5,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  label: { paddingVertical: 10, paddingStart: 40 },
  input: {
    borderColor: 'black',
    borderWidth: 1,

    flex: 1,
  },
});
function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
    console.log('Waiting for ' + miliseconds / 1000 + ' seconds');
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 15,
      update: true,
      work: true,
      inputMinutes: '0',
      inputSeconds: '15',
      inputMinutesB: '0',
      inputSecondsB: '5',
    };
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.minutes !== prevState.minutes ||
      this.state.seconds !== prevState.seconds
    )
      if (this.state.minutes === 0 && this.state.seconds === 0) {
        Vibration.vibrate([500, 500, 500]);
        this.settings(prevState);
      }
  };

  settings = (prevState) => {
    this.setState((prevState) => ({
      work: !prevState.work,
      minutes: !this.state.work
        ? +this.state.inputMinutes
        : +this.state.inputMinutesB,
      seconds: !this.state.work
        ? +this.state.inputSeconds
        : +this.state.inputSecondsB,
    }));

    console.log(this.state);
  };
  showToast = () => {
    ToastAndroid.show('Type a number !', ToastAndroid.SHORT);
  };
  handleMinutes = (inputMinutes) => {
    if (+inputMinutes >= 0) {
      this.setState({ inputMinutes });
      if (this.state.work)
        this.setState({ minutes: +inputMinutes, update: false });
    } else {
      this.showToast();
    }
  };

  handleSeconds = (inputSeconds) => {
    if (+inputSeconds >= 0) {
      this.setState({ inputSeconds });
      if (this.state.work)
        this.setState({ seconds: +inputSeconds, update: false });
    } else {
      this.showToast();
    }
  };

  handleSecondsB = (inputSecondsB) => {
    if (+inputSecondsB >= 0) {
      this.setState({ inputSecondsB });

      if (!this.state.work)
        this.setState({ seconds: +inputSecondsB, update: false });
    } else {
      this.showToast();
    }
  };

  handleMinutesB = (inputMinutesB) => {
    if (+inputMinutesB >= 0) {
      this.setState({ inputMinutesB });
      if (!this.state.work)
        this.setState({ minutes: +inputMinutesB, update: false });
    } else {
      this.showToast();
    }
  };

  shouldComponentUpdate() {
    return this.state.update;
  }

  onPause = () => {
    this.setState((prevState) => ({ update: !prevState.update }));
  };
  onReset = () => {
    if (this.state.work)
      this.setState((prevState) => ({
        minutes: +prevState.inputMinutes,
        seconds: +prevState.inputSeconds,
        update: false,
      }));
    else
      this.setState((prevState) => ({
        minutes: +prevState.inputMinutesB,
        seconds: +prevState.inputSecondsB,
        update: false,
      }));
  };
  componentDidMount() {
    setInterval(this.decreaseTime, 1000);
  }

  decreaseTime = () => {
    if (this.state.update) {
      this.setState((prevState) => ({
        minutes:
          prevState.seconds % 60 === 0
            ? prevState.minutes - 1
            : prevState.minutes,
        seconds: prevState.seconds % 60 === 0 ? 59 : prevState.seconds - 1,
      }));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.heading}>
            {this.state.work ? 'Work Timer' : 'Break Timer'}
          </Text>
          <Text style={styles.timer}>
            {this.state.minutes < 10
              ? '0' + this.state.minutes
              : this.state.minutes}
            :
            {this.state.seconds < 10
              ? '0' + this.state.seconds
              : this.state.seconds}
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title={this.state.update ? 'Pause' : 'Start'}
            onPress={this.onPause}
          />
          <Button title="Reset" onPress={this.onReset} />
        </View>
        <View style={styles.options}>
          <Text style={{ paddingVertical: 10, fontWeight: 'bold' }}>
            Work Time:
          </Text>
          <Text style={styles.label}> Mins:</Text>
          <TextInput
            style={styles.input}
            placeholder="Minutes"
            onChangeText={this.handleMinutes}
            keyboardType="numeric"
            value={this.state.inputMinutes}
            maxLength={2}
          />
          <Text style={styles.label}> Secs:</Text>
          <TextInput
            style={styles.input}
            placeholder="Seconds"
            onChangeText={this.handleSeconds}
            keyboardType="numeric"
            value={this.state.inputSeconds}
            maxLength={2}
          />
        </View>
        <View style={styles.options}>
          <Text style={{ paddingVertical: 10, fontWeight: 'bold' }}>
            Break Time:
          </Text>
          <Text style={styles.label}> Mins:</Text>
          <TextInput
            style={styles.input}
            placeholder="Minutes"
            keyboardType="numeric"
            value={this.state.inputMinutesB}
            onChangeText={this.handleMinutesB}
          />
          <Text style={styles.label}> Secs:</Text>
          <TextInput
            style={styles.input}
            placeholder="Seconds"
            keyboardType="numeric"
            value={this.state.inputSecondsB}
            onChangeText={this.handleSecondsB}
          />
        </View>
        <View></View>
      </View>
    );
  }
}
