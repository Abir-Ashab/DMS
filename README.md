# Diagnostic Center Management System (DMS)

## Project Structure
```
hospital-management-system/
├── Backend/                     # Backend
│   ├── config/                  # Configuration files
│   │   ├── db.js                # Database connection
│   │   └── default.json         # Global config variables
│   ├── controllers/             # Route controllers
│   │   ├── adminController.js   # Admin-related operations
│   │   ├── authController.js    # Authentication operations
│   │   ├── billingController.js # Billing operations
│   │   └── managerController.js # Manager-related operations
│   ├── middleware/              # Middleware functions
│   │   ├── auth.js              # Authentication middleware
│   │   └── role.js              # Role-based access control
│   ├── models/                  # MongoDB schemas
│   │   ├── Bill.js              # Bill schema
│   │   ├── Broker.js            # Broker schema
│   │   ├── Doctor.js            # Doctor schema
│   │   ├── Hospital.js          # Hospital schema
│   │   ├── Patient.js           # Patient schema
│   │   ├── Test.js              # Test schema
│   │   └── User.js              # User schema (Admin/Manager)
│   ├── routes/                  # API routes
│   │   ├── admin.js             # Admin routes
│   │   ├── auth.js              # Authentication routes  
│   │   ├── billing.js           # Billing routes
│   │   ├── broker.js            # Broker routes
│   │   ├── doctor.js            # Doctor routes
│   │   ├── hospital.js          # Hospital routes
│   │   └── manager.js           # Manager routes
│   ├── utils/                   # Utility functions
│   │   └── calculations.js      # Bill calculation utilities
│   ├── package.json             # Backend dependencies
│   └── server.js                # Entry point
├── Frontend/                    # Frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── admin/           # Admin components
│   │   │   ├── manager/         # Manager components
│   │   │   ├── billing/         # Billing components
│   │   │   ├── profiles/        # Profile components
│   │   │   └── common/          # Common UI components
│   │   ├── context/             # React context
│   │   │   └── auth/            # Authentication context
│   │   ├── pages/               # Page components
│   │   ├── utils/               # Utility functions
│   │   ├── App.js               # Main App component
│   │   └── index.js             # Entry point
│   └── package.json             # Frontend dependencies
└── package.json                 # Root dependencies
```