import React, { useState } from 'react';
import CoursesUpload from "./parsers/parseCourses";
import ClassroomsUpload from "./parsers/parseClassroom";
import ServicesUpload from "./parsers/parseService";
import BusyUpload from "./parsers/parseBusy";
import ScheduleComponent from "./ScheduleComponent";
import CourseForm from "./CourseForm";
import { Course, Instructor } from './models/models';
import './App.css';
function App() {
    const [courses, setCourses] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [serviceCourses, setServiceCourses] = useState([]);
    const [busyTimes, setBusyTimes] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [triggerSchedule, setTriggerSchedule] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const handleSchedule = () => {
      setTriggerSchedule(true);
    };

    const addCourse = (newCourseData) => {
        const newCourse = new Course(
            newCourseData.code, newCourseData.name, parseInt(newCourseData.year, 10),
            parseInt(newCourseData.credit, 10), newCourseData.type, newCourseData.department,
            parseInt(newCourseData.numStudents, 10), new Instructor(newCourseData.instructorName),
            newCourseData.hoursPreference
        );
        setCourses([...courses, newCourse]);
    };


    return (
        <div className="App">
            <h2>Course Scheduler For CENG206</h2>
            <p>Hello there!</p>
            <p>Please choose the files you want to upload from below and the program
                will make a non-conflicting schedule for each year. Please note that the
                addCourse button is a bit buggy at the moment, and probably (that means %99 of the time) won't work correctly.
            </p>
            <p>At this time, the uploaded files cannot be modified via GUI, unfortunately. When will
                you be able to modify the uploaded files via GUI? Some time soon, I hope.
            </p>
            <p>(We will probably get GTA 6 before that happens)</p>
            <CoursesUpload setCourses={setCourses} setInstructors={setInstructors} />
            <ClassroomsUpload setClassrooms={setClassrooms} />
            <ServicesUpload setServiceCourses={setServiceCourses} />
            <BusyUpload setBusyTimes={setBusyTimes} />
            <button onClick={handleSchedule}>Schedule A Plan</button>
            <ScheduleComponent
                trigger={triggerSchedule}
                courses={courses}
                instructors={instructors} 
                classrooms={classrooms} 
                serviceCourses={serviceCourses}
                busyTimes={busyTimes}  />
                <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide Form' : 'Add New Course'}</button>
                {showForm && <CourseForm onAddCourse={addCourse} />}
        </div>
    );
}

export default App;

