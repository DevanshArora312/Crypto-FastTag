import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const index = () => {
    const router = useRouter();
    useEffect(()=>{
        setTimeout(()=>{
            router.push("/signup")
        },3000);
    },[])
  return (
    <View>
      <Text>HOME</Text>
    </View>
  )
}

export default index