# ShadowSite - Modern Next.js Shadow Website

A modern shadow-themed website built with Next.js, TypeScript, and Supabase for authentication and database.

## Features

- Modern design with shadow theme
- Responsive layout
- Fast performance with Next.js
- TypeScript for type safety
- User authentication with Supabase
- User profiles with database storage
- Dark mode by default
- Customizable components

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account (free tier works fine)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shadowsite.git
   cd shadowsite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com)
   - Get your project URL and anon key from the API settings
   - Create a `.env.local` file in the root directory with the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. Run the SQL migration:
   - Go to the SQL editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/20240715_initial_schema.sql`
   - Run the SQL to set up the profiles table and triggers

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Authentication Flow

1. Users can sign up with email and password
2. Upon signup, a profile is automatically created
3. Users can update their profile information
4. Authentication state is maintained across the app

## Database Schema

### Profiles Table

| Column      | Type      | Description                       |
|-------------|-----------|-----------------------------------|
| id          | UUID      | Primary key, linked to auth.users |
| username    | TEXT      | Unique username                   |
| full_name   | TEXT      | User's full name                  |
| avatar_url  | TEXT      | URL to user's avatar              |
| website     | TEXT      | User's website                    |
| updated_at  | TIMESTAMP | Last update timestamp             |

## Deployment

This project can be deployed on Vercel, Netlify, or any other platform that supports Next.js.

1. Push your code to a GitHub repository
2. Connect your repository to Vercel or Netlify
3. Add your environment variables (Supabase URL and anon key)
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Testing

This project uses Jest and React Testing Library for testing. The following test scripts are available:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- Unit tests for components are in `src/__tests__/components/`
- Validation schema tests are in `src/__tests__/lib/validations/`

### Writing Tests

When writing tests, follow these guidelines:

1. **Component Tests**: Test the rendering and behavior of components
2. **Validation Tests**: Test the validation logic for forms
3. **Mock Dependencies**: Use Jest mocks for external dependencies

Example component test:
```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Project Structure

- `src/app/`: Next.js App Router pages
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions and validation schemas
- `src/__tests__/`: Test files

## Technologies Used

- Next.js 15.x
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Jest
- React Testing Library
