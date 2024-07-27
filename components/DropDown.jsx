import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler'

const DropDown = ({ style, selectOnly, data, onSelectChange, onTextChange }) => {
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
    }, [data])

    return (
        
            <View className={style + " z-[999]"}>
                {showList ?
                    <View
                        className="absolute z-[1000] bg-slate-50  min-h-[50px] top-8 w-[100%] gap-y-[1px]"
                    >
                        {list.map((item, index) => {
                            return (
                                <View key={index}>
                                    <Pressable
                                        className="p-1 z-[1001] bg-slate-100"
                                        onPress={() => {
                                            setText(item);
                                            setShowList(false)
                                            if(onTextChange){
                                                onTextChange(item)
                                            }
                                            if(onSelectChange){
                                                onSelectChange(item)
                                            }
                                        }}
                                    >
                                        <Text className="text-slate-800 px-2">
                                            {item}
                                        </Text>
                                    </Pressable>
                                </View>
                            )
                        })}

                    </View>
                    : ''}
                <View className="flex-row items-center">
                    <TextInput
                        value={text} onTextInput={(v) => { 
                            setText(v);
                            if(onTextChange){
                                onTextChange(v)
                            }
                         }}
                        className="bg-slate-50 flex-1 pl-1 pr-5"

                        readOnly={selectOnly}
                    />
                    <Pressable className="px-1" onPress={() => setShowList(prev => !prev)}><Text className="text-slate-700">{showList?"▼":"◀"}</Text></Pressable>
                </View>

            </View>

        
    )
}

export default DropDown