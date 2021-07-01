import React, { useEffect, useState } from 'react';
import Weather from './Weather';
import weatherApi from '../api/weather-forecast';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';

import ListGroup from 'react-bootstrap/ListGroup';


const WeatherList = ({ city }) => {
    const [weathers, setWeathers] = useState([]);
    const [localTime, setLocalTime] = useState('');

    useEffect(() => {
        const retrieveWeathers = async () => {

            const response = await weatherApi.get('/api/forecast', {
                params: {
                    city: city.value
                }
            });

            const weatherList = response.data.data.list.map(weather => ({
                ...weather,
                dt: DateTime.fromISO(weather.dt).ts
            }));

            setWeathers(weatherList);
        }

        if (city) {
            retrieveWeathers();

        }

    }, [city]);

    // update the local time string every second
    useEffect(() => {
        let timer;
        if (city) {
            timer = setTimeout(() => {
                setLocalTime(DateTime.local()
                    .setZone(tzlookup(city.latitude, city.longitude))
                    .toLocaleString({
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }));
            }, 1000);
        }

        return () => clearTimeout(timer);
    });



    return (
        <>

            {city ?
                <>
                    <h1 style={{ fontWeight: "bold" }}>{city.label}</h1>
                    <p>
                        {localTime}
                    </p>
                    <ListGroup>
                        {
                            weathers.map((weather, i) =>
                                <Weather
                                    weather={weather}
                                    key={i}
                                    index={i}
                                    latitude={city.latitude}
                                    longitude={city.longitude}

                                />)
                        }
                    </ListGroup>
                </> :
                null}
        </>
    )
};

export default WeatherList;