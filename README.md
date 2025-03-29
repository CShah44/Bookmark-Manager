# Bookmark Manager

A modern web application for organizing and managing your bookmarks with tags and folders.

## Features

- **User Authentication**: Secure login and registration using Clerk
- **Bookmark Management**: Add and delete bookmarks
- **Organization**: Categorize bookmarks with tags and folders
- **Search**: Quickly find bookmarks with powerful search functionality
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Payload CMS (headless CMS)
- **Database**: MongoDB (via Mongoose adapter)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 
- MongoDB database
- Clerk account for authentication

### Environment Variables

Create a `.env.local` file in the root directory with the following variables (Do check the .env.example file for reference):

```
# Database
DATABASE_URI=your_mongodb_connection_string

# Payload CMS
PAYLOAD_SECRET=your_payload_secret_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookmark-manager.git
```

2. Navigate to the project directory:

```bash
cd bookmark-manager
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/actions/` - Server actions for data operations
- `src/app/` - Next.js application routes
- `src/collections/` - Payload CMS collection definitions
- `src/components/` - React components
- `src/lib/` - Utility functions and types

## Usage

### Adding a Bookmark

1. Click the "Add Bookmark" button
2. Enter the URL, title, and optional description
3. Select or create tags and folders to organize your bookmark
4. Click "Save" to add the bookmark to your collection

### Managing Tags and Folders

1. Use the sidebar to access tag and folder management
2. Create new tags/folders or delete existing ones
3. Click on a tag or folder to filter your bookmarks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Payload CMS](https://payloadcms.com/)
- [Clerk](https://clerk.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
