const {DataTypes, Sequelize} = require('sequelize');
const seq = require('../db');

const registration = seq.define('Registration',{
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model:'users',
            key:'id'
        }
    },
    event_id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model:'events',
            key:'id'
        }
    }
},{
    tableName:'registrations',
    timestamps: false
});

module.exports = registration;