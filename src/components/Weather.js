import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import sunny from '../assets/images/sunny.png';
import rainy from '../assets/images/rainy.png';
import cloudy from '../assets/images/cloudy.png';
import windy from '../assets/images/windy.png';
import snowy from '../assets/images/snowy.png';
import arrow from '../assets/images/arrow.png';


const Weather = ({ weather, index, latitude, longitude }) => {
    const [time, setTime] = useState('');
    const [conditionImage, setConditionImage] = useState();

    useEffect(() => {
        if (index === 0) {
            setTime('Now');
        } else if (index === 1) {
            setTime('Tomorrow');
        } else {
            // DateTime.from
            const timezone = tzlookup(latitude, longitude);
            const timeStr = DateTime.local()
                .setZone(timezone)
                .plus({ days: index })
                .toLocaleString({
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                });
            setTime(timeStr);
        }

        switch (weather.condition) {
            case 'sunny':
                setConditionImage(sunny);
                break;
            case 'rainy':
                setConditionImage(rainy);
                break;
            case 'cloudy':
                setConditionImage(cloudy);
                break;
            case 'windy':
                setConditionImage(windy);
                break;
            case 'snowy':
                setConditionImage(snowy);
                break;
            default:
                break;
        }

    }, [index, latitude, longitude, weather]);
    return (
        <>

            <ListGroup.Item>
                <h5 style={{ fontWeight: 'bold' }}>
                    <span>
                        {time}
                    </span>
                    <span style={{ color: 'orange', marginLeft: '20px' }}>
                        {time === 'Now' ?
                            Math.round(((weather.tempMax + weather.tempMin) / 2 + Number.EPSILON) * Math.pow(10, 2)) / Math.pow(10, 2) + '℃' :
                            null}
                    </span>
                </h5>
                <Row>
                    <Col xs={12} md={5} style={{ textAlign: 'center' }}>
                        <h6>{weather.condition.toUpperCase()}</h6>
                        <img src={conditionImage} alt={weather.condition} />
                        <Row style={{ fontWeight: 'bold' }}>
                            <Col style={{color: '#4169E1'}}>{weather.tempMin + '℃'}</Col>
                            <Col style={{color: 'red'}}>{weather.tempMax + '℃'}</Col>
                        </Row>
                        <Row style={{ color: 'grey' }}>
                            <Col>Min</Col>
                            <Col>Max</Col>
                        </Row>
                    </Col>
                    <Col xs={12} md={7} style={{ color: '#696969', textAlign: 'center' }}>
                        <h6 className="mb-3">Pressure: <span style={{ fontWeight: '800' }}>{weather.pressure} Pa</span></h6>
                        <h6 className="mb-3">Humidity: <span style={{ fontWeight: '800' }}>{weather.humidity}%</span></h6>
                        <h6 className="mb-3">Chance of Rain: <span style={{ fontWeight: '800' }}>{weather.precipitation}%</span></h6>
                        <h6 className="mb-3">Cloudiness: <span style={{ fontWeight: '800' }}>{weather.cloudiness}%</span></h6>

                        <h6 className="mb-3">Wind Speed: <span style={{ fontWeight: '800' }}>
                            {weather.windSpeed} m/s</span>
                            <img src={arrow} alt="wind direction" width={20}
                                style={{
                                    transform: `rotate(${-weather.windDirection}deg)`,
                                    marginLeft: '10px'
                                }} />
                        </h6>
                    </Col>
                </Row>


            </ListGroup.Item>

            <div>
                {/* {weather.dt} */}

            </div>
        </>
    );
};

export default React.memo(Weather);