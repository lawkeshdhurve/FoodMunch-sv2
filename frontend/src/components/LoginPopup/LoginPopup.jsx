import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from "axios"


const LoginPopup = ({setShowLogin}) => {

    const {url, setToken, setIsLoading} = useContext(StoreContext)

    const [currState, setCurrState] = useState("Sign-Up")
    const [emailSent, setEmailSent] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState("")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data, [name]: value}))
    }

    const OnLogin = async (event) => {
        event.preventDefault()
        setIsLoading(true);
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        try {
            const response = await axios.post(newUrl, data);
            setIsLoading(false);

            if (response.data.success) {
                if (currState === "Login") {
                    // Login: store token and close popup
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token)
                    setShowLogin(false)
                } else {
                    // Register: show "check your email" screen
                    setRegisteredEmail(data.email)
                    setEmailSent(true)
                }
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            setIsLoading(false);
            alert("Something went wrong. Please try again.");
        }
    }

    // ── Email Sent Confirmation Screen ──────────────────────────
    if (emailSent) {
        return (
            <div className='login-popup'>
                <div className='login-popup-container email-sent-container'>
                    <div className='login-popup-title'>
                        <h2>Check Your Email</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt=''></img>
                    </div>
                    <div className='email-sent-body'>
                        <div className='email-sent-icon'>📧</div>
                        <p className='email-sent-main'>We sent a verification link to</p>
                        <p className='email-sent-address'>{registeredEmail}</p>
                        <p className='email-sent-info'>
                            Click the link in the email to activate your account. Check your spam folder if you don't see it.
                        </p>
                        <button
                            className='email-sent-login-btn'
                            onClick={() => { setEmailSent(false); setCurrState("Login"); }}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Login / Sign-Up Form ─────────────────────────────────────
    return (
        <div className='login-popup'>
            <form onSubmit={OnLogin} className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img className="icon-adaptive" onClick={() => setShowLogin(false)} src={assets.cross_icon} alt=''></img>
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your Name' required/>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your Email' required/>
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required/>
                </div>
                <button type='submit'>{currState === "Sign-Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type='checkbox' required></input>
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign-Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup