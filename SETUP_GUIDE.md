# JobBot - Setup & Navigation Guide

## Welcome to JobBot!

Your futuristic job application automation platform is now live. Here's how to navigate and use the application.

## Navigation Structure

### Home Page (/)
**Your landing page** - First thing users see when they visit JobBot.

Features:
- Hero section with animated gradient text
- Statistics showing platform success metrics (10K+ apps, 95% success rate)
- Job platform showcase (LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster, Dice)
- 6 key features with icons and descriptions
- How it works step-by-step guide
- Call-to-action buttons leading to Dashboard
- Professional footer with links

**How to reach it**: Click "Home" in navbar or "JobBot" logo

---

### Dashboard (/dashboard)
**Your control center** - Overview of all features.

Features:
- Quick access cards for Setup, Auto Apply, Analytics, and Settings
- Color-coded feature cards with icons and descriptions
- Quick statistics dashboard
- Organized grid layout for easy navigation

**How to reach it**: 
- Click "Dashboard" in navbar
- Click "Start Automating" button on home page
- Click "Get Started" button on home page

---

### Setup (/setup)
**Configure your job search** - Where the magic happens!

Features:
- Resume upload (drag-and-drop support)
- Accepts PDF and DOC files
- Job title input field
- Platform selection (6 major job boards)
- Visual checkmarks for selected platforms
- Auto Apply button with loading state
- Toast notifications for success/error feedback
- Pro tips information box

**How to reach it**:
- Click "Setup" in navbar
- Click "Setup Profile" card on Dashboard
- Click "Auto Apply" feature on Dashboard

**What to do**:
1. Drag and drop your resume or click to browse
2. Enter the job title you're targeting (e.g., "Senior Software Engineer")
3. Click on the platform logos to select where you want to apply
4. Click "Start Auto Apply" button
5. Watch for success toast notification

---

### Analytics (/analytics)
**Track your success** - Visual insights into your applications.

Features:
- 4 Key Metrics:
  - Total Applications (Cyan)
  - Success Rate (Green)
  - Response Rate (Purple)
  - Rejection Rate (Red)
- Bar chart showing applications over the week
- Pie chart with application status breakdown
- Detailed status table with percentages
- Color-coded indicators for each status

**How to reach it**:
- Click "Analytics" in navbar
- Click "View Analytics" card on Dashboard

**What to expect**:
- Real-time data visualization
- Interactive charts with hover tooltips
- Status breakdown percentages
- Weekly application trends

---

### Applications (/applications)
**Monitor all your applications** - Detailed application list.

Features:
- Searchable applications table
- Filter by status (All, Accepted, Rejected, Pending)
- Columns: Company, Position, Platform, Status, Date
- Status badges with icons and colors:
  - Green checkmark = Accepted
  - Red X = Rejected
  - Yellow clock = Pending
- Summary statistics at the bottom
- Real-time search functionality

**How to reach it**:
- Click "Applications" in navbar
- Click "My Applications" on Dashboard

**How to use**:
1. Search for companies or positions in the search bar
2. Filter by status using the dropdown
3. Review all your applications in the table
4. Track response rates and success metrics

---

### Settings (/settings)
**Customize your experience** - Manage your account.

Sections:
1. **Profile Settings**
   - Full Name
   - Email Address

2. **Notifications**
   - Job Alerts
   - Application Updates
   - Weekly Reports

3. **Security**
   - Two-Factor Authentication

4. **Danger Zone**
   - Reset All Data button

**How to reach it**:
- Click "Settings" in navbar
- Click "Settings" card on Dashboard

**How to use**:
1. Update your profile information
2. Toggle notification preferences
3. Enable/disable security features
4. Click "Save Settings" to apply changes
5. Receive confirmation toast notification

---

## Toast Notifications

The app uses Sonner for beautiful notifications in the top-right corner:

**Success Notifications** (Green)
- "Resume uploaded: filename.pdf"
- "Successfully applied to 12 jobs!"
- "Settings saved successfully!"

**Error Notifications** (Red)
- "Please upload your resume"
- "Please enter a job title"
- "Please upload a PDF or DOC file"

**Loading Notifications** (Blue)
- "Starting auto-apply process..."
- "Saving settings..."

All notifications have a close button for instant dismissal.

---

## Design Features

### Color Scheme
- **Primary**: Deep Navy (#0a0e27) - Background
- **Secondary**: Purple (#7c3aed) - Brand color, buttons, accents
- **Accent**: Cyan (#06b6d4) - Highlights, secondary CTAs
- **Status Colors**:
  - Green (#10b981) - Success/Accepted
  - Red (#ef4444) - Error/Rejected
  - Amber (#f59e0b) - Warning/Pending

### Visual Effects
- **Glassmorphism**: Frosted glass effect on cards
- **Gradient Text**: Purple to Cyan gradient on headings
- **Neon Glow**: Glowing shadows on logo and important elements
- **Smooth Animations**: Transitions and hover effects throughout

### Icons
All icons from Lucide React:
- Navbar: Menu, Close, Zap
- Features: BarChart, Shield, Rocket, Brain, Sparkles, Upload, Zap, Settings
- Status: CheckCircle, XCircle, Clock
- Actions: ArrowRight, Search, Filter, Save

---

## Mobile Experience

The application is fully responsive:
- **Mobile**: Hamburger menu, single column layouts, optimized touch targets
- **Tablet**: 2-column grids, adjusted spacing
- **Desktop**: Full 3-4 column layouts, side-by-side content

---

## Quick Tips

1. **Resume Upload**: Make sure your resume is updated before uploading
2. **Job Title**: Be specific with your job title for better matching (e.g., "Senior React Developer" not just "Developer")
3. **Platforms**: Select platforms where you're most likely to find relevant jobs
4. **Track Progress**: Check Analytics regularly to monitor your success rate
5. **Notifications**: Enable email notifications to stay updated on responses

---

## Troubleshooting

**Notifications not showing?**
- Check top-right corner of the screen
- Notifications auto-dismiss after a few seconds
- Click elsewhere to see new notifications

**Can't select platforms?**
- Click directly on the platform card
- Look for the checkmark icon to confirm selection
- Selected platforms will have a purple background

**Need to view applications?**
- Go to Applications page
- Use search or filter to find specific applications
- Check the status column for response information

---

## What's Next?

This is a **frontend-only** version. Future updates will include:
- Backend API integration for data persistence
- Real AI-powered job matching
- Email notifications
- Integration with LinkedIn API
- Interview preparation tools
- Job recommendations based on resume analysis

---

**Happy job hunting! Let JobBot do the heavy lifting while you prepare for your dream role.** 🚀
