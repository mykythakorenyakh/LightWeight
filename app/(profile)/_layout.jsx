import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { Slot, Tabs } from 'expo-router'
import { ThemeContext } from '../_layout'



const PropLayout = () => {

  const {colors} = useContext(ThemeContext)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle:{
          backgroundColor:colors.main.navbar,
          borderColor:'#234',
          height:50,
          borderTopWidth:0,
          shadowColor:0
        }
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (<View className="flex-col items-center">
            <Image tintColor={color} className="w-6 h-6" resizeMode='contain' source={require('../../assets/icons/measure.png')} />
            <Text style={{color:color}} className="font-bold text-xs">Measurements</Text>
          </View>)
        }}
      />
      <Tabs.Screen
        name='calculations'
        options={{
          title: 'Calculations',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (<View className="flex-col items-center">
            <Image tintColor={color} className="w-6 h-6" resizeMode='contain' source={require('../../assets/icons/calc.png')} />
            <Text style={{color:color}} className="font-bold text-xs">Calculations</Text>
          </View>)
        }}
      />
      <Tabs.Screen
        name='records'
        options={{
          title: 'Records',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (<View className="flex-col items-center">
            <Image tintColor={color} className="w-6 h-6" resizeMode='contain' source={require('../../assets/icons/best.png')} />
            <Text style={{color:color}} className="font-bold text-xs">Records</Text>
          </View>)
        }}
      />
    </Tabs>
  )
}

export default PropLayout