import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import weatherApi from '../api/weather-forecast';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CitySelection = ({ setCity }) => {
    // define states
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(
        localStorage.getItem('country') ?
            JSON.parse(localStorage.getItem('country')) : null
    );
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('city') ?
        JSON.parse(localStorage.getItem('city')) : null);

    // retrieve all countries from db for the first render
    useEffect(() => {
        const getAllContries = async () => {
            const response = await weatherApi.get('/api/countries');

            setCountryOptions(response.data.data.map(x => ({
                value: x.name,
                label: x.name.toUpperCase(),
                id: x.id
            })));
        };
        getAllContries();
    }, []);

    // retrieve all cities under the selected country from db
    useEffect(() => {
        const getAllCities = async () => {
            const response = await weatherApi.get('/api/cities', {
                params: {
                    countryId: selectedCountry.id
                }
            });

            setCityOptions(response.data.data.map(x => ({
                value: x.name,
                label: x.name.toUpperCase(),
                id: x.id,
                latitude: x.latitude,
                longitude: x.longitude,
                countryId: x.countryId
            })));
        }
        if (selectedCountry) {
            getAllCities();
        }
    }, [selectedCountry]);

    // update states when localStorage changes
    const localStorageCountry = localStorage.getItem('country');
    const localStorageCity = localStorage.getItem('city');
    useEffect(() => {
        setSelectedCountry(JSON.parse(localStorageCountry));
        setSelectedCity(JSON.parse(localStorageCity));
        if (!localStorageCountry) {
            setSelectedCity(null);
        }
    }, [localStorageCountry, localStorageCity]);

    useEffect(() => {
        setCity(selectedCity ? selectedCity : null);
    }, [selectedCity, setCity]);

    const handleCountryChange = selectedOption => {
        setSelectedCountry(currCountry => {
            if (currCountry?.id !== selectedOption?.id) {
                localStorage.setItem('city', null);
            }
            return selectedOption;
        });
        localStorage.setItem('country', JSON.stringify(selectedOption));
    };

    const handleCityChange = selectedOption => {
        setSelectedCity(selectedOption);
        localStorage.setItem('city', JSON.stringify(selectedOption));
    };

    return (
        <>
            <Row>
                <Col xs={12} md={4} className="mb-3">
                    <Select
                        options={countryOptions}
                        isClearable={true}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder={'Select Country'} />
                </Col>
                <Col xs={12} md={8}>
                    {selectedCountry ? <Select
                        options={cityOptions}
                        isClearable={true}
                        value={selectedCity}
                        onChange={handleCityChange}
                        placeholder={"Select City"} /> : null}
                </Col>
            </Row>
        </>
    );
};

export default CitySelection;