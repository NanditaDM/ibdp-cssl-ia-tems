// dashboard logic
let currentUser = null;
let currentPage = 1;
const itemsPerPage = 10;

// init dashboard
window.onload = function () {
    // get current user from session
    const userJSON = sessionStorage.getItem('currentUser');
    if (!userJSON) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userJSON);

    // show user info
    document.getElementById('userInfo').textContent = currentUser.name + " (" + currentUser.type + ")";

    // show nav based on user type
    showNavigation();

    // show meeting location fields toggle
    const meetingLoc = document.getElementById('meetingLocation');
    if (meetingLoc) {
        meetingLoc.addEventListener('change', function () {
            if (this.value === "Out of Office") {
                document.getElementById('outOfOfficeFields').classList.remove('hidden');
            } else {
                document.getElementById('outOfOfficeFields').classList.add('hidden');
            }
        });
    }
};

// logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// show nav based on user type
function showNavigation() {
    const nav = document.getElementById('navigation');
    let buttons = "";

    if (currentUser.type === "Employee" || currentUser.type === "Manager") {
        buttons += '<button onclick="showSection(\'logAttendance\')">Log Attendance</button>';
        buttons += '<button onclick="showSection(\'requestLeave\')">Request Leave</button>';
        buttons += '<button onclick="showSection(\'openTicket\')">Open IT Ticket</button>';
        buttons += '<button onclick="showSection(\'reportHR\')">Report to HR</button>';
        buttons += '<button onclick="showSection(\'logBreak\')">Log Break</button>';
        buttons += '<button onclick="showSection(\'viewHistory\')">View History</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';

        // sales dept only
        if (currentUser.department === "Sales" || currentUser.department === "Acquisition") {
            buttons += '<button onclick="showSection(\'logClient\')">Log Client</button>';
            buttons += '<button onclick="showSection(\'logMeeting\')">Log Meeting</button>';
        }
    }

    if (currentUser.type === "Manager") {
        buttons += '<button onclick="showSection(\'viewFlagged\')">View Flagged</button>';
        buttons += '<button onclick="showSection(\'viewRequests\')">View Requests</button>';
        buttons += '<button onclick="showSection(\'viewTickets\')">View Tickets</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
    }

    if (currentUser.type === "HR") {
        buttons += '<button onclick="showSection(\'viewReports\')">View Reports</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';
    }

    if (currentUser.type === "IT") {
        buttons += '<button onclick="showSection(\'itTickets\')">View Tickets</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';
    }

    if (currentUser.type === "CEO") {
        buttons += '<button onclick="showSection(\'ceoStats\')">View Stats</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';
    }

    nav.innerHTML = buttons;
}

// show section
function showSection(sectionID) {
    // hide all sections
    const sections = document.querySelectorAll('.section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add('hidden');
    }

    // show selected
    document.getElementById(sectionID).classList.remove('hidden');

    // load data for specific sections
    if (sectionID === 'viewHistory') {
        loadHistory();
    } else if (sectionID === 'viewNotifications') {
        loadNotifications();
    } else if (sectionID === 'viewFlagged') {
        loadFlagged();
    } else if (sectionID === 'viewRequests') {
        loadRequests();
    } else if (sectionID === 'viewTickets' && currentUser.type === "Manager") {
        loadManagerTickets();
    } else if (sectionID === 'viewReports') {
        loadReports();
    } else if (sectionID === 'itTickets') {
        loadITTickets();
    } else if (sectionID === 'ceoStats') {
        loadCEOStats();
    }
}

// submit attendance
function submitAttendance() {
    const lateReason = document.getElementById('lateReason').value;

    const result = app.logAttendance(currentUser.id, lateReason);

    if (result.success) {
        document.getElementById('attendanceMsg').textContent = "Attendance logged successfully";
        document.getElementById('lateReason').value = "";
    } else {
        document.getElementById('attendanceMsg').textContent = "Error logging attendance";
    }
}

// submit leave request
function submitLeaveRequest() {
    const reason = document.getElementById('leaveReason').value;
    const type = document.getElementById('leaveType').value;
    const duration = document.getElementById('leaveDuration').value;
    const context = document.getElementById('leaveContext').value;

    const result = app.requestLeave(currentUser.id, reason, type, duration, context);

    if (result.success) {
        document.getElementById('leaveMsg').textContent = "Leave request submitted";
        document.getElementById('leaveContext').value = "";
    } else {
        document.getElementById('leaveMsg').textContent = "Error submitting request";
    }
}

// submit ticket
function submitTicket() {
    const type = document.getElementById('ticketType').value;
    const location = document.getElementById('ticketLocation').value;
    const info = document.getElementById('ticketInfo').value;

    const result = app.openTicket(currentUser.id, type, info, location);

    if (result.success) {
        document.getElementById('ticketMsg').textContent = "Ticket submitted";
        document.getElementById('ticketLocation').value = "";
        document.getElementById('ticketInfo').value = "";
    } else {
        document.getElementById('ticketMsg').textContent = "Error submitting ticket";
    }
}

// submit report
function submitReport() {
    const offenderID = document.getElementById('offenderID').value;
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value;
    const victimType = document.getElementById('victimType').value;

    const result = app.submitReport(currentUser.id, reason, details, offenderID, victimType);

    if (result.success) {
        document.getElementById('reportMsg').textContent = "Report submitted";
        document.getElementById('offenderID').value = "";
        document.getElementById('reportDetails').value = "";
    } else {
        document.getElementById('reportMsg').textContent = "Error submitting report";
    }
}

// submit client acquisition
function submitClientAcquisition() {
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const language = document.getElementById('clientLanguage').value;
    const pin = document.getElementById('clientPin').value;

    const result = app.logClientAcquisition(currentUser.id, name, email, language, pin);

    if (result.success) {
        document.getElementById('clientMsg').textContent = "Client logged successfully";
        document.getElementById('clientName').value = "";
        document.getElementById('clientEmail').value = "";
        document.getElementById('clientLanguage').value = "";
        document.getElementById('clientPin').value = "";
    } else {
        document.getElementById('clientMsg').textContent = "Error logging client";
    }
}

// start break
function startBreak() {
    const breakType = document.getElementById('breakType').value;

    const result = app.startBreak(currentUser.id, breakType);

    if (result.success) {
        document.getElementById('breakMsg').textContent = "Break started";
    } else {
        document.getElementById('breakMsg').textContent = "Error starting break";
    }
}

// end break
function endBreak() {
    const result = app.endBreak(currentUser.id);

    if (result.success) {
        document.getElementById('breakMsg').textContent = "Break ended";
    } else {
        document.getElementById('breakMsg').textContent = result.message || "Error ending break";
    }
}

// submit meeting
function submitMeeting() {
    const client = document.getElementById('meetingClient').value;
    const duration = document.getElementById('meetingDuration').value;
    const startTime = document.getElementById('meetingStart').value;
    const location = document.getElementById('meetingLocation').value;

    let pinCode = null;
    let travelTime = null;

    if (location === "Out of Office") {
        pinCode = document.getElementById('meetingZip').value;
        travelTime = document.getElementById('travelTime').value;

        // validate zip
        if (pinCode.length !== 6 || isNaN(pinCode)) {
            document.getElementById('meetingMsg').textContent = "Invalid zip code (must be 6 digits)";
            return;
        }
    }

    const result = app.logMeeting(currentUser.id, client, startTime, duration, location, pinCode, travelTime);

    if (result.success) {
        document.getElementById('meetingMsg').textContent = "Meeting logged successfully";
        document.getElementById('meetingClient').value = "";
        document.getElementById('meetingDuration').value = "";
        document.getElementById('meetingStart').value = "";
        if (location === "Out of Office") {
            document.getElementById('meetingZip').value = "";
            document.getElementById('travelTime').value = "";
        }
    } else {
        document.getElementById('meetingMsg').textContent = "Error logging meeting";
    }
}

// load history
function loadHistory() {
    const history = app.getUserHistory(currentUser.id);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = history.slice(start, end);

    let html = "<table><tr><th>Type</th><th>Details</th><th>Date/Time</th><th>Action</th></tr>";

    // get full history to find indices
    const fullHistory = app.getUserHistory(currentUser.id);

    for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        let details = "";
        let action = "";

        if (item.type === "Request") {
            details = item.data.getType() + " - " + item.data.getReason() + " - " + item.data.getStatus();
        } else if (item.type === "Ticket") {
            details = item.data.getIssueType() + " - " + item.data.getStatus();
            // find ticket index in app tickets
            if (item.data.getStatus() === "Resolved") {
                const allTickets = app.getAllTickets();
                const ticketIndex = allTickets.indexOf(item.data);
                if (ticketIndex >= 0) {
                    action = '<button onclick="flagTicketUnresolved(' + ticketIndex + ')">Mark Unresolved</button>';
                }
            }
        } else if (item.type === "Report") {
            details = item.data.getReportType();
            // show action if action was taken but further action not requested yet
            if (item.data.getActionTaken() && !item.data.getFurtherActionRequested()) {
                const allReports = app.getAllReports();
                const reportIndex = allReports.indexOf(item.data);
                if (reportIndex >= 0) {
                    action = '<button onclick="requestFurtherActionOnReport(' + reportIndex + ')">Request Further Action</button>';
                }
            } else if (item.data.getActionTaken()) {
                details += " - Action: " + item.data.getActionTaken();
            }
        } else if (item.type === "Client") {
            details = item.data.getClientName() + " - " + item.data.getClientEmail();
        } else if (item.type === "Meeting") {
            details = item.data.getClientName() + " - " + item.data.getDuration() + " mins";
        } else if (item.type === "Break") {
            details = item.data.getBreakType() + " - " + item.data.getTimeStart() + " to " + (item.data.getTimeEnd() || "Ongoing");
        } else if (item.type === "Attendance") {
            details = item.data.getTimeEntry() + (item.data.getLateReason() ? " (Late: " + item.data.getLateReason() + ")" : "");
        }

        html += "<tr><td>" + item.type + "</td><td>" + details + "</td><td>" + new Date(item.dateTime).toLocaleString() + "</td><td>" + action + "</td></tr>";
    }

    html += "</table>";

    document.getElementById('historyContent').innerHTML = html;
    document.getElementById('pageNum').textContent = "Page " + currentPage;
}

// prev page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadHistory();
    }
}

// next page
function nextPage() {
    const history = app.getUserHistory(currentUser.id);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadHistory();
    }
}

// load notifications
function loadNotifications() {
    const notifs = app.getNotifications(currentUser.id);

    let html = "<table><tr><th>From</th><th>Subject</th><th>Date/Time</th></tr>";

    for (let i = 0; i < notifs.length; i++) {
        const senderID = notifs[i].getUserID();
        const subject = notifs[i].getSubject();
        const dateTime = notifs[i].getDateTime();

        html += "<tr><td>" + senderID + "</td><td>" + subject + "</td><td>" + new Date(dateTime).toLocaleString() + "</td></tr>";
    }

    html += "</table>";

    document.getElementById('notifContent').innerHTML = html;
}

// load flagged employees (manager)
function loadFlagged() {
    const flagged = app.getFlaggedEmployees();

    let html = "<table><tr><th>Employee ID</th></tr>";

    for (let i = 0; i < flagged.length; i++) {
        html += "<tr><td>" + flagged[i] + "</td></tr>";
    }

    html += "</table>";

    document.getElementById('flaggedContent').innerHTML = html;
}

// load requests (manager)
function loadRequests() {
    const requests = app.getRequestsForManager(currentUser.id);

    let html = "<table><tr><th>Employee</th><th>Type</th><th>Reason</th><th>Duration</th><th>Context</th><th>Status</th><th>Action</th></tr>";

    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        const status = req.getStatus();

        html += "<tr>";
        html += "<td>" + req.getUserID() + "</td>";
        html += "<td>" + req.getType() + "</td>";
        html += "<td>" + req.getReason() + "</td>";
        html += "<td>" + req.getDuration() + "</td>";
        html += "<td>" + req.getContext() + "</td>";
        html += "<td>" + status + "</td>";
        html += "<td>";

        if (status === "Pending") {
            html += '<button onclick="approveRequest(' + i + ')">Approve</button>';
            html += '<button onclick="denyRequest(' + i + ')">Deny</button>';
        }

        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('requestsContent').innerHTML = html;
}

// approve request
function approveRequest(index) {
    app.updateRequestStatus(index, "Approved");
    loadRequests();
}

// deny request
function denyRequest(index) {
    const reason = prompt("Enter reason for denial:");
    if (reason) {
        app.updateRequestStatus(index, "Denied - " + reason);
        loadRequests();
    }
}

// load tickets (manager)
function loadManagerTickets() {
    const tickets = app.getTicketsForManager(currentUser.id);

    let html = "<table><tr><th>Employee</th><th>Issue Type</th><th>Location</th><th>Details</th><th>Status</th></tr>";

    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        html += "<tr>";
        html += "<td>" + ticket.getUserID() + "</td>";
        html += "<td>" + ticket.getIssueType() + "</td>";
        html += "<td>" + ticket.getLocation() + "</td>";
        html += "<td>" + ticket.getInfo() + "</td>";
        html += "<td>" + ticket.getStatus() + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('ticketsContent').innerHTML = html;
}

// send notification
function sendNotif() {
    const recipient = document.getElementById('notifRecipient').value;
    const subject = document.getElementById('notifSubject').value;

    let recipients = [];

    if (recipient === "department" && currentUser.type === "Manager") {
        recipients = currentUser.employees;
    } else {
        recipients = [recipient];
    }

    const result = app.sendNotification(currentUser.id, subject, recipients);

    if (result.success) {
        document.getElementById('notifMsg').textContent = "Notification sent";
        document.getElementById('notifRecipient').value = "";
        document.getElementById('notifSubject').value = "";
    } else {
        document.getElementById('notifMsg').textContent = "Error sending notification";
    }
}

// load reports (HR)
function loadReports() {
    const reports = app.getAllReports();

    let html = "<table><tr><th>Reporter</th><th>Offender</th><th>Type</th><th>Details</th><th>Victim Type</th><th>Action Taken</th><th>Further Action?</th><th>Action</th></tr>";

    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];

        html += "<tr>";
        html += "<td>" + report.getUserID() + "</td>";
        html += "<td>" + report.getOffenderID() + "</td>";
        html += "<td>" + report.getReportType() + "</td>";
        html += "<td>" + report.getDetails() + "</td>";
        html += "<td>" + report.getVictimType() + "</td>";
        html += "<td>" + (report.getActionTaken() || "None") + "</td>";
        html += "<td>" + (report.getFurtherActionRequested() ? "Yes" : "No") + "</td>";
        html += "<td>";

        if (!report.getActionTaken() || report.getFurtherActionRequested()) {
            html += '<button onclick="respondReport(' + i + ')">Respond</button>';
        }

        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('reportsContent').innerHTML = html;
}

// respond to report
function respondReport(index) {
    const action = prompt("Enter action taken:");
    if (action) {
        app.respondToReport(index, action);
        loadReports();
    }
}

// load IT tickets
function loadITTickets() {
    const allTickets = app.getAllTickets();
    const unresolvedTickets = app.getUnresolvedTickets();

    const today = new Date().toDateString();
    let todayTotal = 0;
    let todayResolved = 0;
    let todayUnresolved = 0;

    for (let i = 0; i < allTickets.length; i++) {
        const ticketDate = new Date(allTickets[i].getDateTime()).toDateString();
        if (ticketDate === today) {
            todayTotal++;
            if (allTickets[i].getStatus() === "Resolved") {
                todayResolved++;
            } else {
                todayUnresolved++;
            }
        }
    }

    let html = "<h4>Today's Stats</h4>";
    html += "<p>Total: " + todayTotal + " | Resolved: " + todayResolved + " | Unresolved: " + todayUnresolved + "</p>";

    html += "<h4>Unresolved Tickets</h4>";
    html += "<table><tr><th>Employee</th><th>Issue Type</th><th>Location</th><th>Details</th><th>ETA</th><th>Action</th></tr>";

    for (let i = 0; i < unresolvedTickets.length; i++) {
        const ticket = unresolvedTickets[i];
        const ticketIndex = allTickets.indexOf(ticket);

        html += "<tr>";
        html += "<td>" + ticket.getUserID() + "</td>";
        html += "<td>" + ticket.getIssueType() + "</td>";
        html += "<td>" + ticket.getLocation() + "</td>";
        html += "<td>" + ticket.getInfo() + "</td>";
        html += "<td>" + (ticket.getETA() || "Not set") + "</td>";
        html += "<td>";

        if (!ticket.getETA()) {
            html += '<button onclick="setETA(' + ticketIndex + ')">Set ETA</button>';
        }

        html += '<button onclick="markResolved(' + ticketIndex + ')">Resolve</button>';
        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('itTicketsContent').innerHTML = html;
}

// set ETA
function setETA(index) {
    const eta = prompt("Enter ETA:");
    if (eta) {
        app.setTicketETA(index, currentUser.id, eta);
        loadITTickets();
    }
}

// mark resolved
function markResolved(index) {
    app.resolveTicket(index);
    loadITTickets();
}

// flag ticket unresolved (employee)
function flagTicketUnresolved(index) {
    app.markTicketUnresolved(index);
    loadHistory();
}

// request further action on report (employee)
function requestFurtherActionOnReport(index) {
    app.requestFurtherAction(index);
    alert("Further action request sent to HR");
    loadHistory();
}

// load CEO stats
function loadCEOStats() {
    const stats = app.getCEOStats();

    let html = "<table>";
    html += "<tr><td>Flagged Employees</td><td>" + stats.flaggedEmployees + "</td></tr>";
    html += "<tr><td>Late Employees Today</td><td>" + stats.lateToday + "</td></tr>";
    html += "<tr><td>Employees on Break</td><td>" + stats.onBreak + "</td></tr>";
    html += "<tr><td>Sales Meetings Today</td><td>" + stats.meetingsToday + "</td></tr>";
    html += "<tr><td>Unexcused Absences Today</td><td>" + stats.unexcusedAbsences + "</td></tr>";
    html += "<tr><td>Clients Acquired Today</td><td>" + stats.clientsToday + "</td></tr>";
    html += "<tr><td>Avg Break Time (minutes)</td><td>" + stats.avgBreakTime + "</td></tr>";
    html += "<tr><td>Avg Meeting Time (minutes)</td><td>" + stats.avgMeetingTime + "</td></tr>";
    html += "</table>";

    document.getElementById('statsContent').innerHTML = html;
}