import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import {Input} from 'native-base';

export class TextInput extends Component {

  render() {
    return (
      <Input
      placeholderTextColor="#bebebe"
      {...this.props} style={[(!this.props.valid && this.props.touched)?styles.invalid:null,styles.font]} />
    )
  }

}


const styles = StyleSheet.create({
  invalid:{
    borderBottomWidth:1,
    borderBottomColor:'red'
  },
  font:{
    fontFamily: "LouisCafe",
}
})

export default TextInput
