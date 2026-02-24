# SocioLink

A modern link-in-bio platform for creators and individuals to showcase their social media links in one place. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- Customizable profiles with themes and backgrounds
- All-in-one link hub for social media and websites
- Mobile-first responsive design
- Secure authentication with JWT and OAuth support
- Drag-and-drop link reordering
- Dark and light mode support
- Fast performance with Next.js

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS, Framer Motion
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT with OAuth (Google, Discord)
- UI: Radix UI components

## Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shikiiii/sociolink.git
   cd sociolink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and configure:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sociolink"
   ACCESS_TOKEN_SECRET="your-access-token-secret"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
   IMGBB_API_KEY="your-imgbb-api-key"
   RUNNING_IN="development"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign up with email/password or OAuth
2. Customize your profile and add links
3. Share your profile at `/p/yourusername`

## License

MIT License - see [LICENSE](LICENSE) for details.
