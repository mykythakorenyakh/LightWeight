import { View, Text, Pressable, Image, Animated } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { Dimensions } from 'react-native';

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { ThemeContext } from '../_layout';


let materialList = [
    require('../../assets/material/gachi1.gif'),
    require('../../assets/material/gachi2.gif'),
    require('../../assets/material/gachi3.gif'),
    require('../../assets/material/gachi4.gif'),

    require('../../assets/material/schwarz1.gif'),
    require('../../assets/material/schwarz2.gif'),

    require('../../assets/material/bale1.gif'),
    require('../../assets/material/bale2.gif'),

    require('../../assets/material/rock1.gif'),
    require('../../assets/material/rock2.gif'),
    require('../../assets/material/rock3.gif'),
    require('../../assets/material/rock4.gif'),
    require('../../assets/material/rock5.gif'),

    require('../../assets/material/voytenko1.gif'),
]

let soundList = [
    require('../../assets/sounds/special/coleman1.mp3'),
    require('../../assets/sounds/special/coleman2.mp3'),
    require('../../assets/sounds/special/coleman3.mp3'),
    require('../../assets/sounds/special/coleman4.mp3'),
    require('../../assets/sounds/special/coleman5.mp3'),

    require('../../assets/sounds/special/coleman6.mp3'),
    require('../../assets/sounds/special/coleman7.mp3'),
    require('../../assets/sounds/special/coleman8.mp3'),
    require('../../assets/sounds/special/coleman9.mp3'),
    require('../../assets/sounds/special/coleman10.mp3'),

    require('../../assets/sounds/special/coleman11.mp3'),
    require('../../assets/sounds/special/coleman12.mp3'),
    require('../../assets/sounds/special/coleman13.mp3'),
    require('../../assets/sounds/special/coleman14.mp3'),
    require('../../assets/sounds/special/coleman15.mp3'),

    require('../../assets/sounds/special/gachi1.mp3'),
    require('../../assets/sounds/special/gachi2.mp3'),
    require('../../assets/sounds/special/gachi3.mp3'),
    require('../../assets/sounds/special/gachi4.mp3'),
    require('../../assets/sounds/special/gachi5.mp3'),
    require('../../assets/sounds/special/gachi6.mp3'),

    require('../../assets/sounds/special/gym1.mp3'),



]


const Special = () => {

    const {colors} = useContext(ThemeContext)

    const windowWidth = Dimensions.get('window').width - 100;
    const windowHeight = Dimensions.get('window').height - 100;

    const [start, setStart] = useState(false)

    const [buttonPressed, setButtonPressed] = useState(false)

    const [image, setImage] = useState()
    const location = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const [cycle, setCycle] = useState(null)

    const [imageIndex, setImageIndex] = useState(0)

    const [soundEffect, setSoundEffect] = useState();
    const [soundIndex, setSoundIndex] = useState(0)

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function playSound(src) {
        Audio.setAudioModeAsync({
            shouldDuckAndroid:false,
            interruptionModeIOS:InterruptionModeIOS.MixWithOthers,
        })
        const { sound } = await Audio.Sound.createAsync(src);
        await sound.setIsMutedAsync(false)

        await sound.setVolumeAsync(Math.random())
        await sound.setPositionAsync(0);
        setSoundEffect(sound);
        await sound.playAsync();
    }


    useEffect(() => {

        if (start) {

            if (imageIndex == 0) {
                materialList = shuffle(materialList);
            }

            setImage(materialList[imageIndex])

            let x = Math.random() * (windowWidth) - 100;
            let y = Math.random() * (windowHeight) - 100;

            let xTo = Math.random() * (windowWidth) - 100;
            let yTo = Math.random() * (windowHeight) - 100;

            location.setValue({
                x, y
            })

            Animated.timing(location, {
                toValue: { x: xTo, y: yTo },
                duration: 3000,
                useNativeDriver: false,
            }).start()

            setTimeout(() => {
                if (imageIndex >= soundList.length / 2) {
                    setImageIndex(0)
                } else {
                    setImageIndex(prev => prev + 1)
                }
            }, 3000)


        } else {
            setImageIndex(0)
        }




    }, [start,imageIndex]);


    useEffect(() => {
        if (start) {

            if (soundIndex == 0) {
                soundList = shuffle(soundList);
            }

            playSound(soundList[soundIndex])

            setTimeout(() => {
                if (soundIndex >= soundList.length / 2) {
                    setSoundIndex(0)
                } else {
                    setSoundIndex(prev => prev + 1)
                }
            }, 1000)


        } else {
            setSoundIndex(0)
        }


    }, [start, soundIndex])

    return (
        <>
            {!start ?
                <View className="flex-1  justify-center items-center"
                    style={{backgroundColor:colors.main.bg}}
                >
                    <Pressable onPressIn={() => setButtonPressed(true)} onPressOut={() => { setButtonPressed(false); setStart(true); }}>
                        <Image resizeMode='contain'
                            className="w-[100px]"
                            source={(!buttonPressed) ? require('../../assets/icons/redbutton1.png') : require('../../assets/icons/redbutton2.png')} />
                    </Pressable>
                </View>
                :

                <Pressable className="flex-1 "
                style={{backgroundColor:colors.main.subBg}}
                onLongPress={() => setStart(false)}>
                    <Animated.Image
                        className="max-w-[400px] max-h-[400px]"
                        resizeMode='contain'
                        style={{ transform: location.getTranslateTransform() }}
                        source={image} />
                </Pressable>

            }
        </>
    )
}

export default Special