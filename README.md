# HNL Portal - Enterprise Business Management System

## 📋 Overview

The HNL Portal is a comprehensive enterprise business management system built for Highnoon Laboratories Limited. It provides a unified platform for managing various business processes including capital expenditure (CAPEX) approvals, sales performance tracking, and administrative workflows.

## 🏗️ System Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with Shadcn/ui components
- **State Management**: TanStack React Query + Zustand
- **Forms**: React Hook Form with Zod validation
- **Charts**: ApexCharts, Recharts, Chart.js
- **Authentication**: NextAuth.js
- **Icons**: Lucide React, Iconify
- **Maps**: Leaflet, Google Maps
- **Calendar**: FullCalendar
- **Rich Text**: CKEditor, Quill

### Project Structure
```
hnl-portal/
├── app/                                    # Next.js App Router
│   ├── [lang]/                             # Internationalization
│   │   ├── (auth)/                         # Authentication pages
│   │   ├── (main)/                         # Main application
│   │   │   ├── (capx)/                     # CAPEX Management System
│   │   │   └── (dashboards)/               # Dashboard modules
│   │   │   └── (profiling-targeting)/      # customer profiling and targeting modules
│   │   └── product-launch/                 # Product launch pages
│   └── api/                                # API routes
├── components/                             # Reusable UI components
├── config/                                 # Configuration files
├── hooks/                                  # Custom React hooks
├── lib/                                    # Utility libraries
├── provider/                               # Context providers
├── store/                                  # State management
└── public/                                 # Static assets
```

## 🚀 Core Modules

### 1. Dashboard System
#### PS Performance Dashboard
- **Purpose**: Track pharmaceutical sales performance
- **Features**:
  - Sales vs Target analysis
  - Brand performance metrics
  - Expense tracking
  - Incentive calculations
  - SFA (Sales Force Automation) performance
- **Components**: Charts, tables, metrics cards
- **Data Sources**: Sales APIs, performance metrics

#### Booker Sales Performance Dashboard
- **Purpose**: Monitor booker sales performance
- **Features**:
  - Sales distribution analysis
  - Day-wise sales tracking
  - MTD (Month-to-Date) performance
  - YTD (Year-to-Date) analysis
  - Total universe metrics
- **Components**: Interactive charts, performance tables
- **Analytics**: Real-time sales data visualization

### 2. CAPEX Management System
#### Dashboard
- **Purpose**: Central hub for CAPEX operations
- **Features**:
  - Overview of all CAPEX requests
  - Status tracking and monitoring
  - Quick access to key metrics
- **Components**: Summary cards, status indicators

#### My Requests
- **Purpose**: User's personal CAPEX requests
- **Features**:
  - Create new CAPEX requests
  - Edit existing requests
  - Track request status
  - View request history
- **Components**: Request forms, status tracking, history view

#### My Tasks
- **Purpose**: Tasks assigned to the user
- **Features**:
  - Pending approvals
  - Task assignments
  - Action items
  - Due date tracking
- **Components**: Task lists, action buttons, status indicators

#### Types Management
- **Purpose**: Manage CAPEX types
- **Features**:
  - CRUD operations for CAPEX types
  - Type categorization
  - Status management
  - Bulk operations
- **Components**: Data tables, forms, grid views

#### Purposes Management
- **Purpose**: Manage CAPEX purposes
- **Features**:
  - Purpose categorization
  - Description management
  - Status tracking
  - Bulk operations
- **Components**: Purpose forms, data tables

#### Currencies Management
- **Purpose**: Manage currency configurations
- **Features**:
  - Currency CRUD operations
  - Exchange rate management
  - Default currency settings
  - Status toggling
- **Components**: Currency forms, rate displays

#### Approval Workflow
- **Purpose**: Configure approval hierarchies
- **Features**:
  - Multi-level approval workflows
  - User assignment to approval levels
  - SLA configuration
  - Workflow templates
- **Components**: Hierarchy editor, workflow designer

### 3. User Management
#### Profile Management
- **Purpose**: User profile and settings
- **Features**:
  - Personal information management
  - Profile picture upload
  - Settings configuration
  - Account preferences
- **Components**: Profile forms, image upload, settings panels

## 🎨 User Interface Design

### Design System
- **Component Library**: Shadcn/ui with custom extensions
- **Color Scheme**: Professional business colors
- **Typography**: Modern, readable fonts
- **Spacing**: Consistent spacing system
- **Responsive**: Mobile-first design approach

### Layout Components
- **Header**: Navigation, user menu, notifications
- **Sidebar**: Main navigation, collapsible
- **Content Area**: Dynamic content based on route
- **Footer**: System information, links

### UI Patterns
- **Data Tables**: Sortable, filterable, paginated
- **Grid Views**: Card-based layouts
- **Forms**: Multi-step, validated forms
- **Modals**: Sheet-based overlays
- **Charts**: Interactive data visualization

## 🔧 Technical Implementation

### State Management
```typescript
// React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData
});

// Zustand for client state
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));
```

### API Integration
```typescript
// Centralized API configuration
const api = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// React Query hooks
export const useCapexList = () => {
  return useQuery({
    queryKey: ['capex-list'],
    queryFn: getCapexList
  });
};
```

### Form Handling
```typescript
// React Hook Form with Zod validation
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email')
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { name: '', email: '' }
});
```

## 📊 Data Management

### Data Models
```typescript
// CAPEX Request
interface CapxRequest {
  id: number;
  title: string;
  initiator: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  items: CapxItem[];
  approvals: Approval[];
}

// User Profile
interface User {
  id: number;
  pno: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  avatar_url?: string;
}
```

### API Endpoints
```typescript
// CAPEX Management
const endpoints = {
  capexList: '/v1/gateway/eworkflow/api/capex',
  capexSubmit: '/v1/gateway/eworkflow/api/capex/submit',
  capexTypes: '/v1/gateway/eworkflow/api/capex/types',
  currencies: '/v1/gateway/eworkflow/api/capex/currencies',
  purposes: '/v1/gateway/eworkflow/api/capex/purposes'
};

// Dashboard APIs
const dashboardEndpoints = {
  psPerformance: '/v1/gateway/ps-performance/api',
  bookerSales: '/v1/gateway/booker-sales/api'
};
```

## 🔐 Security & Authentication

### Authentication Flow
- **NextAuth.js**: JWT-based authentication
- **Session Management**: Secure session handling
- **Role-Based Access**: User role permissions
- **Route Protection**: Middleware-based protection

### Security Features
- **Input Validation**: Zod schema validation
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: API rate limiting

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
2xl: '1536px' /* 2X large devices */
```

### Mobile Optimization
- **Touch-Friendly**: Large touch targets
- **Swipe Gestures**: Mobile navigation
- **Offline Support**: Service worker caching
- **Performance**: Optimized for mobile networks

## 🌐 Internationalization

### Multi-Language Support
- **Languages**: English, Arabic, Bengali
- **Implementation**: Next.js i18n
- **Translation Files**: JSON-based translations
- **RTL Support**: Right-to-left language support

### Language Configuration
```typescript
// Language detection and routing
const locales = ['en', 'ar', 'bn'];
const defaultLocale = 'en';

// Translation usage
const t = useTranslations('common');
return <h1>{t('welcome')}</h1>;
```

## 📈 Performance Optimization

### Code Splitting
- **Route-Based**: Automatic code splitting
- **Component-Based**: Lazy loading components
- **Bundle Analysis**: Webpack bundle analyzer

### Caching Strategy
- **Static Generation**: Pre-built pages
- **Server-Side Rendering**: Dynamic content
- **Client-Side Caching**: React Query cache
- **CDN Integration**: Static asset delivery

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Bundle Size**: Optimized JavaScript bundles
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Self-hosted fonts

## 🧪 Testing Strategy

### Testing Types
- **Unit Tests**: Component testing
- **Integration Tests**: API integration
- **E2E Tests**: User journey testing
- **Performance Tests**: Load testing

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **Storybook**: Component documentation

## 🚀 Deployment

### Environment Configuration
```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000

# Production
NEXT_PUBLIC_API_URL=https://api.hnl.com
NEXT_PUBLIC_GATEWAY_URL=https://gateway.hnl.com
```

### Build Process
```bash
# Development
npm run dev

# Production Build
npm run build
npm run start

# Linting
npm run lint
```

### Deployment Platforms
- **Vercel**: Primary deployment platform
- **Docker**: Containerized deployment
- **AWS**: Cloud infrastructure
- **CDN**: Global content delivery

## 📚 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Husky**: Git hooks

### Git Workflow
- **Feature Branches**: Feature development
- **Pull Requests**: Code review process
- **Semantic Versioning**: Version management
- **Conventional Commits**: Commit message format

### Component Guidelines
```typescript
// Component structure
interface ComponentProps {
  title: string;
  children: React.ReactNode;
  onAction?: () => void;
}

export function Component({ title, children, onAction }: ComponentProps) {
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

## 🔄 API Integration

### REST API Design
- **RESTful Endpoints**: Standard HTTP methods
- **JSON Responses**: Consistent data format
- **Error Handling**: Standardized error responses
- **Pagination**: Cursor-based pagination

### GraphQL Integration
- **Query Optimization**: Efficient data fetching
- **Real-time Updates**: Subscription support
- **Type Safety**: Generated TypeScript types
- **Caching**: Apollo Client caching

## 📊 Analytics & Monitoring

### Analytics Integration
- **Vercel Analytics**: Performance monitoring
- **Google Analytics**: User behavior tracking
- **Custom Metrics**: Business-specific analytics
- **Error Tracking**: Sentry integration

### Monitoring Tools
- **Performance Monitoring**: Core Web Vitals
- **Error Tracking**: Real-time error reporting
- **User Analytics**: Usage patterns
- **Business Metrics**: KPI tracking

## 🛠️ Development Tools

### Development Environment
- **VS Code**: Primary IDE
- **Extensions**: TypeScript, Tailwind CSS
- **Debugging**: React DevTools
- **Hot Reload**: Fast refresh

### Build Tools
- **Webpack**: Module bundling
- **Babel**: JavaScript compilation
- **PostCSS**: CSS processing
- **TypeScript**: Type checking

## 📖 Documentation

### Code Documentation
- **JSDoc**: Function documentation
- **README Files**: Module documentation
- **API Docs**: Endpoint documentation
- **Component Docs**: Storybook stories

### User Documentation
- **User Guides**: Step-by-step instructions
- **Video Tutorials**: Screen recordings
- **FAQ**: Common questions
- **Support**: Help desk integration

## 🔮 Future Roadmap

### Planned Features
- **Mobile App**: React Native application
- **Advanced Analytics**: Business intelligence
- **AI Integration**: Machine learning features
- **Microservices**: Service-oriented architecture

### Technical Improvements
- **Performance**: Further optimization
- **Accessibility**: WCAG 2.1 compliance
- **Security**: Enhanced security measures
- **Scalability**: Horizontal scaling

## 📞 Support & Maintenance

### Support Channels
- **Technical Support**: support@hnl.com
- **Documentation**: docs@hnl.com
- **Feature Requests**: features@hnl.com
- **Bug Reports**: bugs@hnl.com

### Maintenance Schedule
- **Regular Updates**: Monthly releases
- **Security Patches**: As needed
- **Performance Reviews**: Quarterly
- **User Feedback**: Continuous

## 📄 License & Legal

### License Information
- **Proprietary Software**: Highnoon Laboratories Limited
- **All Rights Reserved**: Copyright protection
- **Usage Terms**: Internal use only
- **Data Privacy**: GDPR compliance

### Legal Compliance
- **Data Protection**: User privacy protection
- **Security Standards**: Industry best practices
- **Accessibility**: ADA compliance
- **International**: Multi-jurisdiction support

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: HNL Development Team  
**Contact**: dev@hnl.com