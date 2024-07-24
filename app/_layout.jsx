import { View, Text, Image, ImageBackground } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';


const DrawerIcon = ({color,icon})=>{
  return <Image style={{tintColor:color}} className="mr-[-20] w-5 h-5" source={icon}/>
}

const MainLayout = () => {
  return (
    <Drawer
      drawerContent={(props) => <ImageBackground className="flex-1 pt-[50]" source={require('../assets/bg/drawer.png')}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

      </ImageBackground>}
      screenOptions={
        {
          headerBackground: () => <View className="flex-1 bg-slate-700 "></View>,
          headerTitleStyle: {
            color: '#fafafa'
          },
          drawerStyle: {
            width: '70%'
          },
          drawerLabelStyle:{
            fontWeight:700,
            fontSize:16
          },
          drawerActiveBackgroundColor:'#2235',
          drawerActiveTintColor:'#fffc',
          drawerInactiveTintColor:'#223c',
          drawerInactiveBackgroundColor:'#777a'

          //drawer:()=><Image source={require('../assets/bg/drawer.png')}/>
        }
      }>
      <Drawer.Screen
        name="(planning)" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Plan',
          title: 'Plan',
          drawerIcon:({color,size,focused})=><DrawerIcon color={color} icon={require('../assets/icons/plan.png')}/>, //<Image style={{tintColor:color}} className="mr-[-20] w-5 h-5" source={require('../assets/icons/plan.png')}/>

        }}
      />
      <Drawer.Screen
        name="(properties)" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon:({color,size,focused})=><DrawerIcon color={color} icon={require('../assets/icons/params.png')}/>,
        }}
      />
      <Drawer.Screen
        name="(functions)" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Functions',
          title: 'Functions',
          drawerIcon:({color,size,focused})=><DrawerIcon color={color} icon={require('../assets/icons/func.png')}/>,
        }}
      />
      <Drawer.Screen
        name="settings" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon:({color,size,focused})=><DrawerIcon color={color} icon={require('../assets/icons/settings.png')}/>,
        }}
      />
    </Drawer>
  )
}

export default MainLayout