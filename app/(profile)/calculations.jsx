import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { getProfile } from '../../services/database.jsx'

import DropDown from '../../components/DropDown'
import { ScrollView, TextInput } from 'react-native-gesture-handler'


const Calculations = () => {

    const [page, setPage] = useState('Body Params')
    const [body, setBody] = useState()

    const [bwIncluded,setBWIncluded] = useState(false);
    const [weight,setWeight] = useState()
    const [amount,setAmount] = useState()

    useEffect(() => {
        const result = getProfile().getAllSync().reverse()
        if (result) {
            setBody(Object(result[0]))
        }


    }, [])

    const displayBodyParams = () => {
        if (body) {
            const calories = (Number(body.weight) * 10 + Number(body.height) * 6.25 + 125);

            const proteinMin = (Number(body.weight * 1));
            const proteinMax = (Number(body.weight * 1.5));

            const fatMin = (Number(body.weight * 0.5));
            const fatMax = (Number(body.weight * 1));

            const carbMin = (Number(body.weight * 2));
            const carbMax = (Number(body.weight * 4));


            const bodyFatP = (495 / (1.0324 - 0.19077 * Math.log10(body.weist - body.neck) + 0.15456 * Math.log10(body.height))) - 450

            return (<View className="flex">
                <Text className="px-3 mt-3 text-slate-50 font-bold text-lg">Calories</Text>
                <View className="bg-slate-500 flex-row p-3 justify-between">
                    <Text className="font-semibold text-slate-300">Base Calories</Text>
                    <Text className="italic text-slate-800">{calories}</Text>
                </View>

                <View className="bg-slate-300 flex-row p-1 px-5 justify-between">
                    <Text className="font-semibold text-slate-500">Proteins</Text>
                    <Text className="italic text-slate-800">{proteinMin} - {proteinMax}</Text>
                </View>
                <View className="bg-slate-400 flex-row p-1 px-5 justify-between">
                    <Text className="font-semibold text-slate-300">Fats</Text>
                    <Text className="italic text-slate-800">{fatMin} - {fatMax}</Text>
                </View>
                <View className="bg-slate-300 flex-row p-1 px-5 justify-between">
                    <Text className="font-semibold text-slate-500">Carbs</Text>
                    <Text className="italic text-slate-800">{carbMin} - {carbMax}</Text>
                </View>

                <Text className="px-3 mt-3 text-slate-50 font-bold text-lg">Body Fat%</Text>
                <View className="bg-slate-500 flex-row p-3 justify-between">
                    <Text className="font-semibold text-slate-300">Fat%</Text>
                    <Text className="italic text-slate-800">{bodyFatP.toFixed(2)}</Text>
                </View>
                <View className="bg-slate-300 flex-row p-1 px-5 justify-between">
                    <Text className="font-semibold text-slate-500">Fat Mass</Text>
                    <Text className="italic text-slate-800">{(body.weight * bodyFatP / 100).toFixed(2)}kg</Text>
                </View>
                <View className="bg-slate-400 flex-row p-1 px-5 justify-between">
                    <Text className="font-semibold text-slate-300">Lean Mass</Text>
                    <Text className="italic text-slate-800">{(body.weight - body.weight * bodyFatP / 100).toFixed(2)}kg</Text>
                </View>
            </View>)
        }
    }

    const displayRMRows=()=>{
        const bw = (bwIncluded)?Number(body.weight):0
        const rm = (Number(weight)+Number(bw)) / ((100 - ((amount) * 2.5)) / 100)
        const rows = []
        for(let i = 0;i<20;i++){
            if(i===1) continue;
            const w =  rm * ((100 - ((i) * 2.5)) / 100)
            rows.push((
                <View key={i} className="flex-row p-3 bg-slate-500 justify-between border-x-2 border-x-slate-800">
                    <Text className="font-bold w-[60px] text-slate-100">{(!i)?i+1:i}</Text>
                    <Text className="font-semibold text-slate-300 w-[60px] text-right">{(w/rm*100).toFixed(2)}%</Text>
                    <Text className="font-semibold text-slate-300 w-[60px] text-right">{(Number(w)-Number(bw)).toFixed(2)}kg</Text>
                </View>
            ))
        }
        return rows;
    }

    const rmCalulator = () => {
        if(body){
            return (<View>
                <View className="flex-row gap-x-3 p-3 items-end">
                    <Text className="text-slate-200 text-xl">Enter </Text>
                    <View className="flex-col">
                        <Text  className="text-slate-400 text-ms">Weight</Text>
                        <TextInput inputMode='numeric' className="bg-slate-100 w-[100px]" defaultValue={weight} onChangeText={(v)=>setWeight(v)}/>
                        {bwIncluded?<Text className="absolute bottom-[-10px] w-[50px] right-[-20px] font-bold rotate-[-20deg] text-orange-400 text-xs">+ Body Weight</Text>:''}
                    </View>
                    <View className="flex-col">
                        <Text  className="text-slate-400 text-ms">Amount</Text>
                        <TextInput inputMode='numeric' className="bg-slate-100 w-[100px]" defaultValue={amount} onChangeText={(v)=>setAmount(v)}/>
                    </View>
                    <Pressable 
                    onPress={()=>setBWIncluded(prev=>!prev)}
                    style={{
                        backgroundColor:(!bwIncluded)?'#166534':'#991b1b'
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full">
                        <Text className="text-slate-200 text-[11px]"  >
                            {(!bwIncluded)?'+BW':'-BW'}
                        </Text>
                    </Pressable>
                </View>
                {(weight && amount)?
                <ScrollView className="px-3 bg-slate-700">
                    <View className="flex-col gap-y-[1px] pt-3 mb-[150px]">
                    {displayRMRows()}
                    </View>
                </ScrollView>
                :<Image tintColor={'#6669'} resizeMode='contain' className="mx-auto mt-10 w-10 " source={require('../../assets/icons/null.png')}/>}
            </View>)

        }
    }

    return (
        <View className="flex flex-1 bg-slate-800">
            <DropDown
                data={['Body Params', 'RM Calculator']}
                selectOnly={true}
                onSelectChange={(v) => setPage(v)}
                style={"mx-auto mt-3 bg-slate-50 w-[150px]"}
            />

            {page == 'Body Params' ?
                displayBodyParams()
                : rmCalulator()}

        </View>
    )
}

export default Calculations