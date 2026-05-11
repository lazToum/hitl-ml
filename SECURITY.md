# Security Policy

## Scope

This repository is primarily a book and educational platform. Security issues
most relevant here are:

- Personal data exposure in the Spring platform (auth, session tokens)
- Vulnerabilities in the FastAPI or Axum backends
- XSS or content injection in the React reader or Spring web frontend
- Dependency vulnerabilities with a realistic exploit path

Out of scope: issues in the Jupyter Book toolchain, LaTeX build system, or
static PDF outputs.

## Reporting

**Do not open a public GitHub issue for security vulnerabilities.**

Email **laztoum@protonmail.com** with:

- A description of the vulnerability and its impact
- Steps to reproduce or a proof-of-concept
- The affected component and version (or commit SHA)

You will receive an acknowledgment within **72 hours** and a status update
within **7 days**. We follow coordinated disclosure and will credit reporters
by default (let us know if you prefer to remain anonymous).
