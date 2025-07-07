# Shortr Frontend

A modern, elegant frontend for the Shortr URL shortener built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern, sleek design with dark mode support
- ⚡ Fast and responsive interface
- 📱 Mobile-friendly design
- 🔗 Create, manage, and delete short links
- 📊 View click statistics
- 📋 Copy links to clipboard
- 🗑️ Delete links with confirmation
- 🔄 Real-time updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- The Shortr backend API running on `http://localhost:80`

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Configure the API URL in `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:80
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the Shortr API endpoints:

- `GET /` - Fetch all short links
- `POST /` - Create a new short link
- `DELETE /:alias` - Delete a short link
- `GET /:alias` - Redirect to target URL (handled by backend)

## Design Features

- **Gradient Background**: Subtle gradient from slate-50 to slate-100
- **Card-based Layout**: Clean, organized interface using shadcn/ui cards
- **Responsive Design**: Works perfectly on desktop and mobile
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Proper loading indicators for better UX
- **Toast Notifications**: User-friendly feedback for all actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
