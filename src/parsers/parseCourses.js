import React, { useState } from 'react';
import Papa from 'papaparse';
import { Course, Instructor } from '../models/models';

function CoursesUpload({ setCourses, setInstructors }) {
  const [file, setFile] = useState(null);
  const [displayCourses, setDisplayCourses] = useState([]);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleParse = () => {
    Papa.parse(file, {
      complete: function(results) {
        console.log("Parsed results:", results);
        const parsedCourses = [];
        const parsedInstructors = [];
        results.data.forEach((item, index) => {
            const [code, name, year, credit, type, department, numStudents, instructorName, hoursPreference] = item;
            let instructor = parsedInstructors.find(inst => inst.name === instructorName);
            if (!instructor) {
              instructor = new Instructor(instructorName);
              parsedInstructors.push(instructor);
            }
            const course = new Course(code, name, parseInt(year, 10), parseInt(credit, 10),
              type, department, parseInt(numStudents, 10), instructor, hoursPreference);
            instructor.addCourse(course);
            parsedCourses.push(course);
        });
        setCourses(parsedCourses);
        setInstructors(parsedInstructors);
        setDisplayCourses(parsedCourses);
      },
      header: false,
      skipEmptyLines: true,
      delimiter: ";"
    });
  };

  return (
    <div className="file-upload-container">
    <h2>Upload Courses</h2>
    <label htmlFor="course-upload" className="file-upload-label">Select Courses File</label>
    <input id="course-upload" type="file" onChange={handleFileChange} accept=".csv" />
    <button className="file-upload-button" onClick={handleParse}>Parse Courses</button>
    <div>
        <h3>Parsed Courses:</h3>
        <div className="parsed-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Credit</th>
                        <th>Type</th>
                        <th>Department</th>
                        <th>Capacity</th>
                        <th>Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    {displayCourses.map((course, index) => (
                        <tr key={index}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.year}</td>
                            <td>{course.credit}</td>
                            <td>{course.type}</td>
                            <td>{course.department}</td>
                            <td>{course.numStudents}</td>
                            <td>{course.instructor.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</div>
);
}

export default CoursesUpload;
