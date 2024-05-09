import axios from "axios";

const api = axios.create({
    baseURL: "https://viacep.com.br/ws/"
});

export async function fetchWeather(latitude, longitude, apiKey) {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    return response.data;
}

export default api;
