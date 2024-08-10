import { View, Text, ScrollView, Pressable, Alert, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

const GraphItem = ({id, value, date, type, height, stickColor = "#333", dotColor = "#999",onDelete }) => {
    const animY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animY, {
            toValue: height,
            duration: 1000,
            useNativeDriver: false,
        }).start();

    }, [])

    return (
        <Animated.View className="flex-col items-center w-[30px] " style={{ height: animY }}>
            <Pressable className="w-4 h-4 flex rounded-full  border-2 " style={{ backgroundColor: dotColor, borderColor: stickColor }} onPress={() => {
                Alert.alert('Info', "Date: " + new Date(date).toLocaleDateString() + '\nValue: ' + value.toFixed(2) + type, [
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            if(onDelete) onDelete(id)
                        },
                    },
                    {
                        text: 'Cancel',
                        onPress: () => {

                        },
                    },
                ])


            }} />
            <View className="w-[3px] h-[100%] bg-slate-800" style={{ backgroundColor: stickColor }} />
        </Animated.View>
    )
}


const Graph = ({ graphData, height = 200, bgColor, valueColor, dateColor, textColor = '#223', stickColor, dotColor, onDelete }) => {

    const [data, setData] = useState()

    useEffect(() => {

        setData(prev => null)

    }, [graphData])

    useEffect(() => {
        if (!data) {

            if (graphData) {
                setData(prev => [...graphData])
            }
        }
    }, [data])

    const displayData = () => {

        let biggestValue = Math.max(...data.map(item => item.value))

        return data.map((item, index) => {
            let h = (item.value / biggestValue) * height * 0.9;



            return (<View key={item.id}>
                <GraphItem onDelete={onDelete} dotColor={dotColor} stickColor={stickColor} date={item.date} value={item.value} type={item.type} height={h} id={item.id} />
            </View>)

        })

    }
    const displayDate = () => {
        return data.map((item, index) => {

            return (
                <Text key={index} className="text-[6px] w-[30px]" style={{ color: textColor }}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
            )
        })
    }
    const displayValues = (showLines) => {
        let biggestValue = Math.max(...data.map(item => item.value))

        const h = ((biggestValue / 2) / biggestValue) * height * 0.9;
        let values = []
        for (let i = 1; i <= 2; i++) {
            values.push((
                <View key={i} className="px-1" style={{ height: h }}>
                    <Text className="font-light text-xs" style={{ color: textColor }}>
                        {(biggestValue / i).toFixed(0)}
                    </Text>
                    {showLines ? <View className="absolute border-t-[1px] border-dotted" style={{ width: data.length < 10 ? 500 : data.length * 40 }} ></View> : ''}
                </View>
            ));
        }

        return values;

    }

    return (
        <ScrollView horizontal={true} >
            <View className="flex-row items-stratch" style={{ backgroundColor: bgColor }}>
                <View className="flex-col items-end justify-end border-r-[1px]  z-10 w-fit mr-1 pb-[28px]" style={{ backgroundColor: valueColor }}>
                    {data ?
                        displayValues(true)
                        : ''
                    }
                </View>
                <View className="flex-col ">
                    <View className="flex-row  gap-x-1 items-end px-3 pb-3 " style={{ height: height }}>
                        {data ?
                            displayData()
                            : <Text>No Data...</Text>
                        }
                    </View>
                    <View className=" px-3 py-1 flex-row h-[20px] gap-x-1 border-t-[1px] min-w-[400px] mt-1" style={{ backgroundColor: dateColor }}>
                        {data ?
                            displayDate()
                            : ''
                        }
                    </View>
                </View>
                <View className="flex-col items-end justify-end border-l-[1px] z-10 w-fit pb-[28px]" style={{ backgroundColor: valueColor }}>
                    {data ?
                        displayValues()
                        : ''
                    }
                </View>
            </View>

        </ScrollView>
    )
}

export default Graph