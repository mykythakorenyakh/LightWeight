import { View, Text, Modal, Pressable, TextInput, ScrollView, Image, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

import {addWorkout} from '../../services/database.jsx'

const WorkoutEditor = ({ show, setShow }) => {
  const [title, setTitle] = useState('')
  const [exercises, setExercises] = useState([])
  const [description, setDescription] = useState('')

  useEffect(() => {

  }, [])


  const changeExercise = ({ id, odd, repsType, title, cycle }) => {

    let updated = [...exercises].map(item => {
      if (item.id == id) {
        let newTitle = (title) ? title : item.title;
        let newOdd = (typeof odd === 'boolean') ? odd : item.odd;
        let newRepsType = (repsType) ? repsType : item.repsType;
        let newCycle = (cycle) ? cycle : item.cycle;
        return {
          id,
          title: newTitle,
          odd: newOdd,
          repsType: newRepsType,
          cycle: newCycle,
        }
      }
      return item;
    })

    setExercises(prev => updated)
  }
  const deleteExercise = (id) => {
    setExercises(prev => prev.filter(item => item.id != id))
  }

  const delAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (<View
      className="bg-red-500 h-10 w-10 items-center justify-center self-center rounded-full">
      <Image tintColor={'#223'} className="w-8 h-8" source={require('../../assets/icons/trash.png')} />
    </View>)
  }

  const dipslayExercises = () => {
    if (exercises.length) {
      return (
        <ScrollView className="flex-col">
          {

            exercises.map((item) => {
              return (
                <GestureHandlerRootView key={item.id}>
                  <Swipeable
                    renderLeftActions={delAction}
                    onSwipeableWillOpen={direction => {
                      if (direction === 'left') {
                        deleteExercise(item.id)
                      }
                    }}
                  >
                    <View                                                                                                               //TITLE

                      className="flex flex-row py-1 bg-slate-400  border-l-[6px] border-l-slate-200 mb-1 items-start px-1">
                      <View className="basis-[40%]">
                        <Text className="text-xs font-light">Exercise</Text>
                        <TextInput className="bg-slate-300"
                          defaultValue={item.title}
                          onChangeText={(v) => changeExercise({ id: item.id, title: v })} />
                      </View>

                      {!item.odd ?                                                                                                      //CYCLE PANEL

                        <View className="flex-row gap-[3px] pl-[3px]">
                          <View className="basis-[14%]">
                            <Pressable onPress={() => changeExercise({ id: item.id, odd: true })}><Text className="text-xs font-light" >Sets</Text></Pressable>
                            <TextInput className="bg-slate-300"
                              defaultValue={item.cycle[0].sets}
                              onChangeText={(v) => changeExercise({
                                id: item.id,
                                cycle: [{
                                  id: item.cycle[0].id,
                                  sets: v,
                                  reps: item.cycle[0].reps,
                                  weight: item.cycle[0].weight,
                                  rir: item.cycle[0].rir,
                                }]
                              })}
                            />
                          </View>

                          <View className="basis-[14%]">
                            <Pressable onPress={() => {
                              if (item.repsType === 'rep') { changeExercise({ id: item.id, repsType: 'sec' }) }
                              else if (item.repsType === 'sec') { changeExercise({ id: item.id, repsType: 'min' }) }
                              else { changeExercise({ id: item.id, repsType: 'rep' }) }

                            }}>
                              <Text className="text-xs font-light">Reps</Text>
                            </Pressable>
                            <TextInput className="bg-slate-300"
                              defaultValue={item.cycle[0].reps}
                              onChangeText={(v) => changeExercise({
                                id: item.id,
                                cycle: [{
                                  id: item.cycle[0].id,
                                  sets: item.cycle[0].sets,
                                  reps: v,
                                  weight: item.cycle[0].weight,
                                  rir: item.cycle[0].rir,
                                }]
                              })}
                            />
                            <Text className="absolute bottom-[1px] right-1 text-[8px]">{item.repsType}</Text>
                          </View>

                          <View className="basis-[14%]">
                            <Text className="text-xs font-light">Weight</Text>
                            <TextInput className="bg-slate-300"
                              defaultValue={item.cycle[0].weight}
                              onChangeText={(v) => changeExercise({
                                id: item.id,
                                cycle: [{
                                  id: item.cycle[0].id,
                                  sets: item.cycle[0].sets,
                                  reps: item.cycle[0].reps,
                                  weight: v,
                                  rir: item.cycle[0].rir,
                                }]
                              })}
                            />
                            <Text className="absolute bottom-[1px] right-1 text-[8px]">kg</Text>
                          </View>

                          <View className="basis-[14%]">
                            <Text className="text-xs font-light">RiR</Text>
                            <TextInput className="bg-slate-300"
                              defaultValue={item.cycle[0].rir}
                              onChangeText={(v) => changeExercise({
                                id: item.id,
                                cycle: [{
                                  id: item.cycle[0].id,
                                  sets: item.cycle[0].sets,
                                  reps: item.cycle[0].reps,
                                  weight: item.cycle[0].weight,
                                  rir: v,
                                }]
                              })}
                            />
                          </View>
                        </View>
                        :
                        <View className="ml-[6px] flex-col basis-[58%]">
                          <View className="flex-row gap-[1px] ">
                            <Pressable className="basis-[16%]" onPress={() => { changeExercise({ id: item.id, odd: false }) }}>
                              <Text className="text-xs font-light">Set</Text>
                            </Pressable>
                            <Pressable className="basis-[28%]" onPress={() => {
                              if (item.repsType === 'rep') { changeExercise({ id: item.id, repsType: 'sec' }) }
                              else if (item.repsType === 'sec') { changeExercise({ id: item.id, repsType: 'min' }) }
                              else { changeExercise({ id: item.id, repsType: 'rep' }) }

                            }}>
                              <Text className="text-xs font-light">Reps</Text>
                            </Pressable>
                            <View className="basis-[28%]">
                              <Text className="text-xs font-light">Weight</Text>
                            </View>
                            <View className="basis-[16%]">
                              <Text className="text-xs font-light">RiR</Text>
                            </View>
                          </View>

                          {item.cycle.map((c, i) => (
                            <View className="flex-row gap-x-[3px] items-center border-l-[1px] border-l-slate-700 mb-1" key={c.id}>

                              <View className="basis-[14%]">
                                <Text className="font-light text-slate-900" > {i + 1} </Text>
                              </View>

                              <View className="basis-[27%]">
                                <TextInput className="bg-slate-300" defaultValue={c.reps}
                                  onChangeText={(v) => {
                                    changeExercise({
                                      id: item.id,
                                      cycle: item.cycle.map(cyc => {
                                        if (cyc.id == c.id) cyc.reps = v;
                                        return cyc;
                                      })
                                    })
                                  }}
                                />
                                <Text className="absolute bottom-[1px] right-1 text-[8px]">{item.repsType}</Text>
                              </View>

                              <View className="basis-[27%]">
                                <TextInput className="bg-slate-300" defaultValue={c.weight}
                                  onChangeText={(v) => {
                                    changeExercise({
                                      id: item.id,
                                      cycle: item.cycle.map(cyc => {
                                        if (cyc.id == c.id) cyc.weight = v;
                                        return cyc;
                                      })
                                    })
                                  }}
                                />
                                <Text className="absolute bottom-[1px] right-1 text-[8px]">kg</Text>
                              </View>

                              <View className="basis-[14%]">
                                <TextInput className="bg-slate-300" defaultValue={c.rir}
                                  onChangeText={(v) => {
                                    changeExercise({
                                      id: item.id,
                                      cycle: item.cycle.map(cyc => {
                                        if (cyc.id == c.id) cyc.rir = v;
                                        return cyc;
                                      })
                                    })
                                  }}
                                />
                              </View>

                              {item.cycle.length > 1 ?
                                <Pressable
                                  onPress={() => {
                                    changeExercise({
                                      id: item.id,
                                      cycle: [...item.cycle.filter(cyc => cyc.id != c.id)]
                                    })
                                  }}
                                ><Image className="w-4 h-4" tintColor={'#8329'} source={require('../../assets/icons/trash.png')} /></Pressable>
                                : ''
                              }
                            </View>
                          ))}

                          <Pressable className="flex-1 items-center" onPress={() => changeExercise({
                            id: item.id,
                            cycle: [...item.cycle, {
                              id: Math.random() * 1000000,
                              sets: '3',
                              reps: '6',
                              weight: '0',
                              rir: '1'
                            }]
                          })}>
                            <Text className="text-xs text-gray-700 p-1">Add new set</Text>
                          </Pressable>
                        </View>
                      }
                    </View>
                  </Swipeable>
                </GestureHandlerRootView>
              )

            })

          }

        </ScrollView>)
    }
    return <Text className="flex p-6 bg-slate-400 text-center font-bold"> No Data... </Text>
  }
  const addNewExercise = () => {
    setExercises(prev => {
      let newExer = {
        id: Math.random() * 1000000,
        title: '',
        odd: false,
        repsType: 'rep',
        cycle: [{
          id: Math.random() * 1000000,
          sets: '3',
          reps: '6',
          weight: '0',
          rir: '1'
        }]
      }
      return prev.length ? [...prev, newExer
      ] : [newExer]

    })
  }

  const save = ()=>{
    if(!title.length){
      alert('Title is required!')
      return;
    }
    
    let exer = exercises.map(item=>{
      
      if(item.odd){
        item.cycle = [...item.cycle.map(set=>{
          set.sets = '1'
          return set;
        })]
      }else{
        item.cycle = [item.cycle[0]]
      }
      return item;
    })
    
    exer.map(exe=>{
      console.log('\n\n')
      console.log(exe.id)
      exe.cycle.map(set=>{
        console.log(JSON.stringify(set))
      })
    })


    addWorkout(title,JSON.stringify(exer),description,new Date(Date.now()).toISOString())



  }

  return (
    <Modal
      animationType='fade'
      visible={show}
    >

      <View className="flex-1 bg-slate-500 gap-3">
        <Pressable className="bg-slate-600 justify-center h-12" onPress={() => setShow(false)}>
          <Image className="w-6 ml-3" tintColor={'#223'} resizeMode='contain' source={require('../../assets/icons/arrow.png')} />
        </Pressable>

        <View className="p-3">
          <TextInput className="text-lg" placeholder='Enter Title' onChangeText={(v) => setTitle(v)} />

          <Pressable className="self-end" onPress={() => addNewExercise()}>
            <Text className="text-sm font-light text-gray-800">Add New Exercise</Text>
          </Pressable>
          <View className="max-h-[50%]">
            {dipslayExercises()}
          </View>

          <Text className="text-sm font-light text-gray-800">Description</Text>
          <TextInput
            className="bg-slate-300 text-slate-800"
            multiline={true}
            numberOfLines={8}
            style={{ textAlignVertical: 'top', }}
            defaultValue={description}
            onChangeText={(v) => setDescription(v)}
          />
          <Pressable 
          onPress={()=>save()}
          className="flex items-center p-3 bg-slate-600 mt-3">
            <Text className="text-green-100 text-xl font-extrabold">Save</Text>
          </Pressable>

        </View>

      </View>
    </Modal>
  )
}

export default WorkoutEditor