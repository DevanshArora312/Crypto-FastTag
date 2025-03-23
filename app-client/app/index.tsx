import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const index = () => {
    const router = useRouter();
    useEffect(()=>{
        setTimeout(()=>{
            router.push("/(tabs)")
        },3000);
    },[])
  return (
    <View className='w-full justify-center items-center'>
      <Text className='text-white text-[40px]'>HOME</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  txt: {
    color:"white"
  },
});

export default index