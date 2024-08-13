import { View, Text, TextInput, Image, Pressable, Animated } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Timer from './Timer'
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Audio } from 'expo-av';
import { ThemeContext } from '../app/_layout';

const delay = ms => new Promise(res => setTimeout(res, ms));

const TimersSet = ({ data, timerTitle, repeatAmount, onDataChange, onRepeatChange, onTitleChange }) => {

    const { colors } = useContext(ThemeContext);


    const [timers, setTimers] = useState([]);
    const [title, setTitle] = useState();
    const [order, setOrder] = useState(0);
    const [repeat, setRepeat] = useState();

    const [pause, setPause] = useState(true)
    const [starting, setStarting] = useState(false)




    useEffect(() => {
        setTimers(data)
        setTitle(timerTitle)
        setRepeat(repeatAmount)

    }, [])


    useEffect(() => {
        if (!timers) {
            if (data) {
                setTimers(data)
            }
        }

    }, [timers])


    const createTimer = () => {
        const newArr = (timers) ? [...timers, {
            id: Math.random() * 10000,
            title: 'new Timer',
            time: {
                minutes: 0,
                seconds: 5
            }
        }] : [{
            id: Math.random() * 10000,
            title: 'new Timer',
            time: {
                minutes: 0,
                seconds: 5
            }
        }];

        setTimers([...newArr])
        if (onDataChange) onDataChange([...newArr])
    }

    const delAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [0, 50],
            outputRange: [30, 0],
            extrapolate: 'clamp',
        });
        const angel = dragX.interpolate({
            inputRange: [0, 50],
            outputRange: [90, 0],
            extrapolate: 'clamp',
        });

        return (<Animated.View
            className="bg-red-500 h-10 w-10 items-center justify-center self-center rounded-full"
            style={{
                transform: [{ translateX: scale }],

            }}
        >
            <Image tintColor={'#223'} className="w-8 h-8" source={require('../assets/icons/trash.png')} />
        </Animated.View>)
    }
    const deleteTimer = (timerId) => {
        let newArr = [...timers].filter(item => item.id != timerId)
        setTimers(prev => newArr)
        if (onDataChange) onDataChange(newArr)
    }

    const displayTimers = () => {
        if (timers) {
            return timers.map((item, index) => {
                let play = (order === index && !pause);
                return (

                    <View key={item.id} className="my-[1px]">
                        <Swipeable
                            renderLeftActions={delAction}
                            onSwipeableWillOpen={direction => {
                                if (direction === 'left') {
                                    deleteTimer(item.id)
                                }
                            }}
                        >
                            <Timer
                                timerTitle={item.title}
                                time={item.time}
                                startTimer={play}
                                resetOnly={true}
                                onFinish={() => {
                                    setOrder(prev => prev + 1);
                                    if (repeat == 1 && order + 1 >= timers.length) {
                                        setOrder(0)
                                        setRepeat(repeatAmount)
                                        setPause(true)
                                        return;
                                    }
                                    else {
                                        if (order + 1 >= timers.length) {
                                            if (!repeat) {
                                                setPause(true)
                                            }
                                            setOrder(0)
                                            setRepeat(prev => prev - 1)
                                        }
                                    }



                                }}

                                onTimeChange={(t) => {
                                    setTimers(prev => {
                                        let arr = prev.map(timer => {
                                            if (timer.id === item.id) timer.time = t;
                                            return timer;
                                        })

                                        if (onDataChange) onDataChange(arr)

                                        return arr;
                                    })
                                }}

                                onTitleChange={(t) => {
                                    setTimers(prev => {
                                        let arr = prev.map(timer => {
                                            if (timer.id === item.id) timer.title = t;
                                            return timer;
                                        })

                                        if (onDataChange) onDataChange(arr)

                                        return arr;
                                    })
                                }}

                            />
                        </Swipeable>
                    </View>

                )
            })


        }

    }

    return (
        <View className="flex-col p-3 justify-between my-[1px]" style={{ backgroundColor: colors.main.subBg }}>
            <View className="flex-row py-1 px-3 justify-between items-center">
                <Pressable
                    onPress={() => { createTimer(); }}
                >
                    <Image
                        className="w-4 h-4"
                        resizeMode='contain'
                        tintColor={colors.main.button}
                        source={require('../assets/icons/plus.png')} />
                </Pressable>
                <TextInput
                    className="w-[30%] border-b-[1px]"
                    multiline={false}
                    defaultValue={title}
                    value={title}
                    tintColor={colors.main.text}
                    onChangeText={(v) => {
                        setTitle(v);
                        if (onTitleChange) onTitleChange(v)
                    }}
                />

                {pause ?
                    <TextInput
                        className="w-[10%]  text-center"
                        style={{ backgroundColor: colors.main.subBg}}
                        tintColor={colors.main.text}
                        inputMode='numeric'
                        defaultValue={repeatAmount}
                        value={repeatAmount}
                        onChangeText={(v) => {
                            setRepeat(v)
                            if (onRepeatChange) onRepeatChange(v)
                        }}
                    />
                    :
                    <Text className="w-[10%] text-slate-900">
                        {repeat} / {repeatAmount}
                    </Text>
                }


                <Pressable onPress={() => {
                    setOrder(0)
                    setRepeat(repeatAmount)
                    setTimers(null)
                    setPause(true)

                }}>

                    {(order != 0 || repeat != repeatAmount || !pause) ? <Image tintColor={starting ? '#2239' : '#223'} className="w-6 h-8" resizeMode='contain' source={require('../assets/icons/reset.png')} /> : ''}

                </Pressable>

                <Pressable onPress={(!starting) ? async () => {
                    if (pause) {
                        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/timer/oi.mp3'));
                        setStarting(true)
                        await sound.setPositionAsync(0)
                        await sound.setVolumeAsync(0.25)
                        await sound.playAsync();
                        await delay(1000)

                        await sound.setPositionAsync(0)
                        await sound.setVolumeAsync(0.5)
                        await sound.playAsync();
                        await delay(1000)

                        await sound.setPositionAsync(0)
                        await sound.setVolumeAsync(1)
                        await sound.playAsync();
                        setPause(prev => !prev)
                        setStarting(false)


                    } else {
                        setPause(prev => !prev)
                    }
                } : null}>
                    {pause
                        ? <Image tintColor={!starting ? colors.main.button : colors.main.unavailable} className="w-6 h-8" resizeMode='contain' source={require('../assets/icons/play.png')} />
                        : <Image tintColor={colors.main.button} className="w-8 h-8" resizeMode='contain' source={require('../assets/icons/pause.png')} />}
                </Pressable>
            </View>
            {displayTimers()}
        </View>
    )
}

export default TimersSet