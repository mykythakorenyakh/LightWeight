import { View, Text, Pressable, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

const Timer = ({ timerTitle, time, onFinish, onPause, startTimer, onTitleChange, onTimeChange }) => {

    const [pause, setPause] = useState(true);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [title, setTitle] = useState();

    const timeFormat = (time) => {
        if (Number(time) <= 9) { return '0' + Number(time) }
        else {
            return time

        }
    }

    useEffect(() => {
        if (time) {
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
        if (!pause) {
            if (minutes <= 0 && seconds <= 0) {
                if (onFinish) onFinish();
                setPause(true)
                setMinutes(time.minutes)
                setSeconds(time.seconds)
            }
            let interval = setInterval(() => setSeconds((prev) => {
                if (prev == 0) {
                    setMinutes((prev) => prev - 1)
                    return 59;
                }
                return prev - 1
            }), 1000)
            return () => clearInterval(interval);
        }


    }, [seconds, minutes, pause])

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
        <View className="bg-slate-600 flex-row justify-between py-3 px-6 items-center">
            {displayTime()}

            <TextInput
                className="text-slate-800 text-xl w-[45%]"
                multiline={false}
                defaultValue={title}
                onChangeText={(v) => {
                    setTitle(v);
                    if (onTitleChange) {
                        onTitleChange(v)
                    }
                }}
            />
            <Pressable onPress={() => {
                if (minutes || seconds) {
                    if (!pause && onPause) {
                        onPause()
                    }

                    setPause(prev => !prev)

                }
            }}>
                {pause
                    ? <Image tintColor={(minutes || seconds) ? '#223' : '#2239'} className="w-6 h-8" resizeMode='contain' source={require('../assets/icons/play.png')} />
                    : <Image tintColor={'#223'} className="w-8 h-8" resizeMode='contain' source={require('../assets/icons/pause.png')} />}
            </Pressable>
        </View>
    )
}

export default Timer