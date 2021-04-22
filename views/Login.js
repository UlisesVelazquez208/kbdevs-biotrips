import React, { Component } from "react";
import RNRestart from "react-native-restart";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  AppState
} from "react-native";
import { Navigation } from "react-native-navigation";
import {
  Container,
  Button,
  Text,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label
} from "native-base"; //why??
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import validate from "../core/utils/Validation";
import TextInput from "./components/TextInput";
import DropdownAlert from "react-native-dropdownalert";

export class Login extends Component {
  static options = {
    topBar: {
      visible: false,
      height: 0
    }
  };

  state = {
    componentUnmount: false,
    appState: AppState.currentState,
    showLogin: false,
    controls: {
      email: {
        placeholder: "Email",
        value: "",
        valid: false,
        touched: false,
        validationRules: {
          required: true,
          isEmail: true
        }
      },
      password: {
        placeholder: "Password",
        valid: false,
        touched: false,
        validationRules: {
          required: true
        }
      }
    }
  };

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      console.log(this.state.componentUnmount);
      if (this.state.componentUnmount) {
        RNRestart.Restart();
      }
    }
    this.setState({ appState: nextAppState });
  };

  loginHandler = () => {
    let data = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    console.log(data);
    axios
      .post("https://api.biotrips.app/user/login", data)
      .then(res => {
        // console.log(JSON.stringify(res));
        // this.dropdown.alertWithType('res', '', res.data.message);
        AsyncStorage.setItem("token", res.data.data.token);
        AsyncStorage.setItem("userData", JSON.stringify(res.data.data));
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + res.data.data.token;
        // this.dropdown.alertWithType('success', '', 'You are logged in successfully');
        this.startMain(res.data.data);
      })
      .catch(err => {
        this.dropdown.alertWithType(
          "error",
          "",
          err.response.data ? err.response.data.message : "Error in login"
        );
      });
  };

  componentWillMount() {
    console.log("login screen will mount now");
  }

  componentDidCatch() {
    console.log("login screen did catch now");
  }

  componentDidMount() {
    console.log("login screen did mount now");
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentDidUpdate() {
    console.log("login screen did update now");
  }

  componentWillUnmount() {
    // this.setState(prevState => {
    //   return {
    //     ...prevState,
    //     componentUnmount: true
    //   };
    // });
    this.state.componentUnmount = true;   //not the right way but the way it's working
    console.log("login screen will unmount now");
  }

  componentWillUpdate() {
    console.log("login screen will update now");
  }

  componentWillReceiveProps() {
    console.log("login screen will receive props now");
  }

  // shouldComponentUpdate() {
  //     console.log("login screen should update now");
  // }

  startMain(data) {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: "home",
                passProps: {
                  id: data.id
                }
              }
            }
          ]
        }
      }
    });
  }

  changeTextHandler = (key, value) => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          [key]: {
            ...prevState.controls[key],
            value: value,
            touched: true,
            valid: validate(value, prevState.controls[key].validationRules)
          }
        }
      };
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.outer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/logo.png")}
              // style={{transform:[{scale:0.1}]}}
            />
          </View>
          <Form>
            <View style={styles.card}>
              <Item style={styles.itemContainer}>
                <TextInput
                  placeholder={this.state.controls.email.placeholder}
                  value={this.state.controls.email.value}
                  type="email"
                  valid={this.state.controls.email.valid}
                  touched={this.state.controls.email.touched}
                  autoCapitalize="none"
                  onChangeText={val => this.changeTextHandler("email", val)}
                />
              </Item>
              <Item style={styles.itemContainer}>
                <TextInput
                  placeholder={this.state.controls.password.placeholder}
                  value={this.state.controls.password.value}
                  type="text"
                  valid={this.state.controls.password.valid}
                  touched={this.state.controls.password.touched}
                  autoCapitalize="none"
                  onChangeText={val => this.changeTextHandler("password", val)}
                />
              </Item>
              <View style={styles.buttonContainer}>
                <Button
                  primary
                  style={styles.customBtnLarge}
                  onPress={this.loginHandler}
                >
                  <Text style={styles.font}> LOGIN</Text>
                </Button>
              </View>
            </View>
          </Form>
        </View>
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%"
    // backgroundColor:'red'
  },
  background: {
    width: "100%",
    // height:'100%',
    minHeight: "100%"
    // flex:1,
  },
  outer: {
    minHeight: "100%",
    margin: 30
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.22,

    elevation: 3,
    padding: 15,
    backgroundColor: "white"
  },
  buttonContainer: {
    paddingVertical: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: "20%"
  },

  customBtnText: {
    color: "#3ecf81"
  },
  customBtnLarge: {
    backgroundColor: "#2196f3",
    // paddingVertical:5
    height: 37
    // borderRadius: 30
  },
  itemContainer: {
    // paddingHorizontal: 10,
    marginVertical: 5,
    marginLeft: 0
  },
  textHeading: {
    textAlign: "center",
    fontSize: 23,
    paddingBottom: 20
  },
  sinupText: {
    color: "blue"
  },
  sinupTextContainer: {
    paddingVertical: 30,
    alignItems: "center"
  },
  font: {
    fontFamily: "LouisCafe"
  }
});

export default Login;
