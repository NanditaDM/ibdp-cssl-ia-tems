// handles all the dashboard UI logic
let currentUser = null;
let currentPage = 1;
const itemsPerPage = 10;

// when the page loads, check if someone is logged in
window.onload = function () {
    const userJSON = sessionStorage.getItem('currentUser');
    if (!userJSON) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userJSON);
    document.getElementById('userInfo').textContent = currentUser.name + " (" + currentUser.type + ")";
    showNavigation();
};

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// builds the navigation buttons based on what role the user has
function showNavigation() {
    const nav = document.getElementById('navigation');
    let buttons = "";

    // everyone except CEO gets the basic employee buttons
    if (currentUser.type === "Employee" || currentUser.type === "Manager" || currentUser.type === "HR" || currentUser.type === "IT") {
        buttons += '<button onclick="showSection(\'logAttendance\')">Log Attendance</button>';
        buttons += '<button onclick="showSection(\'requestLeave\')">Request Leave</button>';
        buttons += '<button onclick="showSection(\'openTicket\')">Open IT Ticket</button>';
        buttons += '<button onclick="showSection(\'reportHR\')">Submit Report</button>';
        buttons += '<button onclick="showSection(\'requestHRMeeting\')">Request HR Meeting</button>';
        buttons += '<button onclick="showSection(\'logBreak\')">Log Break</button>';
        buttons += '<button onclick="showSection(\'viewHistory\')">View History</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';
    }

    // only Acquisition team can add clients
    if (currentUser.department === "Acquisition") {
        buttons += '<button onclick="showSection(\'logClient\')">Add Client</button>';
    }

    // only Sales can log meetings with clients
    if (currentUser.department === "Sales") {
        buttons += '<button onclick="showSection(\'logMeeting\')">Log Meeting</button>';
    }

    // Sales can view clients (read-only), Acquisition can add/edit
    if (currentUser.department === "Sales" || currentUser.department === "Acquisition") {
        buttons += '<button onclick="showSection(\'viewClients\')">View Clients</button>';
    }

    // manager-only buttons
    if (currentUser.type === "Manager") {
        buttons += '<button onclick="showSection(\'viewEmployees\')">View Employees</button>';
        buttons += '<button onclick="showSection(\'bookMeeting\')">Book Meeting</button>';
        buttons += '<button onclick="showSection(\'viewEmployeeMeetings\')">View Meeting Logs</button>';
        buttons += '<button onclick="showSection(\'viewFlagged\')">View Flagged</button>';
        buttons += '<button onclick="showSection(\'viewRequests\')">View Requests</button>';
        buttons += '<button onclick="showSection(\'viewTickets\')">View Tickets</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
    }

    // HR gets reports, trends, and meeting requests
    if (currentUser.type === "HR") {
        buttons += '<button onclick="showSection(\'viewReports\')">View Reports</button>';
        buttons += '<button onclick="showSection(\'viewTrends\')">View Trends</button>';
        buttons += '<button onclick="showSection(\'viewHRMeetings\')">View Meeting Requests</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
    }

    // IT gets their ticket dashboard and can add users
    if (currentUser.type === "IT") {
        buttons += '<button onclick="showSection(\'addUser\')">Add User</button>';
        buttons += '<button onclick="showSection(\'itTickets\')">IT Tickets Dashboard</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
    }

    if (currentUser.type === "CEO") {
        buttons += '<button onclick="showSection(\'ceoStats\')">View Stats</button>';
        buttons += '<button onclick="showSection(\'sendNotification\')">Send Notification</button>';
        buttons += '<button onclick="showSection(\'viewNotifications\')">View Notifications</button>';
    }

    nav.innerHTML = buttons;
}

// hides all sections then shows the one that was clicked
function showSection(sectionID) {
    const sections = document.querySelectorAll('.section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add('hidden');
    }

    document.getElementById(sectionID).classList.remove('hidden');

    // some sections need to load data when opened
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
    } else if (sectionID === 'viewEmployees') {
        loadEmployees();
    } else if (sectionID === 'viewEmployeeMeetings') {
        loadEmployeeMeetings();
    } else if (sectionID === 'viewTrends') {
        loadHRTrends();
    } else if (sectionID === 'viewHRMeetings') {
        loadHRMeetingRequests();
    } else if (sectionID === 'requestLeave') {
        loadLeaveDays();
    } else if (sectionID === 'viewClients') {
        loadClients();
    } else if (sectionID === 'sendNotification') {
        loadNotifForm();
    } else if (sectionID === 'addUser') {
        loadAddUserForm();
    }
}

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

function submitLeaveRequest() {
    const type = document.getElementById('leaveType').value;
    const reason = document.getElementById('leaveReason').value;

    if (!reason) {
        document.getElementById('leaveMsg').textContent = "Reason is required";
        return;
    }

    const result = app.requestLeave(currentUser.id, type, reason);

    if (result.success) {
        document.getElementById('leaveMsg').textContent = "Leave request submitted";
        document.getElementById('leaveReason').value = "";
    } else {
        document.getElementById('leaveMsg').textContent = "Error submitting request";
    }
}

function submitTicket() {
    const description = document.getElementById('ticketDescription').value;

    if (!description) {
        document.getElementById('ticketMsg').textContent = "Description is required";
        return;
    }

    const result = app.openTicket(currentUser.id, description);

    if (result.success) {
        document.getElementById('ticketMsg').textContent = "Ticket submitted";
        document.getElementById('ticketDescription').value = "";
    } else {
        document.getElementById('ticketMsg').textContent = "Error submitting ticket";
    }
}

function submitReport() {
    const targetUserId = parseInt(document.getElementById('targetUserId').value);
    const type = document.getElementById('reportType').value;
    const description = document.getElementById('reportDescription').value;

    if (!description) {
        document.getElementById('reportMsg').textContent = "Description is required";
        return;
    }

    const result = app.submitReport(currentUser.id, targetUserId, type, description);

    if (result.success) {
        document.getElementById('reportMsg').textContent = "Report submitted";
        document.getElementById('targetUserId').value = "";
        document.getElementById('reportDescription').value = "";
    } else {
        document.getElementById('reportMsg').textContent = "Error submitting report";
    }
}

function submitClient() {
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;

    if (!name) {
        document.getElementById('clientMsg').textContent = "Client name is required";
        return;
    }

    const result = app.addClient(name, email || null);

    if (result.success) {
        document.getElementById('clientMsg').textContent = "Client added successfully (ID: " + result.clientId + ")";
        document.getElementById('clientName').value = "";
        document.getElementById('clientEmail').value = "";
    } else {
        document.getElementById('clientMsg').textContent = result.message || "Error adding client";
    }
}

function startBreak() {
    const breakType = document.getElementById('breakType').value;

    const result = app.startBreak(currentUser.id, breakType);

    if (result.success) {
        document.getElementById('breakMsg').textContent = "Break started";
    } else {
        document.getElementById('breakMsg').textContent = "Error starting break";
    }
}

function endBreak() {
    const result = app.endBreak(currentUser.id);

    if (result.success) {
        document.getElementById('breakMsg').textContent = "Break ended";
    } else {
        document.getElementById('breakMsg').textContent = result.message || "Error ending break";
    }
}

// pincode must be exactly 6 digits if provided
function submitMeeting() {
    const clientEmail = document.getElementById('meetingClientEmail').value;
    const dateTime = document.getElementById('meetingDateTime').value;
    const pincode = document.getElementById('meetingPincode').value || null;
    const travelTime = document.getElementById('meetingTravelTime').value || null;

    if (!clientEmail || !dateTime) {
        document.getElementById('meetingMsg').textContent = "Client email and date/time are required";
        return;
    }

    if (pincode && (pincode.length !== 6 || isNaN(pincode))) {
        document.getElementById('meetingMsg').textContent = "Invalid pincode (must be 6 digits)";
        return;
    }

    const result = app.logMeeting(currentUser.id, clientEmail, dateTime, pincode, travelTime ? parseFloat(travelTime) : null);

    if (result.success) {
        document.getElementById('meetingMsg').textContent = "Meeting logged successfully";
        document.getElementById('meetingClientEmail').value = "";
        document.getElementById('meetingDateTime').value = "";
        document.getElementById('meetingPincode').value = "";
        document.getElementById('meetingTravelTime').value = "";
    } else {
        document.getElementById('meetingMsg').textContent = result.message || "Error logging meeting";
    }
}

// shows paginated history - 10 items per page
function loadHistory() {
    const history = app.getUserHistory(currentUser.id);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = history.slice(start, end);

    let html = "<table><tr><th>Type</th><th>Details</th><th>Date/Time</th><th>Action</th></tr>";

    for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        let details = "";
        let action = "";

        if (item.type === "Leave Request") {
            details = item.data.getType() + " - " + item.data.getReason() + " - " + item.data.getStatus();
        } else if (item.type === "Ticket") {
            details = item.data.getDescription() + " - " + item.data.getStatus();
            // let them re-flag if the issue came back
            if (item.data.getStatus() === "Resolved") {
                action = '<button onclick="flagTicketBack(' + item.data.getTicketId() + ')">Flag</button>';
            }
        } else if (item.type === "Report") {
            details = item.data.getType() + " - " + item.data.getDescription();
        } else if (item.type === "Meeting") {
            const client = app.getClientById(item.data.getClientId());
            const clientName = client ? client.getName() : "Unknown";
            details = "Client: " + clientName + " at " + item.data.getDateTime();
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

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadHistory();
    }
}

function nextPage() {
    const history = app.getUserHistory(currentUser.id);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadHistory();
    }
}

// shows notifications - "System" for auto-generated ones, otherwise the sender's name
function loadNotifications() {
    const notifs = app.getNotifications(currentUser.id);

    let html = "<table><tr><th>From</th><th>Message</th><th>Target Dept</th></tr>";

    for (let i = 0; i < notifs.length; i++) {
        const senderId = notifs[i].getSenderId();
        const message = notifs[i].getMessage();
        const recipientDept = notifs[i].getRecipientDept();

        let senderName = "System";
        if (senderId !== 0) {
            const name = app.getUserName(senderId);
            senderName = name || ("User #" + senderId);
        }

        html += "<tr><td>" + senderName + "</td><td>" + message + "</td><td>" + recipientDept + "</td></tr>";
    }

    html += "</table>";

    document.getElementById('notifContent').innerHTML = html;
}

// restricts who can send to which departments
function loadNotifForm() {
    const dropdown = document.getElementById('notifRecipientDept');

    if (currentUser.type === "Manager") {
        dropdown.innerHTML = '<option>' + currentUser.department + '</option>';
    } else if (currentUser.type === "CEO") {
        dropdown.innerHTML = '<option>All</option><option>Sales</option><option>Acquisition</option><option>HR</option><option>IT</option>';
    } else if (currentUser.type === "HR") {
        dropdown.innerHTML = '<option>All</option><option>Sales</option><option>Acquisition</option><option>HR</option><option>IT</option>';
    } else if (currentUser.type === "IT") {
        dropdown.innerHTML = '<option>All</option><option>Sales</option><option>Acquisition</option><option>HR</option><option>IT</option>';
    }
}

function loadFlagged() {
    const flagged = app.getFlaggedEmployees();

    let html = "<table><tr><th>Employee ID</th></tr>";

    for (let i = 0; i < flagged.length; i++) {
        html += "<tr><td>" + flagged[i] + "</td></tr>";
    }

    html += "</table>";

    document.getElementById('flaggedContent').innerHTML = html;
}

// manager sees leave requests from their team
function loadRequests() {
    const requests = app.getRequestsForManager(currentUser.id);

    let html = "<table><tr><th>Employee</th><th>Date</th><th>Type</th><th>Reason</th><th>Status</th><th>Action</th></tr>";

    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        const status = req.getStatus();

        html += "<tr>";
        html += "<td>" + req.getEmployeeId() + "</td>";
        html += "<td>" + req.getDate() + "</td>";
        html += "<td>" + req.getType() + "</td>";
        html += "<td>" + req.getReason() + "</td>";
        html += "<td>" + status + "</td>";
        html += "<td>";

        if (status === "Pending") {
            html += '<button onclick="approveRequest(' + req.getRequestId() + ')">Approve</button>';
            html += '<button onclick="rejectRequest(' + req.getRequestId() + ')">Reject</button>';
        }

        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('requestsContent').innerHTML = html;
}

function approveRequest(requestId) {
    app.updateRequestStatus(requestId, "Approved");
    loadRequests();
}

function rejectRequest(requestId) {
    const reason = prompt("Enter reason for rejection:");
    if (reason) {
        app.updateRequestStatus(requestId, "Rejected");
        loadRequests();
    }
}

// manager sees IT tickets from their team
function loadManagerTickets() {
    const tickets = app.getTicketsForManager(currentUser.id);

    let html = "<table><tr><th>Flagger ID</th><th>Description</th><th>ETA</th><th>Status</th></tr>";

    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        html += "<tr>";
        html += "<td>" + ticket.getFlaggerId() + "</td>";
        html += "<td>" + ticket.getDescription() + "</td>";
        html += "<td>" + (ticket.getEta() || "Not set") + "</td>";
        html += "<td>" + ticket.getStatus() + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('ticketsContent').innerHTML = html;
}

function sendNotif() {
    const recipientDept = document.getElementById('notifRecipientDept').value;
    const message = document.getElementById('notifMessage').value;

    if (!message) {
        document.getElementById('notifMsg').textContent = "Message is required";
        return;
    }

    const result = app.sendNotification(currentUser.id, message, recipientDept);

    if (result.success) {
        document.getElementById('notifMsg').textContent = "Notification sent";
        document.getElementById('notifMessage').value = "";
    } else {
        document.getElementById('notifMsg').textContent = result.message || "Error sending notification";
    }
}

// HR sees all reports submitted by employees
function loadReports() {
    const reports = app.getAllReports();

    let html = "<table><tr><th>Report ID</th><th>Reporter</th><th>Target</th><th>Type</th><th>Description</th></tr>";

    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];

        html += "<tr>";
        html += "<td>" + report.getReportId() + "</td>";
        html += "<td>" + report.getReporterUserId() + "</td>";
        html += "<td>" + report.getTargetUserId() + "</td>";
        html += "<td>" + report.getType() + "</td>";
        html += "<td>" + report.getDescription() + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById('reportsContent').innerHTML = html;
}

// IT dashboard - shows ticket counts and lets them set ETAs and resolve
function loadITTickets() {
    const allTickets = app.getAllTickets();
    const pendingTickets = app.getPendingTickets();

    let totalResolved = 0;
    let totalPending = 0;
    let totalFlagged = 0;

    for (let i = 0; i < allTickets.length; i++) {
        if (allTickets[i].getStatus() === "Resolved") {
            totalResolved++;
        } else if (allTickets[i].getStatus() === "Pending") {
            totalPending++;
        } else if (allTickets[i].getStatus() === "Flagged") {
            totalFlagged++;
        }
    }

    let html = "<h4>Ticket Stats</h4>";
    html += "<p>Total: " + allTickets.length + " | Pending: " + totalPending + " | Resolved: " + totalResolved + " | Flagged: " + totalFlagged + "</p>";

    html += "<h4>Pending Tickets</h4>";
    html += "<table><tr><th>Ticket ID</th><th>Flagger ID</th><th>Description</th><th>ETA</th><th>Action</th></tr>";

    for (let i = 0; i < pendingTickets.length; i++) {
        const ticket = pendingTickets[i];

        html += "<tr>";
        html += "<td>" + ticket.getTicketId() + "</td>";
        html += "<td>" + ticket.getFlaggerId() + "</td>";
        html += "<td>" + ticket.getDescription() + "</td>";
        html += "<td>" + (ticket.getEta() || "Not set") + "</td>";
        html += "<td>";

        if (!ticket.getEta()) {
            html += '<button onclick="setETA(' + ticket.getTicketId() + ')">Set ETA</button>';
        }

        html += '<button onclick="markResolved(' + ticket.getTicketId() + ')">Resolve</button>';
        html += "</td>";
        html += "</tr>";
    }

    html += "</table>";

    // also show any tickets that employees flagged back
    let flaggedTickets = [];
    for (let i = 0; i < allTickets.length; i++) {
        if (allTickets[i].getStatus() === "Flagged") {
            flaggedTickets.push(allTickets[i]);
        }
    }

    if (flaggedTickets.length > 0) {
        html += "<h4>Flagged Tickets</h4>";
        html += "<table><tr><th>Ticket ID</th><th>Flagger ID</th><th>Description</th><th>ETA</th><th>Action</th></tr>";

        for (let i = 0; i < flaggedTickets.length; i++) {
            const ticket = flaggedTickets[i];
            html += "<tr>";
            html += "<td>" + ticket.getTicketId() + "</td>";
            html += "<td>" + ticket.getFlaggerId() + "</td>";
            html += "<td>" + ticket.getDescription() + "</td>";
            html += "<td>" + (ticket.getEta() || "Not set") + "</td>";
            html += "<td>";
            html += '<button onclick="markResolved(' + ticket.getTicketId() + ')">Resolve</button>';
            html += "</td></tr>";
        }

        html += "</table>";
    }

    document.getElementById('itTicketsContent').innerHTML = html;
}

function setETA(ticketId) {
    const eta = prompt("Enter ETA (e.g. 2025-01-15 14:00):");
    if (eta) {
        app.setTicketETA(ticketId, eta);
        loadITTickets();
    }
}

function markResolved(ticketId) {
    app.resolveTicket(ticketId);
    loadITTickets();
}

// employee can flag a ticket again if the fix didn't work
function flagTicketBack(ticketId) {
    app.flagTicket(ticketId);
    loadHistory();
}

// CEO stats - company overview with break time averages per dept
function loadCEOStats() {
    const stats = app.getCEOStats();

    let html = "<table>";
    html += "<tr><td>Total Employees</td><td>" + stats.totalEmployees + "</td></tr>";
    html += "<tr><td>Flagged Employees</td><td>" + stats.flaggedEmployees + "</td></tr>";
    html += "<tr><td>Late Employees Today</td><td>" + stats.lateToday + "</td></tr>";
    html += "<tr><td>Unexcused Absences</td><td>" + stats.unexcusedAbsences + "</td></tr>";
    html += "<tr><td>Employees on Break</td><td>" + stats.onBreak + "</td></tr>";
    html += "<tr><td>Total Meetings</td><td>" + stats.totalMeetings + "</td></tr>";
    html += "<tr><td>Pending Leave Requests</td><td>" + stats.pendingRequests + "</td></tr>";
    html += "<tr><td>Pending IT Tickets</td><td>" + stats.pendingTickets + "</td></tr>";
    html += "<tr><td>Total Clients</td><td>" + stats.totalClients + "</td></tr>";
    html += "</table>";

    html += "<h4>Average Break Times by Department</h4>";
    const depts = Object.keys(stats.avgBreakTimesByDept);
    if (depts.length > 0) {
        html += "<table><tr><th>Department</th><th>Avg Break (mins)</th></tr>";
        for (let i = 0; i < depts.length; i++) {
            html += "<tr><td>" + depts[i] + "</td><td>" + stats.avgBreakTimesByDept[depts[i]] + "</td></tr>";
        }
        html += "</table>";
    } else {
        html += "<p>No break data available yet.</p>";
    }

    document.getElementById('statsContent').innerHTML = html;
}

// manager sees their team's info including phone, late count, etc.
function loadEmployees() {
    if (!currentUser.emps) return;

    let html = "<table><tr><th>Employee ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Late Count</th><th>Sick Days Taken</th><th>Personal Days Remaining</th></tr>";

    for (let i = 0; i < currentUser.emps.length; i++) {
        const empRef = currentUser.emps[i];
        const empInfo = app.getEmployeeInfo(empRef.id);

        if (empInfo) {
            html += "<tr>";
            html += "<td>" + empInfo.id + "</td>";
            html += "<td>" + empInfo.name + "</td>";
            html += "<td>" + empInfo.email + "</td>";
            html += "<td>" + (empInfo.phone || "N/A") + "</td>";
            html += "<td>" + empInfo.department + "</td>";
            html += "<td>" + empInfo.lateCount + "</td>";
            html += "<td>" + empInfo.sickDays + "</td>";
            html += "<td>" + empInfo.personalDaysRemaining + "</td>";
            html += "</tr>";
        }
    }

    html += "</table>";
    document.getElementById('employeesContent').innerHTML = html;
}

function submitManagerMeeting() {
    const employeeID = parseInt(document.getElementById('meetingEmployeeID').value);
    const meetingDateTime = document.getElementById('managerMeetingDateTime').value;
    const purpose = document.getElementById('meetingPurpose').value;
    const location = document.getElementById('meetingLocationManager').value;

    const result = app.bookManagerMeeting(currentUser.id, employeeID, meetingDateTime, purpose, location);

    if (result.success) {
        document.getElementById('managerMeetingMsg').textContent = "Meeting booked successfully";
        document.getElementById('meetingEmployeeID').value = "";
        document.getElementById('managerMeetingDateTime').value = "";
        document.getElementById('meetingPurpose').value = "";
    } else {
        document.getElementById('managerMeetingMsg').textContent = "Error booking meeting";
    }
}

// manager can see all meetings their employees have logged
function loadEmployeeMeetings() {
    const meetings = app.getMeetingsForManager(currentUser.id);

    let html = "<table><tr><th>Employee</th><th>Client</th><th>Date/Time</th><th>Pincode</th><th>Travel Time (hrs)</th><th>Action</th></tr>";

    for (let i = 0; i < meetings.length; i++) {
        const meeting = meetings[i];
        const client = app.getClientById(meeting.getClientId());
        const clientName = client ? client.getName() : "Unknown";

        html += "<tr>";
        html += "<td>" + meeting.getEmployeeId() + "</td>";
        html += "<td>" + clientName + "</td>";
        html += "<td>" + meeting.getDateTime() + "</td>";
        html += "<td>" + (meeting.getPincode() || "In-office") + "</td>";
        html += "<td>" + (meeting.getTravelTime() || "N/A") + "</td>";
        html += "<td><button onclick=\"flagEmployee(" + meeting.getEmployeeId() + ")\">Flag Employee</button></td>";
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById('employeeMeetingsContent').innerHTML = html;
}

// manager flags employee for inaccurate meeting reporting
function flagEmployee(employeeID) {
    const reason = prompt("Enter reason for flagging:");
    if (reason) {
        app.flagEmployeeForReporting(currentUser.id, employeeID, reason);
        alert("Employee flagged. HR has been notified.");
    }
}

function submitHRMeetingRequest() {
    const purpose = document.getElementById('hrMeetingPurpose').value;

    const result = app.requestHRMeeting(currentUser.id, purpose);

    if (result.success) {
        document.getElementById('hrMeetingRequestMsg').textContent = "Meeting request sent to HR";
        document.getElementById('hrMeetingPurpose').value = "";
    } else {
        document.getElementById('hrMeetingRequestMsg').textContent = "Error sending request";
    }
}

// HR sees trends over the last 30 days
function loadHRTrends() {
    const trends = app.getHRTrends();

    let html = "<h4>Trends Over Last 30 Days</h4>";
    html += "<table>";
    html += "<tr><td><strong>Total Late Entries</strong></td><td>" + trends.totalLateEntries + "</td></tr>";
    html += "<tr><td><strong>Total Leave Requests</strong></td><td>" + trends.totalLeaveRequests + "</td></tr>";
    html += "</table>";

    html += "<h4>Employees with Frequent Overtime (10+ days)</h4>";
    if (trends.overtimeEmployees.length > 0) {
        html += "<ul>";
        for (let i = 0; i < trends.overtimeEmployees.length; i++) {
            html += "<li>" + trends.overtimeEmployees[i] + "</li>";
        }
        html += "</ul>";
    } else {
        html += "<p>No employees with excessive overtime.</p>";
    }

    html += "<h4>Employees with Excessive Sick Leave (5+ days)</h4>";
    if (trends.excessiveSickLeave.length > 0) {
        html += "<ul>";
        for (let i = 0; i < trends.excessiveSickLeave.length; i++) {
            html += "<li>" + trends.excessiveSickLeave[i] + "</li>";
        }
        html += "</ul>";
    } else {
        html += "<p>No employees with excessive sick leave.</p>";
    }

    document.getElementById('trendsContent').innerHTML = html;
}

function loadHRMeetingRequests() {
    const requests = app.getHRMeetingRequests();

    let html = "<table><tr><th>Employee ID</th><th>Purpose</th><th>Date/Time</th><th>Status</th></tr>";

    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];

        html += "<tr>";
        html += "<td>" + req.getUserID() + "</td>";
        html += "<td>" + req.getPurpose() + "</td>";
        html += "<td>" + new Date(req.getDateTime()).toLocaleString() + "</td>";
        html += "<td>" + req.getStatus() + "</td>";
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById('hrMeetingsContent').innerHTML = html;
}

// shows how many sick and personal days the employee has used/left
function loadLeaveDays() {
    const leaveDays = app.getLeaveDays(currentUser.id);
    document.getElementById('sickDaysTaken').textContent = leaveDays.sickDays;
    document.getElementById('personalDaysRemaining').textContent = leaveDays.personalDays;
}

// client list - Acquisition can edit, Sales can only view
function loadClients() {
    const clients = app.getClientsForManager(currentUser.id);

    // only show Action column if user can edit (Acquisition dept)
    const canEdit = currentUser.department === "Acquisition";
    let html = "<table><tr><th>Client ID</th><th>Name</th><th>Email</th>";
    if (canEdit) {
        html += "<th>Action</th>";
    }
    html += "</tr>";

    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];

        html += "<tr>";
        html += "<td>" + client.getClientId() + "</td>";
        html += "<td>" + client.getName() + "</td>";
        html += "<td>" + (client.getEmail() || "N/A") + "</td>";
        if (canEdit) {
            const safeName = client.getName().replace(/'/g, "\\'");
            const safeEmail = (client.getEmail() || "").replace(/'/g, "\\'");
            html += "<td><button onclick=\"editClient(" + client.getClientId() + ", '" + safeName + "', '" + safeEmail + "')\">Edit</button></td>";
        }
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById('clientsContent').innerHTML = html;
}

// pre-fills the update form with the client's current info
function editClient(clientId, name, email) {
    document.getElementById('updateClientId').value = clientId;
    document.getElementById('updateClientName').value = name;
    document.getElementById('updateClientEmail').value = email;
    showSection('updateClient');
}

function submitUpdateClient() {
    const clientId = parseInt(document.getElementById('updateClientId').value);
    const name = document.getElementById('updateClientName').value;
    const email = document.getElementById('updateClientEmail').value;

    if (!name) {
        document.getElementById('updateClientMsg').textContent = "Client name is required";
        return;
    }

    const result = app.updateClient(clientId, name, email || null);

    if (result.success) {
        document.getElementById('updateClientMsg').textContent = "Client updated successfully";
    } else {
        document.getElementById('updateClientMsg').textContent = result.message || "Error updating client";
    }
}

// populates the manager dropdown and shows the add user form
function loadAddUserForm() {
    const managers = app.getManagers();
    const managerDropdown = document.getElementById('newUserManager');

    // populate manager dropdown
    let options = '<option value="">-- Select Manager --</option>';
    for (let i = 0; i < managers.length; i++) {
        options += '<option value="' + managers[i].id + '">' + managers[i].name + ' (' + managers[i].dept + ')</option>';
    }
    managerDropdown.innerHTML = options;

    // show/hide manager dropdown based on role
    updateManagerVisibility();

    // clear previous messages
    document.getElementById('addUserMsg').textContent = '';
}

// shows manager dropdown for Employee/HR/IT, hides it for Manager role
function updateManagerVisibility() {
    const role = document.getElementById('newUserRole').value;
    const managerGroup = document.getElementById('managerGroup');

    if (role === "Manager") {
        managerGroup.style.display = "none";
    } else {
        managerGroup.style.display = "block";
    }
}

function submitNewUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const dept = document.getElementById('newUserDept').value;
    const phone = document.getElementById('newUserPhone').value;
    const managerId = document.getElementById('newUserManager').value;

    // validation
    if (!name || !email || !password) {
        document.getElementById('addUserMsg').textContent = "Name, email, and password are required";
        return;
    }

    const result = app.addUser(
        name,
        email,
        password,
        role,
        dept,
        phone || null,
        managerId ? parseInt(managerId) : null
    );

    if (result.success) {
        document.getElementById('addUserMsg').textContent = "User added successfully (ID: " + result.userId + ")";
        // clear form
        document.getElementById('newUserName').value = "";
        document.getElementById('newUserEmail').value = "";
        document.getElementById('newUserPassword').value = "";
        document.getElementById('newUserPhone').value = "";
        document.getElementById('newUserManager').value = "";
    } else {
        document.getElementById('addUserMsg').textContent = result.message || "Error adding user";
    }
}
