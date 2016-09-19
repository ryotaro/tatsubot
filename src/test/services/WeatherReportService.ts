import * as fs from 'fs';
import * as path from 'path';
import {assert} from 'chai';
import {WeatherReportService} from '../../services/WeatherReportService';

describe('WeatherReportService', () =>{
    context('getWeather', () => {
        let weatherReportService: WeatherReportService = null;
        beforeEach((done) => {
            weatherReportService = new WeatherReportService(
                Promise.resolve<string>(
                    fs.readFileSync(path.join('./fixtures', '13.fixture.json'), 'UTF8')
                )
            );
            done(null);
        });

        it('should retrieve Izu 9/20', async () => {
            try{ 
                const obj = await weatherReportService.getWeather(new Date('2016-09-20'), '伊豆諸島南部');
                assert.deepEqual(obj.date, '2016/09/20');
                assert.deepEqual(obj.rainfallchance.period[0].content, '60');
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            }
        });
    }); 
});