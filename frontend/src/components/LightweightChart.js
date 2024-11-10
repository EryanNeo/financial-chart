import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const LightweightChart = ({ data,volumeData }) => {
  const chartContainerRef = useRef(null); // To reference the chart container
  const chartRef = useRef(null); // To store the chart instance
  const seriesRef = useRef(null); // To store the series instance
  const volumeRef = useRef(null);
  const currentCandleRef = useRef(0); // Store the current candle index in a ref (to avoid stale closures)
  const [isPlaying, setIsPlaying] = useState(true); // Track the play/pause state

  const generateRealTimeData = () => {
    return data[currentCandleRef.current];
  };
  const generateVolumeRealTimeData = () => {
    return volumeData[currentCandleRef.current];
  };

  // Create chart when the component is mounted
  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        lineWidth: 2,
        crosshair: { mode: 0 },
        timeScale: { timeVisible: true, secondsVisible: true },
      });
      chartRef.current.timeScale().applyOptions({
        rightOffset: 10
      })
      seriesRef.current = chartRef.current.addCandlestickSeries();
      volumeRef.current = chartRef.current.addHistogramSeries({
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: ''
      });
      seriesRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.01,
          bottom: 0.2
        }
      })
      volumeRef.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0
        }
      })

      // Initialize with the initial slice of data
      seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
      volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));

      // Set up a real-time update interval
      const interval = setInterval(() => {
        if (isPlaying) {
          // console.log(currentCandleRef.current);
          currentCandleRef.current += 1; // Increment the current candle index

          // Ensure we don't exceed the data length
          if (currentCandleRef.current < data.length) {
            // Update the chart with the new data
            seriesRef.current.update(generateRealTimeData());
            volumeRef.current.update(generateVolumeRealTimeData());
          }
          else{
            stopUpdate();
          }
        }
      }, 1000); // Update every second

      return () => {
        clearInterval(interval); // Clean up the interval on component unmount
        chartRef.current.remove();
      };
    }
    // eslint-disable-next-line
  }, [isPlaying, data]); // Re-run effect when isPlaying or data changes

  // Toggle play/pause
  const togglePlayPause = () => {
    if(isPlaying === true){
        currentCandleRef.current -= 1;
    }
    setIsPlaying((prevState) => {
        seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
        volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
        return !prevState;
    });
  };
  const stopUpdate = () => {
    setIsPlaying((prevState) => {
        return false;
    });
  };

  const spaceBarHandler = (event) => {
    // console.log(event.keyCode);
    if(event.keyCode === 32){
        togglePlayPause();
    }
  }
  const next5 = () => {
    currentCandleRef.current += 4;
    if(currentCandleRef.current > data.length -1){
        currentCandleRef.current = data.length -1;
    }
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }
  const prev5 = () => {
    currentCandleRef.current -= 6;
    if(currentCandleRef.current < 0){
        currentCandleRef.current = 0;
    }
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }
  const next10 = () => {
    currentCandleRef.current += 9;
    if(currentCandleRef.current > data.length -1){
        currentCandleRef.current = data.length -1;
    }
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }
  const prev10 = () => {
    currentCandleRef.current -= 11;
    if(currentCandleRef.current < 0){
        currentCandleRef.current = 0;
    }
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }
  const start0 = () => {
    currentCandleRef.current = 0;
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }
  const end0 = () => {
    currentCandleRef.current = data.length - 2;
    seriesRef.current.setData(data.slice(0, currentCandleRef.current + 1));
    volumeRef.current.setData(volumeData.slice(0, currentCandleRef.current + 1));
  }

  return (
    <div>
      <div ref={chartContainerRef} style={{ width: '80vw', height: '80vh' }} onKeyDown={spaceBarHandler} tabIndex={0} ></div>
      <div className="control-buttons">
        <button onClick={start0} className='button' >
          {'start'}
        </button>
        <button onClick={prev10} className='button' >
          {'prev10'}
        </button>
        <button onClick={prev5} className='button' >
          {'prev5'}
        </button>
        <button onClick={togglePlayPause} className='button button-play' >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={next5} className='button' >
          {'next5'}
        </button>
        <button onClick={next10} className='button' >
          {'next10'}
        </button>
        <button onClick={end0} className='button' >
          {'end'}
        </button>
      </div>
    </div>
  );
};

export default LightweightChart;

