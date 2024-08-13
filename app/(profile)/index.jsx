import { View, Text, ImageBackground, TextInput, ScrollView, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import DropDown from '../../components/DropDown'

import { getProfile, updateProfile, deleteProfile } from '../../services/database.jsx'
import Graph from '../../components/Graph.jsx'

import { ThemeContext } from '../_layout.jsx'


const PropHome = () => {

  const {colors} = useContext(ThemeContext)

  const [params, setParams] = useState([])

  const [height, setHeight] = useState()
  const [neck, setNeck] = useState()
  const [biceps, setBiceps] = useState()
  const [weist, setWeist] = useState()
  const [weight, setWeight] = useState()

  const [save, setSave] = useState(false)

  const [tab, setTab] = useState('weight');
  const [graphData, setGraphData] = useState();

  const [poseur,setPouser] = useState(require('../../assets/bg/profilelight.png'))

  const update = () => {
    const result = getProfile().getAllSync().reverse();
    if (result.length) {
      setParams(result)

      setHeight(result[0].height)
      setNeck(result[0].neck)
      setBiceps(result[0].biceps)
      setWeist(result[0].weist)
      setWeight(result[0].weight)

      setSave(false)


    }
    updateGraph();
  }

  const updateGraph = () => {
    const result = getProfile().getAllSync();
    if (result.length == 0) {
      return;
    }
    if (tab == 'weight') {
      setGraphData(prev => {
        return result.map(item => {
          return {
            id: item.id,
            date: item.date,
            value: Number(item.weight),
            type: 'kg',
          }
        })
      })
    } else if (tab == 'neck') {
      setGraphData(prev => {
        return result.map(item => {
          return {
            id: item.id,
            date: item.date,
            value: Number(item.neck),
            type: 'cm',
          }
        })
      })
    }
    else if (tab == 'biceps') {
      setGraphData(prev => {
        return result.map(item => {
          return {
            id: item.id,
            date: item.date,
            value: Number(item.biceps),
            type: 'cm',
          }
        })
      })
    } else if (tab == 'weist') {
      setGraphData(prev => {
        return result.map(item => {
          return {
            id: item.id,
            date: item.date,
            value: Number(item.weist),
            type: 'cm',
          }
        })
      })
    } else if (tab == 'height') {
      setGraphData(prev => {
        return result.map(item => {
          return {
            id: item.id,
            date: item.date,
            value: Number(item.height),
            type: 'cm',
          }
        })
      })
    }

  }

  useEffect(()=>{
    if(colors.dark){
      setPouser(require('../../assets/bg/profile.png'));
    }else{
      setPouser(require('../../assets/bg/profilelight.png'));
    }
  },[colors])


  useEffect(() => {

    updateGraph();


  }, [tab])

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
    if (!height
      || !neck
      || !biceps
      || !weist
      || !weight) {
      setSave(false)
    } else {
      setSave(true)
    }

  }, [height, neck, biceps, weist, weight])

  const deleteResults = (id) => {
    if (id) {
      deleteProfile(id)
      update()
    }
  }

  return (
    <View className="flex-1 flex-col"
      style={{
        backgroundColor:colors.main.bg
      }}
    >

      <ScrollView>

        <View className="flex-1 items-center w-[360px] mt-[-20px]">
          <Image resizeMode='contain' className="flex-1 w-[350px]" source={poseur} />


          {save ?
            <Pressable
              onPress={() => {
                console.log('save')
                updateProfile(new Date(Date.now()).toISOString(), Number(height.replace(",", ".")), Number(neck.replace(",", ".")), Number(biceps.replace(",", ".")), Number(weist.replace(",", ".")), Number(weight.replace(",", ".")));
                update();
              }}
              className="absolute w-14 h-14 bg-green-700 self-center top-[250px] rounded-full items-center justify-center">
              <Image className="w-10 h-10" tintColor={'#fcfcfc'} source={require('../../assets/icons/accept.png')} />
            </Pressable>
            : ''}



          <View className="absolute bottom-[100px] left-[20px] top-[145px]">
            <TextInput keyboardType='numeric'
            style={{
              backgroundColor:colors.main.optionBg,
              borderBottomWidth:(!colors.dark)?1:0,
              borderBottomColor:colors.button,
              
            }}
            className=" font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='neck' defaultValue={neck} onChangeText={(v) => setNeck(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[35px] top-[70px]">
            <TextInput keyboardType='numeric'
            style={{
              backgroundColor:colors.main.optionBg,
              borderBottomWidth:(!colors.dark)?1:0,
              borderBottomColor:colors.button,

            }}
            className="font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='height' defaultValue={height} onChangeText={(v) => setHeight(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[6px] top-[250px]">
            <TextInput keyboardType='numeric'
            style={{
              backgroundColor:colors.main.optionBg,
              borderBottomWidth:(!colors.dark)?1:0,
              borderBottomColor:colors.button,

            }}
            className="font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='biceps' defaultValue={biceps} onChangeText={(v) => setBiceps(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[30px] left-[30px] top-[340px]">
            <TextInput keyboardType='numeric'
            style={{
              backgroundColor:colors.main.optionBg,
              borderBottomWidth:(!colors.dark)?1:0,
              borderBottomColor:colors.button,

            }}
            className="font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='weist' defaultValue={weist} onChangeText={(v) => setWeist(v)} />
            <Text className="reletive left-[55px] top-[-15px] text-xs font-thin">cm</Text>
          </View>

          <View className="absolute bottom-[100px] right-[30px]">
            <TextInput keyboardType='numeric'
            style={{
              backgroundColor:colors.main.optionBg,
              borderBottomWidth:(!colors.dark)?1:0,
              borderBottomColor:colors.button,

            }}
            className="font-light w-[75px] px-1" placeholderTextColor={'#2239'} placeholder='weight' defaultValue={weight} onChangeText={(v) => setWeight(v)} />
            <Text className="absolute right-[1px] bottom-[1px] text-xs font-thin">kg</Text>
          </View>

        </View>


        <View className="flex-1 gap-y-1">
          <View className="flex-row items-center">
            <Text className="mx-1 text-slate-400">
              Tab
            </Text>
            <DropDown
              selectOnly={true}
              style={" w-[150px]"}
              data={['neck', 'biceps', 'weist', 'weight']}
              inputBgColor={colors.main.optionBg}
              optionBgColor={colors.main.optionBg}
              textColor={colors.main.text}
              onSelectChange={(v) => setTab(v)}
              defaultText={tab}
            />
          </View>

          <View className="border-t-[1px]"> 
            <Graph graphData={graphData}
              height={500}
              bgColor={colors.main.subBg}
              
              textColor='#fcfcfc99'
              dateColor={colors.main.border}
              valueColor={colors.main.border}
              stickColor='#faa75599'
              dotColor='#333'
              onDelete={(id)=>deleteResults(id)}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  )
}




export default PropHome