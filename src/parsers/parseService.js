import React, { useState } from 'react';
import Papa from 'papaparse';
import {serviceCourse} from '../models/models';

function ServicesUpload({setServiceCourses}) {
  const [file, setFile] = useState(null);
  const [displayService, setDisplayService] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleParse = () => {
    Papa.parse(file, {
      complete: function(results) {
        const parsedServices = [];
        results.data.forEach(item => {
          const[courseCode, day, times] = item;
          const timeSlots = times.split(',').map(time => time.trim());
          parsedServices.push({courseCode: courseCode.trim(), day: day.trim(), timeSlots});
        });
        setServiceCourses(parsedServices);
        setDisplayService(parsedServices);
      },
      header: false,
      skipEmptyLines: true,
      delimiter: ";"
    });
  };
  
  return (
    <div className="file-upload-container">
    <h2>Upload Service</h2>
    <label htmlFor="service-upload" className="file-upload-label">Select Service File</label>
    <input id="service-upload" type="file" onChange={handleFileChange} accept=".csv" />
    <button className="file-upload-button" onClick={handleParse}>Parse Service</button>
      <div>
        <h3>Parsed Service:</h3>
        <div className="parsed-table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Instructor</th>
              <th>Time Slots</th>
            </tr>
          </thead>
          <tbody>
            {displayService.map((service, index) => (
              <tr key={index}>
                <td>{service.courseCode}</td>
                <td>{service.day}</td>
                <td>{service.timeSlots.join(',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default ServicesUpload;
  