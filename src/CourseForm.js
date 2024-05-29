import React, { useState } from 'react';

function CourseForm({ onAddCourse }) {
    const [formData, setFormData] = useState({
        code: '', name: '', year: '', credit: '', type: '', department: '', numStudents: '', instructorName: '', hoursPreference: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCourse(formData);
        setFormData({
            code: '', name: '', year: '', credit: '', type: '', department: '', numStudents: '', instructorName: '', hoursPreference: ''
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Course Code" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Course Name" />
            <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" />
            <input type="text" name="credit" value={formData.credit} onChange={handleChange} placeholder="Credit" />
            <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Type (Compulsory/Elective)" />
            <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department (Department/Service)" />
            <input type="text" name="numStudents" value={formData.numStudents} onChange={handleChange} placeholder="Number of Students" />
            <input type="text" name="instructorName" value={formData.instructorName} onChange={handleChange} placeholder="Instructor Name" />
            <input type="text" name="hoursPreference" value={formData.hoursPreference} onChange={handleChange} placeholder="'3' or '2+1'" />
            <button type="submit">Add Course</button>
        </form>
    );
}

export default CourseForm;

