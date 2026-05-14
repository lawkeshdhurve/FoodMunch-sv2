import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
    isVerified:{type:Boolean,default:false},
    verifyToken:{type:String,default:null},
    verifyTokenExpiry:{type:Date,default:null},
},{minimize:false})//if not false it will not create cart data with default value

const userModel=mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;