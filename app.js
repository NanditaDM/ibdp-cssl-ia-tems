// main application class - uses encapsulation to keep all data private
class Application {
    #users;
    #leaveRequests;
    #tickets;
    #reports;
    #clients;
    #meetings;
    #notifications;
    #attendances;
    #breaks;
    #flaggedEmployees;
    #managerMeetings;
    #hrMeetingRequests;
    #idCounters;

    constructor() {
        this.#users = [];
        this.#leaveRequests = [];
        this.#tickets = [];
        this.#reports = [];
        this.#clients = [];
        this.#meetings = [];
        this.#notifications = [];
        this.#attendances = [];
        this.#breaks = [];
        this.#flaggedEmployees = [];
        this.#managerMeetings = [];
        this.#hrMeetingRequests = [];
        this.#idCounters = {
            users: 0,
            clients: 0,
            meetings: 0,
            leaveRequests: 0,
            tickets: 0,
            notifications: 0,
            reports: 0
        };
        this.initUsers();
    }

    // generates unique IDs that go up by 1 each time
    #nextId(type) {
        this.#idCounters[type]++;
        return this.#idCounters[type];
    }

    // filters any record array to only include a manager's own employees
    // used by getRequestsForManager, getTicketsForManager, getMeetingsForManager
    #getRecordsForManager(managerId, records, getIdFn) {
        const result = [];
        const manager = this.getUserByID(managerId);

        if (manager instanceof Manager) {
            const empIds = manager.getEmps().map(e => e.id);

            for (let i = 0; i < records.length; i++) {
                if (empIds.includes(getIdFn(records[i]))) {
                    result.push(records[i]);
                }
            }
        }

        return result;
    }

    // sets up all the pre-made accounts for testing
    initUsers() {
        this.#users.push(new CEO(this.#nextId('users'), "Neha Sharma", "ceo_neha@turtlemint.com", "NehaCEO@2025"));

        // HR and IT are employees with special roles
        this.#users.push(new Employee(this.#nextId('users'), "Sahil Kapoor", "hr_sahil@turtlemint.com", "SahilHR@data", "HR", null, "HR"));
        this.#users.push(new Employee(this.#nextId('users'), "Rina Verma", "it_rina@turtlemint.com", "RinaTech#logs", "IT", null, "IT"));

        // managers - each manages a different department
        const mgr1 = new Manager(this.#nextId('users'), "Asha Patel", "mgr_asha@turtlemint.com", "AshaMGR@2025", "Sales");
        const mgr2 = new Manager(this.#nextId('users'), "Priya Desai", "mgr_priya@turtlemint.com", "PriyaMGR@2025", "Acquisition");
        this.#users.push(mgr1);
        this.#users.push(mgr2);

        // regular employees split between departments
        const emp1 = new Employee(this.#nextId('users'), "John Kumar", "emp_john23@turtlemint.com", "John@123", "Sales");
        const emp2 = new Employee(this.#nextId('users'), "Rahul Singh", "emp_rahul99@turtlemint.com", "Rahul@99pass", "Sales");
        const emp3 = new Employee(this.#nextId('users'), "Anita Roy", "emp_anita@turtlemint.com", "Anita@456", "Acquisition");
        const emp4 = new Employee(this.#nextId('users'), "Vikram Mehta", "emp_vikram@turtlemint.com", "Vikram@789", "Acquisition");

        this.#users.push(emp1);
        this.#users.push(emp2);
        this.#users.push(emp3);
        this.#users.push(emp4);

        // link employees to their managers
        mgr1.addEmployee({ id: emp1.getUserId(), name: emp1.getName() });
        mgr1.addEmployee({ id: emp2.getUserId(), name: emp2.getName() });
        mgr2.addEmployee({ id: emp3.getUserId(), name: emp3.getName() });
        mgr2.addEmployee({ id: emp4.getUserId(), name: emp4.getName() });
    }

    // checks email/password and returns user data if valid
    login(email, password) {
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i].getEmail() === email && this.#users[i].getPassword() === password) {
                const user = this.#users[i];
                const role = user.getRole();

                return {
                    success: true,
                    user: {
                        id: user.getUserId(),
                        name: user.getName(),
                        email: user.getEmail(),
                        type: role,
                        department: user.getDept ? user.getDept() : null,
                        emps: user.getEmps ? user.getEmps() : null
                    }
                };
            }
        }
        return { success: false, message: "Invalid email or password" };
    }

    getUserByID(id) {
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i].getUserId() === id) {
                return this.#users[i];
            }
        }
        return null;
    }

    // looks up a user's name by their ID - used for display in notifications
    getUserName(userId) {
        const user = this.getUserByID(userId);
        if (user) {
            return user.getName();
        }
        return null;
    }

    // finds which manager an employee reports to
    getManagerForEmployee(employeeId) {
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i] instanceof Manager) {
                const emps = this.#users[i].getEmps();
                for (let j = 0; j < emps.length; j++) {
                    if (emps[j].id === employeeId) {
                        return this.#users[i];
                    }
                }
            }
        }
        return null;
    }

    // returns fresh employee list for a manager (not stale session data)
    getEmployeesForManager(managerId) {
        const manager = this.getUserByID(managerId);
        if (manager instanceof Manager) {
            return manager.getEmps();
        }
        return [];
    }

    // returns all managers so IT can populate the dropdown when adding a user
    getManagers() {
        const managers = [];
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i] instanceof Manager) {
                managers.push({
                    id: this.#users[i].getUserId(),
                    name: this.#users[i].getName(),
                    dept: this.#users[i].getDept()
                });
            }
        }
        return managers;
    }

    // IT can add new users to the system
    addUser(name, email, password, role, dept, phone, managerId) {
        // check for duplicate email
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i].getEmail() === email) {
                return { success: false, message: "A user with this email already exists" };
            }
        }

        const id = this.#nextId('users');
        let newUser;

        if (role === "Manager") {
            newUser = new Manager(id, name, email, password, dept, phone || null);
        } else {
            // Employee, HR, and IT all use Employee class with role parameter
            newUser = new Employee(id, name, email, password, dept, phone || null, role);
        }

        this.#users.push(newUser);

        // link to manager if one was selected (not for Manager role)
        if (managerId && role !== "Manager") {
            const manager = this.getUserByID(managerId);
            if (manager instanceof Manager) {
                manager.addEmployee({ id: newUser.getUserId(), name: newUser.getName() });
            }
        }

        this.saveToStorage();
        return { success: true, userId: id };
    }

    // used when logging meetings - you enter client email and it finds the client
    getClientByEmail(email) {
        for (let i = 0; i < this.#clients.length; i++) {
            if (this.#clients[i].getEmail() === email) {
                return this.#clients[i];
            }
        }
        return null;
    }

    getClientById(clientId) {
        for (let i = 0; i < this.#clients.length; i++) {
            if (this.#clients[i].getClientId() === clientId) {
                return this.#clients[i];
            }
        }
        return null;
    }

    // logs attendance and checks if the employee is late
    // if late too many times in a month, they get flagged
    logAttendance(userId, lateReason) {
        const now = new Date();
        const date = now.toDateString();
        const time = now.toLocaleTimeString();

        const att = new Attendance(userId, now.toString(), date, time, lateReason);
        this.#attendances.push(att);

        const user = this.getUserByID(userId);
        if (user instanceof Employee) {
            user.addAttendance(att);
        }

        // if they came in after 9am or gave a late reason, count it
        const hour = now.getHours();
        if (hour >= 9 || lateReason) {
            if (user instanceof Employee) {
                user.incrementLateCount();
            }

            // let the manager know someone was late
            const manager = this.getManagerForEmployee(userId);
            if (manager) {
                const notifId = this.#nextId('notifications');
                const notif = new Notification(
                    notifId,
                    "Employee " + user.getName() + " was late. Reason: " + (lateReason || "None provided"),
                    userId,
                    manager.getDept()
                );
                this.#notifications.push(notif);
            }

            // flag if they've been late more than 3 times this month
            let lateCount = 0;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            for (let i = 0; i < this.#attendances.length; i++) {
                if (this.#attendances[i].getUserID() === userId) {
                    const attDate = new Date(this.#attendances[i].getDateTime());
                    if (attDate >= thirtyDaysAgo && this.#attendances[i].getLateReason()) {
                        lateCount++;
                    }
                }
            }

            if (lateCount > 3) {
                if (!this.#flaggedEmployees.includes(userId)) {
                    this.#flaggedEmployees.push(userId);
                }

                if (manager) {
                    const flagNotifId = this.#nextId('notifications');
                    const flagNotif = new Notification(
                        flagNotifId,
                        "Employee " + user.getName() + " has been flagged for >3 late entries in a month",
                        0,
                        manager.getDept()
                    );
                    this.#notifications.push(flagNotif);
                }
            }
        }

        this.saveToStorage();
        return { success: true };
    }

    // creates a new leave request and notifies the manager
    requestLeave(userId, type, reason) {
        const id = this.#nextId('leaveRequests');
        const req = new LeaveRequest(id, userId, type, reason);
        this.#leaveRequests.push(req);

        // track sick days on the employee object
        if (type === "Sick") {
            const user = this.getUserByID(userId);
            if (user instanceof Employee) {
                user.incrementSickDays();
            }
        }

        // send notification to the manager's department
        const user = this.getUserByID(userId);
        if (user instanceof Employee) {
            const manager = this.getManagerForEmployee(userId);
            if (manager) {
                const notifId = this.#nextId('notifications');
                const notif = new Notification(
                    notifId,
                    "Leave request from " + user.getName() + " - " + type + " - " + reason,
                    userId,
                    manager.getDept()
                );
                this.#notifications.push(notif);
            }
        }
        this.saveToStorage();

        return { success: true };
    }

    openTicket(userId, description) {
        const id = this.#nextId('tickets');
        const ticket = new Ticket(id, userId, description);
        this.#tickets.push(ticket);
        this.saveToStorage();

        return { success: true };
    }

    submitReport(reporterUserId, targetUserId, type, description) {
        const id = this.#nextId('reports');
        const report = new Report(id, targetUserId, reporterUserId, type, description);
        this.#reports.push(report);
        this.saveToStorage();

        return { success: true };
    }

    // registers a new client - checks for duplicate emails
    addClient(name, email) {
        if (email) {
            const existing = this.getClientByEmail(email);
            if (existing) {
                return { success: false, message: "Client with this email already exists" };
            }
        }
        const id = this.#nextId('clients');
        const client = new Client(id, name, email);
        this.#clients.push(client);
        this.saveToStorage();

        return { success: true, clientId: id };
    }

    // updates an existing client's name and email
    updateClient(clientId, name, email) {
        const client = this.getClientById(clientId);
        if (!client) {
            return { success: false, message: "Client not found" };
        }

        // make sure the new email isn't taken by someone else
        if (email) {
            const existing = this.getClientByEmail(email);
            if (existing && existing.getClientId() !== clientId) {
                return { success: false, message: "Another client already uses this email" };
            }
        }

        client.setName(name);
        client.setEmail(email || null);
        this.saveToStorage();
        return { success: true };
    }

    startBreak(userId, breakType) {
        const now = new Date();
        const date = now.toDateString();
        const time = now.toLocaleTimeString();

        const brk = new Break(userId, now.toString(), date, time, breakType);
        this.#breaks.push(brk);

        const user = this.getUserByID(userId);
        if (user instanceof Employee) {
            user.addBreak(brk);
        }

        return { success: true, breakIndex: this.#breaks.length - 1 };
    }

    // finds their most recent open break and closes it
    endBreak(userId) {
        const now = new Date();
        const time = now.toLocaleTimeString();

        for (let i = this.#breaks.length - 1; i >= 0; i--) {
            if (this.#breaks[i].getUserID() === userId && !this.#breaks[i].getTimeEnd()) {
                this.#breaks[i].setTimeEnd(time);
                return { success: true };
            }
        }

        return { success: false, message: "No active break found" };
    }

    // logs a meeting with a client - looks up client by email first
    // if it's outside office (has pincode), notifies the manager
    logMeeting(employeeId, clientEmail, dateTime, pincode, travelTime) {
        const client = this.getClientByEmail(clientEmail);
        if (!client) {
            return { success: false, message: "Client not found. Register the client first." };
        }

        const id = this.#nextId('meetings');
        const meeting = new Meeting(id, employeeId, client.getClientId(), dateTime, pincode, travelTime);
        this.#meetings.push(meeting);

        if (pincode) {
            const user = this.getUserByID(employeeId);
            if (user instanceof Employee) {
                const manager = this.getManagerForEmployee(employeeId);
                if (manager) {
                    const notifId = this.#nextId('notifications');
                    const notif = new Notification(
                        notifId,
                        "Employee " + user.getName() + " has an out-of-office meeting at pincode " + pincode,
                        employeeId,
                        manager.getDept()
                    );
                    this.#notifications.push(notif);
                }
            }
        }

        this.saveToStorage();
        return { success: true };
    }

    // pulls together all records for a user into one timeline
    getUserHistory(userId) {
        const history = [];

        for (let i = 0; i < this.#leaveRequests.length; i++) {
            if (this.#leaveRequests[i].getEmployeeId() === userId) {
                history.push({
                    type: "Leave Request",
                    data: this.#leaveRequests[i],
                    dateTime: this.#leaveRequests[i].getDate()
                });
            }
        }

        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getFlaggerId() === userId) {
                history.push({
                    type: "Ticket",
                    data: this.#tickets[i],
                    dateTime: new Date().toISOString()
                });
            }
        }

        for (let i = 0; i < this.#reports.length; i++) {
            if (this.#reports[i].getReporterUserId() === userId) {
                history.push({
                    type: "Report",
                    data: this.#reports[i],
                    dateTime: new Date().toISOString()
                });
            }
        }

        for (let i = 0; i < this.#meetings.length; i++) {
            if (this.#meetings[i].getEmployeeId() === userId) {
                history.push({
                    type: "Meeting",
                    data: this.#meetings[i],
                    dateTime: this.#meetings[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#breaks.length; i++) {
            if (this.#breaks[i].getUserID() === userId) {
                history.push({
                    type: "Break",
                    data: this.#breaks[i],
                    dateTime: this.#breaks[i].getDateTime()
                });
            }
        }

        for (let i = 0; i < this.#attendances.length; i++) {
            if (this.#attendances[i].getUserID() === userId) {
                history.push({
                    type: "Attendance",
                    data: this.#attendances[i],
                    dateTime: this.#attendances[i].getDateTime()
                });
            }
        }

        // newest stuff first
        history.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });

        return history;
    }

    // each role only sees notifications meant for them
    // CEO sees everything, HR/IT see their dept + "All", others see only their dept
    getNotifications(userId) {
        const user = this.getUserByID(userId);
        const userDept = user && user.getDept ? user.getDept() : null;
        const userRole = user ? user.getRole() : null;
        const notifs = [];

        for (let i = 0; i < this.#notifications.length; i++) {
            const recipDept = this.#notifications[i].getRecipientDept();

            if (userRole === "CEO") {
                notifs.push(this.#notifications[i]);
            }
            else if (userRole === "HR" && (recipDept === "HR" || recipDept === "All")) {
                notifs.push(this.#notifications[i]);
            }
            else if (userRole === "IT" && (recipDept === "IT" || recipDept === "All")) {
                notifs.push(this.#notifications[i]);
            }
            else if (userRole === "Manager" && recipDept === userDept) {
                notifs.push(this.#notifications[i]);
            }
            else if (userRole === "Employee" && recipDept === userDept) {
                notifs.push(this.#notifications[i]);
            }
        }

        return notifs;
    }

    getFlaggedEmployees() {
        return this.#flaggedEmployees;
    }

    // these three use the shared helper to filter by manager's employees
    getRequestsForManager(managerId) {
        return this.#getRecordsForManager(managerId, this.#leaveRequests, r => r.getEmployeeId());
    }

    updateRequestStatus(requestId, status) {
        for (let i = 0; i < this.#leaveRequests.length; i++) {
            if (this.#leaveRequests[i].getRequestId() === requestId) {
                this.#leaveRequests[i].setStatus(status);
                this.saveToStorage();
                return { success: true };
            }
        }
        return { success: false };
    }

    getTicketsForManager(managerId) {
        return this.#getRecordsForManager(managerId, this.#tickets, t => t.getFlaggerId());
    }

    // only CEO, HR, IT, and managers can send notifications
    // managers are restricted to their own department
    sendNotification(senderId, message, recipientDept) {
        const sender = this.getUserByID(senderId);
        const senderRole = sender ? sender.getRole() : null;

        if (senderRole !== "CEO" && senderRole !== "HR" && senderRole !== "IT" && senderRole !== "Manager") {
            return { success: false, message: "Unauthorized to send notifications" };
        }

        if (senderRole === "Manager" && recipientDept !== sender.getDept()) {
            return { success: false, message: "Managers can only notify their own department" };
        }

        const id = this.#nextId('notifications');
        const notif = new Notification(id, message, senderId, recipientDept);
        this.#notifications.push(notif);
        this.saveToStorage();

        return { success: true };
    }

    getAllReports() {
        return this.#reports;
    }

    getAllTickets() {
        return this.#tickets;
    }

    getPendingTickets() {
        const pending = [];
        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getStatus() === "Pending") {
                pending.push(this.#tickets[i]);
            }
        }
        return pending;
    }

    // IT team sets an estimated time for when they'll fix the ticket
    setTicketETA(ticketId, eta) {
        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getTicketId() === ticketId) {
                this.#tickets[i].setEta(eta);

                // let the person who raised the ticket know
                const flaggerId = this.#tickets[i].getFlaggerId();
                const user = this.getUserByID(flaggerId);
                if (user && user.getDept) {
                    const notifId = this.#nextId('notifications');
                    const notif = new Notification(
                        notifId,
                        "Your IT ticket #" + ticketId + " ETA: " + eta,
                        0,
                        user.getDept()
                    );
                    this.#notifications.push(notif);
                }

                this.saveToStorage();
                return { success: true };
            }
        }
        return { success: false };
    }

    resolveTicket(ticketId) {
        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getTicketId() === ticketId) {
                this.#tickets[i].setStatus("Resolved");

                const flaggerId = this.#tickets[i].getFlaggerId();
                const user = this.getUserByID(flaggerId);
                if (user && user.getDept) {
                    const notifId = this.#nextId('notifications');
                    const notif = new Notification(
                        notifId,
                        "Your IT ticket #" + ticketId + " has been resolved",
                        0,
                        user.getDept()
                    );
                    this.#notifications.push(notif);
                }

                this.saveToStorage();
                return { success: true };
            }
        }
        return { success: false };
    }

    // employee can re-flag a ticket if the issue wasn't actually fixed
    flagTicket(ticketId) {
        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getTicketId() === ticketId) {
                this.#tickets[i].setStatus("Flagged");
                this.saveToStorage();
                return { success: true };
            }
        }
        return { success: false };
    }

    // gives the CEO a high-level overview of the whole company
    getCEOStats() {
        const today = new Date().toDateString();
        const stats = {
            totalEmployees: 0,
            flaggedEmployees: this.#flaggedEmployees.length,
            lateToday: 0,
            onBreak: 0,
            unexcusedAbsences: 0,
            totalMeetings: this.#meetings.length,
            pendingRequests: 0,
            pendingTickets: 0,
            totalClients: this.#clients.length,
            avgBreakTimesByDept: {}
        };

        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i] instanceof Employee) {
                stats.totalEmployees++;
            }
        }

        for (let i = 0; i < this.#attendances.length; i++) {
            if (this.#attendances[i].getDate() === today && this.#attendances[i].getLateReason()) {
                stats.lateToday++;
            }
        }

        // count late entries that don't have an approved leave on the same date
        for (let i = 0; i < this.#attendances.length; i++) {
            if (this.#attendances[i].getLateReason()) {
                const attUserId = this.#attendances[i].getUserID();
                const attDate = this.#attendances[i].getDate();

                let hasApprovedLeave = false;
                for (let j = 0; j < this.#leaveRequests.length; j++) {
                    if (this.#leaveRequests[j].getEmployeeId() === attUserId &&
                        this.#leaveRequests[j].getDate() === attDate &&
                        this.#leaveRequests[j].getStatus() === "Approved") {
                        hasApprovedLeave = true;
                        break;
                    }
                }

                if (!hasApprovedLeave) {
                    stats.unexcusedAbsences++;
                }
            }
        }

        for (let i = 0; i < this.#breaks.length; i++) {
            if (this.#breaks[i].getDate() === today && !this.#breaks[i].getTimeEnd()) {
                stats.onBreak++;
            }
        }

        // calculate how long breaks are on average for each department
        const deptBreakTotals = {};
        const deptBreakCounts = {};

        for (let i = 0; i < this.#breaks.length; i++) {
            const brk = this.#breaks[i];
            if (brk.getTimeEnd()) {
                const userId = brk.getUserID();
                const user = this.getUserByID(userId);
                if (user && user.getDept) {
                    const dept = user.getDept();
                    const start = new Date("1970-01-01 " + brk.getTimeStart());
                    const end = new Date("1970-01-01 " + brk.getTimeEnd());
                    const durationMins = (end - start) / 60000;

                    if (durationMins > 0) {
                        if (!deptBreakTotals[dept]) {
                            deptBreakTotals[dept] = 0;
                            deptBreakCounts[dept] = 0;
                        }
                        deptBreakTotals[dept] += durationMins;
                        deptBreakCounts[dept]++;
                    }
                }
            }
        }

        for (let dept in deptBreakTotals) {
            stats.avgBreakTimesByDept[dept] = Math.round(deptBreakTotals[dept] / deptBreakCounts[dept]);
        }

        for (let i = 0; i < this.#leaveRequests.length; i++) {
            if (this.#leaveRequests[i].getStatus() === "Pending") {
                stats.pendingRequests++;
            }
        }

        for (let i = 0; i < this.#tickets.length; i++) {
            if (this.#tickets[i].getStatus() === "Pending") {
                stats.pendingTickets++;
            }
        }

        return stats;
    }

    // manager flags an employee and HR gets notified
    flagEmployeeForReporting(managerId, employeeId, reason) {
        const notifId = this.#nextId('notifications');
        const notif = new Notification(
            notifId,
            "Employee #" + employeeId + " flagged for inaccurate reporting: " + reason,
            managerId,
            "HR"
        );
        this.#notifications.push(notif);
        this.saveToStorage();

        return { success: true };
    }

    // manager schedules a meeting with one of their employees
    bookManagerMeeting(managerId, employeeId, meetingDateTime, purpose, location) {
        const now = new Date();
        const meeting = new ManagerMeeting(managerId, now.toString(), employeeId, meetingDateTime, purpose, location);
        this.#managerMeetings.push(meeting);

        const employee = this.getUserByID(employeeId);
        if (employee && employee.getDept) {
            const notifId = this.#nextId('notifications');
            const notif = new Notification(
                notifId,
                "Meeting scheduled: " + purpose + " on " + meetingDateTime,
                managerId,
                employee.getDept()
            );
            this.#notifications.push(notif);
        }
        this.saveToStorage();

        return { success: true };
    }

    // returns all the info a manager needs to see about an employee
    getEmployeeInfo(employeeId) {
        const user = this.getUserByID(employeeId);
        if (user instanceof Employee) {
            return {
                id: user.getUserId(),
                name: user.getName(),
                email: user.getEmail(),
                phone: user.getPhone(),
                department: user.getDept(),
                lateCount: user.getLateCount(),
                sickDays: user.getSickDays(),
                personalDaysRemaining: user.getPersonalDaysRemaining()
            };
        }
        return null;
    }

    getMeetingsForManager(managerId) {
        return this.#getRecordsForManager(managerId, this.#meetings, m => m.getEmployeeId());
    }

    // all clients are shared across the company
    getClientsForManager(managerId) {
        return this.#clients;
    }

    // employee requests a meeting with HR - sends them a notification
    requestHRMeeting(userId, purpose) {
        const now = new Date();
        const request = new HRMeetingRequest(userId, now.toString(), purpose);
        this.#hrMeetingRequests.push(request);

        const user = this.getUserByID(userId);
        const notifId = this.#nextId('notifications');
        const notif = new Notification(
            notifId,
            "HR Meeting Request from " + user.getName() + ": " + purpose,
            userId,
            "HR"
        );
        this.#notifications.push(notif);
        this.saveToStorage();

        return { success: true };
    }

    getHRMeetingRequests() {
        return this.#hrMeetingRequests;
    }

    getLeaveDays(userId) {
        const user = this.getUserByID(userId);
        if (user instanceof Employee) {
            return {
                sickDays: user.getSickDays(),
                personalDays: user.getPersonalDaysRemaining()
            };
        }
        return { sickDays: 0, personalDays: 0 };
    }

    // looks at the last 30 days and finds patterns like overtime or excessive sick leave
    getHRTrends() {
        const trends = {
            overtimeEmployees: [],
            excessiveSickLeave: [],
            totalLateEntries: 0,
            totalLeaveRequests: 0
        };

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // find employees who stayed past 6pm on 10+ days
        const exitTimes = {};
        for (let i = 0; i < this.#attendances.length; i++) {
            const att = this.#attendances[i];
            const attDate = new Date(att.getDateTime());
            if (attDate >= thirtyDaysAgo) {
                const userID = att.getUserID();
                if (!exitTimes[userID]) {
                    exitTimes[userID] = 0;
                }
                if (att.getTimeExit()) {
                    const exitHour = parseInt(att.getTimeExit().split(':')[0]);
                    if (exitHour >= 18) {
                        exitTimes[userID]++;
                    }
                }
            }
        }

        for (let userID in exitTimes) {
            if (exitTimes[userID] >= 10) {
                trends.overtimeEmployees.push(userID);
            }
        }

        // employees with 5 or more sick days
        for (let i = 0; i < this.#users.length; i++) {
            if (this.#users[i] instanceof Employee && this.#users[i].getSickDays() >= 5) {
                trends.excessiveSickLeave.push(this.#users[i].getUserId());
            }
        }

        for (let i = 0; i < this.#attendances.length; i++) {
            const attDate = new Date(this.#attendances[i].getDateTime());
            if (attDate >= thirtyDaysAgo && this.#attendances[i].getLateReason()) {
                trends.totalLateEntries++;
            }
        }

        for (let i = 0; i < this.#leaveRequests.length; i++) {
            const reqDate = new Date(this.#leaveRequests[i].getDate());
            if (reqDate >= thirtyDaysAgo) {
                trends.totalLeaveRequests++;
            }
        }

        return trends;
    }

    // saves everything to localStorage so data persists between sessions
    saveToStorage() {
        try {
            // save dynamically added users (ID > 9, since initUsers creates 1-9)
            const dynamicUsersData = [];
            for (let i = 0; i < this.#users.length; i++) {
                const u = this.#users[i];
                if (u.getUserId() > 9) {
                    const userData = {
                        userId: u.getUserId(),
                        name: u.getName(),
                        email: u.getEmail(),
                        password: u.getPassword(),
                        role: u.getRole(),
                        phone: u.getPhone ? u.getPhone() : null,
                        dept: u.getDept ? u.getDept() : null
                    };
                    // if managed by someone, save the manager ID
                    const mgr = this.getManagerForEmployee(u.getUserId());
                    if (mgr) {
                        userData.managerId = mgr.getUserId();
                    }
                    dynamicUsersData.push(userData);
                }
            }
            localStorage.setItem('dynamicUsers', JSON.stringify(dynamicUsersData));

            const ticketsData = [];
            for (let i = 0; i < this.#tickets.length; i++) {
                ticketsData.push({
                    ticketId: this.#tickets[i].getTicketId(),
                    flaggerId: this.#tickets[i].getFlaggerId(),
                    description: this.#tickets[i].getDescription(),
                    eta: this.#tickets[i].getEta(),
                    status: this.#tickets[i].getStatus()
                });
            }
            localStorage.setItem('tickets', JSON.stringify(ticketsData));

            const requestsData = [];
            for (let i = 0; i < this.#leaveRequests.length; i++) {
                requestsData.push({
                    requestId: this.#leaveRequests[i].getRequestId(),
                    employeeId: this.#leaveRequests[i].getEmployeeId(),
                    date: this.#leaveRequests[i].getDate(),
                    type: this.#leaveRequests[i].getType(),
                    reason: this.#leaveRequests[i].getReason(),
                    status: this.#leaveRequests[i].getStatus()
                });
            }
            localStorage.setItem('leaveRequests', JSON.stringify(requestsData));

            const reportsData = [];
            for (let i = 0; i < this.#reports.length; i++) {
                reportsData.push({
                    reportId: this.#reports[i].getReportId(),
                    targetUserId: this.#reports[i].getTargetUserId(),
                    reporterUserId: this.#reports[i].getReporterUserId(),
                    type: this.#reports[i].getType(),
                    description: this.#reports[i].getDescription()
                });
            }
            localStorage.setItem('reports', JSON.stringify(reportsData));

            const notifsData = [];
            for (let i = 0; i < this.#notifications.length; i++) {
                notifsData.push({
                    notifId: this.#notifications[i].getNotifId(),
                    message: this.#notifications[i].getMessage(),
                    senderId: this.#notifications[i].getSenderId(),
                    recipientDept: this.#notifications[i].getRecipientDept()
                });
            }
            localStorage.setItem('notifications', JSON.stringify(notifsData));

            const clientsData = [];
            for (let i = 0; i < this.#clients.length; i++) {
                clientsData.push({
                    clientId: this.#clients[i].getClientId(),
                    name: this.#clients[i].getName(),
                    email: this.#clients[i].getEmail()
                });
            }
            localStorage.setItem('clients', JSON.stringify(clientsData));

            const meetingsData = [];
            for (let i = 0; i < this.#meetings.length; i++) {
                meetingsData.push({
                    meetingId: this.#meetings[i].getMeetingId(),
                    employeeId: this.#meetings[i].getEmployeeId(),
                    clientId: this.#meetings[i].getClientId(),
                    pincode: this.#meetings[i].getPincode(),
                    travelTime: this.#meetings[i].getTravelTime(),
                    dateTime: this.#meetings[i].getDateTime()
                });
            }
            localStorage.setItem('meetings', JSON.stringify(meetingsData));

            const managerMeetingsData = [];
            for (let i = 0; i < this.#managerMeetings.length; i++) {
                managerMeetingsData.push({
                    userID: this.#managerMeetings[i].getUserID(),
                    dateTime: this.#managerMeetings[i].getDateTime(),
                    employeeID: this.#managerMeetings[i].getEmployeeID(),
                    meetingDateTime: this.#managerMeetings[i].getMeetingDateTime(),
                    purpose: this.#managerMeetings[i].getPurpose(),
                    location: this.#managerMeetings[i].getLocation()
                });
            }
            localStorage.setItem('managerMeetings', JSON.stringify(managerMeetingsData));

            const hrMeetingRequestsData = [];
            for (let i = 0; i < this.#hrMeetingRequests.length; i++) {
                hrMeetingRequestsData.push({
                    userID: this.#hrMeetingRequests[i].getUserID(),
                    dateTime: this.#hrMeetingRequests[i].getDateTime(),
                    purpose: this.#hrMeetingRequests[i].getPurpose(),
                    status: this.#hrMeetingRequests[i].getStatus()
                });
            }
            localStorage.setItem('hrMeetingRequests', JSON.stringify(hrMeetingRequestsData));

            localStorage.setItem('flaggedEmployees', JSON.stringify(this.#flaggedEmployees));
            localStorage.setItem('idCounters', JSON.stringify(this.#idCounters));
        } catch (e) {
            console.error("Error saving data:", e);
        }
    }

    // loads everything back from localStorage when the page refreshes
    loadFromStorage() {
        try {
            // restore ID counters
            const countersData = localStorage.getItem('idCounters');
            if (countersData) {
                const saved = JSON.parse(countersData);
                // restore users counter if dynamic users were added
                if (saved.users && saved.users > 9) {
                    this.#idCounters.users = saved.users;
                }
                this.#idCounters.clients = saved.clients || 0;
                this.#idCounters.meetings = saved.meetings || 0;
                this.#idCounters.leaveRequests = saved.leaveRequests || 0;
                this.#idCounters.tickets = saved.tickets || 0;
                this.#idCounters.notifications = saved.notifications || 0;
                this.#idCounters.reports = saved.reports || 0;
            }

            // restore dynamically added users
            const dynamicUsersData = localStorage.getItem('dynamicUsers');
            if (dynamicUsersData) {
                const users = JSON.parse(dynamicUsersData);

                // first pass: create all dynamic users
                for (let i = 0; i < users.length; i++) {
                    const u = users[i];
                    let newUser;

                    if (u.role === "Manager") {
                        newUser = new Manager(u.userId, u.name, u.email, u.password, u.dept, u.phone || null);
                    } else {
                        newUser = new Employee(u.userId, u.name, u.email, u.password, u.dept, u.phone || null, u.role);
                    }

                    this.#users.push(newUser);
                }

                // second pass: link employees to their managers
                for (let i = 0; i < users.length; i++) {
                    const u = users[i];
                    if (u.managerId && u.role !== "Manager") {
                        const manager = this.getUserByID(u.managerId);
                        if (manager instanceof Manager) {
                            manager.addEmployee({ id: u.userId, name: u.name });
                        }
                    }
                }
            }

            const ticketsData = localStorage.getItem('tickets');
            if (ticketsData) {
                const tickets = JSON.parse(ticketsData);
                for (let i = 0; i < tickets.length; i++) {
                    const t = tickets[i];
                    const ticket = new Ticket(t.ticketId, t.flaggerId, t.description);
                    if (t.eta) ticket.setEta(t.eta);
                    if (t.status) ticket.setStatus(t.status);
                    this.#tickets.push(ticket);
                }
            }

            const leaveRequestsData = localStorage.getItem('leaveRequests');
            if (leaveRequestsData) {
                const requests = JSON.parse(leaveRequestsData);
                for (let i = 0; i < requests.length; i++) {
                    const r = requests[i];
                    const req = new LeaveRequest(r.requestId, r.employeeId, r.type, r.reason);
                    if (r.date) req.setDate(r.date);
                    if (r.status) req.setStatus(r.status);
                    this.#leaveRequests.push(req);
                }
            }

            const reportsData = localStorage.getItem('reports');
            if (reportsData) {
                const reports = JSON.parse(reportsData);
                for (let i = 0; i < reports.length; i++) {
                    const r = reports[i];
                    const report = new Report(r.reportId, r.targetUserId, r.reporterUserId, r.type, r.description);
                    this.#reports.push(report);
                }
            }

            const notifsData = localStorage.getItem('notifications');
            if (notifsData) {
                const notifs = JSON.parse(notifsData);
                for (let i = 0; i < notifs.length; i++) {
                    const n = notifs[i];
                    const notif = new Notification(n.notifId, n.message, n.senderId, n.recipientDept);
                    this.#notifications.push(notif);
                }
            }

            const clientsData = localStorage.getItem('clients');
            if (clientsData) {
                const clients = JSON.parse(clientsData);
                for (let i = 0; i < clients.length; i++) {
                    const c = clients[i];
                    const client = new Client(c.clientId, c.name, c.email);
                    this.#clients.push(client);
                }
            }

            const meetingsData = localStorage.getItem('meetings');
            if (meetingsData) {
                const meetings = JSON.parse(meetingsData);
                for (let i = 0; i < meetings.length; i++) {
                    const m = meetings[i];
                    const meeting = new Meeting(m.meetingId, m.employeeId, m.clientId, m.dateTime, m.pincode, m.travelTime);
                    this.#meetings.push(meeting);
                }
            }

            const managerMeetingsData = localStorage.getItem('managerMeetings');
            if (managerMeetingsData) {
                const meetings = JSON.parse(managerMeetingsData);
                for (let i = 0; i < meetings.length; i++) {
                    const m = meetings[i];
                    const meeting = new ManagerMeeting(m.userID, m.dateTime, m.employeeID, m.meetingDateTime, m.purpose, m.location);
                    this.#managerMeetings.push(meeting);
                }
            }

            const hrMeetingRequestsData = localStorage.getItem('hrMeetingRequests');
            if (hrMeetingRequestsData) {
                const requests = JSON.parse(hrMeetingRequestsData);
                for (let i = 0; i < requests.length; i++) {
                    const r = requests[i];
                    const request = new HRMeetingRequest(r.userID, r.dateTime, r.purpose);
                    if (r.status) request.setStatus(r.status);
                    this.#hrMeetingRequests.push(request);
                }
            }

            const flaggedData = localStorage.getItem('flaggedEmployees');
            if (flaggedData) {
                this.#flaggedEmployees = JSON.parse(flaggedData);
            }
        } catch (e) {
            console.error("Error loading data:", e);
        }
    }
}

// start the app and load any saved data
const app = new Application();
app.loadFromStorage();
