# SocioLink 🌐

**One link to rule them all. Your digital identity, simplified.**

SocioLink is a modern, beautiful link-in-bio platform that allows creators, influencers, and individuals to create personalized profiles showcasing all their social media links in one elegant place. Built with Next.js 15, TypeScript, and cutting-edge web technologies for the best user experience.

![SocioLink Preview](https://i.imgur.com/6LvjCIr.png)
![SocioLink Preview](https://i.imgur.com/rWZDe12.png)

## ✨ Features

- **🎨 Beautiful & Customizable**: Choose from multiple themes and personalize your profile with unique backgrounds and animations
- **🔗 All-in-One Link Hub**: Consolidate all your social media, websites, and content in one beautiful link
- **📱 Mobile-First Design**: Responsive design that looks stunning on all devices
- **🔐 Secure Authentication**: JWT-based authentication with OAuth support for Google and Discord
- **🎯 Drag & Drop Interface**: Easily reorder your links with an intuitive drag-and-drop editor
- **🌙 Dark/Light Mode**: Automatic theme switching with manual override
- **⚡ Fast & Modern**: Built with Next.js 15 and React 19 for optimal performance
- **🛡️ Privacy-Focused**: Your data stays yours with transparent privacy policies

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion animations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with OAuth (Google, Discord)
- **UI Components**: Radix UI primitives
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database (local or cloud)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shikiiii/sociolink.git
   cd sociolink
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure the following:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/sociolink"

   ACCESS_TOKEN_SECRET="your-access-token-secret"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret"

   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_REDIRECT_URI="http://localhost:3000/oauth/google"

   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
   DISCORD_REDIRECT_URI="http://localhost:3000/oauth/discord"

   IMGBB_API_KEY="your-imgbb-api-key"

   RUNNING_IN="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Your Profile

1. **Sign up** with email/password or OAuth (Google/Discord)
2. **Customize your profile** - Choose a username, bio, and theme
3. **Add your links** - Drag and drop to reorder your social media links
4. **Share your SocioLink** - Your profile will be available at `yoursite.com/p/yourusername`

### Features Overview

- **Profile Customization**: Change themes, backgrounds, and animations
- **Link Management**: Add, edit, reorder, and delete links
- **Analytics**: Track link clicks and visitor statistics
- **Privacy Controls**: Make your profile public or private

## 🏗️ Project Structure

```
sociolink/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── components/        # Reusable components
│   │   ├── p/[username]/      # Public profile pages
│   │   └── ...                # Other pages
│   ├── components/
│   │   └── ui/                # UI components (shadcn/ui)
│   └── lib/                   # Utilities and configurations
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply database migrations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Node.js:

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect your GitHub repo and add environment variables
- **Heroku**: Use the Node.js buildpack

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and modern web technologies
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Shikiiii/sociolink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Shikiiii/sociolink/discussions)
- **Email**: support@sociolink.com

---

**Made with ❤️ by the SocioLink team**

*One link to connect them all.*
