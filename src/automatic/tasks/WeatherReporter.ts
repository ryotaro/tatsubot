import * as hubot from 'hubot';

export function WeatherReporter() {
    return async function(robot: hubot.Robot): Promise<void> {
        try {
            robot.messageRoom('#bottest', 'Hello, from tatsuro!');
        } catch (err) {
            console.error(err);             
        }
    }
}