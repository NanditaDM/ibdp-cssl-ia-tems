// base class for all users - other roles inherit from this
class User {
    #userId;
    #name;
    #email;
    #password;
    #role;
    #phone;

    constructor(userId, name, email, password, role, phone = null) {
        this.#userId = userId;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#role = role;
        this.#phone = phone;
    }

    getUserId() {
        return this.#userId;
    }

    getName() {
        return this.#name;
    }

    getEmail() {
        return this.#email;
    }

    getPassword() {
        return this.#password;
    }

    getRole() {
        return this.#role;
    }

    getPhone() {
        return this.#phone;
    }

}

// employee class - inherits from User and adds department + tracking fields
class Employee extends User {
    #dept;
    #lateCount;
    #sickDays;
    #attendance;
    #breaks;
    #personalDaysRemaining;

    constructor(userId, name, email, password, dept, phone = null, role = "Employee") {
        super(userId, name, email, password, role, phone);
        this.#dept = dept;
        this.#lateCount = 0;
        this.#sickDays = 0;
        this.#attendance = [];
        this.#breaks = [];
        this.#personalDaysRemaining = 10;
    }

    getDept() {
        return this.#dept;
    }

    getLateCount() {
        return this.#lateCount;
    }

    getSickDays() {
        return this.#sickDays;
    }

    getAttendance() {
        return this.#attendance;
    }

    getBreaks() {
        return this.#breaks;
    }

    getPersonalDaysRemaining() {
        return this.#personalDaysRemaining;
    }

    addAttendance(attendanceRecord) {
        this.#attendance.push(attendanceRecord);
    }

    addBreak(breakRecord) {
        this.#breaks.push(breakRecord);
    }

    incrementLateCount() {
        this.#lateCount++;
    }

    incrementSickDays() {
        this.#sickDays++;
    }

    decrementPersonalDays() {
        if (this.#personalDaysRemaining > 0) {
            this.#personalDaysRemaining--;
        }
    }

}

// manager class - inherits from Employee, manages a list of employees
class Manager extends Employee {
    #emps;

    constructor(userId, name, email, password, dept, phone = null) {
        super(userId, name, email, password, dept, phone, "Manager");
        this.#emps = [];
    }

    // returns employee list
    getEmps() {
        return this.#emps;
    }

    addEmployee(emp) {
        this.#emps.push(emp);
    }

}

// CEO class - inherits directly from User since they don't belong to a department
class CEO extends User {
    constructor(userId, name, email, password, phone = null) {
        super(userId, name, email, password, "CEO", phone);
    }
}
