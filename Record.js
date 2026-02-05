// client that the company works with
class Client {
    #clientId;
    #name;
    #email;

    constructor(clientId, name, email = null) {
        this.#clientId = clientId;
        this.#name = name;
        this.#email = email;
    }

    getClientId() {
        return this.#clientId;
    }

    getName() {
        return this.#name;
    }

    getEmail() {
        return this.#email;
    }

    setName(name) {
        this.#name = name;
    }

    setEmail(email) {
        this.#email = email;
    }
}

// tracks a meeting between an employee and a client
class Meeting {
    #meetingId;
    #employeeId;
    #clientId;
    #pincode;
    #travelTime;
    #dateTime;

    constructor(meetingId, employeeId, clientId, dateTime, pincode = null, travelTime = null) {
        this.#meetingId = meetingId;
        this.#employeeId = employeeId;
        this.#clientId = clientId;
        this.#dateTime = dateTime;
        this.#pincode = pincode;
        this.#travelTime = travelTime;
    }

    getMeetingId() {
        return this.#meetingId;
    }

    getEmployeeId() {
        return this.#employeeId;
    }

    getClientId() {
        return this.#clientId;
    }

    getPincode() {
        return this.#pincode;
    }

    getTravelTime() {
        return this.#travelTime;
    }

    getDateTime() {
        return this.#dateTime;
    }
}

// employee leave request - status goes from Pending to Approved/Rejected
class LeaveRequest {
    #requestId;
    #employeeId;
    #date;
    #type;
    #reason;
    #status;

    constructor(requestId, employeeId, type, reason) {
        this.#requestId = requestId;
        this.#employeeId = employeeId;
        this.#date = new Date().toISOString().split('T')[0];
        this.#type = type;
        this.#reason = reason;
        this.#status = "Pending";
    }

    getRequestId() {
        return this.#requestId;
    }

    getEmployeeId() {
        return this.#employeeId;
    }

    getDate() {
        return this.#date;
    }

    getType() {
        return this.#type;
    }

    getReason() {
        return this.#reason;
    }

    getStatus() {
        return this.#status;
    }

    setStatus(newStatus) {
        this.#status = newStatus;
    }

    // used when loading saved data back from localStorage
    setDate(date) {
        this.#date = date;
    }
}

// IT ticket - employees raise these when they have tech issues
class Ticket {
    #ticketId;
    #flaggerId;
    #description;
    #eta;
    #status;

    constructor(ticketId, flaggerId, description) {
        this.#ticketId = ticketId;
        this.#flaggerId = flaggerId;
        this.#description = description;
        this.#eta = null;
        this.#status = "Pending";
    }

    getTicketId() {
        return this.#ticketId;
    }

    getFlaggerId() {
        return this.#flaggerId;
    }

    getDescription() {
        return this.#description;
    }

    getEta() {
        return this.#eta;
    }

    getStatus() {
        return this.#status;
    }

    setEta(eta) {
        this.#eta = eta;
    }

    setStatus(newStatus) {
        this.#status = newStatus;
    }
}

// notification sent to a specific department
class Notification {
    #notifId;
    #message;
    #senderId;
    #recipientDept;

    constructor(notifId, message, senderId, recipientDept) {
        this.#notifId = notifId;
        this.#message = message;
        this.#senderId = senderId;
        this.#recipientDept = recipientDept;
    }

    getNotifId() {
        return this.#notifId;
    }

    getMessage() {
        return this.#message;
    }

    getSenderId() {
        return this.#senderId;
    }

    getRecipientDept() {
        return this.#recipientDept;
    }
}

// HR report - for reporting behavior or attendance issues
class Report {
    #reportId;
    #targetUserId;
    #reporterUserId;
    #type;
    #description;

    constructor(reportId, targetUserId, reporterUserId, type, description) {
        this.#reportId = reportId;
        this.#targetUserId = targetUserId;
        this.#reporterUserId = reporterUserId;
        this.#type = type;
        this.#description = description;
    }

    getReportId() {
        return this.#reportId;
    }

    getTargetUserId() {
        return this.#targetUserId;
    }

    getReporterUserId() {
        return this.#reporterUserId;
    }

    getType() {
        return this.#type;
    }

    getDescription() {
        return this.#description;
    }
}

// base class for time-stamped records like attendance and breaks
class Record {
    #userID;
    #dateTime;

    constructor(userID, dateTime) {
        this.#userID = userID;
        this.#dateTime = dateTime;
    }

    getUserID() {
        return this.#userID;
    }

    getDateTime() {
        return this.#dateTime;
    }
}

// tracks when an employee clocks in and out
class Attendance extends Record {
    #date;
    #timeEntry;
    #timeExit;
    #lateReason;

    constructor(userID, dateTime, date, timeEntry, lateReason) {
        super(userID, dateTime);
        this.#date = date;
        this.#timeEntry = timeEntry;
        this.#timeExit = null;
        this.#lateReason = lateReason;
    }

    getDate() {
        return this.#date;
    }

    getTimeEntry() {
        return this.#timeEntry;
    }

    getTimeExit() {
        return this.#timeExit;
    }

    getLateReason() {
        return this.#lateReason;
    }

    setTimeExit(time) {
        this.#timeExit = time;
    }
}

// tracks employee break times
class Break extends Record {
    #date;
    #timeStart;
    #timeEnd;
    #breakType;

    constructor(userID, dateTime, date, timeStart, breakType) {
        super(userID, dateTime);
        this.#date = date;
        this.#timeStart = timeStart;
        this.#timeEnd = null;
        this.#breakType = breakType;
    }

    getDate() {
        return this.#date;
    }

    getTimeStart() {
        return this.#timeStart;
    }

    getTimeEnd() {
        return this.#timeEnd;
    }

    getBreakType() {
        return this.#breakType;
    }

    setTimeEnd(time) {
        this.#timeEnd = time;
    }
}

// meeting that a manager books with one of their employees
class ManagerMeeting extends Record {
    #employeeID;
    #meetingDateTime;
    #purpose;
    #location;

    constructor(userID, dateTime, employeeID, meetingDateTime, purpose, location) {
        super(userID, dateTime);
        this.#employeeID = employeeID;
        this.#meetingDateTime = meetingDateTime;
        this.#purpose = purpose;
        this.#location = location;
    }

    getEmployeeID() {
        return this.#employeeID;
    }

    getMeetingDateTime() {
        return this.#meetingDateTime;
    }

    getPurpose() {
        return this.#purpose;
    }

    getLocation() {
        return this.#location;
    }
}

// request from an employee to meet with HR
class HRMeetingRequest extends Record {
    #purpose;
    #status;

    constructor(userID, dateTime, purpose) {
        super(userID, dateTime);
        this.#purpose = purpose;
        this.#status = "Pending";
    }

    getPurpose() {
        return this.#purpose;
    }

    getStatus() {
        return this.#status;
    }

    setStatus(newStatus) {
        this.#status = newStatus;
    }
}
