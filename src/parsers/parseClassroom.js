import React, { useState } from 'react';
import Papa from 'papaparse';
import { Classroom } from '../models/models';

function ClassroomsUpload({ setClassrooms }) {
  const [file, setFile] = useState(null);
  const [displayClassrooms, setDisplayClassrooms] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleParse = () => {
    Papa.parse(file, {
      complete: function(results) {
        const parsedClassrooms = [];
        results.data.forEach(item => {
          const [id, capacity] = item;
          const classroom = new Classroom(id, capacity);
          parsedClassrooms.push(classroom);
        });
        setClassrooms(parsedClassrooms);
        setDisplayClassrooms(parsedClassrooms);
      },
      header: false,
      skipEmptyLines: true,
      delimiter: ";"
    });
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Classrooms</h2>
      <label htmlFor="classrooms-upload" className="file-upload-label">Select Classroom File</label>
      <input id="classrooms-upload" type="file" onChange={handleFileChange} accept=".csv" />
      <button className="file-upload-button" onClick={handleParse}>Parse Classrooms</button>
      <div>
        <h3>Parsed Classrooms:</h3>
        <div className="parsed-table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {displayClassrooms.map((classroom, index) => (
              <tr key={index}>
                <td>{classroom.id}</td>
                <td>{classroom.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default ClassroomsUpload;

  