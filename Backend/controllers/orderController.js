import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"

// placing user order from frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Use req.headers.origin to get the correct frontend URL (e.g. localhost:5174)
        const frontend_url = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
        
        // Dummy payment: redirect to our own payment page instead of Stripe
        const session_url = `${frontend_url}/dummy-payment?orderId=${newOrder._id}`;
        res.json({ success: true, session_url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
}



import { generateInvoice } from "../utils/generateInvoice.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            const order = await orderModel.findByIdAndUpdate(orderId,{payment:true}, { new: true });
            
            // Get user email to send the confirmation
            const user = await userModel.findById(order.userId);
            
            if (user && user.email) {
                try {
                    const pdfBuffer = await generateInvoice(order, user);
                    await sendOrderConfirmationEmail(user.email, order, pdfBuffer);
                } catch (emailError) {
                    console.log("Failed to send order confirmation email:", emailError);
                    // We don't fail the order verification if email fails
                }
            }
            
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
  // user orders for frontend

  const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
  }
    // Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
  // api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}