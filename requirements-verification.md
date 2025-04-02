# Requirements Verification

This document verifies how our implementation meets all the requirements specified in the lab tasks.

## Lab 4 Requirements

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Use modern technologies for building distributed information systems (Web services, SOA, RESTful) | The system uses RESTful APIs with Express.js for building the web services | ✅ Implemented |
| Create software for polling telemetry data sources from resource transport channels | `PullReplicationService` polls data from territorial services | ✅ Implemented |
| Implement asynchronous polling of two web service sources by a central web service | The central service asynchronously polls the two territorial services using `PullReplicationService.pullFromAllTerritorials()` | ✅ Implemented |
| Handle exceptions related to unavailability or malfunction of remote services | Error handling is implemented in all API calls with proper try/catch blocks and timeout settings | ✅ Implemented |
| Ensure time synchronization between web services | `TimeSyncService` provides time synchronization functionality | ✅ Implemented |
| Implement logging for services | Logging system is implemented using Winston logger with different log levels | ✅ Implemented |
| Provide information about the current state of the polled web services | Status endpoints are implemented for all services | ✅ Implemented |

## Lab 5 Requirements

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Implement pull replication from territorial sources to the central database | `PullReplicationService` handles pulling data from territorial services to the central database | ✅ Implemented |
| Develop a program to fill source databases with model data (for 10 objects) randomly generated | `DataGeneratorService` generates random data for testing | ✅ Implemented |
| Generate values based on student number | Student number is used to adjust the range of generated values | ✅ Implemented |
| Implement logging for data generation and replication mechanism | Logging is implemented for both data generation and replication | ✅ Implemented |

## Lab 6 Requirements

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Implement push replication of telemetry data from the centralized database to territorial databases | `PushReplicationService` implements push replication from the central database to territorial databases | ✅ Implemented |
| Push to 2 databases (5 telemetry items each) | The central service pushes data to both territorial databases based on subscription in N_TI | ✅ Implemented |
| Implement logging for the replication mechanism | Logging is implemented for the push replication process | ✅ Implemented |

## Additional Implementations

| Feature | Implementation | Status |
|---------|---------------|--------|
| Containerization | Docker and Docker Compose are configured for easy deployment | ✅ Implemented |
| Database initialization | Scripts for creating and seeding databases are provided | ✅ Implemented |
| Health check endpoints | Health check endpoints are implemented for all services | ✅ Implemented |
| Environment configuration | Environment variables are used for all configurable parameters | ✅ Implemented |
| TypeScript type safety | All code is written in TypeScript with proper types | ✅ Implemented |
| ORM for database operations | TypeORM is used for database operations | ✅ Implemented |
| Entity models | Entity models follow the technical specification | ✅ Implemented |
| API documentation | API endpoints are documented in the README | ✅ Implemented |

## Technical Requirements Compliance

| Technical Requirement | Implementation | Status |
|----------------------|---------------|--------|
| Use modern web service technologies | RESTful APIs with Express.js | ✅ Implemented |
| Database schema as specified in the technical project | Database schema follows the technical project with BODI, BODK, N_TI, etc. | ✅ Implemented |
| Configuration from files, not hardcoded | All configuration is loaded from environment variables | ✅ Implemented |
| RESTful architecture | The system uses RESTful architecture for communication | ✅ Implemented | 