# Digital Campus Demo - 数字化校园前端演示系统

> 一个完整的数字化校园管理系统前端演示，支持多角色权限控制，使用React、TypeScript和现代Web技术构建。

## 🎯 项目概述

这是一个完整的数字化校园管理系统前端演示，展示以下功能：

- **多角色权限控制**: 学生、教师、教研组长、校长和管理员角色
- **现代化UI/UX**: 响应式设计，支持深色/浅色主题
- **国际化支持**: 英文和中文语言支持
- **模拟API系统**: 使用MSW (Mock Service Worker) 完整模拟后端
- **实时功能**: 消息、通知和仪表板分析

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yorhagengyue/CamousDemo2.git
   cd CamousDemo2
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问 `http://localhost:5173`

## 🎭 Demo Login

The system includes 5 pre-configured demo accounts for different roles:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Student** | student@demo.com | password | Student dashboard with courses, attendance, and messaging |
| **Teacher** | teacher@demo.com | password | Teacher interface for classroom management |
| **HOD** | hod@demo.com | password | Head of Department with oversight capabilities |
| **Principal** | principal@demo.com | password | Principal dashboard with KPI analytics |
| **Admin** | admin@demo.com | password | System administration and user management |

> **Note**: All accounts use the same password for demo purposes. In production, this would be handled by proper authentication services.

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6 with role-based guards
- **API Mocking**: MSW (Mock Service Worker)
- **Internationalization**: react-i18next
- **Charts**: Recharts
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/                    # Application routing and layout
├── components/             # Reusable UI components
│   ├── layout/            # Header, Sidebar, etc.
│   └── ui/                 # shadcn/ui components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── dashboard/         # Role-based dashboards
│   ├── messages/          # Messaging system
│   ├── courses/           # Course management
│   ├── profiles/          # User profiles
│   ├── attendance/        # Attendance tracking
│   ├── leaves/            # Leave management
│   ├── reports/           # KPI and analytics
│   └── admin/             # Administration
├── fixtures/              # Mock data files
├── mocks/                 # MSW handlers
├── stores/                # Zustand stores
├── types/                 # TypeScript definitions
├── i18n/                  # Internationalization
└── utils/                 # Utility functions
```

## 🎨 Features

### 🔐 Authentication & Authorization
- **Multi-provider Login**: Simulated Google/Singpass integration
- **Role-based Access Control**: Dynamic UI based on user permissions
- **Privacy Consent**: GDPR-compliant consent modal

### 📊 Dashboards
- **Student Dashboard**: Personal courses, attendance, messages
- **Teacher Dashboard**: Classroom management, student oversight
- **Principal Dashboard**: School-wide KPIs and analytics
- **Admin Dashboard**: System administration and user management

### 💬 Communication
- **Internal Messaging**: Send and receive messages between users
- **Notifications**: Real-time notification system
- **Message Status**: Read/unread indicators

### 📚 Course Management
- **Course Catalog**: Browse available courses
- **Course Details**: Detailed course information
- **Enrollment**: Course selection and enrollment tracking

### 👥 User Management
- **Student Profiles**: Academic information and progress
- **Teacher Profiles**: Teaching assignments and schedules
- **Role Management**: Admin interface for user roles

### 📈 Analytics & Reporting
- **KPI Dashboard**: Key performance indicators
- **Attendance Reports**: Attendance tracking and analytics
- **Audit Logs**: System activity monitoring

## 🌐 Internationalization

The application supports multiple languages:
- **English** (en)
- **Chinese** (zh)

Language switching is available in the header navigation.

## 🎨 Theming

The application includes:
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern dark mode
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mock Data

The application uses MSW (Mock Service Worker) to simulate backend APIs. Mock data is stored in the `src/fixtures/` directory:

- `users.json` - User accounts and profiles
- `messages.json` - Internal messages
- `courses.json` - Course catalog
- `attendance.json` - Attendance records
- `leaves.json` - Leave requests
- `kpi.json` - Key performance indicators

### Adding New Features

1. Create feature directory in `src/features/`
2. Add route in `src/app/router.tsx`
3. Update navigation in `src/components/layout/Sidebar.tsx`
4. Add mock data handlers in `src/mocks/handlers.ts`
5. Update TypeScript types in `src/types/index.ts`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_APP_TITLE=Digital Campus Demo
VITE_API_BASE_URL=/api
```

### TailwindCSS Configuration

The project uses TailwindCSS with custom configuration in `tailwind.config.js`:

- Custom color palette
- Responsive breakpoints
- Animation utilities
- Component variants

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🧪 Testing

The application includes comprehensive error handling and fallback mechanisms:

- **API Error Handling**: Graceful degradation when APIs fail
- **Fallback Data**: Local fixture data as backup
- **Loading States**: User-friendly loading indicators
- **Error Boundaries**: React error boundaries for component errors

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options

- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload to S3 bucket with CloudFront distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yorhagengyue/CamousDemo2/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core authentication and authorization
- ✅ Role-based dashboards
- ✅ Messaging system
- ✅ Course management
- ✅ User profiles
- ✅ Analytics and reporting

### Phase 2 (Future)
- 🔄 Academic assessment tools
- 🔄 Asset management
- 🔄 Maintenance request system
- 🔄 Advanced analytics
- 🔄 Mobile app integration

---

**Built with ❤️ for digital education transformation**

