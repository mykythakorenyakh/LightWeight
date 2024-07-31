import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, TextInput } from 'react-native-gesture-handler'

const DropDown = ({ style, barStyle, isReletive, defaultText, selectOnly, data, onSelectChange, onTextChange }) => {
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
        if(defaultText) setText(defaultText)
    }, [data])

    return (
        
            <View className={style + " z-[999]"}>
                
                <View className="flex-row items-center">
                    <TextInput
                        value={text} onChangeText={(v) => { 
                            setText(v);
                            if(onTextChange){
                                onTextChange(v)
                            }
                         }}
                        className={(!barStyle)?"bg-slate-50 flex-1 pl-1 pr-5":barStyle}

                        readOnly={selectOnly}
                    />
                    <Pressable className="px-1" onPress={() => setShowList(prev => !prev)}><Text className="text-slate-700">{showList?"▼":"◀"}</Text></Pressable>
                </View>
                {showList ?
                    <View
                        className={(!isReletive)?"z-[1000] bg-slate-50 top-8  min-h-[50px] w-[100%] gap-y-[1px]":"z-[1000] bg-slate-50 top-[1px]  min-h-[50px] w-[100%] gap-y-[1px]"}
                        style={{
                            position:(isReletive)?'reletive':'absolute',       
                        }}
                    >
                        {list.map((item, index) => {
                            return (
                                <View key={index}>
                                    <Pressable
                                        className="p-1 z-[1001] bg-slate-100"
                                        onPress={() => {
                                            if(onSelectChange){
                                                onSelectChange(item)
                                            }
                                            if(onTextChange){
                                                onTextChange(item)
                                            }
                                            setText(item);
                                            setShowList(false)
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
            </View>

        
    )
}

export default DropDown