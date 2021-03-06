import React, { Component } from 'react'
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  BackHandler,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import styles from './Main.Styles'
import Toast from 'react-native-simple-toast'
import images from '../../Themes/Images'
import { sendBird } from '../Root/RootContainer'

export let currentEmail = ''

export default class MainScreen extends Component {

  constructor (props) {
    super(props)
    BackHandler.addEventListener('hardwareBackPress', function () {
      Alert.alert(
        'Exit app',
        'Are you sure to exit?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
          }
        ],
        {
          cancelable: false
        }
      )
      return true
    })
    this.state = {
      email: '',
      isLoading: false,
    }
    this.profileUrl = ''
  }

  componentDidMount () {
    SplashScreen.hide()
    this.readDataLocal()
  }

  onBtnConnectPress = () => {
    Keyboard.dismiss()
    this.setState({isLoading: true})
    if (this.state.email.trim()) {
      sendBird.connect(this.state.email, (user, error) => {
        this.setState({isLoading: false})
        if (error) {
          Toast.show(error.message)
        } else {
          this.profileUrl = user.profileUrl
          this.writeDataLocal()
        }
      })
    } else {
      this.setState({isLoading: false})
      Toast.show('Please input all fields')
    }
  }

  readDataLocal = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
      if (value) {
        this.setState({email: value})
        currentEmail = value
      }
    } catch (error) {
      console.log(error)
    }
  }

  writeDataLocal = async () => {
    try {
      await AsyncStorage.setItem('email', this.state.email)
      await AsyncStorage.setItem('profileUrl', this.profileUrl)
      currentEmail = this.state.email
    } catch (error) {
      Toast.show(error.message)
    }
    this.onWriteLocalSuccess()
  }

  onWriteLocalSuccess = () => {
    this.props.navigation.navigate('MenuScreen')
  }

  onClearEmailPress = () => {
    this.refInputEmail.clear()
    this.setState({email: ''})
  }

  render () {
    return (
      <View style={styles.viewContainer}>
        {/* Header */}
        <View style={styles.toolbar}>
          <Text style={styles.titleToolbar}>CHAT SENDBIRD</Text>
        </View>

        {/* Body */}
        <View style={styles.viewBody}>
          <View style={styles.viewItemInput}>
            <Text style={styles.textTitleInput}>Email</Text>
            <TextInput
              ref={(ref) => this.refInputEmail = ref}
              style={styles.textInput}
              value={this.state.email}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder="123@gmail.com"
              placeholderTextColor="#aeaeae"
              returnKeyType="done"
              onChangeText={(value) => this.setState({email: value})}
            />
            <TouchableOpacity style={styles.viewClear} onPress={this.onClearEmailPress}>
              <Image source={images.ic_clear} style={styles.icClear}/>
            </TouchableOpacity>
            <View style={styles.viewBreakLine}/>
          </View>

          <View style={{height: 30}}/>

          <TouchableOpacity onPress={this.onBtnConnectPress} style={styles.btnConnect}>
            <Text style={styles.textBtnConnect}>CONNECT</Text>
          </TouchableOpacity>

        </View>

        {/* Loading */}
        {
          this.state.isLoading ?
            <View style={styles.viewLoading}>
              <ActivityIndicator size="large"/>
            </View> :
            null
        }

      </View>
    )
  }
}
