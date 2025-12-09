// base class for all users
class User {
    #userID; // private
    #fullName; // private
    #email; // private
    #password; // private

    constructor(userID, fullName, email, password) {
        this.#userID = userID;
        this.#fullName = fullName;
        this.#email = email;
        this.#password = password;
    }

    // getters
    getUserID() {
        return this.#userID;
    }

    getFullName() {
        return this.#fullName;
    }

    getEmail() {
        return this.#email;
    }

    getPassword() {
        return this.#password;
    }

    // setters
    setPassword(newPass) {
        this.#password = newPass;
    }
}

// employee class - inherits from User
class Employee extends User {
    #department; // private
    #role; // private
    #managerID; // private
    #attendance; // private array
    #breaks; // private array

    constructor(userID, fullName, email, password, department, role, managerID) {
        super(userID, fullName, email, password); // inheritance
        this.#department = department;
        this.#role = role;
        this.#managerID = managerID;
        this.#attendance = [];
        this.#breaks = [];
    }

    // getters
    getDepartment() {
        return this.#department;
    }

    getRole() {
        return this.#role;
    }

    getManagerID() {
        return this.#managerID;
    }

    getAttendance() {
        return this.#attendance;
    }

    getBreaks() {
        return this.#breaks;
    }

    // add attendance record
    addAttendance(attendanceRecord) {
        this.#attendance.push(attendanceRecord);
    }

    // add break record
    addBreak(breakRecord) {
        this.#breaks.push(breakRecord);
    }
}

// manager class - inherits from Employee
class Manager extends Employee {
    #employees; // private array

    constructor(userID, fullName, email, password, department, role, managerID) {
        super(userID, fullName, email, password, department, role, managerID);
        this.#employees = [];
    }

    // getters
    getEmployees() {
        return this.#employees;
    }

    // add employee under manager
    addEmployee(employeeID) {
        this.#employees.push(employeeID);
    }
}

// HR class - inherits from User
class HR extends User {
    constructor(userID, fullName, email, password) {
        super(userID, fullName, email, password);
    }
}

// IT class - inherits from User
class IT extends User {
    constructor(userID, fullName, email, password) {
        super(userID, fullName, email, password);
    }
}

// CEO class - inherits from User
class CEO extends User {
    constructor(userID, fullName, email, password) {
        super(userID, fullName, email, password);
    }
}
