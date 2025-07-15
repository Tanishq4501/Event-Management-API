const {DataTypes} = require('sequelize');
const seq = require('../db');

const user = seq.define('User',{
    id: {type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name: {type:DataTypes.STRING,allowNull:false},
    email: {type:DataTypes.STRING,allowNull:false,unique:true}
},{
    tableName:'users',
    timestamps:false
});

module.exports = user;