import React, { useState } from 'react';
import Papa from 'papaparse';
import { Instructor } from '../models/models';

function BusyUpload({ setBusyTimes }) {
  const [file, setFile] = useState(null);
  const [displayBusy, setDisplayBusy] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleParse = () => {
    Papa.parse(file, {
      complete: function(results) {
        const parsedBusyTimes = [];
        results.data.forEach(item => {
          const[instructorName, day, times] = item;
          const timeSlots = times.split(',').map(time => time.trim());
          parsedBusyTimes.push({instructorName: instructorName, day: day, times: timeSlots});
        });
        setBusyTimes(parsedBusyTimes);
        setDisplayBusy(parsedBusyTimes);
      },
      header: false,
      skipEmptyLines: true,
      delimiter: ";"
    });
  };

  return (
    <div className="file-upload-container">
    <h2>Upload Busy</h2>
    <label htmlFor="busy-upload" className="file-upload-label">Select Busy File</label>
    <input id="busy-upload" type="file" onChange={handleFileChange} accept=".csv" />
    <button className="file-upload-button" onClick={handleParse}>Parse Busy</button>
    <div>
      <h3>Parsed Busy:</h3>
      <div className="parsed-table-container">
      <table>
        <thead>
          <tr>
            <th>Instructor Name</th>
            <th>Day</th>
            <th>Time Slots</th>
          </tr>
        </thead>
        <tbody>
          {displayBusy.map((busy, index) => (
            <tr key={index}>
              <td>{busy.instructorName}</td>
              <td>{busy.day}</td>
              <td>{busy.times.join(',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  </div>
  );
}

export default BusyUpload;


  