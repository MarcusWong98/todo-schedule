if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true ,useUnifiedTopology: true});

mongoose.connection.once('open',()=>{
    console.log('Connecting to database')
    // console.log(mongoose.connection)
}).on('error',err=> console.log('Error : ' + err))

const Schedule = require('./models/schedule');
const History = require('./models/history');

// const get = require('./routes/homepage');

const timerRouter = require('./routes/timer.js');
const scheduleRouter = require('./routes/schedule.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/public',express.static('public'));

app.use('/schedule', scheduleRouter);

app.use(express.json());

app.use('/timer', timerRouter);

app.get('/', (req, res) =>{
    res.render('index',{
        title: 'My exe schedule'
    });
})

app.post('/api', async (req,res)=>{

    const body = req.body;

    if('schedule' in body){
        try{
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

            const yesterday = new Date();

            yesterday.setDate(yesterday.getDate() - 1);

            const monthOfYesterday = yesterday.getMonth();

            const dateOfYesterday = yesterday.getDate();

            const dateIDOfYesterday = months[monthOfYesterday] + '-' + dateOfYesterday;

            const todoOfYesterday = await Schedule.deleteOne({dateID: dateIDOfYesterday});

            const allData = await Schedule.find();

            // console.log(allData)

            res.json(allData);
        }catch (e) {
            console.log(e)
        }
    }else if('history' in body){
        const history = await History.find();
        res.json(history);
    }

    // res.json({
    //     todoList: allData
    // });
})

app.post('/mySchedule',async (req,res)=>{

    const body = req.body;

    console.log(body)

    if('todayDate' in body){

        const yesterday = body.todayDate.split('-')[0] + (body.todayDate.split('-')[1] - 1);

        console.log(body.whatTodo);

            const {dateID, whatTodo} = body.todo;

            try{
                await Schedule.deleteOne({dateID: yesterday});

                let oldTodo = await Schedule.findOne({dateID: dateID});

                if(oldTodo === null){

                    let schedule = new Schedule({
                        dateID: dateID,
                        todo: whatTodo
                    });

                    schedule = await schedule.save();
                    console.log(schedule);

                    console.log('success');
                }else{
                    console.log('this is oldTodo:'+oldTodo)
                    oldTodo = await Schedule.updateOne({dateID: dateID}, {
                        dateID: dateID,
                        todo: whatTodo
                    })
                }


                // if(5 < 1){
                //     console.log('test 5 < 1')
                // }else{
                //     console.log('test is wrong')
                // }

            }catch (e) {
                console.log(e)
            }
            res.json(body);
        // }
    }else if('time' in body){
        try{
            const existingHistory = await History.findOne({dateID: body.dateID})


            if(existingHistory){
                await History.updateOne({dateID: body.dateID},{
                    time: body.time,
                    todo: body.todo
                });
                // existingHistory.time= body.time;
                // // existingHistory.todo = body.todo;
                // existingHistory.markModified('time');
                // await existingHistory.save()
                // // existingHistory = await history.save();
                // console.log(existingHistory.time)
            }else{
                let history = new History({
                    dateID: body.dateID,
                    todo: body.todo,
                    time: body.time
                })
                history = await history.save()
            }
            res.json(body)
        }catch (e) {
            console.log(e)
        }

    }
    // console.log(body.todoList)




    // console.log(body.todoList.length);

    // res.json(body);
    // try{
    //     const body = await req.body;
    //     const schedule = new Schedule({
    //         dateID: req.body.dateID,
    //         todo: req.body.todo
    //     })
    //
    //     console.log(body);
    //     res.json(body);
    //
    //     schedule.save();
    //     // const json = await body.json;
    //     // console.log(json);
    // }catch (e) {
    //     console.log(e);
    // }
})


app.listen(process.env.PORT || 3000, () => console.log('listening on 3000'));