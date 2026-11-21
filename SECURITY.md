# Security Policy

## Responsible Disclosure
If you discover a security vulnerability in OpenDoor, please document the steps and submit a report to the project maintainers.

## Safety Guidelines
- Never hardcode or commit API secrets or keys to the repository.
- Use `.env.local` for local secrets.
- Server-side routes must sanitize all untrusted user notices before processing.
