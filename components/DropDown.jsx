import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler'

const DropDown = ({ inputBgColor, optionBgColor, textColor, style, barStyle, isReletive, defaultText, selectOnly, data, onSelectChange, onTextChange }) => {
    const [text, setText] = useState('');
    const [showList, setShowList] = useState(false)

    const [list, setList] = useState([])

    useEffect(() => {
        if (data) {
            setList([...data])
            if (selectOnly) {
                setText(data[0])
            }
        }
        if (defaultText) setText(defaultText)
    }, [data])

    return (

        <View className={style + " z-[999] rounded-lg"}
            style={{
                backgroundColor: (inputBgColor) ? inputBgColor : '#f8fafc',
            }}
        >

            <View className="flex-row items-center">
                <TextInput
                    value={text} onChangeText={(v) => {
                        setText(v);
                        if (onTextChange) {
                            onTextChange(v)
                        }
                    }}
                    className={(!barStyle) ? "flex-1 pl-2 pr-5 rounded-lg" : barStyle}
                    style={{
                        backgroundColor: (inputBgColor) ? inputBgColor : '#f8fafc',
                        color:textColor?textColor:'#112'
                    }}
                    readOnly={selectOnly}
                />
                <Pressable className="px-1" onPress={() => setShowList(prev => !prev)}><Text className="text-slate-700">{showList ? "▼" : "◀"}</Text></Pressable>
            </View>
            {showList ?
                <View
                    className={"border-[0.5px] z-[1000] min-h-[50px] w-[100%] gap-y-[1px] "+((!isReletive) ? "top-8  " : "top-[1px]")}
                    style={{
                        position: (isReletive) ? 'reletive' : 'absolute',
                        backgroundColor:optionBgColor?optionBgColor:'#fcfcfc'
                    }}
                >
                    {list.map((item, index) => {
                        return (
                            <View key={index}>
                                <Pressable
                                    className="p-1 z-[1001]"
                                    style={{ 
                                        optionBgColor: (optionBgColor) ? optionBgColor : '#fcfcfc' 
                                    }}
                                    onPress={() => {
                                        if (onSelectChange) {
                                            onSelectChange(item)
                                        }
                                        if (onTextChange) {
                                            onTextChange(item)
                                        }
                                        setText(item);
                                        setShowList(false)
                                    }}
                                >
                                    <Text className="px-2"
                                        style={{
                                            color:textColor?textColor:'#112'
                                        }}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    })}

                </View>
                : ''}
        </View>


    )
}

export default DropDown