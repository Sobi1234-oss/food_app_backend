const mongoose=require("mongoose");

const UserDetailsSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:{type:String,unique:true},
    mobile:String,
},{
    collection:"UserInfo"
});
mongoose.model("UserInfo ",UserDetailsSchema)