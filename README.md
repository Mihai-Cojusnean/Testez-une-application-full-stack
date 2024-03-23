# Yoga App

Welcome to our Yoga App!

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
    - [Database](#database)
    - [Application](#application)
3. [Operation](#operation)
4. [Testing](#testing)
    - [Unit Tests with Jest](#unit-tests-with-jest)
    - [End-to-End Tests with Cypress](#end-to-end-tests-with-cypress)
    - [Integration Tests with JUnit](#integration-tests-with-junit)
5. [Coverage Reports](#coverage-reports)

## Prerequisites

Ensure you have the following installed on your machine:

- [MySQL](https://dev.mysql.com/downloads/installer/)
- [Java 11](https://www.oracle.com/fr/java/technologies/downloads/#java11)
- [Maven](https://maven.apache.org/download.cgi)

## Installation

### Database

To install the database:

1. Update the application properties in the backend project to connect to your MySQL database.
2. Execute the SQL scripts provided in the `ressources/sql/script.sql` directory to create the necessary tables and
  populate initial data.

By default the admin account is:

- login: yoga@studio.com
- password: test!1234

### Application

To install the application:

1. **Clone this repository to your local machine.**
   `git clone https://github.com/Mihai-Cojusnean/Testez-une-application-full-stack`
2. Navigate to the `frontend/` directory and run `npm install` to install frontend dependencies.
3. Navigate to the `backend/` directory and run `mvn install` to install backend dependencies.

## Operation

To operate the application:

1. Start the backend Spring Boot server by running `mvn spring-boot:run` from the `backend/` directory.
2. Start the frontend Angular server by running `ng serve` from the `frontend/` directory.

## Testing

### Unit Tests with Jest

To launch unit tests with Jest:

1. Navigate to the `front/` directory.
2. Run `npm run test` to execute the Jest unit tests.
3. View test results in the console.

### End-to-End Tests with Cypress

To launch end-to-end tests with Cypress:

1. Navigate to the `front/` directory.
2. Run `npm run e2e` to execute the Cypress end-to-end tests.
3. Cypress test runner will open, allowing you to interact with the tests.

### Integration Tests with JUnit

To launch integration tests with JUnit:

1. Navigate to the `back/` directory.
2. Run `mvn test` to execute the JUnit integration tests.
3. Test results will be output to the console, and JUnit XML reports will be generated in the `target/surefire-reports/`
   directory.

## Coverage Reports

To generate coverage reports:

1. For frontend:
    - Navigate to the `front/` directory.
    - Run `npm run test:coverage` to generate coverage reports using Jest. Reports will be available in the `coverage/`
      directory.
2. For backend:
    - Navigate to the `back/` directory.
    - Run `mvn clean test` to generate coverage reports using JaCoCo. Reports will be available in
      the `target/site/jacoco/` directory.