# Contributing to OrderWeather

Thank you for considering contributing to OrderWeather! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Error messages and logs**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit with clear messages**
6. **Submit the pull request**

## Development Setup

See [QUICKSTART.md](./QUICKSTART.md) for development environment setup.

## Coding Standards

### Backend (Node.js)

- Use ES6+ features
- Use async/await for asynchronous operations
- Follow RESTful API conventions
- Add error handling to all async operations
- Use meaningful variable and function names
- Comment complex logic

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use PropTypes or TypeScript for type checking
- Follow React best practices
- Keep CSS organized and maintainable

### General

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings (except in React JSX)
- Keep lines under 100 characters where possible
- Remove trailing whitespace

## Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add payment refund functionality
Fix weather API date parsing bug
Update README with deployment instructions
```

## Project Structure

```
orderweather/
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   └── tests/            # Backend tests
│
└── frontend/             # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   └── utils/        # Utility functions
    └── tests/            # Frontend tests
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

Always test these flows before submitting:
1. Create order flow
2. Payment flow
3. Order status display
4. Error handling

## Feature Development Workflow

1. **Discuss** - Open an issue to discuss the feature
2. **Design** - Plan the implementation
3. **Implement** - Write code following standards
4. **Test** - Add and run tests
5. **Document** - Update relevant documentation
6. **Review** - Submit PR for review

## Areas for Contribution

### High Priority

- [ ] Add user authentication
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Multiple weather providers
- [ ] More payment methods (PayPal)

### Medium Priority

- [ ] Order history page
- [ ] More weather conditions (wind speed, humidity)
- [ ] Custom pricing
- [ ] Localization (i18n)
- [ ] Mobile app

### Low Priority

- [ ] Social sharing
- [ ] Weather statistics
- [ ] Referral program
- [ ] Gift orders

## Documentation

Help improve documentation:
- Fix typos and clarify unclear sections
- Add examples and use cases
- Update outdated information
- Translate to other languages

## Questions?

Feel free to open an issue with the label `question` if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC).

Thank you for contributing! 🎉
