import { createContext,useEffect,useState } from "react";
import axios from "axios"


export const StoreContext= createContext(null)

const StoreContextProvider =(props)=>{

    
    const [cartItems,setCartItems] = useState({});  
    const url = "http://localhost:4000"
    const [token,setToken]=useState("")
    const [food_list,setFoodList]=useState([]);

    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    }

    const addToCart =async (itemId) =>{  
        if (!cartItems[itemId]) {  
            setCartItems((prev)=>({...prev,[itemId]:1}))  
        }  
        else {  
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))  
        } 
        
        let itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
            showToast(`🍔 ${itemInfo.name} added to cart!`);
        } else {
            showToast(`🍔 Item added to cart!`);
        }

        if (token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }  
  
    const removeFromCart = async(itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))  
        showToast(`🗑️ Item removed from cart`);
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }  



    const getTotalCartAmount=()=>{
        let totalAmount =0;
        for(const item in cartItems)
            {
                if(cartItems[item]>0){
                let itemInfo=food_list.find((product)=>product._id===item)
                totalAmount+=itemInfo.price*cartItems[item];
                }
            }
            return totalAmount;
    }

    const fetchFoodList=async ()=>{
        const response= await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }
    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
        }
    }
    loadData();
    },[])

    const [isLoading, setIsLoading] = useState(false);

    const contextValue = {  
        food_list,  
        cartItems,  
        setCartItems,  
        addToCart,  
        removeFromCart  ,
        getTotalCartAmount,
        url,
        token,
        setToken,
        isLoading,
        setIsLoading,
        toastMessage
    } 
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;