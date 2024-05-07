import React from 'react'
import SinUpForm from '../components/SinUpForm'
import LoginForm from '../components/LoginForm'
import {useSelector} from 'react-redux';

const AuthPage = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className='m-auto w-[70%]  mt-7 mb-8'>
        {auth.status === 'login' && (
        <div>
          <h1 className='flex justify-center text-xl font-bold'>Login</h1>
           <LoginForm />
        </div>
      )} 
      {auth.status === 'signup' && (
        <div>
          <h1 className='flex justify-center text-xl font-bold'>Signup</h1>
          <SinUpForm/>
        </div>
      )}
    </div>
  )
}

export default AuthPage
