const mongoose=require('mongoose');
const CalanderSchema=new mongoose.Schema({
    StartDate:{
      type:Date
      },
      EndDate:{
        type:Date
      },
    event:{
      type:String
     }
  })
  const CalenderUser=mongoose.model('CalenderUser',CalanderSchema);


  module.exports.CalanderSchema=CalanderSchema;
  module.exports.CalenderUser=CalenderUser;