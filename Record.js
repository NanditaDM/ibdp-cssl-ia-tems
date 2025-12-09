// base class for all records
class Record {
    #userID; // private
    #dateTime; // private

    constructor(userID, dateTime) {
        this.#userID = userID;
        this.#dateTime = dateTime;
    }

    // getters
    getUserID() {
        return this.#userID;
    }

    getDateTime() {
        return this.#dateTime;
    }
}

// request record - inherits from Record
class Request extends Record {
    #type; // private
    #duration; // private
    #context; // private
    #status; // private
    #reason; // private

    constructor(userID, dateTime, type, duration, context, reason) {
        super(userID, dateTime);
        this.#type = type;
        this.#duration = duration;
        this.#context = context;
        this.#status = "Pending";
        this.#reason = reason;
    }

    // getters
    getType() {
        return this.#type;
    }

    getDuration() {
        return this.#duration;
    }

    getContext() {
        return this.#context;
    }

    getStatus() {
        return this.#status;
    }

    getReason() {
        return this.#reason;
    }

    // setter
    setStatus(newStatus) {
        this.#status = newStatus;
    }
}

// ticket record - inherits from Record
class Ticket extends Record {
    #itMemberID; // private
    #eta; // private
    #status; // private
    #issueType; // private
    #info; // private
    #location; // private

    constructor(userID, dateTime, issueType, info, location) {
        super(userID, dateTime);
        this.#itMemberID = null;
        this.#eta = null;
        this.#status = "Unresolved";
        this.#issueType = issueType;
        this.#info = info;
        this.#location = location;
    }

    // getters
    getITMemberID() {
        return this.#itMemberID;
    }

    getETA() {
        return this.#eta;
    }

    getStatus() {
        return this.#status;
    }

    getIssueType() {
        return this.#issueType;
    }

    getInfo() {
        return this.#info;
    }

    getLocation() {
        return this.#location;
    }

    // setters
    setITMemberID(id) {
        this.#itMemberID = id;
    }

    setETA(eta) {
        this.#eta = eta;
    }

    setStatus(newStatus) {
        this.#status = newStatus;
    }
}

// report record - inherits from Record
class Report extends Record {
    #reportType; // private
    #details; // private
    #offenderID; // private
    #victimType; // private
    #actionTaken; // private
    #furtherActionRequested; // private

    constructor(userID, dateTime, reportType, details, offenderID, victimType) {
        super(userID, dateTime);
        this.#reportType = reportType;
        this.#details = details;
        this.#offenderID = offenderID;
        this.#victimType = victimType;
        this.#actionTaken = null;
        this.#furtherActionRequested = false;
    }

    // getters
    getReportType() {
        return this.#reportType;
    }

    getDetails() {
        return this.#details;
    }

    getOffenderID() {
        return this.#offenderID;
    }

    getVictimType() {
        return this.#victimType;
    }

    getActionTaken() {
        return this.#actionTaken;
    }

    getFurtherActionRequested() {
        return this.#furtherActionRequested;
    }

    // setters
    setActionTaken(action) {
        this.#actionTaken = action;
    }

    setFurtherActionRequested(val) {
        this.#furtherActionRequested = val;
    }
}

// client acquisition record - inherits from Record
class ClientAcquisition extends Record {
    #clientName; // private
    #clientEmail; // private
    #spokenLanguage; // private
    #pinCode; // private

    constructor(userID, dateTime, clientName, clientEmail, spokenLanguage, pinCode) {
        super(userID, dateTime);
        this.#clientName = clientName;
        this.#clientEmail = clientEmail;
        this.#spokenLanguage = spokenLanguage;
        this.#pinCode = pinCode;
    }

    // getters
    getClientName() {
        return this.#clientName;
    }

    getClientEmail() {
        return this.#clientEmail;
    }

    getSpokenLanguage() {
        return this.#spokenLanguage;
    }

    getPinCode() {
        return this.#pinCode;
    }
}

// meeting record - inherits from Record
class Meeting extends Record {
    #clientName; // private
    #startDateTime; // private
    #duration; // private
    #location; // private
    #pinCode; // private
    #travelTime; // private

    constructor(userID, dateTime, clientName, startDateTime, duration, location, pinCode, travelTime) {
        super(userID, dateTime);
        this.#clientName = clientName;
        this.#startDateTime = startDateTime;
        this.#duration = duration;
        this.#location = location;
        this.#pinCode = pinCode;
        this.#travelTime = travelTime;
    }

    // getters
    getClientName() {
        return this.#clientName;
    }

    getStartDateTime() {
        return this.#startDateTime;
    }

    getDuration() {
        return this.#duration;
    }

    getLocation() {
        return this.#location;
    }

    getPinCode() {
        return this.#pinCode;
    }

    getTravelTime() {
        return this.#travelTime;
    }
}

// attendance record - inherits from Record
class Attendance extends Record {
    #date; // private
    #timeEntry; // private
    #timeExit; // private
    #lateReason; // private

    constructor(userID, dateTime, date, timeEntry, lateReason) {
        super(userID, dateTime);
        this.#date = date;
        this.#timeEntry = timeEntry;
        this.#timeExit = null;
        this.#lateReason = lateReason;
    }

    // getters
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

    // setter
    setTimeExit(time) {
        this.#timeExit = time;
    }
}

// break record - inherits from Record
class Break extends Record {
    #date; // private
    #timeStart; // private
    #timeEnd; // private
    #breakType; // private

    constructor(userID, dateTime, date, timeStart, breakType) {
        super(userID, dateTime);
        this.#date = date;
        this.#timeStart = timeStart;
        this.#timeEnd = null;
        this.#breakType = breakType;
    }

    // getters
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

    // setter
    setTimeEnd(time) {
        this.#timeEnd = time;
    }
}

// notification record - inherits from Record
class Notification extends Record {
    #subject; // private
    #recipients; // private array

    constructor(userID, dateTime, subject, recipients) {
        super(userID, dateTime);
        this.#subject = subject;
        this.#recipients = recipients;
    }

    // getters
    getSubject() {
        return this.#subject;
    }

    getRecipients() {
        return this.#recipients;
    }
}
