# Terravision UI

This project is a user interface for [Terravision](https://github.com/patrickchugh/terravision), built with Next.js

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker
- Docker Compose

## Installation

To install and run the Terravision UI project, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install and run the application with docker compose: `docker compose up -d`
4. Once the containers are up and running, you can access the Terravision UI in your browser at `http://localhost:3000`.

## Development

To run the app in development mode, follow these steps:

1. Install the projects dependencies: `pnpm install`
2. Start the development server: `pnpm dev`

## Project Structure

- `app/` - Contains the main application code.
- `components/` - Contains reusable React components.
- `lib/` - Contains utility functions and custom hooks.
- `terravision/` - Contains Python code for the Terravision application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
