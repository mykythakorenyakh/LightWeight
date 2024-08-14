import { View, Text, Image, ImageBackground, useColorScheme } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Redirect, Slot, useRouter } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { dark, light } from '../assets/styles/themes';


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'dark');
  const [colors, setColors] = useState(dark);

  const [volume, setVolume] = useState(1)

  useEffect(() => {
    // Load saved theme from storage
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');

        const savedVolume = await AsyncStorage.getItem('volume');
        if (savedTheme) {
          setTheme(savedTheme);
          if (savedTheme == 'auto') {
            setColors((colorScheme == 'dark') ? dark : light)
          } else if (savedTheme == 'light') {
            setColors(light)
          } else {
            setColors(dark)
          }
        }

        if (savedVolume) {
          setVolume(Number(savedVolume))
        }else{
          AsyncStorage.setItem('volume', String(1))
        }

      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    getTheme();
  }, []);

  useEffect(() => {


    if (colorScheme && theme == 'auto') {
      setColors(colorScheme === 'light' ? light : dark)
    }
  }, [colorScheme]);

  const toggleTheme = newTheme => {
    setTheme(newTheme);
    if (newTheme == 'dark') {
      setColors(dark)
    }
    else if (newTheme == 'auto') {
      setColors(colorScheme == 'dark' ? dark : light)
    }
    else {
      setColors(light)
    }
    AsyncStorage.setItem('theme', newTheme)
  };

  const toggleVolume = newVolume => {
    setVolume(Number(newVolume))
    AsyncStorage.setItem('volume', String(newVolume))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, volume, toggleVolume }}>
      {children}
    </ThemeContext.Provider>
  );
};


const DrawerIcon = ({ color, icon }) => {
  return <Image style={{ tintColor: color }} className="mr-[-20] w-5 h-5" source={icon} />
}

const MainLayout = () => {
  const router = useRouter()



  useEffect(() => {
    router.navigate('(planning)')
  }, [])

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme, toggleTheme, colors }) => (
          <Drawer
            drawerContent={(props) => <ImageBackground className="flex-1 pt-[50]" source={require('../assets/bg/drawer.png')}>
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
              </DrawerContentScrollView>

            </ImageBackground>}
            screenOptions={
              {
                headerBackground: () => <View className="flex-1 " style={{ backgroundColor: colors.main.navbar }}></View>,
                headerTitleStyle: {
                  color: colors.main.navText
                },
                drawerStyle: {
                  width: '70%'
                },
                drawerLabelStyle: {
                  fontWeight: 700,
                  fontSize: 16
                },
                drawerActiveBackgroundColor: '#2235',
                drawerActiveTintColor: '#fffc',
                drawerInactiveTintColor: '#223c',
                drawerInactiveBackgroundColor: '#777a',
                //drawer:()=><Image source={require('../assets/bg/drawer.png')}/>
              }
            }>
            <Drawer.Screen
              name="(planning)" // This is the name of the page and must match the url from root

              options={{
                drawerLabel: 'Home',
                title: 'Plan',
                drawerIcon: ({ color, size, focused }) => <DrawerIcon color={color} icon={require('../assets/icons/plan.png')} />, //<Image style={{tintColor:color}} className="mr-[-20] w-5 h-5" source={require('../assets/icons/plan.png')}/>

              }}
            />
            <Drawer.Screen
              name="(profile)" // This is the name of the page and must match the url from root
              options={{
                drawerLabel: 'Profile',
                title: 'Profile',
                drawerIcon: ({ color, size, focused }) => <DrawerIcon color={color} icon={require('../assets/icons/params.png')} />,
              }}
            />
            <Drawer.Screen
              name="(functions)" // This is the name of the page and must match the url from root
              options={{
                drawerLabel: 'Functions',
                title: 'Functions',
                drawerIcon: ({ color, size, focused }) => <DrawerIcon color={color} icon={require('../assets/icons/func.png')} />,
              }}
            />
            <Drawer.Screen
              name="settings" // This is the name of the page and must match the url from root
              options={{
                drawerLabel: 'Settings',
                title: 'Settings',
                drawerIcon: ({ color, size, focused }) => <DrawerIcon color={color} icon={require('../assets/icons/settings.png')} />,
              }}
            />
          </Drawer>
        )}

      </ThemeContext.Consumer>

    </ThemeProvider>
  )
}

export default MainLayout