import React, { useState,useEffect } from 'react'
import { auth } from '../../firebase'
import {toast} from 'react-toastify'
import { useDispatch,useSelector } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';
//We can use history because our whole app is wrapped under Browser router

const RegisterComplete = ({history}) => {
    const [email,setEmail] =useState('')
    const [password,setPassword] = useState('')
    const { user } = useSelector((state)=> ({...state}));

    useEffect(()=>{
        setEmail(window.localStorage.getItem('emailForRegistration'));
    },[])
    let dispatch = useDispatch()

    const handleSubmit = async (e) =>{
        e.preventDefault();
        //validation
        if(!email||!password){
            toast.error('email and password required')
            return;
        }
        if(password.length < 6){
            toast.error('password must be greater than or altleast 6 characters')
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email,window.location.href);
                console.log(result,'RESULT');
                if(result.user.emailVerified){
                    // remove email from local storage
                    window.localStorage.removeItem('emailForRegistration')
                    // get user id token
                    let user = auth.currentUser
                    await user.updatePassword(password);
                    const idTokenResult = await user.getIdTokenResult();

                    // redux store

                    createOrUpdateUser(idTokenResult.token)//send the idTokenResult to the backend
                    .then((res)=>{
                      //getting all info from mongoDb and dispatching it.
                      console.log(res);
                      dispatch({
                        type:"LOGGED_IN_USER",
                        payload:{
                          name:res.data.name,
                          email:res.data.email,
                          token:idTokenResult.token,
                          role:res.data.role,
                          _id:res.data._id
                        },
                      });
                    })
                    .catch(err => console.log(err))
                    
                    // redirect
                  
                    history.push('/')

                }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const handleChange = (e) =>{
         setPassword(e.target.value)
    }

    const CompleteRegisterForm = ()=>{
        return(
           <form onSubmit={handleSubmit}>
               <input type="email" className="form-control" value={email}
               disabled
               />
                  <input type="password" className="form-control" value={password} onChange={handleChange}
                  autoFocus
                  placeholder='Password'
               /><br></br>
               <button type='submit' className='btn btn-secondary mt-2'>Complete Registration</button>
           </form>
        )
    }
  return (
    <div className='container p-5' >
        <div className='row'>
            <div className='col-md-6 offset-md-3'>
                <h4>Register</h4>
             
               {CompleteRegisterForm()}
            </div>
        </div>
    </div>
  )
}

export default RegisterComplete