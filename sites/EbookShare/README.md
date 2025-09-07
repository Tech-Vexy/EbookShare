# 📚 EbookShare - Modern Ebook Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-latest-FD366E?style=for-the-badge&logo=appwrite)](https://appwrite.io/)

A modern, beautiful, and intuitive platform for computer science and software engineering students and professionals to share and discover essential ebooks. Built with Next.js, TypeScript, and Appwrite.

![EbookShare Hero](https://via.placeholder.com/1200x600/6366f1/ffffff?text=EbookShare+Platform)

## ✨ Features

### 🎯 Core Functionality
- **📖 Ebook Management**: Upload, organize, and manage technical ebooks
- **🔍 Smart Search**: Advanced search with filters by category, author, and tags
- **📱 Responsive Design**: Seamless experience across all devices
- **👥 User Management**: Secure authentication and user profiles
- **📊 Analytics**: Download tracking and usage statistics

### 🎨 Modern UI/UX
- **🌈 Beautiful Design**: Modern gradients, glass morphism effects
- **🌙 Dark Mode**: Full dark/light theme support
- **⚡ Smooth Animations**: Micro-interactions and transitions
- **🎭 Interactive Elements**: Hover effects and dynamic components
- **📐 Clean Layout**: Well-organized, intuitive interface

### 🔧 Technical Features
- **🚀 Performance**: Optimized with Next.js 15 and React 19
- **🔒 Security**: Enterprise-grade security with Appwrite
- **📦 Modern Stack**: TypeScript, Tailwind CSS, Radix UI
- **🎯 SEO Optimized**: Built-in SEO best practices
- **♿ Accessible**: WCAG compliant design

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Appwrite** account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tech-Vexy/EbookShare.git
   cd EbookShare
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_EBOOKS_COLLECTION_ID=your_ebooks_collection_id
   NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_collection_id
   NEXT_PUBLIC_APPWRITE_EBOOKS_BUCKET_ID=your_storage_bucket_id
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Appwrite Setup

### 1. Create Appwrite Project
1. Sign up at [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project
3. Note your project ID

### 2. Database Setup
Run the Appwrite setup script to create collections:
```bash
# Follow the instructions in APPWRITE_SETUP.md
pnpm run setup:appwrite
```

### 3. Storage Setup
1. Create a storage bucket named "ebooks"
2. Configure file permissions for authenticated users
3. Add the bucket ID to your environment variables

### 4. Authentication Setup
1. Enable Email/Password authentication
2. Configure your domain in Appwrite console
3. Set up OAuth providers (optional)

## 📁 Project Structure

```
ebook-platform/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── catalog/           # Book catalog
│   ├── dashboard/         # User dashboard
│   ├── upload/            # Book upload
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── catalog/          # Catalog components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and services
│   ├── appwrite.ts       # Appwrite configuration
│   ├── ebook-service.ts  # Ebook service
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple-blue gradient (`oklch(0.55 0.25 260)`)
- **Accent**: Magenta-pink (`oklch(0.6 0.3 320)`)
- **Secondary**: Soft lavender (`oklch(0.7 0.15 280)`)
- **Background**: Dynamic gradients with glass morphism

### Typography
- **Font**: Geist Sans (modern, clean)
- **Headings**: Bold, gradient text effects
- **Body**: Optimized for readability

### Components
- **Shadcn/ui**: High-quality, accessible components
- **Radix UI**: Unstyled, accessible primitives
- **Custom animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms
- **Netlify**: Add build command `pnpm build`
- **Railway**: Configure environment variables
- **Docker**: Use the provided Dockerfile

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- **ESLint**: Follow the configured rules
- **Prettier**: Auto-formatting enabled
- **TypeScript**: Strict mode enabled
- **Conventions**: Use conventional commits

## 📝 Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks

# Database
pnpm setup:appwrite    # Setup Appwrite collections
pnpm seed:categories   # Seed default categories
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for real-world performance
- **Bundle Size**: Minimized with tree shaking
- **Image Optimization**: Next.js Image component

## 🔐 Security

- **Authentication**: Secure session management
- **File Upload**: Validated file types and sizes
- **Data Validation**: Input sanitization and validation
- **HTTPS**: Enforced in production
- **Environment Variables**: Secure configuration management

## 🌍 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Appwrite](https://appwrite.io/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Lucide](https://lucide.dev/) - Beautiful icons

## 🐛 Bug Reports

Found a bug? Please open an issue on [GitHub Issues](https://github.com/Tech-Vexy/EbookShare/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

<div align="center">
  <p>Built with ❤️ by Tech-Vexy</p>
  <p>
    <a href="https://ebookshare.appwrite.network/">Website</a> •
    <a href="https://github.com/Tech-Vexy/EbookShare">GitHub</a> •
    <a href="https://twitter.com/EVeldrine">Twitter</a>
  </p>
</div>
