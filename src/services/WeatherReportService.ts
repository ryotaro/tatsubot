import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import * as moment from 'moment';

export class WeatherReportService {
    constructor(private apiPromise: Promise < string > | bluebird.Thenable < string > ) {}

    public async getWeather(date: Date, place: string): Promise < WeatherData > {
        try {
            const jsonp = await this.apiPromise;
            const json = unwindJSONP(jsonp, 'drk7jpweather.callback');
            const apiResponseObj = JSON.parse(json);

            const keyDate = moment(date).format('YYYY/MM/DD');
            if (! apiResponseObj.pref.area[place]) {
                return null;
            }

            return _.find<any, WeatherData>(apiResponseObj.pref.area[place].info,
                (elem: any) => {
                    return elem.date === keyDate
                });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async getForecastMessage(targetDate: Date, 
                                    alertThreshold: number,
                                    targetPrefecture = '東京地方'): Promise<string> {
        const weatherJSON = await this.getWeather(
            targetDate,
            targetPrefecture);    

        const maxRainfallChance = _(weatherJSON.rainfallchance.period)
            .map<number>((period: Period) => parseInt(period.content, 10))
            .max();

        const rainFallTimeSeries: string = _.reduce(weatherJSON.rainfallchance.period, (memo: string, current: {hour: string, content: string}) => {
            return memo + 
                current.hour + ': ' + current.content + '%' + '\n';
        }, '');

        const temperatureMinMax = _.keyBy(weatherJSON.temperature.range, 'centigrade');
        return `${alertThreshold <= maxRainfallChance ? '@channel: 雨降るかも!!' : ''}
${targetPrefecture}の天気
最大降水確率: ${maxRainfallChance} %
時間帯別降水確率: 
:::
${rainFallTimeSeries}
:::
${weatherJSON.weather_detail}
最高気温 ${temperatureMinMax['max'].content} 度
最低気温 ${temperatureMinMax['min'].content} 度
        ` 
    }
}

function unwindJSONP(jsonpString: string, callbackname: string): string {
    return jsonpString
        .replace(new RegExp(`${callbackname}\\(`, 'g'), '')
        .replace(/\);?$/, '');
}
 
export interface Period {
    hour: string;
    content: string;
}

export interface Rainfallchance {
    unit: string;
    period: Period[];
}

export interface Range {
    centigrade: string;
    content: string;
}

export interface Temperature {
    unit: string;
    range: Range[];
}

export interface WeatherData {
    rainfallchance: Rainfallchance;
    weather: string;
    date: string;
    img: string;
    wave: string;
    temperature: Temperature;
    weather_detail: string;
}