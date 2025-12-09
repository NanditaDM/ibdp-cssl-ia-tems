T.E.A.Ms.M - Employee Management System
IBDP CS SL Internal Assessment

=== HOW TO RUN ===
1. Open login.html in a web browser (Chrome, Firefox, Safari, etc.)
2. Login with one of the pre-created accounts below
3. Use the dashboard to access different features based on your role

=== PRE-CREATED ACCOUNTS ===

CEO Account:
Username: ceo_neha
Password: NehaCEO@2025
Name: Neha Sharma

HR Account:
Username: hr@company.com
Password: hr123
Name: Sarah Jones

IT Account:
Username: it@company.com
Password: it123
Name: Mike Brown

Manager Account:
Username: mgr_asha
Password: AshaMGR@2025
Name: Asha Patel (Sales Manager)

Employee Accounts:
Username: emp_john23
Password: John@123
Name: John Kumar (Sales Rep under Asha)

Username: emp_rahul99
Password: Rahul@99pass
Name: Rahul Singh (Sales Rep under Asha)

=== FEATURES BY ROLE ===

EMPLOYEE:
- Log daily attendance (with late reason if applicable)
- Request leave (sick, personal, etc.)
- Open IT help tickets
- Report issues to HR
- Log breaks (start/end)
- Log client acquisitions (Sales/Acquisition dept only)
- Log meetings (Sales/Acquisition dept only)
- View personal history
- View notifications

MANAGER:
- All employee features
- View flagged employees (>3 late entries in 20 days)
- View and approve/deny leave requests
- View IT tickets from team members
- Send notifications to team

HR:
- View all behavioral reports
- Respond to reports with action taken
- Send notifications to employees/departments

IT:
- View all tickets
- View today's ticket statistics
- Set ETA for tickets
- Mark tickets as resolved

CEO:
- View dashboard statistics:
  - Number of flagged employees
  - Late employees today
  - Employees on break
  - Sales meetings today
  - Clients acquired today
  - Average break time
  - Average meeting time
- Send notifications to anyone

=== TECHNICAL NOTES ===

OOP Concepts Used:
1. Encapsulation - All class properties are private (#)
2. Inheritance - Employee extends User, Manager extends Employee, etc.
3. Polymorphism - Different user types with different capabilities
4. Method Overriding - Constructors call parent constructors
5. Libraries of Objects - Arrays store collections of users and records

Files:
- User.js - User class hierarchy (User, Employee, Manager, HR, IT, CEO)
- Record.js - Record class hierarchy (Request, Ticket, Report, etc.)
- app.js - Main application logic and data management
- dashboard.js - Dashboard UI logic
- login.html - Login page
- dashboard.html - Main dashboard interface

All data is stored in memory (resets on page refresh).
Session storage is used to maintain login state between pages.
