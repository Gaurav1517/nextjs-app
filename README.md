# Topic Management App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It's a full-stack application for managing topics, built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete topics.
- **Enhanced Topic Schema**: Topics include title, description, author, category, status, and priority.
- **Dockerized**: Run the entire application using Docker Compose.
- **Seeding**: Populate the database with sample data via API endpoint.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Running Locally with Docker

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd nextjs-app
   ```

2. **Build and run the application**:
   ```bash
   docker-compose up --build -d
   ```

   This will:
   - Build the Next.js application.
   - Start a MongoDB container.
   - Run the Next.js app on port 3000.

3. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Seed the database** (optional):
   To populate the database with sample topics, run:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
   Or visit `http://localhost:3000/api/seed` in your browser and use a tool like Postman to send a POST request.

### Alternative: Running Without Docker (Development Mode)

If you prefer to run without Docker:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb://localhost:27017/nextjsapp
   SITE_URL=http://localhost:3000
   ```

3. **Start MongoDB**:
   Ensure MongoDB is running locally on port 27017, or update `MONGO_URI` accordingly.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

- `app/`: Next.js app directory with pages and API routes.
- `components/`: React components (TopicsList, AddTopic, EditTopicForm, etc.).
- `models/`: Mongoose models (Topic schema).
- `libs/`: Database connection utilities.
- `scripts/`: Seeding scripts.
- `Dockerfile`: Docker configuration for the Next.js app.
- `docker-compose.yml`: Docker Compose setup with Next.js and MongoDB services.

## API Endpoints

- `GET /api/topics`: Fetch all topics.
- `POST /api/topics`: Create a new topic.
- `GET /api/topics/[id]`: Fetch a specific topic.
- `PUT /api/topics/[id]`: Update a topic.
- `DELETE /api/topics?id=<id>`: Delete a topic.
- `POST /api/seed`: Seed the database with sample data.
- `GET /api/seed`: Check database status.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
