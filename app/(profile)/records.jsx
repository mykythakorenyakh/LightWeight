import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { getExercises } from '../../services/database';
import DropDown from '../../components/DropDown';
import { ThemeContext } from '../_layout';


const Records = () => {

    const { colors } = useContext(ThemeContext)

    const [exercises, setExercises] = useState();

    const [titles, setTitles] = useState()
    const [title, setTitle] = useState('All')

    const [types, setTypes] = useState()
    const [type, setType] = useState('All')

    const [amountUp, setAmountUp] = useState(true)
    const [weightUp, setWeightUp] = useState(true)

    const [refreshing, setRefreshing] = useState(true);

    const update = () => {
        const results = [...new Set(getExercises().getAllSync().reverse())]
        if (results) {
            const arr = []
            results.map(item => {
                return new Object(JSON.parse(item.exercises)).map(exer => {
                    if (!exer.odd) {
                        arr.push({
                            id: exer.id,
                            title: exer.title,
                            amount: exer.cycle[0].reps,
                            weight: exer.cycle[0].weight,
                            type: exer.repsType,
                        })
                    } else {
                        exer.cycle.map(set => {
                            arr.push({
                                id: exer.id,
                                title: exer.title,
                                amount: set.reps,
                                weight: set.weight,
                                type: exer.repsType,
                            })
                            return set;
                        })
                    }
                    return exer
                })
            })

            setExercises([...new Set(arr)])
            setTitles(['All', ...new Set(arr.map(item => item.title))])
            setTypes(['All', ...new Set(arr.map(item => item.type))])
        }
    }

    useEffect(() => {
        update()

        setRefreshing(false)
    }, [])

    const onRefresh = () => {
        setRefreshing(true)

        update()

        setRefreshing(false)
    }

    const displayExercises = () => {
        if (exercises) {
            return (

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View className="p-3 gap-y-[1px] min-h-[600px]">
                        {exercises.filter(set => {
                            if (title === 'All') return true;
                            else return set.title == title;

                        }).filter(set => {
                            if (type === 'All') return true;
                            else return set.type == type;

                        }).sort((set1, set2) => {
                            return (amountUp) ? set2.amount - set1.amount : set1.amount - set2.amount;
                        }).sort((set1, set2) => {
                            return (weightUp) ? set2.weight - set1.weight : set1.weight - set2.weight;
                        }).map((item, index) => (
                            <View
                                style={{
                                    backgroundColor: colors.main.optionBg,
                                    borderLeftColor: colors.main.button,
                                    borderRightColor: colors.main.button
                                }}
                                className="flex-row justify-between  p-3 border-x-2 " key={item.id + "-" + index}>

                                <Text className="w-[100px] text-lg font-bold"
                                    style={{
                                        color: colors.main.text,
                                    }}
                                >{item.title}</Text>
                                <Text className=" text-ms text-lg"
                                    style={{
                                        color: colors.main.subText,
                                    }}
                                >
                                    {item.amount}<Text className="text-[10px]"
                                        style={{
                                            color: colors.main.subText,
                                        }}
                                    >{(item.type !== 'rep') ? item.type + ' ' : ' '}
                                    </Text>

                                    {item.weight != 0 ? <Text className="w-[30px] text-right"
                                        style={{
                                            color: colors.main.subText,
                                        }}
                                    > x {item.weight}kg</Text> : ''}
                                </Text>



                            </View>
                        ))}
                    </View>
                </ScrollView>
            )
        }
    }

    return (

        <View


            className="flex-1 "
            style={{
                backgroundColor: colors.main.bg
            }}
        >
            <View className="flex-row p-3 gap-x-[3px] items-end">
                <View>
                    <Text className="text-slate-400">Exercise</Text>
                    <DropDown
                        data={titles}
                        selectOnly={true}
                        onSelectChange={(v) => setTitle(v)}
                        style="w-[120px]"
                        inputBgColor={colors.main.optionBg}
                        optionBgColor={colors.main.optionBg}
                        textColor={colors.main.text}
                    />
                </View>
                <View>
                    <Text className="text-slate-400">Type</Text>
                    <DropDown
                        data={types}
                        selectOnly={true}
                        onSelectChange={(v) => setType(v)}
                        style="w-[70px]"
                        inputBgColor={colors.main.optionBg}
                        optionBgColor={colors.main.optionBg}
                        textColor={colors.main.text}
                    />
                </View>
                <Pressable onPress={() => setWeightUp(prev => !prev)}>
                    <Text className="font-extrabold py-2 px-1"
                        style={{
                            color: colors.main.button,
                            backgroundColor: colors.main.optionBg,
                        }}
                    >{weightUp ? '↑' : '↓'}Weight</Text>
                </Pressable>
                <Pressable onPress={() => setAmountUp(prev => !prev)}>
                    <Text className="font-extrabold py-2 px-1"
                        style={{
                            color: colors.main.button,
                            backgroundColor: colors.main.optionBg,
                        }}
                    >{amountUp ? '↑' : '↓'}Amount</Text>
                </Pressable>
            </View>
            {displayExercises()}
        </View>
    )
}

export default Records