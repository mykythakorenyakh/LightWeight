import { View, Text, Modal, Pressable, TextInput, ScrollView, Image, Animated, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

import { Calendar } from 'react-native-calendars'

import { addWorkout, updateWorkout, getExercises } from '../../services/database.jsx';
import DropDown from '../../components/DropDown.jsx';
import { ThemeContext } from '../_layout.jsx';


const WorkoutEditor = ({ show, setShow, workout, setWorkout }) => {

  const { colors } = useContext(ThemeContext)

  const [title, setTitle] = useState('')
  const [exercises, setExercises] = useState([])
  const [description, setDescription] = useState('')

  const [showCalendar, setShowCalendar] = useState(false)
  const [day, setDay] = useState(null)

  const [titles, setTitles] = useState();

  useEffect(() => {
    if (workout) {

      setTitle(workout.title)
      setExercises(JSON.parse(workout.exercises))
      setDescription(workout.desc)

      const d = new Date(workout.date);
      setDay(`${d.getFullYear()}-${d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.month}-${d.getDate()}`)

    }

    const results = [...new Set(getExercises().getAllSync().reverse())]
    if (results) {
      const arr = []
      results.map(item => {
        return new Object(JSON.parse(item.exercises)).map(exer => {
          if (!exer.odd) {
            arr.push(exer.title)
          } else {
            exer.cycle.map(set => {
              arr.push(exer.title)
              return set;
            })
          }
          return exer
        })
      })

      setTitles([...new Set([...arr])])

    }



  }, [workout])

  const checkChanges = () => {
    if (workout) {
      if (workout.title != title) return true;

      if (JSON.parse(workout.exercises).length != exercises.length) return true;

      if (workout.desc !== description) return true;

      const date = new Date(workout.date).toISOString();

      if (date != new Date(day).toISOString()) return true;
    }
    return false;
  }

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
        <ScrollView className="flex-col" >
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

                      className="flex flex-row py-1  border-l-[6px] mb-1 items-start px-1"
                      style={{
                        backgroundColor: colors.main.subBg,
                        borderLeftColor: colors.main.border
                      }}
                    >
                      <View className="basis-[40%]">
                        <Text className="text-xs font-light"
                          style={{
                            color: colors.main.subText,
                          }}
                        >Exercise</Text>
                        <DropDown
                          data={titles}
                          defaultText={item.title}
                          onTextChange={(v) => changeExercise({ id: item.id, title: v })}
                          onSelectChange={(v) => changeExercise({ id: item.id, title: v })}
                          isReletive={true}
                          inputBgColor={colors.main.optionBg}
                          optionBgColor={colors.main.optionBg}
                          textColor={colors.main.text}
                        />

                      </View>

                      {!item.odd ?                                                                                                      //CYCLE PANEL

                        <View className="flex-row gap-[3px] pl-[3px]">
                          <View className="basis-[14%]">
                            <Pressable onPress={() => changeExercise({ id: item.id, odd: true })}><Text className="text-xs font-light" >Sets</Text></Pressable>
                            <TextInput keyboardType="numeric" className="bg-slate-300"
                              style={{
                                backgroundColor: colors.main.optionBg,
                                color: colors.main.subText,
                              }}
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
                            <TextInput keyboardType="numeric"
                              style={{
                                backgroundColor: colors.main.optionBg,
                                color: colors.main.subText,
                              }}
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
                            <TextInput keyboardType="numeric"
                              style={{
                                backgroundColor: colors.main.optionBg,
                                color: colors.main.subText,
                              }}
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
                            <TextInput keyboardType="numeric"
                              style={{
                                backgroundColor: colors.main.optionBg,
                                color: colors.main.subText,
                              }}
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
                                <TextInput keyboardType="numeric" style={{
                                  backgroundColor: colors.main.optionBg,
                                  color: colors.main.subText,
                                }} defaultValue={c.reps}
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
                                <TextInput keyboardType="numeric" style={{
                                  backgroundColor: colors.main.optionBg,
                                  color: colors.main.subText,
                                }} defaultValue={c.weight}
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
                                <TextInput keyboardType="numeric" style={{
                                  backgroundColor: colors.main.optionBg,
                                  color: colors.main.subText,
                                }} defaultValue={c.rir}
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

  const close = () => {

    setTitle(null)
    setExercises([])
    setDescription(null)
    setWorkout(null)
    setDay(null)
    setShow(false)
    setShowCalendar(false)
  }

  const save = () => {
    if (!title.length) {
      alert('Title is required!')
      return;
    }


    let exer = exercises.map(item => {
      item.title = String(item.title).trim()

      if (item.odd) {
        item.cycle = [...item.cycle.map(set => {
          set.sets = '1'

          return set;
        })]
      } else {
        item.cycle = [item.cycle[0]]
      }
      return item;
    })




    if (workout) {
      updateWorkout(workout.id, title, JSON.stringify(exer), description, (!day) ? new Date(Date.now()).toISOString() : new Date(day).toISOString())
    } else {
      addWorkout(title.trim(), JSON.stringify(exer), description, (!day) ? new Date(Date.now()).toISOString() : new Date(day).toISOString())
    }


    close()

  }

  return (
    <Modal
      animationType='fade'
      visible={show}
    >

      <View className="flex-1 gap-3"
        style={{ backgroundColor: colors.main.bg }}>
        <View className="h-12 flex-row items-center justify-between"
          style={{ backgroundColor: colors.main.navbar }}
        >
          <Pressable onPress={() => {
            if (checkChanges()) {
              Alert.alert('Warning', 'Do you want to save changes', [{
                text: 'Save',
                onPress: () => {
                  save();
                }
              },
              {
                text: 'Cancel',
                onPress: () => {
                  close();
                }
              }
              ])
            } else {
              close();
            }

          }}>
            <Image className="w-6 ml-3" tintColor={colors.main.button} resizeMode='contain' source={require('../../assets/icons/arrow.png')} />
          </Pressable>
          <Pressable className="flex-row items-center gap-x-3" onPress={() => { setShowCalendar(prev => !prev) }}>
            {(day) ? <Pressable onPress={() => { setDay(null); setShowCalendar(false) }}><Text className="font-bold" style={{ color: colors.main.button }}>Clear Date</Text></Pressable> : ''}
            <Image className="w-6 mr-3" tintColor={colors.main.button} resizeMode='contain' source={require('../../assets/icons/calendar.png')} />
          </Pressable>
        </View>

        {showCalendar ?
          <Calendar
            className="my-1"
            enableSwipeMonths={true}
            markingType="dot"
            markedDates={{ [day]: { selected: true, color: '#10f' } }}
            theme={{
              calendarBackground: colors.main.subBg,
              dayTextColor: colors.main.subText,
              textDisabledColor: '#8887',
            }} style={{ backgroundColor: colors.main.subBg }}
            onDayPress={(d) => {

              setDay(`${d.year}-${d.month <= 9 ? '0' + d.month : d.month}-${d.day}`)

            }}
          />
          : ''}

        <View className="p-3">
          <TextInput style={{
            color: colors.main.text,
          }} className="text-lg px-3" multiline={true} placeholder='Enter Title' defaultValue={title} onChangeText={(v) => setTitle(v)} />

          <Pressable className="self-end mt-3" onPress={() => addNewExercise()}>
            <Text className="text-sm font-bold p-1"
              style={{
                color: colors.main.button
              }}
            >+ Add New Exercise</Text>
          </Pressable>
          <View className="max-h-[50%]">
            {dipslayExercises()}
          </View>

          <Text className="text-sm opacity-75"
            style={{
              color: colors.main.text
            }}
          >Description</Text>
          <TextInput
            className="p-1"
            multiline={true}
            numberOfLines={8}
            style={{
              textAlignVertical: 'top',
              backgroundColor: colors.main.subBg,
              color: colors.main.text
            }}
            defaultValue={description}
            onChangeText={(v) => setDescription(v)}
          />
          <Pressable
            onPress={() => save()}
            className="flex items-center p-3 mt-3"
            style={{
              backgroundColor: colors.main.buttonBg,

            }}
          >
            <Text className="text-green-100 text-xl font-extrabold">Save</Text>
          </Pressable>

        </View>

      </View>
    </Modal>
  )
}

export default WorkoutEditor