import './App.css';
import { useState,useEffect } from 'react';
import LightweightChart from './components/LightweightChart';
import fetchData from './components/fetchData';
import SelectBar from './components/SelectBar';

function App(){
  const [candleData, setCandleData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [date, setDate] = useState('2024-01-01');
  const [script, setScript] = useState('ADANIENT');
  const [trigger,setTrigger] = useState(false);
  
  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await fetchData(script,date);
      setCandleData(data.map(candle => {
        return({
          ...candle,
          time: candle.time + 19800
        });
      }));
      setVolumeData(data.map(candle => ({
        time: candle.time + 19800,
        value: candle.volume,
        color: candle.open >= candle.close ? '#EF5350' : '#26A69A',
      })));
    };

    fetchDataAsync();
  }, [trigger]);

  const handleScriptChange = (value) => {
    setScript(value);
  };
  const handleDateChange = (value) => {
    setDate(value);
  };
  const handleClick = () => {
    setTrigger((value) => {
      return !value;
    })
  }

  return (
    <div>
      {script && date && <p>Script: {script} Date: {date}</p>}
      <SelectBar 
          handleDateChange={handleDateChange}
          handleScriptChange={handleScriptChange}
          handleClick={handleClick}
          script={script}
          date={date} 
      />
      {
        (!candleData.length)?
        <div>Loading...</div>:
        <LightweightChart data={candleData} volumeData={volumeData} />
      }
    </div>
  );
}

export default App;
