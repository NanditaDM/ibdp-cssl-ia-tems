// main app class - encapsulation
class Application {
    #users; // private
    #requests; // private
    #tickets; // private
    #reports; // private
    #clients; // private
    #meetings; // private
    #attendances; // private
    #breaks; // private
    #notifications; // private
    #flaggedEmployees; // private

    constructor() {
        this.#users = [];
        this.#requests = [];
        this.#tickets = [];
        this.#reports = [];
        this.#clients = [];
        this.#meetings = [];
        this.#attendances = [];
        this.#breaks = [];
        this.#notifications = [];
        this.#flaggedEmployees = [];
        this.initUsers(); // pre-create users
    }

    // init users - pre-created accounts
    initUsers() {
        // CEO
        this.#users.push(new CEO("CEO001", "Neha Sharma", "ceo_neha", "NehaCEO@2025"));

        // HR
        this.#users.push(new HR("HR001", "Sarah Jones", "hr@company.com", "hr123"));

        // IT
        this.#users.push(new IT("IT001", "Mike Brown", "it@company.com", "it123"));

        // managers
        const mgr1 = new Manager("MGR001", "Asha Patel", "mgr_asha", "AshaMGR@2025", "Sales", "Sales Manager", null);
        this.#users.push(mgr1);

        // employees
        const emp1 = new Employee("EMP001", "John Kumar", "emp_john23", "John@123", "Sales", "Sales Rep", "MGR001");
        const emp2 = new Employee("EMP002", "Rahul Singh", "emp_rahul99", "Rahul@99pass", "Sales", "Sales Rep", "MGR001");
        this.#users.push(emp1);
        this.#users.push(emp2);

        // add employees to managers
        mgr1.addEmployee("EMP001");
        mgr1.addEmployee("EMP002");
    }

    // login method - polymorphism (different user types)
    login(email, password) {
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i].getEmail() === email && this.#users[i].getPassword() === password) {
                // determine user type
                let userType = "";
                if (this.#users[i] instanceof CEO) {
                    userType = "CEO";
                } else if (this.#users[i] instanceof HR) {
                    userType = "HR";
                } else if (this.#users[i] instanceof IT) {
                    userType = "IT";
                } else if (this.#users[i] instanceof Manager) {
                    userType = "Manager";
                } else if (this.#users[i] instanceof Employee) {
                    userType = "Employee";
                }

                return {
                    success: true,
                    user: {
                        id: this.#users[i].getUserID(),
                        name: this.#users[i].getFullName(),
                        email: this.#users[i].getEmail(),
                        type: userType,
                        department: this.#users[i].getDepartment ? this.#users[i].getDepartment() : null,
                        managerID: this.#users[i].getManagerID ? this.#users[i].getManagerID() : null,
                        employees: this.#users[i].getEmployees ? this.#users[i].getEmployees() : null
                    }
                };
            }
        }
        return { success: false, message: "Invalid email or password" };
    }

    // get user by ID
    getUserByID(id) {
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i].getUserID() === id) {
                return this.#users[i];
            }
        }
        return null;
    }

    // log attendance
    logAttendance(userID, lateReason) {
        const now = new Date();
        const date = now.toDateString();
        const time = now.toLocaleTimeString();

        // create attendance record
        const att = new Attendance(userID, now.toString(), date, time, lateReason);
        this.#attendances.push(att);

        const user = this.getUserByID(userID);
        if (user instanceof Employee) {
            user.addAttendance(att);
        }

        // check if late
        const hour = now.getHours();
        if (hour >= 9 || lateReason) { // late if after 9am
            // notify manager
            const managerID = user.getManagerID();
            if (managerID) {
                const notif = new Notification(
                    userID,
                    now.toString(),
                    "Employee " + user.getFullName() + " was late. Reason: " + (lateReason || "None provided"),
                    [managerID]
                );
                this.#notifications.push(notif);
            }

            // check for flags (>3 late in last 20 days)
            let lateCount = 0;
            const twentyDaysAgo = new Date();
            twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

            for (let i = 0; i < this.#attendances.length; i++) {
                if (this.#attendances[i].getUserID() === userID) {
                    const attDate = new Date(this.#attendances[i].getDateTime());
                    if (attDate >= twentyDaysAgo && this.#attendances[i].getLateReason()) {
                        lateCount++;
                    }
                }
            }

            if (lateCount > 3) {
                // flag employee
                if (!this.#flaggedEmployees.includes(userID)) {
                    this.#flaggedEmployees.push(userID);
                }

                // notify manager
                if (managerID) {
                    const flagNotif = new Notification(
                        "SYSTEM",
                        now.toString(),
                        "Employee " + user.getFullName() + " has been flagged for >3 late entries in 20 days",
                        [managerID]
                    );
                    this.#notifications.push(flagNotif);
                }
            }
        }

        return { success: true };
    }

    // request leave
    requestLeave(userID, reason, type, duration, context) {
        const now = new Date();
        const req = new Request(userID, now.toString(), type, duration, context, reason);
        this.#requests.push(req);

        // notify manager
        const user = this.getUserByID(userID);
        if (user instanceof Employee) {
            const managerID = user.getManagerID();
            if (managerID) {
                const notif = new Notification(
                    userID,
                    now.toString(),
                    "Leave request from " + user.getFullName() + " - " + type + " - " + reason,
                    [managerID]
                );
                this.#notifications.push(notif);
            }
        }

        return { success: true };
    }

    // open ticket
    openTicket(userID, issueType, info, location) {
        const now = new Date();
        const ticket = new Ticket(userID, now.toString(), issueType, info, location);
        this.#tickets.push(ticket);

        return { success: true };
    }

    // submit report
    submitReport(userID, reportType, details, offenderID, victimType) {
        const now = new Date();
        const report = new Report(userID, now.toString(), reportType, details, offenderID, victimType);
        this.#reports.push(report);

        return { success: true };
    }

    // log client acquisition
    logClientAcquisition(userID, name, email, language, pinCode) {
        const now = new Date();
        const client = new ClientAcquisition(userID, now.toString(), name, email, language, pinCode);
        this.#clients.push(client);

        return { success: true };
    }

    // start break
    startBreak(userID, breakType) {
        const now = new Date();
        const date = now.toDateString();
        const time = now.toLocaleTimeString();

        const brk = new Break(userID, now.toString(), date, time, breakType);
        this.#breaks.push(brk);

        const user = this.getUserByID(userID);
        if (user instanceof Employee) {
            user.addBreak(brk);
        }

        return { success: true, breakIndex: this.#breaks.length - 1 };
    }

    // end break
    endBreak(userID) {
        const now = new Date();
        const time = now.toLocaleTimeString();

        // find last break for user
        for (let i = this.#breaks.length - 1; i >= 0; i--) {
            if (this.#breaks[i].getUserID() === userID && !this.#breaks[i].getTimeEnd()) {
                this.#breaks[i].setTimeEnd(time);
                return { success: true };
            }
        }

        return { success: false, message: "No active break found" };
    }

    // log meeting
    logMeeting(userID, clientName, startDateTime, duration, location, pinCode, travelTime) {
        const now = new Date();
        const meeting = new Meeting(userID, now.toString(), clientName, startDateTime, duration, location, pinCode, travelTime);
        this.#meetings.push(meeting);

        // notify manager if out of office
        if (location === "Out of Office") {
            const user = this.getUserByID(userID);
            if (user instanceof Employee) {
                const managerID = user.getManagerID();
                if (managerID) {
                    const notif = new Notification(
                        userID,
                        now.toString(),
                        "Employee " + user.getFullName() + " logged out-of-office meeting with " + clientName,
                        [managerID]
                    );
                    this.#notifications.push(notif);
                }
            }
        }

        return { success: true };
    }

    // get user history
    getUserHistory(userID) {
        const history = [];

        // add all records for user
        for (let i = 0; i < this.#requests.length; i++) {
            if (this.#requests[i].getUserID() === userID) {
                history.push({
                    type: "Request",
                    data: this.#requests[i],
                    dateTime: this.#requests[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getUserID() === userID) {
                history.push({
                    type: "Ticket",
                    data: this.#tickets[i],
                    dateTime: this.#tickets[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#reports.length; i++) {
            if (this.#reports[i].getUserID() === userID) {
                history.push({
                    type: "Report",
                    data: this.#reports[i],
                    dateTime: this.#reports[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#clients.length; i++) {
            if (this.#clients[i].getUserID() === userID) {
                history.push({
                    type: "Client",
                    data: this.#clients[i],
                    dateTime: this.#clients[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#meetings.length; i++) {
            if (this.#meetings[i].getUserID() === userID) {
                history.push({
                    type: "Meeting",
                    data: this.#meetings[i],
                    dateTime: this.#meetings[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#breaks.length; i++) {
            if (this.#breaks[i].getUserID() === userID) {
                history.push({
                    type: "Break",
                    data: this.#breaks[i],
                    dateTime: this.#breaks[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#attendances.length; i++) {
            if (this.#attendances[i].getUserID() === userID) {
                history.push({
                    type: "Attendance",
                    data: this.#attendances[i],
                    dateTime: this.#attendances[i].getDateTime()
                });
            }
        }

        // sort by date (newest first)
        history.sort(function(a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });

        return history;
    }

    // get notifications for user
    getNotifications(userID) {
        const notifs = [];

        for (let i = 0; i < this.#notifications.length; i++) {
            const recipients = this.#notifications[i].getRecipients();
            // check if user is recipient
            if (Array.isArray(recipients)) {
                for (let j = 0; j < recipients.length; j++) {
                    if (recipients[j] === userID) {
                        notifs.push(this.#notifications[i]);
                        break;
                    }
                }
            } else if (recipients === userID) {
                notifs.push(this.#notifications[i]);
            }
        }

        return notifs;
    }

    // get flagged employees
    getFlaggedEmployees() {
        return this.#flaggedEmployees;
    }

    // get requests for manager
    getRequestsForManager(managerID) {
        const requests = [];
        const manager = this.getUserByID(managerID);

        if (manager instanceof Manager) {
            const employees = manager.getEmployees();

            for (let i = 0; i < this.#requests.length; i++) {
                const reqUserID = this.#requests[i].getUserID();
                for (let j = 0; j < employees.length; j++) {
                    if (employees[j] === reqUserID) {
                        requests.push(this.#requests[i]);
                        break;
                    }
                }
            }
        }

        return requests;
    }

    // update request status
    updateRequestStatus(requestIndex, status) {
        if (requestIndex >= 0 && requestIndex < this.#requests.length) {
            this.#requests[requestIndex].setStatus(status);
            return { success: true };
        }
        return { success: false };
    }

    // get tickets for manager
    getTicketsForManager(managerID) {
        const tickets = [];
        const manager = this.getUserByID(managerID);

        if (manager instanceof Manager) {
            const employees = manager.getEmployees();

            for (let i = 0; i < this.#tickets.length; i++) {
                const ticketUserID = this.#tickets[i].getUserID();
                for (let j = 0; j < employees.length; j++) {
                    if (employees[j] === ticketUserID) {
                        tickets.push(this.#tickets[i]);
                        break;
                    }
                }
            }
        }

        return tickets;
    }

    // send notification
    sendNotification(senderID, subject, recipients) {
        const now = new Date();
        const notif = new Notification(senderID, now.toString(), subject, recipients);
        this.#notifications.push(notif);

        return { success: true };
    }

    // get all reports
    getAllReports() {
        return this.#reports;
    }

    // respond to report
    respondToReport(reportIndex, action) {
        if (reportIndex >= 0 && reportIndex < this.#reports.length) {
            this.#reports[reportIndex].setActionTaken(action);
            this.#reports[reportIndex].setFurtherActionRequested(false); // reset flag

            // notify reporter
            const reporterID = this.#reports[reportIndex].getUserID();
            const now = new Date();
            const notif = new Notification(
                "HR",
                now.toString(),
                "Your report has been addressed. Action: " + action,
                [reporterID]
            );
            this.#notifications.push(notif);

            return { success: true };
        }
        return { success: false };
    }

    // get all tickets
    getAllTickets() {
        return this.#tickets;
    }

    // get unresolved tickets
    getUnresolvedTickets() {
        const unresolved = [];
        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getStatus() === "Unresolved") {
                unresolved.push(this.#tickets[i]);
            }
        }
        return unresolved;
    }

    // set ticket ETA
    setTicketETA(ticketIndex, itMemberID, eta) {
        if (ticketIndex >= 0 && ticketIndex < this.#tickets.length) {
            this.#tickets[ticketIndex].setITMemberID(itMemberID);
            this.#tickets[ticketIndex].setETA(eta);

            // notify employee
            const empID = this.#tickets[ticketIndex].getUserID();
            const now = new Date();
            const notif = new Notification(
                itMemberID,
                now.toString(),
                "Your IT ticket ETA: " + eta,
                [empID]
            );
            this.#notifications.push(notif);

            return { success: true };
        }
        return { success: false };
    }

    // resolve ticket
    resolveTicket(ticketIndex) {
        if (ticketIndex >= 0 && ticketIndex < this.#tickets.length) {
            this.#tickets[ticketIndex].setStatus("Resolved");

            // notify employee
            const empID = this.#tickets[ticketIndex].getUserID();
            const itMemberID = this.#tickets[ticketIndex].getITMemberID();
            const now = new Date();
            const notif = new Notification(
                itMemberID,
                now.toString(),
                "Your IT ticket has been resolved",
                [empID]
            );
            this.#notifications.push(notif);

            return { success: true };
        }
        return { success: false };
    }

    // mark ticket unresolved
    markTicketUnresolved(ticketIndex) {
        if (ticketIndex >= 0 && ticketIndex < this.#tickets.length) {
            this.#tickets[ticketIndex].setStatus("Unresolved");
            return { success: true };
        }
        return { success: false };
    }

    // get CEO stats
    getCEOStats() {
        const today = new Date().toDateString();
        const stats = {
            flaggedEmployees: this.#flaggedEmployees.length,
            lateToday: 0,
            onBreak: 0,
            meetingsToday: 0,
            unexcusedAbsences: 0,
            clientsToday: 0,
            avgBreakTime: 0,
            avgMeetingTime: 0
        };

        // late today
        for (let i = 0; i < this.#attendances.length; i++) {
            if (this.#attendances[i].getDate() === today && this.#attendances[i].getLateReason()) {
                stats.lateToday++;
            }
        }

        // on break
        for (let i = 0; i < this.#breaks.length; i++) {
            if (this.#breaks[i].getDate() === today && !this.#breaks[i].getTimeEnd()) {
                stats.onBreak++;
            }
        }

        // meetings today
        for (let i = 0; i < this.#meetings.length; i++) {
            const meetingDate = new Date(this.#meetings[i].getDateTime()).toDateString();
            if (meetingDate === today) {
                stats.meetingsToday++;
            }
        }

        // clients today
        for (let i = 0; i < this.#clients.length; i++) {
            const clientDate = new Date(this.#clients[i].getDateTime()).toDateString();
            if (clientDate === today) {
                stats.clientsToday++;
            }
        }

        // avg break time
        let totalBreakTime = 0;
        let completedBreaks = 0;
        for (let i = 0; i < this.#breaks.length; i++) {
            if (this.#breaks[i].getDate() === today && this.#breaks[i].getTimeEnd()) {
                const start = new Date("1970-01-01 " + this.#breaks[i].getTimeStart());
                const end = new Date("1970-01-01 " + this.#breaks[i].getTimeEnd());
                const diff = (end - start) / 1000 / 60; // minutes
                totalBreakTime += diff;
                completedBreaks++;
            }
        }
        if (completedBreaks > 0) {
            stats.avgBreakTime = Math.round(totalBreakTime / completedBreaks);
        }

        // avg meeting time
        let totalMeetingTime = 0;
        let meetingCount = 0;
        for (let i = 0; i < this.#meetings.length; i++) {
            const meetingDate = new Date(this.#meetings[i].getDateTime()).toDateString();
            if (meetingDate === today) {
                totalMeetingTime += parseInt(this.#meetings[i].getDuration());
                meetingCount++;
            }
        }
        if (meetingCount > 0) {
            stats.avgMeetingTime = Math.round(totalMeetingTime / meetingCount);
        }

        return stats;
    }

    // add user (IT only)
    addUser(userType, userID, fullName, email, password, department, role, managerID) {
        let newUser;

        if (userType === "Employee") {
            newUser = new Employee(userID, fullName, email, password, department, role, managerID);
        } else if (userType === "Manager") {
            newUser = new Manager(userID, fullName, email, password, department, role, managerID);
        } else if (userType === "HR") {
            newUser = new HR(userID, fullName, email, password);
        } else if (userType === "IT") {
            newUser = new IT(userID, fullName, email, password);
        } else if (userType === "CEO") {
            newUser = new CEO(userID, fullName, email, password);
        }

        if (newUser) {
            this.#users.push(newUser);
            return { success: true };
        }

        return { success: false };
    }

    // request further action on report
    requestFurtherAction(reportIndex) {
        if (reportIndex >= 0 && reportIndex < this.#reports.length) {
            this.#reports[reportIndex].setFurtherActionRequested(true);

            // notify HR
            const now = new Date();
            const notif = new Notification(
                this.#reports[reportIndex].getUserID(),
                now.toString(),
                "Further action requested on report about " + this.#reports[reportIndex].getOffenderID(),
                ["HR001"]
            );
            this.#notifications.push(notif);

            return { success: true };
        }
        return { success: false };
    }
}

// create app instance
const app = new Application();
