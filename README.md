# ShadowSite - Modern Next.js Shadow Website

A modern shadow-themed website built with Next.js, TypeScript, and Supabase for authentication and database.

## Features

- Modern design with shadow theme and animations
- Fully responsive layout for all devices
- Fast performance with Next.js App Router and Turbopack
- TypeScript for type safety and better developer experience
- User authentication with Supabase (login, signup, password reset)
- User profiles with database storage and form validation
- Dark mode by default with shadow effects
- Server Actions for form submissions
- Server Components for improved performance
- Client-side form validation with Zod and React Hook Form

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

6. Open [http://localhost:3001](http://localhost:3001) in your browser to see the result.

## Authentication Flow

1. Users can sign up with email and password
2. Upon signup, a profile is automatically created
3. Users can update their profile information
4. Authentication state is maintained across the app using AuthContext
5. Password reset functionality is available

## Security Best Practices

The application implements several security best practices:

1. **Secure User Verification**: Uses Supabase's `getUser()` method when available to securely verify the user on the client side, with a fallback to session user for backward compatibility.
2. **Server-Side Session Handling**: Middleware uses `getSession()` for efficient authentication checks without exposing user data.
3. **Server Component Security**: Comments in server components highlight the need for additional verification in production environments.
4. **Graceful Degradation**: The authentication context includes fallback mechanisms and proper error handling to ensure security without breaking functionality.
5. **Type Safety**: TypeScript is used throughout the application to prevent type-related security issues.
6. **Form Validation**: Both client-side and server-side validation using Zod schemas.
7. **Protected Routes**: Middleware ensures that protected routes are only accessible to authenticated users.

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

- `src/app/`: Next.js App Router pages and layouts
  - `page.tsx`: Home page
  - `layout.tsx`: Root layout with AuthProvider
  - `about/`: About page
  - `blog/`: Blog page
  - `contact/`: Contact page with form
  - `login/`: Login page
  - `profile/`: User profile page
  - `forgot-password/`: Password reset page
  - `auth/`: Authentication-related pages
  - `services/`: Services page
- `src/components/`: Reusable UI components
  - `Navbar.tsx`: Navigation bar
  - `Footer.tsx`: Footer component
  - `Hero.tsx`: Hero section
  - `Features.tsx`: Features section
  - `ProfileForm.tsx`: User profile form
  - `ContactForm.tsx`: Contact form
  - `SimpleCard.tsx`: Simple card component
  - `AnimatedCard.tsx`: Animated card component
  - `FeatureCard.tsx`: Feature card component
- `src/lib/`: Utility functions and services
  - `supabase.ts`: Client-side Supabase client
  - `supabase-server.ts`: Server-side Supabase client
  - `supabase-server-utils.ts`: Utility functions for server-side Supabase
  - `validations/`: Zod validation schemas
- `src/context/`: React context providers
  - `AuthContext.tsx`: Authentication context provider
- `src/actions/`: Server actions
  - `auth.ts`: Authentication-related server actions
  - `profile.ts`: Profile-related server actions
- `src/__tests__/`: Test files
- `src/middleware.ts`: Next.js middleware for route protection

## Technologies Used

- Next.js 15.x (App Router)
- TypeScript 5.x
- Tailwind CSS 4.x
- Framer Motion 12.x
- React Hook Form 7.x
- Zod 3.x
- Supabase 2.49.x (Auth, Database)
- React 19.x
- Jest 29.x
- React Testing Library 16.x
- Turbopack (for development)
