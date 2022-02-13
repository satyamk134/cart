/**
 * Apis related to order
 * /order/get
 * /order/put
 * /order/post
 * /order/delete
 */

 const { request, response } = require('express');
 const mongoose = require('mongoose');
const { cart } = require('../../../../../forum-node/src/modules/products/controllers/index.controller');
 const db = require("../../../../models");
 const {Op} = db.Sequelize;
 const Cart = db.Cart;
 const CartDetails = db.CartDetails
 const axiosObj = require('../services/axios');


let test =(req, res)=>{
    res.send("test called in Cart, thanks for calling");
}

const addService = async  (req, res, next)=>{
    //add given service to cart
    //Cart.create()
    const {serviceId,merchantName,shopId} = req.body;

    const checkIfShopChanged = async  ()=>{
        try{
            let query = {
                where:{
                    userId:req.userInfo.userId,
                    status:'filled',
                    shopId:{
                        [Op.ne]:shopId
                    }
                }
            }
            let cartInfo = await Cart.findOne(query);
            if(cartInfo){
                //if any cart with diffrent shop is found
                return Promise.reject({cartId:cartInfo.id,status:"error",msg:"Your cart already have services from different shop. Do you want to have a fresh start?"})

            }else{
                return cartInfo;
            }
            

        }catch(err){

        }
    }

    let CreateCart = async ()=>{ 
        try{
            let isCart = await Cart.findOne({where:{userId:req.userInfo.userId}});
            if(isCart){
                await Cart.update({merchantName:merchantName,shopId:shopId,status:"filled"},{where:{userId:req.userInfo.userId}});
            }else{
                isCart = await Cart.create({userId:req.userInfo.userId,merchantName:merchantName,shopId:shopId,status:"filled"});
            }
            return isCart;
            
        }catch(err){
            throw new Error(err);
            //return Promise.reject({errMsg:"Create Cart Service is not working"});
        }
       
    }

    let addLaundaryService = async (cart) => {
        /**
         * Todo: Service id validation is pending
         */
        
        let cartId = cart.id;
        console.log("cart",cartId);
        try{
            let foundItem = await CartDetails.findOne({where:{cartId:cartId, serviceId:serviceId}});
            if(foundItem && foundItem.status == 'added'){
               await CartDetails.update({status:'deleted'},{where:{id:foundItem.id}});
               return Promise.resolve({msg:"Service already so marked it as soft delete"});
            }
            if(foundItem && foundItem.status=="deleted"){
                //udpdate status
                await CartDetails.update({status:'added'},{where:{id:foundItem.id}});
            }else{
                let addStatus = await CartDetails.create({cartId:cartId, serviceId:serviceId,status:"added"});
                return addStatus;  
            }
             

        }catch(err){
            throw new Error(err);
        }
       
    }

    try{
        await checkIfShopChanged();
        let cart = await CreateCart();
        await addLaundaryService(cart);
        res.status(200).json({status:"success",msg:"Service added successfully"});
    }catch(err){
        console.log("err is",err);
        if(err.status && err.status == 'error'){
            return res.json(err).status(200);
        }
        next({err:{errMsg:"Add Service is not working"},errorStack:err});
    }

}

const updateMultiServices =  async (req,res, next)=>{
    let  {services} = req.body;

    let CreateCart = async ()=>{
        try{
            let isCart = await Cart.findOne({where:{userId:req.userInfo.userId}});
            if(!isCart){
                return await Cart.create({userId:req.userInfo.userId})
            }
            return isCart;
            
        }catch(err){
            throw new Error(err);
            //return Promise.reject({errMsg:"Create Cart Service is not working"});
        }
       
    }
    
    let updateCart = async  (cart)=>{
        //upate shopId in cart 
        const {shopId}  = req.body;
        try{
            await Cart.update({shopId:shopId}, {where:{id:cart.id}});
        }catch(err){
            throw new Error(err); 
        }
    }

    let addLaundaryService = async (cart) => {
        /**
         * Todo: Service id validation is pending
         */
        let cartId = cart.id;
        try{
            for(let i=0;i<services.length;i++){
                let serviceId = services[i];
                let isAlreadyAdded = await CartDetails.findOne({where:{cartId:cartId, serviceId:serviceId}});
                if(isAlreadyAdded){
                   console.log("found",isAlreadyAdded);
                   continue;
                   //return Promise.resolve({msg:"Service already added. Nothing to do"});
                }
                await CartDetails.create({cartId:cartId, serviceId:serviceId});
                
            }

            return Promise.resolve({msg:"All services added successfully"});
              

        }catch(err){
            throw new Error(err);
        }
       
    }

    try{
        let cart = await CreateCart();
        await updateCart(cart);
        await addLaundaryService(cart);
        res.status(200).json({msg:"Service added successfully"});
    }catch(error){
        next({err:{errMsg:"Add Service is not working"},errorStack:error});
    }
}

const removeService = async  (req, res, next)=>{
    //add given service to cart
    //Cart.create()
    const {serviceId} = req.body;
    const {userId} = req.userInfo;

    let fetchCart = async ()=>{
        try{
           return  await Cart.findOne({where:{userId:userId}});
        }catch(err){
            throw new Error(err);
        }
       
    }

    let removeLaundaryService = async (cart) => {
        let cartId = cart.id;
        try{
            let addStatus = await CartDetails.destroy({where:{CartId:cartId, serviceId:serviceId}});
            return addStatus;   
        }catch(err){
            throw new Error(err);
        }  
    }

    try{
        let cart = await fetchCart();
        await removeLaundaryService(cart);
        res.status(200).json({msg:"Service removed successfully"})
    }catch(error){
        next({err:{errMsg:"Remove Service is not working"},errorStack:error});
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Cart can have only one shop at a time
 */
const addShop = async (req, res,next)=>{

    const { shopId } = req.body;

    let CreateCart = async ()=>{
        try{
            await Cart.create({userId:req.userInfo.userId, shopId:shopId})
        }catch(err){
            throw new Error(err);
            //return Promise.reject({errMsg:"Create Cart Service is not working"});
        }
       
    }

    try{
        await CreateCart();
        res.status(200).json({msg:"Shop Added in successfully to cart."})
    }catch(error){
        console.log("error for promise1 is");
        //res.json("called");
        next({err:{errMsg:"Cart Service is not working"},errorStack:error});
        //throw new Error({errMsg:"Cart Service is not working"});
    }




}

const getCartDetails = async(req, res, next)=>{

    const {userId} = req.userInfo;

    let fetchCart = async ()=>{
        try{
            let cartDetail = await Cart.findOne({where:{userId:userId}});
            if(cartDetail){
                   return cartDetail; 
            }else{
                return Promise.reject({status:"error",msg:"Cart is empty"});
            }

        }catch(err){
            throw new Error(err);
        }
    }
    let getLaundaryServices = async (cart)=>{
        let cartId = cart.id;
        try{
            return await CartDetails.findAll({where:{cartId: cartId,status:"added"}});
        }catch(error){
            throw new Error({msg:"Not able to get Cart Details"});
        }
        
    }

    let getServiceDetails = async (services)=>{
        let addedServices = [];
        axiosObj.setConfig('user');
        for(let i=0;i<services.length;i++){
            var eachService = services[i];
            let response = await axiosObj.getRequest('/api/merchant/service',{params:{serviceId:eachService.serviceId}});
            addedServices[i] = {service:eachService, detail:response.data};
        }
        return addedServices;
    }

    try{
       const cart = await fetchCart();
       let services =  await getLaundaryServices(cart);
       let servicesInfo = await getServiceDetails(services);
       res.json({cartInfo:cart,data:servicesInfo});
    }catch(err){
        console.log("Error is",err);
        if(err.status == 'error'){
            return res.json({data:[],err:err}).status(200);
        }
        
        next(err);
    }    
}

const emptyCart = async (req, res, next)=>{
    const {cartId} = req.body;
    let updateCart = async()=>{
        await Cart.update({status:"empty"},{where:{id:cartId}});
    }
    let updateCartServices = async ()=>{
        await CartDetails.update({status:"deleted"},{where:{cartId:cartId}})
    } 

    try{
        await updateCart();
        await updateCartServices();
        res.json({msg:"Cart is empty now",status:"success"}).status(200);
    }catch(err){
        next(err);
    }

}
const deleteCart = async(req, res, next)=>{
        const {cartId} = req.body; 
        try{
            await CartDetails.destroy({where:{cartId:cartId}});
            await Cart.destroy({where:{id:cartId}});
            res.json({msg:"Cart has been deleted", status:"success"}).status(200);
        }catch(err){
            console.log("error is",err);
            next(err);
        }
}

module.exports = {
    test,
    addService,
    removeService,
    getCartDetails,
    addShop,
    updateMultiServices,
    emptyCart,
    deleteCart
}


