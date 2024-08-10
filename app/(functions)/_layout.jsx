import { View, Text, Image } from 'react-native'
import React from 'react'
import { Slot, Tabs } from 'expo-router'



const FuncLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle:{
          backgroundColor:'#234',
          borderColor:'#234',
          height:50
        }
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Timers',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (<View className="flex-col items-center">
            <Image tintColor={color} className="w-6 h-6" resizeMode='contain' source={require('../../assets/icons/timer.png')} />
            <Text style={{color:color}} className="font-bold text-xs">Timers</Text>
          </View>)
        }}
      />
      <Tabs.Screen
        name='special'
        options={{
          title: 'Special',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (<View className="flex-col items-center">
            <Image tintColor={color} className="w-6 h-6" resizeMode='contain' source={require('../../assets/icons/secret.png')} />
            <Text style={{color:color}} className="font-bold text-xs">Special</Text>
          </View>)
        }}
      />
    </Tabs>
  )
}

export default FuncLayout