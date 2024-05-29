import React, { useState, useEffect } from 'react';
import {Course, Classroom, Instructor} from './models/models';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'];

function ScheduleComponent({ trigger, courses, instructors, classrooms, serviceCourses, busyTimes}) {
    const [schedule, setSchedule] = useState({});
    useEffect(() => {
        if (trigger) {
            const computedSchedule = scheduleCourses(courses, classrooms, serviceCourses, busyTimes);
            setSchedule(computedSchedule);
        }
    }, [trigger, courses, classrooms, serviceCourses, busyTimes]);

    //We initialize a schedule for showing
    function initializeSchedule() {
        const schedule = {};
        weekDays.forEach(day => {
            schedule[day] = {};
            timeSlots.forEach(time => {
                schedule[day][time] = [];
            });
        });
        return schedule;
    }

    //We push the parsed data from the busy file into the busy slots of the instructors
    function initializeInstructorBusyTimes(busyTimes) {
        busyTimes.forEach(busy => {
            const {instructorName, day, timeSlots} = busy;
            let instructor = instructors.find(instructor => instructor.name === instructorName);
            if (!instructor) {
                instructor = new Instructor(instructorName);
                instructors.push(instructor);
            }
            instructor.busySlots.push({day: day, times: [timeSlots]});
        });
    }

    //A method for finding an available classroom for a course
    function findAvailableClassroom(day, startTime, requiredCapacity, hoursNeeded) {
        const startSlotIndex = timeSlots.indexOf(startTime);
        return classrooms.find(classroom => {
            if (classroom.capacity < requiredCapacity) 
                
                return false;
            for (let i = 0; i < hoursNeeded; i++) {
                const timeIndex = startSlotIndex + i;
                if (timeIndex >= timeSlots.length || classroom.bookedSlots.some(slot => slot.day === day && slot.times.includes(timeSlots[timeIndex]))) {
                    return false;
                }
            }
            return true;
        });
    }
    
    //A function that checks if courses in the same time slot overlap
    function checkCourseOverlap(schedule, day, time, year) {
        return schedule[day][time].some(course => course.year === year);
    }
    
    //A function that schedules service courses
    function scheduleServiceCourses(schedule, serviceCourses) {
        serviceCourses.forEach(service => {
            const { courseCode, day, timeSlots } = service;
            const course = courses.find(c => c.code === courseCode);
            if (!course) return;
            const classroom = findAvailableClassroomForServiceCourse(day, timeSlots, course.numStudents);
            if (classroom) {
                timeSlots.forEach(time => {
                    if (!schedule[day]) schedule[day] = {};
                    if (!schedule[day][time]) schedule[day][time] = [];
    
                    schedule[day][time].push({
                        courseName: course.name,
                        classroomId: classroom.id,
                        instructorName: course.instructor.name,
                        year: course.year
                    });
    
                    classroom.bookedSlots.push({
                        day: day,
                        times: [time],
                        classroomId: classroom.id
                    });

                    course.instructor.busySlots.push({
                        day: day,
                        times: [time],
                        classroomId: classroom.id
                    });
                });
            } else {
                console.log(`No available classroom found for ${course.name} at ${timeSlots.join(', ')} on ${day}.`);
            }
        });
    }
    
    //A function that checks classrooms for service courses
    //If you ask why we couldn't just use the function earlier, service courses
    //are just pushed into the time slots without checking for consecutivity because they are placed first
    function findAvailableClassroomForServiceCourse(day, timeSlots, requiredCapacity) {
        return classrooms.find(classroom => {
            if (classroom.capacity < requiredCapacity) return false;
    
            return !timeSlots.some(time => 
                classroom.bookedSlots.some(slot => slot.day === day && slot.times.includes(time))
            );
        });
    }
    
    //Gets the current hours scheduled for a course, needed for 2+1 courses
    function getHoursScheduledForCourse(schedule, course) {
        let totalHours = 0;
        for (const day of weekDays) {
            for (const time of timeSlots) {
                totalHours += schedule[day][time].filter(entry => entry.courseName === course.name).length;
            }
        }
        return totalHours;
    }

    //The function that actually places the courses
    function scheduleCourseHelper(schedule, course, day, time, hoursNeeded) {
        const startSlotIndex = timeSlots.indexOf(time);
        if (startSlotIndex === -1 || startSlotIndex + hoursNeeded > timeSlots.length) return false;
    
        const currentHoursScheduled = getHoursScheduledForCourse(schedule, course);
        if (currentHoursScheduled + hoursNeeded > course.hoursPreference) {
            return false;
        }
        //We check for courses for the same year and if instructor is available for the current time slot
        if (checkCourseOverlap(schedule, day, time, course.year) || !course.instructor.isAvailable(day, currentHoursScheduled)) {
            return false;
        }
    
        let classroom = findAvailableClassroom(day, time, course.numStudents, hoursNeeded);
        if (!classroom) {
            console.log(`No available classroom found for ${course.name}.`);
            return false;
        }
        
        for (let i = 0; i < hoursNeeded; i++) {
            const currentTime = timeSlots[startSlotIndex + i];
            classroom.bookedSlots.push({ day: day, times: [currentTime], courseCode: course.code });
            course.instructor.busySlots.push({day, times: [currentTime]});
            schedule[day][currentTime].push({
                courseName: course.name,
                classroomId: classroom.id,
                instructorName: course.instructor.name,
                year: course.year
            });
        }
    
        return true;
    }
    
    //The function that calls the scheduleCourse function
    function scheduleCourses(courses, classrooms, serviceCourses, busyTimes) {
        const schedule = initializeSchedule();
        initializeInstructorBusyTimes(busyTimes);
        scheduleServiceCourses(schedule, serviceCourses);
    

        for (const course of courses) {
            if (course.department === 'S') continue;
            if (course.hoursPreference.includes('+')) {
                let firstHours = parseInt(course.hoursPreference.slice(0,1));
                let lastHours = parseInt(course.hoursPreference.slice(-1));
                let scheduledFirstHours = false;
                for (let i = 0; i < weekDays.length; i++) {
                    const day = weekDays[i];
                    for (const time of timeSlots) {
                        if (scheduleCourseHelper(schedule, course, day, time, firstHours)) {
                            scheduledFirstHours = true;
                            let foundLastHours = false;
                            for (let j = 1; j < weekDays.length; j++) {
                                const nextDay = weekDays[(i + j) % weekDays.length];
                                if (tryScheduleLastHour(schedule, course, nextDay, lastHours)) {
                                    foundLastHours = true;
                                    break;
                                }
                            }
                            if (!foundLastHours) {
                                console.log(`Failed to schedule single hour for: ${course.name}. Two hours were scheduled on ${day}.`);
                            }
                            break;
                        }
                    }
                    if (scheduledFirstHours) break;
                }
            } else {
                for (const day of weekDays) {
                    for (const time of timeSlots) {
                        scheduleCourseHelper(schedule, course, day, time, parseInt(course.hoursPreference));
                    }
                }
            }
        }
    
        return schedule;
    }
    
    
    
    function tryScheduleLastHour(schedule, course, day, lastHours) {
        for (const time of timeSlots) {
            if (scheduleCourseHelper(schedule, course, day, time, lastHours)) {
                return true;
            }
        }
        return false;
    }

    const renderTableForYear = (year) => (
        <div className="schedule-container">
            <h2>Schedule for Year {year}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        {weekDays.map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map(time => (
                        <tr key={time}>
                            <td>{time}</td>
                            {weekDays.map(day => (
                                <td key={day}>
                                    {schedule[day] && schedule[day][time]
                                        ? schedule[day][time]
                                            .filter(course => course.year === year)
                                            .map((course, index) => (
                                                <div key={index}>
                                                    {course.courseName}
                                                    &nbsp;
                                                    ({course.classroomId})
                                                </div>
                                            ))
                                        : "-"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div>
        {renderTableForYear(1)}
        {renderTableForYear(2)}
        {renderTableForYear(3)}
        {renderTableForYear(4)}
        </div>
    );
}

export default ScheduleComponent;
