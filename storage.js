// Simple storage adapter - saves to browser's LocalStorage
// Data persists even after closing browser
// FREE and works offline!

class Storage {
    // save all app data
    static saveAll(app) {
        try {
            // save tickets
            const tickets = app.getAllTickets();
            const ticketsData = [];
            for (let i = 0; i < tickets.length; i++) {
                ticketsData.push({
                    userID: tickets[i].getUserID(),
                    dateTime: tickets[i].getDateTime(),
                    issueType: tickets[i].getIssueType(),
                    info: tickets[i].getInfo(),
                    location: tickets[i].getLocation(),
                    itMemberID: tickets[i].getITMemberID(),
                    eta: tickets[i].getETA(),
                    status: tickets[i].getStatus()
                });
            }
            localStorage.setItem('tickets', JSON.stringify(ticketsData));

            // save requests
            const requests = app.getRequestsForManager('ALL'); // will create this method
            localStorage.setItem('requests', JSON.stringify(requests || []));

            // save reports
            const reports = app.getAllReports();
            const reportsData = [];
            for (let i = 0; i < reports.length; i++) {
                reportsData.push({
                    userID: reports[i].getUserID(),
                    dateTime: reports[i].getDateTime(),
                    reportType: reports[i].getReportType(),
                    details: reports[i].getDetails(),
                    offenderID: reports[i].getOffenderID(),
                    victimType: reports[i].getVictimType(),
                    actionTaken: reports[i].getActionTaken(),
                    furtherActionRequested: reports[i].getFurtherActionRequested()
                });
            }
            localStorage.setItem('reports', JSON.stringify(reportsData));

            // save notifications
            const allNotifs = app.getAllNotifications(); // will create this method
            localStorage.setItem('notifications', JSON.stringify(allNotifs || []));

            console.log("Data saved to LocalStorage");
        } catch (e) {
            console.error("Error saving data:", e);
        }
    }

    // load all app data
    static loadAll(app) {
        try {
            // load tickets
            const ticketsData = localStorage.getItem('tickets');
            if (ticketsData) {
                const tickets = JSON.parse(ticketsData);
                for (let i = 0; i < tickets.length; i++) {
                    const t = tickets[i];
                    const ticket = new Ticket(t.userID, t.dateTime, t.issueType, t.info, t.location);
                    if (t.itMemberID) ticket.setITMemberID(t.itMemberID);
                    if (t.eta) ticket.setETA(t.eta);
                    if (t.status) ticket.setStatus(t.status);
                    app.restoreTicket(ticket); // will create this method
                }
                console.log("Loaded " + tickets.length + " tickets from storage");
            }

            // load other data similarly...
            console.log("Data loaded from LocalStorage");
        } catch (e) {
            console.error("Error loading data:", e);
        }
    }

    // clear all data
    static clearAll() {
        localStorage.clear();
        console.log("All data cleared");
    }
}
