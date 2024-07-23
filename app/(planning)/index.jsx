import { View, Text, TextInput, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import WorkoutEditor from './editor'

const PlanHome = () => {

  const [showEditor,setShowEditor] = useState(false)

  return (
    <>
    <WorkoutEditor show={showEditor} setShow={setShowEditor}/>
    <View className="flex-1 px-5 py-3 bg-slate-800 ">

      <View className="flex w-full items-center self-center absolute bottom-10">
        <Pressable  onPress={()=>setShowEditor(true)} className="flex w-14 h-14 bg-cyan-600 justify-center items-center rounded-full">
          <Image className="w-6 h-6" style={{ tintColor: '#fcfcfc' }} source={require('../../assets/icons/plus.png')} />
        </Pressable>
      </View>

      <View className="flex flex-row justify-between items-center">
        <TextInput placeholderTextColor={'#fcfcfcaa'} className='flex-1 mr-12 border-b-2 px-2 border-b-gray-900 h-8 text-slate-200 text-sm' placeholder='search...' />
        <Pressable>
          <Image className="w-6 h-6" tintColor={'#fcfcfcaa'} source={require('../../assets/icons/calendar.png')} />
        </Pressable>
      </View>



    </View>
    </>
  )
}

export default PlanHome