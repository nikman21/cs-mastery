/*
 * Next.js 14 App Router Examples
 * Week 1 - Full-Stack Development
 * 
 * This file demonstrates:
 * - Server vs Client Components
 * - App Router patterns
 * - Data fetching strategies
 * - Component composition
 */

import React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================================================
// 1. SERVER COMPONENTS (Default in App Router)
// ============================================================================

// Server Component - can fetch data directly
async function BlogList() {
  // This runs on the server
  const posts = await fetchPosts();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Server Component with async data fetching
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(userId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <PostPreview key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. CLIENT COMPONENTS
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from 'react';

// Client Component - uses React hooks
function Counter() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <span className="text-2xl font-bold">{count}</span>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Client Component with form handling
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {submitStatus === 'success' && (
        <p className="text-green-600 text-sm">Message sent successfully!</p>
      )}
      
      {submitStatus === 'error' && (
        <p className="text-red-600 text-sm">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}

// ============================================================================
// 3. HYBRID PATTERNS
// ============================================================================

// Server Component that renders Client Components
async function Dashboard() {
  const stats = await fetchDashboardStats();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Server-rendered stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Active Sessions" value={stats.activeSessions} />
        <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
      </div>
      
      {/* Client component for interactive features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <QuickActions />
      </div>
      
      {/* Another client component */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityFeed />
      </div>
    </div>
  );
}

// Server Component for static content
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Client Component for interactive features
"use client";

function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  
  const actions = [
    { id: 'create-user', label: 'Create User', icon: '👤' },
    { id: 'generate-report', label: 'Generate Report', icon: '📊' },
    { id: 'send-notification', label: 'Send Notification', icon: '🔔' },
  ];
  
  const handleAction = async (actionId: string) => {
    setSelectedAction(actionId);
    
    try {
      await fetch(`/api/actions/${actionId}`, { method: 'POST' });
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setSelectedAction(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => handleAction(action.id)}
          disabled={selectedAction === action.id}
          className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="text-2xl">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}

// Client Component for real-time updates
"use client";

function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch initial activities
    fetchActivities().then(setActivities).finally(() => setIsLoading(false));
    
    // Set up real-time updates (WebSocket or polling)
    const interval = setInterval(() => {
      fetchActivities().then(setActivities);
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>;
  }
  
  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

// ============================================================================
// 4. LAYOUT COMPONENTS
// ============================================================================

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

// Header component
function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            MyApp
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

// Client component for user menu
"use client";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Fetch user data
    fetchUser().then(setUser);
  }, []);
  
  if (!user) {
    return (
      <div className="flex space-x-4">
        <Link href="/login" className="text-gray-700 hover:text-gray-900">
          Login
        </Link>
        <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign Up
        </Link>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <Image
          src={user.avatar}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{user.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Settings
          </Link>
          <button
            onClick={() => {/* Handle logout */}}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MyApp</h3>
            <p className="text-gray-300">
              Building the future of web applications.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 MyApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// 5. DATA FETCHING PATTERNS
// ============================================================================

// Server-side data fetching
async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
}

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${userId}`, {
    next: { tags: ['user'] } // Cache with tag
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
}

async function fetchUserPosts(userId: string): Promise<Post[]> {
  const response = await fetch(`https://api.example.com/users/${userId}/posts`, {
    next: { tags: ['user-posts'] }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user posts');
  }
  
  return response.json();
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('https://api.example.com/dashboard/stats', {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  
  return response.json();
}

// Client-side data fetching
"use client";

async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch('/api/activities');
  
  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }
  
  return response.json();
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/user');
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    return null;
  }
}

// ============================================================================
// 6. ERROR BOUNDARIES & LOADING STATES
// ============================================================================

// Error boundary component
"use client";

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Suspense wrapper
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

// ============================================================================
// 7. TYPE DEFINITIONS
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  publishedAt: Date;
  tags: string[];
}

interface Activity {
  id: string;
  type: 'user_created' | 'post_published' | 'comment_added';
  description: string;
  timestamp: Date;
  user?: User;
}

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  revenue: number;
}

// ============================================================================
// 8. HELPER COMPONENTS
// ============================================================================

// Blog card component
function BlogCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-500">{post.author.name}</span>
          </div>
          <time className="text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </article>
  );
}

// Post preview component
function PostPreview({ post }: { post: Post }) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold mb-2">
        <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h3>
      <p className="text-gray-600 mb-2 line-clamp-2">
        {post.content}
      </p>
      <time className="text-sm text-gray-500">
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
    </div>
  );
}

// Activity item component
function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm">
            {activity.type === 'user_created' && '👤'}
            {activity.type === 'post_published' && '📝'}
            {activity.type === 'comment_added' && '💬'}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <time className="text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString()}
        </time>
      </div>
    </div>
  );
}

// Export components
export {
  BlogList,
  UserProfile,
  Counter,
  ContactForm,
  Dashboard,
  StatCard,
  QuickActions,
  ActivityFeed,
  Header,
  Footer,
  UserMenu,
  ErrorBoundary,
  LoadingSpinner,
  SuspenseWrapper,
  BlogCard,
  PostPreview,
  ActivityItem,
}; 