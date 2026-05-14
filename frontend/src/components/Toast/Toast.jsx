import React, { useContext } from 'react';
import './Toast.css';
import { StoreContext } from '../../Context/StoreContext';

const Toast = () => {
    const { toastMessage } = useContext(StoreContext);

    if (!toastMessage) return null;

    return (
        <div className="custom-toast">
            {toastMessage}
        </div>
    );
};

export default Toast;
