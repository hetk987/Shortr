# Shortr Frontend

A modern, responsive web interface for the Shortr URL shortener built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern, Responsive Design** - Beautiful UI that works on all devices
- 🌙 **Dark/Light Theme Toggle** - Switch between themes with system preference detection
- ⚡ **Real-time Link Creation** - Instant feedback and updates
- 🔍 **Search & Filter** - Find links quickly with real-time search and sorting
- 📁 **Drag & Drop Bulk Upload** - Upload multiple links via CSV files
- 📊 **Link Management** - Edit, delete, and copy links with ease
- 🔔 **Toast Notifications** - User-friendly feedback for all actions
- 📱 **Mobile Optimized** - Fully responsive design for mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **UI Components**: Custom components with Headless UI patterns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- The Shortr backend server running on port 80

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd shortr-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:80" > .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── bulk-upload.tsx
│   ├── create-link-form.tsx
│   ├── links-list.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── toast-container.tsx
├── lib/               # Utility functions
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
└── types/             # TypeScript type definitions
    └── index.ts
```

### API Integration

The frontend communicates with the Shortr backend API:

- `GET /api/links` - Fetch all links
- `POST /api/links` - Create a new link
- `POST /api/links/bulk` - Bulk create links
- `PUT /api/links/:alias` - Update a link
- `DELETE /api/links/:alias` - Delete a link

### Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: CSS custom properties for theme switching
- **Components**: Reusable UI components with variants
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and micro-interactions

## Features in Detail

### Link Creation

- Real-time form validation
- Instant feedback on success/error
- Automatic form reset after creation

### Bulk Upload

- Drag and drop CSV file support
- Preview before upload
- Error handling for invalid entries
- Progress feedback

### Link Management

- Search by alias or URL
- Sort by creation date, clicks, or alphabetically
- Edit links inline
- Copy short URLs to clipboard
- Delete with confirmation

### Theme System

- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:80)

### Docker Deployment

The frontend can be deployed alongside the backend using Docker Compose. See the main project README for deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Shortr URL shortener application.
