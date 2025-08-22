# CRMMS Security

CRMMS (Customer Relationship Management Master System) is a secure and reliable system for managing customer relationships. This document outlines the security measures implemented and how user data is protected.

---

## Open Source and Transparency

CRMMS is a fully open-source project available on [GitHub](https://github.com/DuskStarGITHUB/crmms). This allows any developer to:

* Review the code and ensure there are no hidden vulnerabilities.
* Contribute to security and performance improvements.
* Independently audit the system's implementation of best practices.

---

## Authentication and Access Control

The system implements multiple layers of protection for accounts and data:

* JWT (JSON Web Tokens) for secure authentication and sessions.
* Hierarchical roles: Admin, Moderator, Access Owner, Guild, Spot, Builder, and User, each with strictly limited permissions.
* Encrypted passwords using secure hashing (bcrypt).
* Principle of least privilege: users can only access information necessary for their role.

---

## Data Protection

* PostgreSQL database configurable with unique credentials per installation.
* Environment variables store sensitive information such as JWT keys and database credentials, never in code.
* Internal logging of important actions to detect suspicious access or intrusion attempts.

---

## Secure Development Practices

CRMMS follows industry-standard secure development practices:

* TypeScript to prevent type errors that could lead to vulnerabilities.
* ESLint and linters to maintain clean and secure code.
* Regular updates of dependencies to minimize the risk of exploits.
* Controlled build and deployment using Vite and NestJS to ensure a reliable and reproducible environment.

---

## Secure Deployment Recommendations

To maintain a secure CRMMS installation:

1. Use HTTPS for all connections.
2. Configure the database with a unique user and password and restrict remote access.
3. Keep Node.js, PostgreSQL, and project dependencies up to date.
4. Update the `.env` file with secure keys.
5. Perform regular backups of the database and important files.

---
