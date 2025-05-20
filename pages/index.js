import React, { useState } from 'react'
import Login from '../components/login'
import SignUp from '../components/signUp'

export default function Index() {
  const [isSignUp, setisSignUp] = useState(false)

  return (
    <>
      {isSignUp ? <SignUp setisSignUp={setisSignUp}/> : <Login setisSignUp={setisSignUp} />}

    </>
  )
}
