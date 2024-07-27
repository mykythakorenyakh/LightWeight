import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'

import { getExercises } from '../../services/database';
import DropDown from '../../components/DropDown';

const Records = () => {

    const [exercises, setExercises] = useState();

    const [titles, setTitles] = useState()
    const [title, setTitle] = useState('All')

    const [types, setTypes] = useState()
    const [type, setType] = useState('All')

    const [amountUp,setAmountUp] = useState(true)
    const [weightUp,setWeightUp] = useState(true)

    useEffect(() => {
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

    }, [])


    const displayExercises = () => {
        if (exercises) {
            return (

                <ScrollView>
                    <View className="p-3 gap-y-[1px]">
                        {exercises.filter(set => {
                            if (title === 'All') return true;
                            else return set.title == title;

                        }).filter(set => {
                            if (type === 'All') return true;
                            else return set.type == type;

                        }).sort((set1,set2)=>{
                            return (amountUp)?set2.amount - set1.amount:set1.amount - set2.amount;
                        }).sort((set1,set2)=>{
                            return (weightUp)?set2.weight - set1.weight:set1.weight - set2.weight;
                        }).map((item, index) => (
                            <View className="flex-row justify-between bg-slate-600 p-3 border-x-2 border-x-slate-900" key={item.id + "-" + index}>

                                <Text className="w-[100px] text-slate-800 text-lg font-bold">{item.title}</Text>
                                <Text className=" text-ms text-slate-800 text-lg">
                                    {item.amount}<Text className="text-[10px] text-slate-700">{(item.type !== 'rep') ? item.type + ' ' : ' '}
                                    </Text>

                                    {item.weight != 0 ? <Text className="w-[30px] text-right text-slate-800"> x {item.weight}kg</Text> : ''}
                                </Text>



                            </View>
                        ))}
                    </View>
                </ScrollView>
            )
        }
    }

    return (
        <View className="flex-1 bg-slate-800">
            <View className="flex-row p-3 gap-x-[3px] items-center">
                <View>
                    <Text className="text-slate-400">Exercise</Text>
                    <DropDown
                        data={titles}
                        selectOnly={true}
                        onSelectChange={(v) => setTitle(v)}
                        style="bg-slate-50 w-[120px]"
                    />
                </View>
                <View>
                    <Text className="text-slate-400">Type</Text>
                    <DropDown
                        data={types}
                        selectOnly={true}
                        onSelectChange={(v) => setType(v)}
                        style="bg-slate-50 w-[70px]"
                    />
                </View>
                <Pressable onPress={()=>setWeightUp(prev=>!prev)}>
                    <Text className="font-extrabold text-slate-300 py-3 px-1 bg-sky-950">{weightUp?'↑':'↓'}Weight</Text>
                </Pressable>
                <Pressable onPress={()=>setAmountUp(prev=>!prev)}>
                    <Text className="font-extrabold text-slate-300 py-3 px-1 bg-sky-950">{amountUp?'↑':'↓'}Amount</Text>
                </Pressable>
            </View>
            {displayExercises()}
        </View>
    )
}

export default Records