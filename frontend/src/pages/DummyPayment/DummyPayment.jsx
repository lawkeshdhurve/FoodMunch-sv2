import React, { useState } from 'react'
import './DummyPayment.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const DummyPayment = () => {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    const { url } = useContext(StoreContext)
    const navigate = useNavigate()

    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
    })
    const [loading, setLoading] = useState(false)
    const [cardType, setCardType] = useState('')

    const formatCardNumber = (val) => {
        return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4)
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
        return digits
    }

    const detectCardType = (number) => {
        const n = number.replace(/\s/g, '')
        if (/^4/.test(n)) return 'visa'
        if (/^5[1-5]/.test(n)) return 'mastercard'
        if (/^3[47]/.test(n)) return 'amex'
        return ''
    }

    const onChangeHandler = (e) => {
        let { name, value } = e.target
        if (name === 'number') {
            value = formatCardNumber(value)
            setCardType(detectCardType(value))
        }
        if (name === 'expiry') value = formatExpiry(value)
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
        setCardData(prev => ({ ...prev, [name]: value }))
    }

    const handlePay = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate payment processing delay
        await new Promise(r => setTimeout(r, 1800))
        try {
            const response = await axios.post(url + '/api/order/verify', {
                success: 'true',
                orderId,
            })
            if (response.data.success) {
                navigate('/myorders')
            }
        } catch {
            navigate('/')
        }
    }

    const handleCancel = async () => {
        await axios.post(url + '/api/order/verify', { success: 'false', orderId })
        navigate('/')
    }

    const cardLogoMap = {
        visa: '💳 VISA',
        mastercard: '💳 MC',
        amex: '💳 AMEX',
    }

    return (
        <div className='dp-page'>
            <div className='dp-wrapper'>

                {/* ── Left: Card Preview ── */}
                <div className='dp-card-preview'>
                    <div className='dp-card'>
                        <div className='dp-card-top'>
                            <div className='dp-chip'></div>
                            <span className='dp-card-brand'>{cardType ? cardLogoMap[cardType] : '💳'}</span>
                        </div>
                        <div className='dp-card-number'>
                            {cardData.number || '•••• •••• •••• ••••'}
                        </div>
                        <div className='dp-card-bottom'>
                            <div>
                                <p className='dp-label'>Card Holder</p>
                                <p className='dp-value'>{cardData.name || 'YOUR NAME'}</p>
                            </div>
                            <div>
                                <p className='dp-label'>Expires</p>
                                <p className='dp-value'>{cardData.expiry || 'MM/YY'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='dp-secure-badge'>🔒 256-bit SSL Secured</div>
                </div>

                {/* ── Right: Payment Form ── */}
                <div className='dp-form-panel'>
                    <div className='dp-header'>
                        <div className='dp-logo'>🍔 Food Munch</div>
                        <h2>Complete Payment</h2>
                        <p className='dp-subtitle'>This is a demo payment — no real money is charged</p>
                    </div>

                    <form onSubmit={handlePay} className='dp-form'>
                        <div className='dp-field'>
                            <label>Cardholder Name</label>
                            <input
                                type='text'
                                name='name'
                                value={cardData.name}
                                onChange={onChangeHandler}
                                placeholder='John Doe'
                                required
                            />
                        </div>
                        <div className='dp-field'>
                            <label>Card Number</label>
                            <input
                                type='text'
                                name='number'
                                value={cardData.number}
                                onChange={onChangeHandler}
                                placeholder='1234 5678 9012 3456'
                                required
                            />
                        </div>
                        <div className='dp-field-row'>
                            <div className='dp-field'>
                                <label>Expiry Date</label>
                                <input
                                    type='text'
                                    name='expiry'
                                    value={cardData.expiry}
                                    onChange={onChangeHandler}
                                    placeholder='MM/YY'
                                    required
                                />
                            </div>
                            <div className='dp-field'>
                                <label>CVV</label>
                                <input
                                    type='password'
                                    name='cvv'
                                    value={cardData.cvv}
                                    onChange={onChangeHandler}
                                    placeholder='•••'
                                    required
                                />
                            </div>
                        </div>

                        <button type='submit' className='dp-pay-btn' disabled={loading}>
                            {loading
                                ? <span className='dp-btn-spinner'></span>
                                : '✓ Pay Now'}
                        </button>
                    </form>

                    <button onClick={handleCancel} className='dp-cancel-btn'>
                        ✕ Cancel Order
                    </button>

                    <div className='dp-accepted'>
                        <span>Accepted:</span>
                        <span>VISA</span>
                        <span>MasterCard</span>
                        <span>AMEX</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DummyPayment
