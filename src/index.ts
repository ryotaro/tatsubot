import * as lodash from 'lodash';
import * as hubot from 'hubot';
import * as moment from 'moment-timezone'
import * as _ from 'lodash';

import { WeatherReporter } from './automatic/tasks/WeatherReporter';
import { TaskList } from './TaskList';

declare const module: any;
moment.tz.setDefault('Asia/Tokyo');

module.exports = function(robot: hubot.Robot) {
    configureResponding(robot);
    configureInterval(robot);
}

function configureResponding(robot: hubot.Robot) {
    robot.respond(/hello([0-9])/, (res: hubot.Response) => {
        res.reply(`hi ${res.match[1]}`);
    })
}

function configureInterval(robot: hubot.Robot) {
    const dailyTasks = new TaskList([
            WeatherReporter()
        ]
        , 1000 * 60 * 60 * 24
        , moment().startOf('day').hour(7).valueOf()
    );
    setInterval(async () => {
        try {
            const currentDate = new Date();
            for (const currentTask of _.filter([
                dailyTasks
            ], (task: TaskList) => task.doSomethingNow(currentDate))) {
                await currentTask.invokeSeries(robot);
            }
        } catch (e) {
            console.error('Error occurred', e);
        }
    }, 3 * 1000);
}