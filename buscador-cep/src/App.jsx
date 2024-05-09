import React, { useState } from 'react';
import './App.css';
import { FiSearch } from 'react-icons/fi';

import { fetchWeather } from './services/api';

function App() {
  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  function setEnderecoPorCEP(enderecoText) {
    setCep(enderecoText);
  }

  async function fetchClimaPorCidade() {
    const apiKey = '8c12f65456e6d11aa1f8c2d29c8a84f3';

    if (!cep.localidade) {
      setError('Por favor, digite o nome de uma cidade ou busque um CEP válido.');
      return;
    }

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cep.localidade}&appid=${apiKey}&units=metric&lang=pt_br`);
      const data = await response.json();

      if (data.cod !== 200) {
        setError('Cidade não encontrada.');
      } else {
        setWeather(data);
        setError(null);
      }
    } catch (error) {
      console.error('Falha ao buscar informações do clima:', error);
      setError('Erro ao carregar informações do clima.');
    }
  }

  async function fetchEnderecoPorCEP() {
    const cepLimpo = input.replace(/\D/g, ''); 

    if (cepLimpo.length !== 8) {
      setError('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado.');
      } else {
        setEnderecoPorCEP({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep
        });
        setError(null);
      }
    } catch (error) {
      console.error('Falha ao buscar o endereço:', error);
      setError('Erro ao carregar endereço.');
    }
  }

  return (
    <div className="container">
      <h1 className='title'>Buscador de CEP e Clima</h1>

      <div className="containerInput">
        <input 
          type="text" 
          placeholder='Digite seu CEP...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className='buttonSearch' onClick={fetchEnderecoPorCEP}>
          <FiSearch size={25} color='#FFF' />
        </button>
        <button className='buttonSearch' onClick={fetchClimaPorCidade}>
          <FiSearch size={25} color='#FFF' />
        </button>
      </div>

      {error && <p>{error}</p>}

      {Object.keys(cep).length > 0 && (
    <div className="infoContainer">
        <h2>Endereço</h2>
        <p>CEP: {cep.cep}</p>
        <p>Logradouro: {cep.logradouro}</p>
        <p>Bairro: {cep.bairro}</p>
        <p>Localidade: {cep.localidade} - {cep.uf}</p>
    </div>
)}

{weather && (
    <div className="infoContainer">
        <h2>Condições Climáticas</h2>
        <p>Cidade: {weather.name}, {weather.sys.country}</p>
        <p>Descrição: {weather.weather[0].description}</p>
        <p>Temperatura: {weather.main.temp}°C</p>
        <p>Umidade: {weather.main.humidity}%</p>
    </div>
)}
    </div>
  );
}

export default App;
