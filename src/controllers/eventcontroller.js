const {user,event,registration} = require('../models');
const seq = require('../db');
const {Op, Transaction} = require('sequelize');
const { UPDATE } = require('sequelize/lib/query-types');

//create a new event
async function createEvent(req,res){
    try{
        const { title, date_time, location, capacity } = req.body;
        const fields = [title, date_time, location, capacity];
        const missing_field = Object.keys(fields).filter(key => !fields[key]);

        if (missing_field.length > 0){
            return res.status(400).json({
                message:`Missing field are: ${missing_field.join(', ')}`
            });
        }

        if (capacity <=0 || capacity > 1000){
            return res.status(400).json({
                message:'Capacity must be between 1 and 1000.'
            });
        }

        const Event = await event.create({title,date_time,location,capacity});
        return res.status(200).json({
            eventId: Event.id,
            message:'Event created successfully!'
        });

    }catch(err){
        return res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });
    }
};

// fetch event details 
async function getEventDetails(req,res) {
    try{
        const Event = await event.findByPk(req.params.id,{
            include: [{model: user, through: {attributes: []},as:'users'}]
        });

        if (!Event) return res.status(404).json({
            message:'Event not found!'
        });

        return res.json(Event);

    }catch(err){
        return res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });
    }
};

//register for an event
async function registerEvent(req,res) {
    const transac = await seq.transaction();
    try{
        const {userId} = req.body;
        
        const Event = await event.findByPk(req.params.id,{
/*             include: [{model: user, through: {attributes: []},as:'users'}]
        , */transaction:transac,lock: transac.LOCK.UPDATE});

        if (!Event){
            await transac.rollback();
            return res.status(404).json({
                message:'Event not found!'
            });
        } 

        //checking for "Disallow registration for past events"
        if (new Date(Event.date_time) < new Date()){
            await transac.rollback();
            return res.status(400).json({
                message:'Registration failed: This event has already occured.'
            });
        }

        //checking for "event is full"
        const regcount = await Event.countUsers();
        if (regcount >= Event.capacity){
            await transac.rollback();
            return res.status(400).json({
                message:'Cannot register. The event is already full.'
            });
        }

        //checking for "duplicate registrations"
        const User = await user.findByPk(userId,{transaction:transac});
        if (!User){ 
            await transac.rollback();
            return res.status(400).json({
                message:'User not found.'
            });
        }
        const findByUserId = await registration.findOne({where: {user_id: userId,event_id:Event.id},transaction:transac});
        if (findByUserId){
            await transac.rollback();
            return res.status(400).json({
                message: 'Registration failed: The user is already registered for this event.'
            });
        } 

        //all conditions satisfied 'creating registration for the event'
        await registration.create({user_id:userId,event_id:Event.id},{transaction:transac});
        await transac.commit();

        return res.json({
            message:'User registered for the event successfully.'
        });

    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });
    }
};

//cancel registration
async function cancelRegistration(req,res) {
    const transac = await seq.transaction();
    try{
        const {userId} = req.body;
        const eventId = req.params.id;
        
        const Registration = await registration.findOne({where:{user_id:userId,event_id:eventId}, transaction: transac});
        if (!Registration){
            await transac.rollback();
            return res.status(400).json({
                message:'User is not registered for the given event.'
            });
        }

        await Registration.destroy({transaction: transac});
        await transac.commit();

        return res.json({
            message:'Registration cancelled successfully.'
        });

    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });
    }
};

//fetching upcoming events
async function fetchUpcomingEvents(req,res) {
    try{
        //current date & time
        const now = new Date();
        //fetching only events that has date_time > now
        const Events = await event.findAll({where:{date_time:{[Op.gt]:now}}}); 

        //sorting events first by date (ascending),then by location (alaphabetically)
        Events.sort((a,b)=>{
            if (a.date_time < b.date_time) return -1;
            if (a.date_time > b.date_time) return 1;
            return (a.location).localeCompare(b.location);
        });

        return res.json(Events);

    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });
    }
};

// acquiring event stats
async function eventStat(req,res) {
    try{
        const Event = await event.findByPk(req.params.id,{
            include: [{model: user, through: {attributes: []},as:'users'}]
        });
        if (!Event){
            return res.status(400).json({
                message:"Event not found!"
            });
        }

        const total_registration = await Event.countUsers();
        const remaining_capacity = Event.capacity - total_registration;
        const percentage_used = ((total_registration/Event.capacity)*100).toFixed(2);
        
        return res.json({
            total_registration,
            remaining_capacity,
            percentUsed: `${percentage_used}%`
        });

    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });   
    }
};

module.exports = {
    createEvent,
    getEventDetails,
    registerEvent,
    cancelRegistration,
    fetchUpcomingEvents,
    eventStat
};

