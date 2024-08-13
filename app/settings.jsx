import { View, Text, useColorScheme, Switch } from 'react-native'
import React, { useContext, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { RadioButton } from 'react-native-paper'
import { ThemeContext } from './_layout'



const Settings = () => {

  const { theme, toggleTheme, colors } = useContext(ThemeContext);

  const [sysmeTheme, _] = useColorScheme()

  const [autoTheme, setAutoTheme] = useState(theme=='auto'?true:false)
  const [isLight, setIsLight] = useState(theme=='light');

  const changeTheme = (t) => {
    toggleTheme(t);
  }


  return (
    <View className={"flex-1 flex-col"}
      style={
        {
          backgroundColor:colors.main.bg
        }
      }
    >
      <Text className="text-xl p-3" style={{color:colors.main.text}}>
        Theme
      </Text>
      <View className="flex-row items-center w-[100%] px-3 justify-between "
      style={
        {
          backgroundColor:colors.main.subBg
        }
      }>
        <Text style={{color:colors.main.subText}}>Auto Theme</Text>
        <Switch value={autoTheme} onValueChange={(v) => {
          setAutoTheme(v)
          if (v) {
            
            changeTheme('auto');
            setIsLight(sysmeTheme=='l')
          }else{
            setIsLight(sysmeTheme=='l')
            changeTheme(sysmeTheme=='l'?'light':'dark');
          }
        }} />
      </View>
      {!autoTheme ?
        <View
        style={
          {
            backgroundColor:colors.main.optionBg
          }
        }>
          <View className="flex-row items-center w-full justify-between px-3">
            <Text style={{color:colors.main.subText}}>Light</Text>
            <RadioButton
              value="light"
              status={isLight ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsLight(true)
                changeTheme('light');
              }}
              color="#007BFF"
            />
          </View>
          <View className="flex-row items-center w-full justify-between px-3">
            <Text style={{color:colors.main.subText}}>Dark</Text>
            <RadioButton
              value="dark"
              status={!isLight ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsLight(false)
                changeTheme('dark');
              }}
              color="#007BFF"
            />
          </View>
        </View>
        : ''}
    </View>
  )
}

export default Settings