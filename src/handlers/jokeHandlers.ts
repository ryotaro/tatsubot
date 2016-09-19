import * as hubot from 'hubot';

export function jokeHandlers(robot: hubot.Robot) {
    // Greeting
    robot.hear(/(たっちゃん|イケメン)/, (res: hubot.Response) => {
        res.send('呼んだ??');
    });
}