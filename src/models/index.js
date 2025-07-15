const user = require('./user');
const event = require('./event');
const registration = require('./registration');

//many to many relationship defination
user.belongsToMany(event,{
    through:registration,
    foreignKey:'user_id',
    otherKey:'event_id',
    as: 'events'
});

event.belongsToMany(user,{
    through:registration,
    foreignKey:'event_id',
    otherKey:'user_id',
    as: 'users'
});

module.exports = {user,event,registration};