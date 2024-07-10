import { useState, useEffect } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

const WeatherData = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=c45a8618fc83e03c7355f428f9ffa221');
                const result = await xml2js.parseStringPromise(response.data);
                setWeatherData(result);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {weatherData ? <pre>{JSON.stringify(weatherData, null, 2)}</pre> : 'Loading...'}
        </div>
    );
};

export default WeatherData;