# Contributing to EbookShare

Thank you for your interest in contributing to EbookShare! We welcome contributions from developers of all skill levels. This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together towards common goals

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm
- Git installed
- Basic knowledge of React, TypeScript, and Next.js

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/EbookShare.git
   cd EbookShare
   ```

2. **Add the upstream repository**
   ```bash
   git remote add upstream https://github.com/Tech-Vexy/EbookShare.git
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Appwrite configuration
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## 📝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** provided
3. **Provide clear reproduction steps**
4. **Include relevant system information**

**Good Issue Example:**
```
Title: Search functionality not working with special characters

Description:
When searching for books with titles containing special characters (like "C++", "C#"), 
the search returns no results even though matching books exist.

Steps to reproduce:
1. Go to /catalog
2. Search for "C++"
3. Observe no results are returned

Expected: Books with "C++" in the title should appear
Actual: No results shown

Environment:
- Browser: Chrome 120
- OS: Windows 11
- Node.js: 18.17.0
```

### Suggesting Features

For feature suggestions:

1. **Check the roadmap** in GitHub Projects
2. **Open a discussion** in GitHub Discussions first
3. **Provide use cases** and examples
4. **Consider implementation complexity**

### Code Contributions

#### 1. Choose an Issue

- Look for issues labeled `good first issue` for beginners
- Check if the issue is already assigned
- Comment on the issue to express interest

#### 2. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

#### 3. Make Changes

- **Follow the coding standards** (see below)
- **Write tests** for new functionality
- **Update documentation** if needed
- **Keep commits focused** and atomic

#### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add search filtering by publication year"

# Bug fix
git commit -m "fix: resolve search issue with special characters"

# Documentation
git commit -m "docs: update API documentation for ebook service"

# Style/formatting
git commit -m "style: format code according to prettier rules"

# Refactor
git commit -m "refactor: optimize ebook loading performance"
```

#### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 🎨 Coding Standards

### TypeScript/JavaScript

- **Use TypeScript** for all new files
- **Follow ESLint rules** configured in the project
- **Use meaningful variable names**
- **Add JSDoc comments** for complex functions
- **Prefer functional components** and hooks

**Example:**
```typescript
interface EbookCardProps {
  ebook: Ebook
  category?: Category
  showDownloadButton?: boolean
}

/**
 * Displays an ebook card with title, author, and metadata
 */
export function EbookCard({ ebook, category, showDownloadButton = true }: EbookCardProps) {
  // Component logic here
}
```

### React Components

- **Use functional components** with hooks
- **Destructure props** in function parameters
- **Use meaningful component names** (PascalCase)
- **Keep components focused** and single-purpose
- **Use custom hooks** for reusable logic

### CSS/Styling

- **Use Tailwind CSS** classes primarily
- **Follow the design system** colors and spacing
- **Use CSS variables** for custom properties
- **Mobile-first responsive design**
- **Semantic HTML** elements

**Example:**
```tsx
<Card className="hover-lift bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300">
  <CardHeader className="pb-4">
    <CardTitle className="text-xl font-sans leading-tight group-hover:text-primary transition-colors">
      {ebook.title}
    </CardTitle>
  </CardHeader>
</Card>
```

### File Organization

```
components/
├── auth/              # Authentication components
├── catalog/           # Book catalog components
├── layout/            # Layout components (header, footer)
├── ui/                # Reusable UI components
└── upload/            # Upload-related components

lib/
├── appwrite.ts        # Appwrite configuration
├── ebook-service.ts   # Ebook-related API calls
├── auth.ts           # Authentication utilities
└── utils.ts          # General utilities

app/
├── (routes)/         # App routes
├── globals.css       # Global styles
└── layout.tsx        # Root layout
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Check test coverage
pnpm test:coverage
```

### Writing Tests

- **Write unit tests** for utility functions
- **Write component tests** for UI components
- **Write integration tests** for critical user flows
- **Mock external dependencies** (Appwrite, etc.)

**Example Test:**
```typescript
import { render, screen } from '@testing-library/react'
import { EbookCard } from './ebook-card'

describe('EbookCard', () => {
  const mockEbook = {
    title: 'Test Book',
    author: 'Test Author',
    // ... other required fields
  }

  it('renders ebook title and author', () => {
    render(<EbookCard ebook={mockEbook} />)
    
    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })
})
```

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for functions and classes
- **README updates** for new features
- **API documentation** for service functions
- **Component prop documentation**

### Updating Documentation

- Update README.md for new features
- Add examples to component documentation
- Update setup instructions if needed
- Include screenshots for UI changes

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commits follow conventional commit format
- [ ] Branch is up to date with main

### Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Edge cases considered

## Screenshots (if applicable)
Include before/after screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (ESLint, tests, build)
2. **At least one review** from a maintainer
3. **Address feedback** and update PR
4. **Squash and merge** when approved

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Notes

- Automatically generated from conventional commits
- Manual curation for major releases
- Include migration guides for breaking changes

## 🎯 Areas for Contribution

### High Priority
- 🔍 **Search improvements**: Better search algorithms
- 📱 **Mobile experience**: Enhanced mobile UI
- ♿ **Accessibility**: WCAG compliance improvements
- 🚀 **Performance**: Optimization and caching

### Medium Priority
- 🌐 **Internationalization**: Multi-language support
- 📊 **Analytics**: Better user insights
- 🔔 **Notifications**: Real-time updates
- 🎨 **Themes**: Additional theme options

### Beginner Friendly
- 🐛 **Bug fixes**: Small issue resolution
- 📝 **Documentation**: Improving docs and examples
- 🧪 **Tests**: Adding test coverage
- 🎨 **UI polish**: Small visual improvements

## 💬 Getting Help

### Community Channels

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Real-time chat with the community
- **Email**: support@ebookshare.dev for sensitive issues

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)

## 🙏 Recognition

Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Featured in community highlights**
- **Invited to maintainer discussions** for significant contributions

Thank you for contributing to EbookShare! Together, we're building something amazing for the developer community. 🚀

---

*Questions? Feel free to reach out in GitHub Discussions or open an issue.*
