import { View, Text, Modal, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'

const WorkoutEditor = ({ show, setShow }) => {
  const [title, setTitle] = useState('')
  const [exercises, setExercises] = useState([])

  useEffect(() => {

  }, [])

  const dipslayExercises = () => {
    if (exercises.length) {
      return (
        <View className="flex-col">
          {

            exercises.map((item) => {
              return (<View
                key={item.id}
                className="flex flex-row h-12 bg-slate-400 border-l-2 border-l-red-200 mb-1 justify-between items-center px-3">
                <TextInput className="bg-slate-300" value={item.title} />
                <TextInput className="bg-slate-300" value={item.sets} />
                <TextInput className="bg-slate-300" value={item.reps} />
                <TextInput className="bg-slate-300" value={item.weight} />
                <TextInput className="bg-slate-300" value={item.rir} />
              </View>)

            })

          }

        </View>)
    }
    return <Text className="flex p-6 bg-slate-400 text-center font-bold"> No Data... </Text>
  }
  const addNewExercise = () => {
    setExercises(prev => {
      let newExer = {
        id: Math.random() * 1000,
        title: 'title',
        sets: '1',
        reps: '1',
        weight: '0',
        rir: '1'
      }
      return prev.length ? [...prev, newExer
      ] : [newExer]

    })
  }

  return (
    <Modal
      animationType='slide'
      visible={show}
    >
      <View className="flex-1 p-3 bg-slate-500 gap-3">
        <Pressable onPress={() => setShow(false)}><Text>go back</Text></Pressable>
        <TextInput className="text-lg" placeholder='Enter Title' onChange={(v) => setTitle(v)} />

        <Pressable className="self-end" onPress={() => addNewExercise()}>
          <Text className="text-sm font-light text-gray-800">Add New Exercise</Text>
        </Pressable>
        {dipslayExercises()}

      </View>
    </Modal>
  )
}

export default WorkoutEditor