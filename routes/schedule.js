const express = require('express');
const Schedule = require('../models/schedule');
const router = express.Router();

router.get('/', async (req, res) =>{

    // try{
    //     const allTodo = await Schedule.find();
    //     res.status(200).render('schedule',{allTodo:allTodo});
    //     // res.json(allTodo);
    // }catch (e) {
    //     console.log(e)
    // }
    res.render('schedule');


})





module.exports = router;