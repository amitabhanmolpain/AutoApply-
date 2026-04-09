# JobBot - Automated Job Application Platform

## Overview

JobBot is a modern, futuristic SaaS platform that automates job applications across multiple job platforms. Users can upload their resume, specify target positions, select job platforms, and let AI handle the rest while tracking their applications and success metrics.

## Design & Aesthetics

- **Theme**: Futuristic Dark Mode with Purple/Cyan accents
- **Color Palette**:
  - Primary: Deep Navy (#0a0e27)
  - Secondary: Purple (#7c3aed)
  - Accent: Cyan (#06b6d4)
  - Success: Green (#10b981)
  - Warning: Amber (#f59e0b)
  - Error: Red (#ef4444)

- **Visual Effects**:
  - Glassmorphism with backdrop blur
  - Gradient text and buttons
  - Neon glows and shadows
  - Smooth animations and transitions
  - Responsive design (mobile-first)

## Pages & Routes

### 1. **Home Page** (`/`)
- Hero section with CTA buttons
- Job platforms showcase
- Features grid with icons
- How it works section
- Success statistics
- Call-to-action section
- Professional footer

### 2. **Dashboard** (`/dashboard`)
- Overview of all features
- Quick access to Setup, Analytics, and Applications
- Key stats display
- Navigation cards with icons

### 3. **Setup** (`/setup`)
- Resume upload with drag-and-drop
- Job title input
- Platform selection (6 major platforms)
- Auto-apply button with toast notifications
- Info boxes and tips

### 4. **Analytics** (`/analytics`)
- Real-time metrics (4 KPIs)
- Bar chart for weekly applications
- Pie chart for application status breakdown
- Status breakdown table
- Color-coded metrics with icons

### 5. **Applications** (`/applications`)
- Searchable application list
- Filter by status (All, Accepted, Rejected, Pending)
- Table with company, position, platform, status, and date
- Status indicators with icons and colors
- Summary statistics

### 6. **Settings** (`/settings`)
- Profile settings (name, email)
- Notification preferences
- Security settings (2FA)
- Danger zone for account actions
- Save functionality with confirmation

## Components

### Navbar (`components/navbar.tsx`)
- Fixed navigation with logo
- Desktop menu items
- Mobile hamburger menu
- Active route highlighting
- CTA button

### Footer (`components/footer.tsx`)
- Brand information
- Product links
- Support links
- Legal links
- Social media links

## Features

- **Multi-platform Support**: LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster, Dice
- **Smart Resume Upload**: PDF and DOC file support
- **Job Filtering**: Select specific job titles and platforms
- **Real-time Notifications**: Toast notifications for all user actions (using Sonner)
- **Advanced Analytics**: Charts and metrics for application tracking
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Glassmorphism UI**: Modern, futuristic design aesthetic
- **Icon Integration**: Lucide React icons throughout the app
- **Accessibility**: Semantic HTML and ARIA labels

## Dependencies

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS v4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Recharts**: Chart library for analytics
- **Sonner**: Toast notification library
- **Vercel Analytics**: Analytics tracking

## Key Design Patterns

1. **Glassmorphism**: Used in cards, modals, and sections with `@apply glassmorphism`
2. **Gradient Text**: Applied to headings with `@apply gradient-text`
3. **Gradient Buttons**: CTA buttons with `@apply gradient-button`
4. **Neon Glow**: Accent elements with `@apply neon-glow`
5. **Color-coded Status**: Green for success, red for errors, amber for pending

## File Structure

```
app/
├── page.tsx                 # Home page
├── layout.tsx              # Root layout with Sonner provider
├── globals.css             # Theme and component styles
├── dashboard/
│   └── page.tsx           # Dashboard page
├── setup/
│   └── page.tsx           # Setup page
├── analytics/
│   └── page.tsx           # Analytics page
├── applications/
│   └── page.tsx           # Applications page
└── settings/
    └── page.tsx           # Settings page

components/
├── navbar.tsx             # Navigation bar
└── footer.tsx             # Footer component
```

## Customization

### Colors
Edit `/app/globals.css` to modify the color variables:
- `--background`: Main background color
- `--primary`: Primary brand color
- `--accent`: Accent color
- Chart colors for analytics

### Typography
Fonts are configured in `globals.css` using Geist font family.

### Components
All component styles use Tailwind CSS classes for easy customization.

## Getting Started

1. **Install dependencies**: `pnpm install`
2. **Run development server**: `pnpm dev`
3. **Open browser**: Navigate to `http://localhost:3000`

## Usage Flow

1. User lands on home page
2. Clicks "Get Started" or "Start Automating"
3. Directed to Dashboard with feature overview
4. Navigates to Setup page
5. Uploads resume and selects preferences
6. Clicks "Start Auto Apply"
7. Receives toast notification confirmation
8. Can view analytics and track applications
9. Manages settings as needed

## Toast Notifications

The app uses Sonner for notifications:
- **Success**: Green toast for successful actions
- **Error**: Red toast for validation errors
- **Loading**: Loading state during operations
- **Info**: Blue toast for informational messages

All notifications appear in the top-right corner with a close button.

## Future Enhancements

- Backend API integration for data persistence
- Database for storing user applications
- Real AI-powered job matching algorithm
- Email notifications
- Social sharing features
- Interview preparation tools
- Integration with LinkedIn API

---

Built with ❤️ using Next.js and Tailwind CSS
