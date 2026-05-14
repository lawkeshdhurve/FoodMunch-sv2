import React, { useContext, useEffect, useState } from 'react'
import './VerifyEmail.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const { url, setToken } = useContext(StoreContext)
    const navigate = useNavigate()

    // states: 'loading' | 'success' | 'error'
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const token = searchParams.get('token')
        if (!token) {
            setStatus('error')
            setMessage('No verification token found in the link.')
            return
        }

        const verify = async () => {
            try {
                const response = await axios.get(`${url}/api/user/verify-email?token=${token}`)
                if (response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem('token', response.data.token)
                    setStatus('success')
                    setMessage(response.data.message)
                    // redirect to home after 3s
                    setTimeout(() => navigate('/'), 3000)
                } else {
                    setStatus('error')
                    setMessage(response.data.message)
                }
            } catch (error) {
                setStatus('error')
                setMessage('Something went wrong. Please try again.')
            }
        }

        verify()
    }, [])

    return (
        <div className='verify-email-page'>
            <div className='verify-email-card'>
                {status === 'loading' && (
                    <>
                        <div className='ve-spinner'></div>
                        <h2 className='ve-title'>Verifying your email…</h2>
                        <p className='ve-subtitle'>Please wait a moment</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='ve-icon ve-icon-success'>✓</div>
                        <h2 className='ve-title'>Email Verified!</h2>
                        <p className='ve-subtitle'>{message}</p>
                        <p className='ve-redirect'>Redirecting you to the homepage in 3 seconds…</p>
                        <button className='ve-btn' onClick={() => navigate('/')}>Go Now</button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='ve-icon ve-icon-error'>✕</div>
                        <h2 className='ve-title'>Verification Failed</h2>
                        <p className='ve-subtitle'>{message}</p>
                        <p className='ve-hint'>The link may have expired (valid for 24 hours). Please register again.</p>
                        <button className='ve-btn ve-btn-outline' onClick={() => navigate('/')}>Back to Home</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
