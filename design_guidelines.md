# AI To-Do Assistant Design Guidelines

## Design Approach
**System-Based Approach**: Given the productivity-focused nature and data-heavy interface, I'm selecting **Material Design 3** as the foundation. This provides excellent patterns for task management, data visualization, and clear information hierarchy while maintaining accessibility standards.

**Key Design Principles:**
- Clarity and efficiency over visual flair
- Consistent interaction patterns
- Clear visual hierarchy for task prioritization
- Seamless integration of AI suggestions into workflow

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 219 100% 42% (Deep Blue)
- Secondary: 219 20% 96% (Light Gray)
- Success: 142 76% 36% (Green)
- Warning: 38 92% 50% (Orange)
- Error: 0 84% 60% (Red)
- Premium Accent: 14 91% 60% (Coral - for premium features)

**Dark Mode:**
- Primary: 219 100% 65% (Lighter Blue)
- Secondary: 219 15% 15% (Dark Gray)
- Background: 219 20% 8% (Very Dark Blue-Gray)
- Surface: 219 15% 12% (Slightly Lighter Dark)

### B. Typography
**Primary Font:** Inter (Google Fonts)
- Headings: Inter 600 (Semibold)
- Body: Inter 400 (Regular)
- Captions/Labels: Inter 500 (Medium)

**Sizes:**
- H1: 2rem (32px)
- H2: 1.5rem (24px)
- Body: 0.875rem (14px)
- Small: 0.75rem (12px)

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Tight spacing: p-2, m-2
- Standard spacing: p-4, m-4
- Generous spacing: p-6, m-6
- Large spacing: p-8, m-8

**Grid:** 12-column responsive grid with consistent gutters

### D. Component Library

**Navigation:**
- Clean sidebar navigation with collapsible sections
- Top navigation bar with user profile and premium status indicator

**Task Components:**
- Task cards with priority color-coding (red/high, orange/medium, blue/low)
- Drag-and-drop enabled task lists
- Compact list view and detailed card view options
- AI suggestion badges with subtle coral accent

**Forms:**
- Material Design input fields with floating labels
- Date/time pickers for deadlines
- Multi-step forms for complex task creation

**Data Displays:**
- Progress rings for completion tracking
- Priority indicators using color and iconography
- AI-generated schedule timeline view

**Overlays:**
- Modal dialogs for task details and editing
- Toast notifications for actions and AI suggestions
- Premium upgrade prompts with coral theming

**Authentication:**
- Clean, centered login/signup forms
- Google OAuth button with official branding
- Password strength indicators

**Payment:**
- Tabbed interface for Stripe vs Solana payment options
- Clear pricing tiers with feature comparisons
- Transaction status indicators

### E. Animations
**Minimal and Purposeful:**
- Subtle fade-in for AI suggestions appearing
- Smooth drag-and-drop feedback
- Loading states for AI processing
- Gentle hover states on interactive elements

**No distracting animations** - focus on utility and clarity over visual effects.

## Key Interface Patterns

**Dashboard Layout:**
- Left sidebar: Navigation and filters
- Main content: Task list with AI suggestions integrated
- Right panel: Daily schedule optimization (when available)

**Task Priority Visual System:**
- Color-coded left borders on task cards
- Priority icons (high/medium/low)
- AI confidence indicators for suggestions

**Premium Features Integration:**
- Coral-colored premium badges
- Gentle upgrade prompts in natural workflow moments
- Clear visual distinction between free and premium AI features

**Responsive Behavior:**
- Mobile-first task management with swipe gestures
- Collapsible sidebar on tablet/mobile
- Touch-friendly button sizes and spacing

This design system prioritizes productivity and clarity while providing clear paths to premium features through thoughtful coral accent placement and AI suggestion integration.