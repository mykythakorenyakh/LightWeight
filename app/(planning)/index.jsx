import { View, Text, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import WorkoutEditor from './editor'
import { getWorkouts, deleteWorkout } from '../../services/database.jsx'
import { Calendar } from 'react-native-calendars'

const PlanHome = () => {

  const [showEditor, setShowEditor] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)

  const [day, setDay] = useState(null)
  const [search, setSearch] = useState(null)

  const [workouts, setWorkouts] = useState([])

  const [selected, setSelected] = useState();



  const update = () => {
    setWorkouts(getWorkouts().getAllSync().reverse())
  }

  useEffect(() => {
    update();
  }, [showEditor])
  
  useEffect(() => {
    update();
  }, [])

  const editWorkout = (workout) => {


    setShowEditor(true)
    setSelected(workout)
  }
  const removeWorkout = (workout) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', onPress: () => { }, style: 'cancel' },
      {
        text: 'Delete', onPress: () => {
          deleteWorkout(workout.id)
          update()
        }, style: 'destructive'
      },
    ])
  }

  const displayWorouts = () => {
    if (workouts.length) {
      return workouts.map((item) => {
        const date = `${new Date(item.date).getDate()}/${new Date(item.date).getMonth() + 1 < 10 ? '0' : ''}${new Date(item.date).getMonth() + 1}/${new Date(item.date).getFullYear()}`

        if (`${new Date(item.date).getFullYear()}-${new Date(item.date).getMonth() + 1 < 10 ? '0' : ''}${new Date(item.date).getMonth() + 1}-${new Date(item.date).getDate()}` != day && day) return;
        if (search && !(String(item.title).includes(search) || String(item.desc).includes(search))) return;

        return (
          <Pressable
            key={`block-${item.id}`}
            onPress={() => editWorkout(item)}
            onLongPress={() => removeWorkout(item)}
            className="flex flex-col w-[48%] max-h-[200px] min-h-[150px] bg-slate-400 rounded p-1">

            <View className="flex-col border-b-[0.5px] border-gray-500">
              <Text className="text-sm font-extralight text-slate-900 text-[8px] self-end">{date}</Text>
              <Text className="text-sm font-light mt-[-7px] text-slate-900">{item.title}</Text>
            </View>

            <View className="px-1">
              {JSON.parse(item.exercises).map((exer, index) => {
                
                return (
                  <View key={`block-${item.id}-item-${exer.id}`} className="flex-row">
                    <View className="flex-row">
                      <Text className="text-xs font-extralight">{index + 1})</Text>
                      <Text className="pl-1 text-xs font-light text-slate-800 italic">{exer.title}</Text>
                    </View>

                    <View >
                      {exer.cycle.length === 1 ?

                        <Text className="pl-1 text-xs font-extralight">{exer.cycle[0].sets}x{exer.cycle[0].reps}<Text className="text-[8px] font-extralight">{exer.repsType != 'rep' ? exer.repsType : ''}</Text> {exer.cycle[0].weight != 0 ? '+' + exer.cycle[0].weight + 'kg' : ''}</Text>

                        :
                        <View className="flex-col pl-1 text-xs font-light">
                          {exer.cycle.map((set,index) => {
                            return (
                              <View key={`block-${item.id}-item-${exer.id}-subitem-${set.id}`} className="flex-row items-baseline">
                                <Text className="text-xs font-extralight">{set.reps}</Text>
                                <Text className="text-[8px] font-extralight">{exer.repsType != 'rep' ? exer.repsType : 'reps'}</Text>
                                <Text className="text-[9px] font-extralight"> {set.weight != 0 ? '+' + set.weight + 'kg' : ''} </Text>
                              </View>
                            )
                          })}
                        </View>
                      }

                    </View>

                  </View>
                )

              })}
            </View>

            <ScrollView className="px-1 mt-3 border-t-[0.5px] border-gray-500">
              <Text className="text-[9px] font-extralight"><Text className="text-sm text-yellow-600 ">{item.desc ? 'ⓘ' : ''}</Text>   {item.desc}</Text>
            </ScrollView>


          </Pressable>
        )
      })
    }
  }

  return (
    <>
      <WorkoutEditor show={showEditor} setShow={setShowEditor} workout={selected} setWorkout={setSelected} />

      <View className="flex-1 px-5 py-3 bg-slate-800 ">

        <View className="flex w-full z-50 items-center self-center absolute bottom-10">
          <Pressable onPress={() => setShowEditor(true)} className="flex w-14 h-14 bg-blue-500 justify-center items-center rounded-full">
            <Image className="w-6 h-6" style={{ tintColor: '#fcfcfc' }} source={require('../../assets/icons/plus.png')} />
          </Pressable>
        </View>

        <View className="flex flex-row justify-between items-center">
          <TextInput value={search} onChangeText={(v) => setSearch(v)} placeholderTextColor={'#fcfcfcaa'} className='flex-1 mr-12 border-b-2 px-2 border-b-gray-900 h-8 text-slate-200 text-sm' placeholder='search...' />
          <Pressable onPress={() => setShowCalendar(prev => !prev)}>
            <Image className="w-6 h-6" tintColor={'#fcfcfcaa'} source={require('../../assets/icons/calendar.png')} />
          </Pressable>
        </View>

        {(day || search) ? <Pressable onPress={() => { setSearch(null); setDay(null); setShowCalendar(false) }}><Text className="text-lg mx-auto text-orange-100">Clear</Text></Pressable> : ''}

        {showCalendar ?
          <Calendar
            className="my-1 rounded"
            enableSwipeMonths={true}
            markingType="dot"
            markedDates={{ [day]: { selected: true, color: '#238' } }}
            theme={{
              calendarBackground: '#223',
              dayTextColor: '#348',
              textDisabledColor: '#8887',
            }} style={{ backgroundColor: '#223' }}
            onDayPress={(d) => {
              setDay(`${d.year}-${d.month <= 9 ? '0' + d.month : d.month}-${d.day}`)
            }}
          />
          : ''}
          
        <ScrollView >
          <View className="flex flex-row gap-y-3 flex-wrap justify-between mt-1">
            {displayWorouts()}
          </View>
        </ScrollView>

      </View>
    </>
  )
}

export default PlanHome