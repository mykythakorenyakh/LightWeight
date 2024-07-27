import { View, Text, ImageBackground, TextInput, ScrollView, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import DropDown from '../../components/DropDown'

import { getProfile, updateProfile } from '../../services/database.jsx'



const PropHome = () => {

  const [params, setParams] = useState([])

  const [height, setHeight] = useState()
  const [neck, setNeck] = useState()
  const [biceps, setBiceps] = useState()
  const [weist, setWeist] = useState()
  const [weight, setWeight] = useState()

  const [save, setSave] = useState(false)

  const update = ()=>{
    const result = getProfile().getAllSync().reverse();
    if (result.length) {
      setParams(result)

      setHeight(result[0].height)
      setNeck(result[0].neck)
      setBiceps(result[0].biceps)
      setWeist(result[0].weist)
      setWeight(result[0].weight)

      setSave(false)

      console.log(result)
    }
  }

  useEffect(() => {
    update();

  }, [])

  useEffect(() => {
    if (params.length) {
      const latest = params[0];
      
      if (latest.height != height
        || latest.neck != neck
        || latest.biceps != biceps
        || latest.weist != weist
        || latest.weight != weight) {
          
        console.log('change')
        setSave(true)
      } else {
        setSave(false)
      }
      return
    }
    setSave(true)
  }, [height, neck, biceps, weist, weight])

  return (
    <View className="flex-1 flex-col bg-slate-800">

      <ScrollView>

        <View className="flex-1 items-center w-[360px] mt-[-20px]">
          <Image resizeMode='contain' className="flex-1 w-[350px]" source={require('../../assets/bg/profile.png')} />


          {save ?
            <Pressable
              onPress={() => {
                console.log('save')
                updateProfile(new Date(Date.now()).toISOString(),height,neck,biceps,weist,weight);
                update();
              }}
              className="absolute w-14 h-14 bg-green-700 self-center top-[250px] rounded-full items-center justify-center">
              <Image className="w-10 h-10" tintColor={'#fcfcfc'} source={require('../../assets/icons/accept.png')} />
            </Pressable>
            : ''}



          <View className="absolute bottom-[100px] left-[20px] top-[145px]">
            <TextInput keyboardType='numeric' className="bg-slate-100 font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='neck' defaultValue={neck} onChangeText={(v) => setNeck(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[35px] top-[70px]">
            <TextInput keyboardType='numeric' className="bg-slate-100 font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='height' defaultValue={height} onChangeText={(v) => setHeight(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[6px] top-[250px]">
            <TextInput keyboardType='numeric' className="bg-slate-100 font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='biceps' defaultValue={biceps} onChangeText={(v) => setBiceps(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[30px] left-[30px] top-[340px]">
            <TextInput keyboardType='numeric' className="bg-slate-100 font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='weist' defaultValue={weist} onChangeText={(v) => setWeist(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[30px]">
            <TextInput keyboardType='numeric' className="bg-slate-100 font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='weight' defaultValue={weight} onChangeText={(v) => setWeight(v)} />
            <Text className="absolute right-[1px] bottom-[1px] text-xs font-thin">kg</Text>
          </View>

        </View>


        <View className="flex-1">
          <DropDown
            selectOnly={true}
            style={" w-[150px] bg-slate-50 mx-3"}
            data={['neck', 'biceps', 'weist', 'weight']}
          />


        </View>

      </ScrollView>
    </View>
  )
}




export default PropHome