# Shared Checklist Application

This is a simple shared checklist web application built with Node.js, Express and PostgreSQL.

The application allows users to register, log in, create checklists and share them with other users.

## Live Demo

https://checklist-app-t5r7.onrender.com

## Features

- User registration
- User login (passwords hashed with bcrypt)
- Create checklist
- View own checklists
- Delete checklist
- Share checklist with another user
- Simple modern UI

## Tech Stack

Frontend:
- HTML
- CSS
- Vanilla JavaScript (ES Modules)

Backend:
- Node.js
- Express.js
- PostgreSQL
- bcrypt

## Database Tables

### users
- id
- email
- password

### checklists
- id
- title
- owner_id

### shared_checklists
- checklist_id
- user_id

## Notes

- Passwords are securely hashed.
- Users can only manage their own checklists.
- Sharing allows other users to access specific checklists.

## Purpose

This project demonstrates:
- REST API design
- Authentication
- Database integration
- Frontend and backend integration
- Basic access control

## Test Credentials

You can use the following account to test the application: test_login_credentials.json
