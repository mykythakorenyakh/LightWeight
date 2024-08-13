import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { getProfile } from '../../services/database.jsx'

import DropDown from '../../components/DropDown'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { ThemeContext } from '../_layout.jsx'


const Calculations = () => {

    const { colors } = useContext(ThemeContext)

    const [page, setPage] = useState('Body Params')
    const [body, setBody] = useState()

    const [bwIncluded, setBWIncluded] = useState(false);
    const [weight, setWeight] = useState()
    const [amount, setAmount] = useState()

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
                <Text className="px-3 mt-3 font-bold text-lg"
                    style={{
                        color: colors.main.text
                    }}
                >Calories</Text>
                <View className=" flex-row p-3 justify-between"
                    style={{
                        backgroundColor: colors.main.subBg
                    }}
                >
                    <Text className="font-semibold "
                        style={{
                            color: colors.main.subText
                        }}
                    >Base Calories</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{calories}</Text>
                </View>

                <View className="bg-slate-300 flex-row p-1 px-5 justify-between"
                    style={{
                        backgroundColor: colors.main.optionBg
                    }}
                >
                    <Text className="font-semibold"
                        style={{
                            color: colors.main.subText
                        }}
                    >Proteins</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{proteinMin} - {proteinMax}</Text>
                </View>
                <View className="flex-row p-1 px-5 justify-between"
                    style={{
                        backgroundColor: colors.main.subBg
                    }}
                >
                    <Text className="font-semibold"
                        style={{
                            color: colors.main.subText
                        }}
                    >Fats</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{fatMin} - {fatMax}</Text>
                </View>
                <View className="bg-slate-300 flex-row p-1 px-5 justify-between"
                    style={{
                        backgroundColor: colors.main.optionBg
                    }}
                >
                    <Text className="font-semibold"
                        style={{
                            color: colors.main.subText
                        }}
                    >Carbs</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{carbMin} - {carbMax}</Text>
                </View>

                <Text className="px-3 mt-3 font-bold text-lg"
                    style={{
                        color: colors.main.text
                    }}
                >Body Fat%</Text>
                <View className="flex-row p-3 justify-between"
                    style={{
                        backgroundColor: colors.main.subBg
                    }}
                >
                    <Text className="font-semibold "
                        style={{
                            color: colors.main.subText
                        }}
                    >Fat%</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{bodyFatP.toFixed(2)}</Text>
                </View>
                <View className="flex-row p-1 px-5 justify-between"
                    style={{
                        backgroundColor: colors.main.optionBg
                    }}
                >
                    <Text className="font-semibold "
                        style={{
                            color: colors.main.subText
                        }}
                    >Fat Mass</Text>
                    <Text className="italic "
                        style={{
                            color: colors.main.text
                        }}
                    >{(body.weight * bodyFatP / 100).toFixed(2)}kg</Text>
                </View>
                <View className="flex-row p-1 px-5 justify-between"
                    style={{
                        backgroundColor: colors.main.subBg
                    }}
                >
                    <Text className="font-semibold "
                        style={{
                            color: colors.main.subText
                        }}
                    >Lean Mass</Text>
                    <Text className="italic"
                        style={{
                            color: colors.main.text
                        }}
                    >{(body.weight - body.weight * bodyFatP / 100).toFixed(2)}kg</Text>
                </View>
            </View>)
        }
    }

    const displayRMRows = () => {
        const bw = (bwIncluded) ? Number(body.weight) : 0
        const rm = (Number(weight) + Number(bw)) / ((100 - ((amount) * 2.5)) / 100)
        const rows = []
        for (let i = 0; i < 20; i++) {
            if (i === 1) continue;
            const w = rm * ((100 - ((i) * 2.5)) / 100)
            rows.push((
                <View key={i} className="flex-row p-3 justify-between border-x-2"
                    style={{
                        borderLeftColor: colors.main.button,
                        borderRightColor: colors.main.button,
                        backgroundColor: colors.main.optionBg

                    }}
                >
                    <Text className="font-bold w-[60px]"
                        style={{
                            color: colors.main.subText,
                        }}
                    >{(!i) ? i + 1 : i}</Text>
                    <Text
                        style={{
                            color: colors.main.subText,
                        }}
                        className="font-semibold w-[60px] text-right">{(w / rm * 100).toFixed(2)}%</Text>
                    <Text className="font-semibold w-[60px] text-right"
                        style={{
                            color: colors.main.subText,
                        }}
                    >{(Number(w) - Number(bw)).toFixed(2)}kg</Text>
                </View>
            ))
        }
        return rows;
    }

    const rmCalulator = () => {
        if (body) {
            return (<View>
                <View className="flex-row gap-x-3 p-3 items-end">
                    <Text className="italic text-xl"
                        style={{
                            color: colors.main.text
                        }}
                    >Enter </Text>
                    <View className="flex-col">
                        <Text className="text-ms"
                            style={{
                                color: colors.main.text
                            }}>Weight</Text>
                        <TextInput inputMode='numeric' className="px-2 w-[100px]"
                            style={{
                                color: colors.main.text,
                                backgroundColor: colors.main.optionBg
                            }}
                            defaultValue={weight} onChangeText={(v) => setWeight(v)} />
                        {bwIncluded ? <Text className="absolute bottom-[-8px] w-[50px] right-[-20px] font-bold rotate-[-20deg] text-orange-400 text-xs">+ Body Weight</Text> : ''}
                    </View>
                    <View className="flex-col">
                        <Text className="text-ms"
                            style={{
                                color: colors.main.text
                            }}
                        >Amount</Text>
                        <TextInput inputMode='numeric' className="px-2 w-[100px]"
                            style={{
                                color: colors.main.text,
                                backgroundColor: colors.main.optionBg
                            }}
                            defaultValue={amount} onChangeText={(v) => setAmount(v)} />
                    </View>
                    <Pressable
                        onPress={() => setBWIncluded(prev => !prev)}
                        style={{
                            backgroundColor: (!bwIncluded) ? '#166534' : '#991b1b'
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full">
                        <Text className="text-slate-200 text-[11px]"  >
                            {(!bwIncluded) ? '+BW' : '-BW'}
                        </Text>
                    </Pressable>
                </View>
                {(weight && amount) ?
                    <ScrollView className="px-3"
                        style={{
                            backgroundColor: colors.main.subBg
                        }}
                    >
                        <View className="flex-col gap-y-[1px] pt-3 mb-[150px]">
                            {displayRMRows()}
                        </View>
                    </ScrollView>
                    : <Image tintColor={'#6669'} resizeMode='contain' className="mx-auto mt-10 w-10 " source={require('../../assets/icons/null.png')} />}
            </View>)

        }
    }

    return (
        <View className="flex flex-1"
            style={{
                backgroundColor: colors.main.bg
            }}
        >
            <View>
                <DropDown
                    data={['Body Params', 'RM Calculator']}
                    defaultText={page}
                    selectOnly={true}
                    style="mx-auto mt-3 w-[150px]"
                    inputBgColor={colors.main.optionBg}
                    optionBgColor={colors.main.optionBg}
                    textColor={colors.main.text}
                    onSelectChange={(v) => setPage(v)}
                />
            </View>

            {page == 'Body Params' ?
                displayBodyParams()
                : rmCalulator()}

        </View>
    )
}

export default Calculations