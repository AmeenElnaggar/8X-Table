## 8X-Table

A dynamic and reusable data table built with **Angular** and **PrimeNG**.  
This project provides a flexible way to render tables dynamically by retrieving both column definitions and data from the database.  
It supports full **CRUD operations** using dynamic dialogs and leverages PrimeNG’s table and dialog components.

---

## Features

- Dynamic table with configurable columns and data
- Create, Update, Delete operations via dynamic dialogs
- Global and per-column filtering
- Modular structure with reusable components
- Custom cell templates with `ngTemplateOutlet` support
- Reactive integration with backend (JSON Server)

---

## Tech Stack

- Angular20
- PrimeNG20
- TypeScript
- JSON Server (for local database mocking)

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

Ensure you have json-server installed globally.
```bash
npm install -g json-server
```

### 2. Run the Angular application
```bash
npm start
```

### 3. Start the mock backend (JSON Server)
```bash
json-server --watch db.json
```

## Notes
The reusable table can render any dataset passed to it via input() bindings.
Custom templates for specific columns can be passed using ngTemplateOutlet.
Designed to be easily extendable to support pagination, sorting, or other PrimeNG features.


