import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SelectBar = ({handleScriptChange,handleDateChange,handleClick,script,date}) => {
  const [scripts, setScripts] = useState([]);
  const [dates, setDates] = useState([]);
  const [allScripts, setAllScripts] = useState([]);
  const [allDates, setAllDates] = useState([]);

  // Fetching scripts and dates data on component mount
  useEffect(() => {
    fetch('/database.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setScripts(jsonData);
      })
      .catch((error) => console.error('Error fetching scripts:', error));

    fetch('/documents.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setDates(jsonData);
      })
      .catch((error) => console.error('Error fetching dates:', error));
  }, []);

  // Creating options for react-select dropdowns based on fetched data
  useEffect(() => {
    const scriptOptions = scripts.map((script) => ({
      value: script,
      label: script,
    }));

    const dateOptions = dates.map((date) => ({
      value: date,
      label: date,
    }));

    setAllScripts(scriptOptions);
    setAllDates(dateOptions);
  }, [scripts, dates]);

  // Handling the change of script selection
  const scriptChange = (selectedOption) => {
    handleScriptChange(selectedOption.value)
  };

  // Handling the change of date selection
  const dateChange = (selectedOption) => {
    handleDateChange(selectedOption.value);
  };
  const onClick = function(){
    handleClick();
  }

  return (
    <div className='chart-header'>
      <div className="select-field">
        <Select
            className='select-field-item'
            options={allScripts}
            value={allScripts.find((script) => script.value === script)} // Find selected script by value
            onChange={scriptChange}
            placeholder="Select Script"
            defaultValue={script}
        />
        <Select
            className='select-field-item'
            options={allDates}
            value={allDates.find((date) => date.value === date)} // Find selected date by value
            onChange={dateChange}
            placeholder="Select Date"
            defaultValue={date}
        />
        <button onClick={onClick}>Fetch</button>
      </div>
    </div>
  );
};

export default SelectBar;
