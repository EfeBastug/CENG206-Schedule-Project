export class Course {
    constructor(code, name, year, credit, type, department, numStudents, instructor, hoursPreference) {
        this.code = code;
        this.name = name;
        this.year = year;
        this.credit = credit;
        this.type = type;
        this.department = department;
        this.numStudents = numStudents;
        this.instructor = instructor;
        this.hoursPreference = hoursPreference;
    }
}

export class Classroom {
    constructor(id, capacity) {
        this.id = id;
        this.capacity = capacity;
        this.bookedSlots = [];
    }
}

export class Instructor {
    constructor(name) {
        this.name = name;
        this.courses = [];
        this.busySlots = [];
    }

    addCourse(course) {
        this.courses.push(course);
    }

    addBusySlot(day, times) {
        this.busySlots.push({ day, times });
    }

    isAvailable(day, time) {
        return !this.busySlots.some(slot => slot.day === day && slot.times.includes(time));
    }
}

export class ServiceCourse {
    constructor(id, times) {
        this.id = id;
        this.times = times;
    }
}
