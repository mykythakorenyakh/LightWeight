import { View, Text, Pressable, TextInput, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { Audio, InterruptionModeIOS } from 'expo-av';

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { ThemeContext } from '../app/_layout';



const Timer = ({ timerTitle, time, onFinish, onPause, startTimer, onTitleChange, onTimeChange, resetOnly }) => {


    const {colors} = useContext(ThemeContext)

    const [sound, setSound] = useState();

    const [pause, setPause] = useState(true);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [title, setTitle] = useState();

    const [timer, setTimer] = useState()

    const timeFormat = (time) => {
        if (Number(time) <= 9) { return '0' + Number(time) }
        else {
            return time

        }
    }

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/timer/oi2x.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    useEffect(() => {
        if (time) {
            Audio.setAudioModeAsync({
                shouldDuckAndroid:false,
                interruptionModeIOS:InterruptionModeIOS.MixWithOthers,
            })
            setMinutes(time.minutes);
            setSeconds(time.seconds);
        }

    }, [])

    useEffect(() => {
        setTitle(timerTitle)
    }, [timerTitle])

    useEffect(() => {

        setPause(!startTimer)
        if (!pause && onPause) {
            onPause()

        }


    }, [startTimer])


    useEffect(() => {


        const tick = async () => {
            if (!pause) {
                console.log(minutes)
                if (minutes == 0 && seconds == 4) {
                    playSound()
                }
                if (minutes <= 0 && seconds <= 0) {
                    if (onFinish) onFinish();
                    setPause(true)
                    setMinutes(time.minutes)
                    setSeconds(time.seconds)
                }
                if (!timer) {
                    let interval = setInterval(() => {

                        setSeconds((prev) => {
                            if (prev == 0) {
                                setMinutes((prev) => prev - 1)
                                return 59;
                            }
                            return prev - 1
                        });

                    }, 1000)
                    setTimer(interval)
                    return () => clearInterval(interval)

                }
            }

            if (pause) {
                clearInterval(timer)
                setTimer(null);
            }


        }




        tick()


    }, [minutes, seconds, pause])

    const displayTime = () => {
        if (pause) {
            return (<View className="flex-row gap-x-1 items-center">
                <TextInput
                    inputMode='numeric'
                    className=" font-light text-xl border-b-[1px] w-[30px] text-center"
                    defaultValue={String(minutes)}
                    value={String(minutes)}
                    onChangeText={(v) => {
                        if (Number(v) < 60) {
                            setMinutes(v)
                            if (onTimeChange) {
                                onTimeChange({
                                    minutes: Number(v),
                                    seconds: Number(seconds)
                                })
                            }
                        }
                    }}
                />
                <Text>:</Text>
                <TextInput
                    inputMode='numeric'
                    className="font-light text-xl border-b-[1px] w-[30px] text-center"
                    defaultValue={String(seconds)}
                    value={String(seconds)}
                    onChangeText={(v) => {
                        if (Number(v) < 60) {
                            setSeconds(v)
                            if (onTimeChange) {
                                onTimeChange({
                                    minutes: Number(minutes),
                                    seconds: Number(v)
                                })
                            }
                        }
                    }}
                />
            </View>)
        } else {
            return (
                <View className="flex-row gap-x-1">
                    <Text
                        className="font-bold text-xl"
                    >{timeFormat(minutes)} :</Text>
                    <Text
                        className="font-bold text-xl"
                    >{timeFormat(seconds)}</Text>
                </View>
            )
        }

    }

    return (
        <View className="flex-row justify-between py-3 px-6 items-center"
        style={{backgroundColor:colors.main.optionBg}}
        >
            {displayTime()}

            <TextInput
                className="text-xl w-[45%]"
                multiline={false}
                defaultValue={title}
                tintColor={colors.main.text}
                onChangeText={(v) => {
                    setTitle(v);
                    if (onTitleChange) {
                        onTitleChange(v)
                    }
                }}
            />
            {resetOnly ?
                <Pressable onPress={() => {
                    setMinutes(time.minutes)
                    setSeconds(time.seconds)
                }}>

                    {(time.minutes!=minutes || time.seconds!=seconds)?<Image tintColor={colors.main.button} className="w-6 h-8" resizeMode='contain' source={require('../assets/icons/reset.png')} />:''}

                </Pressable>
                :
                <Pressable onPress={() => {
                    if (minutes || seconds) {
                        if (!pause && onPause) {
                            onPause()
                        }


                        setPause(prev => !prev)

                    }
                }}>
                    {pause
                        ? <Image tintColor={(minutes || seconds) ? colors.main.button : colors.main.unavailable} className="w-6 h-8" resizeMode='contain' source={require('../assets/icons/play.png')} />
                        : <Image tintColor={colors.main.button} className="w-8 h-8" resizeMode='contain' source={require('../assets/icons/pause.png')} />}
                </Pressable>
            }

        </View>
    )
}

export default Timer