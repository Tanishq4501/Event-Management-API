const {DataTypes} = require('sequelize');
const seq = require('../db');

const event = seq.define('Event',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    title:{type:DataTypes.STRING,allowNull:false},
    date_time:{type:DataTypes.DATE,allowNull:false},
    location:{type:DataTypes.STRING,allowNull:false},
    capacity:{type:DataTypes.INTEGER,allowNull:false,validate:{min:1,max:1000}}
},{
    tableName:'events',
    timestamps:false
});

module.exports = event;