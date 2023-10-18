const userModel = require('../model/userModel');
const billModel = require('../model/billModel');
const encryptPassword = require('../utils/bcrypt');

const billCreation = async (req, res) => {
    const {billTitle, userEmail, billAmount} = req.body;
    const uuid = v4();
    const billId = uuid.slice(0, 8);
    const billGenDate = new Date();
    const status = 'unpaid';
    const billDueDate = new Date();
    billDueDate.setDate(billGenDate.getDate() + 7);

    try {
        const bill = await billModel.findOne({billId});
        if(bill) {
            return res.status(400).json({message: 'Bill already exists'});
        } else {
            const newBill = new billModel({billId, billTitle, userEmail, billAmount, billGenDate, billDueDate, status});
            await newBill.save();
            return res.status(200).json({message: 'Bill created successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal error'});
    }
};

const updateBills= async(req,res)=>{
    const{id} = req.params;
    console.log(id);
    //bill id, bill title, user email, bill amount, bill gen date, bill due date, status;
    const {billTitle, userEmail, billAmount, billDueDate, status}=req.body
    try {
        const task=await billModel.findOneAndUpdate({ billId: id },
            {
            billTitle:billTitle,
            userEmail:userEmail,
            billAmount:billAmount,
            billDueDate: billDueDate,
            status:status
        }, 
        {new:true}  //return updated task
        );
        if (!task) {
            res.status(404).json({message:"Task not found"})
        } else {
            res.status(200).json({message:"Task updated"})
        }
       } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server error'})
    }
}
const deleteBills= async(req,res)=>{
    const {id}=req.params;
    try {
        const task=await billModel.findOneAndDelete({billId:id});
        if (!task) {
            res.status(404).json({message:"Task not found"})
        } else {
            res.status(200).json({message:"Task deleted"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'})
    }
};

const getAllBills = async (req, res) => {
    try {
        const bills = await billModel.find();
        if(!bills){
            return res.status(400).json({message: 'No bills found'});
        }else{
            return res.status(200).json(bills);
        }
    } catch (error) {
        res.status(500).json({message: 'Internal error'});
    }
};

module.exports = {billCreation, updateBills, deleteBills, getAllBills}

