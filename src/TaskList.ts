import * as moment from 'moment-timezone';
import * as hubot from 'hubot';
import * as bluebird from 'bluebird';
import * as _ from 'lodash';

export class TaskList {
    private playLimit: number;
    constructor (public tasks: ((robot: hubot.Robot)=> Promise<void>)[],
                 public launchIntervalEpoc: number,
                 playLimit?: number) {
        this.playLimit = playLimit || +(new Date());
    }

    public doSomethingNow(currentDate: Date): boolean {        
        return (this.playLimit <= currentDate.valueOf());
    }

    public async invokeSeries(robot: hubot.Robot): Promise<void> {
        try {
            this.playLimit += this.launchIntervalEpoc;
            const startDate = new Date();
            console.log(`Task started on (${startDate}): playLimit(${new Date(this.playLimit)}), interval(${this.launchIntervalEpoc})`);
            for (const task of this.tasks) {
                await task(robot);
            }
            const endDate = new Date();
            console.log(`Task ended on (${endDate}): elapsed time(${+endDate - (+startDate)} ms)`);
        } catch (err) { 
            console.error(err);           
        }
    }
}