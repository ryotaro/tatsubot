import * as hubot from 'hubot';
import * as request from 'request-promise';
import * as _ from 'lodash';
import {
    WeatherReportService
} from '../../services/WeatherReportService';

export function WeatherReporter(alertThreshold: number = 40) {
    return async function(robot: hubot.Robot): Promise < void > {
        try {
            robot.messageRoom(process.env.NODE_ENV === 'production' ? '#general' : '#bottest', 
            await (new WeatherReportService(
                request('http://www.drk7.jp/weather/json/13.js')
            )).getForecastMessage(
                new Date(),
                alertThreshold));
        } catch (err) {
            console.error(err);
        }
    }
}