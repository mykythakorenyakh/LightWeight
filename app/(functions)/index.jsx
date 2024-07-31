import { View, Text, Pressable, Image, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Timer from '../../components/Timer'
import TimersSet from '../../components/TimersSet';

import { addTimer, getTimers, updateTimer, deleteTimer } from '../../services/database';
import { Swipeable } from 'react-native-gesture-handler';

const FuncHome = () => {

  const [start, setStart] = useState(false);

  const [timers, setTimers] = useState([]);


  useEffect(() => {
    const result = getTimers().getAllSync();
    if (result.length) {
      console.log(JSON.stringify(result))
      setTimers([...result].map(item => {
        if (item.timers == "") {
          item.timers = null;
        } else {
          item.timers = JSON.parse(item.timers);
        }

        return item
      }))
    }

  }, [])

  const createSet = () => {

    const newTimer = {
      id: Math.random() * 10000,
      title: 'New Set',
      repeat: '5',
      timers: null
    }
    setTimers(prev => [...prev, newTimer])
    addTimer(
      newTimer.id,
      newTimer.title,
      newTimer.repeat,
      JSON.stringify(newTimer.timers)
    )
  }

  const delAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (<View
      className="ml-3 bg-red-500 h-14 w-14 items-center justify-center self-center rounded-full">
      <Image tintColor={'#223'} className="w-8 h-8" source={require('../../assets/icons/trash.png')} />
    </View>)
  }
  const deleteSet = (timerId) => {
    let newArr = [...timers].filter(item => item.id != timerId)
    setTimers(prev => newArr)
    deleteTimer(timerId)
  }

  const displaySets = () => {


    if (timers.length != 0) {

      return timers.map((item, index) => {

        return (
          <Swipeable
            key={item.id}
            renderLeftActions={delAction}
            onSwipeableWillOpen={direction => {
              if (direction === 'left') {
                deleteSet(item.id)
              }
            }}
          >
            <TimersSet
              timerTitle={item.title}
              repeatAmount={item.repeat}
              data={item.timers}

              onRepeatChange={(v) => {
                setTimers(prev => {
                  return [...prev.map(t => {
                    if (t.id === item.id) {
                      t.repeat = v;
                      updateTimer(
                        t.id,
                        t.title,
                        t.repeat,
                        (t.timers) ? JSON.stringify(t.timers) : ''
                      )
                    }
                    return t;
                  })]
                })
              }}

              onTitleChange={(v) => {
                setTimers(prev => {
                  return [...prev.map(t => {
                    if (t.id === item.id) {

                      t.title = v;
                      updateTimer(
                        t.id,
                        t.title,
                        t.repeat,
                        (t.timers) ? JSON.stringify(t.timers) : ''
                      )
                    }
                    return t;
                  })]
                })
              }}

              onDataChange={(v) => {
                setTimers(prev => {
                  return [...prev.map(t => {
                    if (t.id === item.id) {
                      t.timers = v;
                      updateTimer(
                        t.id,
                        t.title,
                        t.repeat,
                        (t.timers) ? JSON.stringify(t.timers) : ''
                      )
                    }
                    return t;
                  })]
                })
              }}


            />
          </Swipeable>
        )

      })

    }


  }


  return (
    <View className="flex-1 bg-slate-800">

      <View className="flex absolute bottom-10 w-full items-center z-[1]">
        <Pressable
          onPress={() => {
            createSet()
          }}
          className="w-14 h-14 justify-center items-center place-self-center rounded-full bg-blue-500">
          <Image
            resizeMode='contain'
            className="h-6 w-6"
            tintColor={'#fcfcfc'}
            source={require('../../assets/icons/plus.png')} />
        </Pressable>
      </View>

      <ScrollView className="flex-col mt-3m">
        {displaySets()}
      </ScrollView>

    </View>
  )
}

export default FuncHome