// REPLACE YOUR ENTIRE SINDAAssistant.jsx with this simplified working version
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, MessageCircle, Users, Globe, AlertTriangle, 
  BarChart3, Settings, Download, TrendingUp,
  Clock, MapPin, Star, Phone, Mail,
  GraduationCap, Heart, ChevronRight,
  PieChart, MessageSquare, Database, FileText,
  Search, Plus, Edit, Eye, MoreHorizontal,
  Video, Mic, Paperclip, Bot, Crown,
  Menu, X, CheckCircle, UserCheck, Target,
  BookOpen, Lock, Calendar, DollarSign,
  Award, Activity, Zap, Shield, Home,
  HandHeart, Info, HelpCircle, ArrowRight,
  ArrowLeft, ChevronLeft, Waves, TrendingDown,
  LineChart, BarChart, XCircle
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  Pie
} from 'recharts';

// Main SINDA Platform Component
const IntegratedSINDAPlatform = () => {
  // Core platform state
  const [platform, setPlatform] = useState('assistant');
  const [viewHistory, setViewHistory] = useState(['assistant']);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  
  // CRM specific state
  const [currentView, setCurrentView] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [aiAgents, setAiAgents] = useState({
    leadGeneration: { status: 'active', lastRun: '2025-06-18 09:30', leads: 23 },
    ticketManager: { status: 'active', lastAction: '2025-06-18 11:45', processed: 45 },
    emailHandler: { status: 'active', lastEmail: '2025-06-18 12:15', handled: 67 }
  });
  const [showAiAgentsModal, setShowAiAgentsModal] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);
  
  // Assistant specific state
  const [currentStep, setCurrentStep] = useState('chat');
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Languages
  const languages = {
    english: { 
      name: 'English', 
      native: 'English',
      greeting: 'Welcome to SINDA! 🙏 I\'m here to help you discover our programs and guide you through your journey with us.',
      flag: '🇬🇧'
    },
    tamil: { 
      name: 'Tamil', 
      native: 'தமிழ்',
      greeting: 'SINDA இல் உங்களை வரவேற்கிறோம்! இன்று நான் எப்படி உதவ முடியும்?',
      flag: '🇮🇳'
    },
    hindi: { 
      name: 'Hindi', 
      native: 'हिंदी',
      greeting: 'SINDA में आपका स्वागत है! आज मैं आपकी कैसे सहायता कर सकता हूँ?',
      flag: '🇮🇳'
    },
    malayalam: {
      name: 'Malayalam',
      native: 'മലയാളം',
      greeting: 'SINDA ലേക്ക് സ്വാഗതം! ഇന്ന് ഞാൻ എങ്ങനെ സഹായിക്കാം?',
      flag: '🇮🇳'
    }
  };

  // Navigation functions
  const navigateToView = useCallback((view) => {
    if (view !== currentView) {
      setViewHistory(prev => [...prev, view]);
      setCurrentView(view);
    }
  }, [currentView]);

  const goBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
    }
  }, [viewHistory]);

  const canGoBack = viewHistory.length > 1;

  // Sample data (keeping all CRM functionality)
  const crmData = {
    contacts: [
      {
        id: 1,
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+65 9123 4567',
        status: 'active',
        programs: ['STEP', 'Family Services'],
        lastContact: '2025-06-17',
        priority: 'high',
        notes: 'Mother of 2, needs help with tuition fees',
        avatar: '👩🏽‍💼'
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        email: 'rajesh.k@email.com',
        phone: '+65 8765 4321',
        status: 'pending',
        programs: ['Youth Club'],
        lastContact: '2025-06-16',
        priority: 'medium',
        notes: 'Interested in leadership programs',
        avatar: '👨🏽‍💻'
      }
    ],
    tickets: [
      {
        id: 'TK-2025-001',
        subject: 'STEP Tuition Application',
        contact: 'Priya Sharma',
        status: 'open',
        priority: 'high',
        agent: 'Sarah Chen',
        created: '2025-06-17 09:30',
        description: 'Application for STEP tuition program for 2 children'
      },
      {
        id: 'TK-2025-002',
        subject: 'Emergency Financial Assistance',
        contact: 'Meera Nair',
        status: 'in-progress',
        priority: 'urgent',
        agent: 'David Tan',
        created: '2025-06-18 08:15',
        description: 'Urgent financial assistance for medical bills'
      }
    ],
    agents: [
      {
        id: 1,
        name: 'Sarah Chen',
        status: 'online',
        activeTickets: 12,
        resolvedToday: 8,
        avatar: '👩🏻‍💼'
      },
      {
        id: 2,
        name: 'David Tan',
        status: 'online',
        activeTickets: 15,
        resolvedToday: 12,
        avatar: '👨🏻‍💼'
      }
    ],
    analytics: {
      totalContacts: 8456,
      activeTickets: 247,
      resolvedToday: 89,
      avgResponseTime: '12 minutes',
      satisfactionScore: 4.8,
      financialAidDistributed: 2100000,
      jobPlacements: 567
    },
    realTimeMetrics: {
      activeUsers: 247,
      messagesPerMinute: 18,
      responseTime: 0.8,
      resolutionRate: 96.7
    },
    monthlyData: [
      { month: 'Jan', contacts: 820, tickets: 245, assistance: 89000, satisfaction: 4.6 },
      { month: 'Feb', contacts: 950, tickets: 287, assistance: 102000, satisfaction: 4.7 },
      { month: 'Mar', contacts: 1100, tickets: 324, assistance: 125000, satisfaction: 4.8 },
      { month: 'Apr', contacts: 890, tickets: 298, assistance: 98000, satisfaction: 4.7 },
      { month: 'May', contacts: 1250, tickets: 356, assistance: 145000, satisfaction: 4.9 },
      { month: 'Jun', contacts: 1380, tickets: 398, assistance: 167000, satisfaction: 4.8 }
    ],
    programDistribution: [
      { name: 'Education Support', value: 42, count: 5234, color: '#3B82F6' },
      { name: 'Family Services', value: 28, count: 3489, color: '#06B6D4' },
      { name: 'Youth Development', value: 18, count: 2245, color: '#6366F1' },
      { name: 'Community Outreach', value: 12, count: 1496, color: '#14B8A6' }
    ]
  };

  // Program categories
  const programCategories = [
    {
      id: 'education',
      title: 'Education Programs',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Academic support from pre-school to tertiary education',
      programs: ['STEP Tuition', 'A-Level Support', 'ITE Programs', 'Bursaries'],
      count: '8 Programs'
    },
    {
      id: 'family',
      title: 'Family Services',
      icon: Heart,
      color: 'from-cyan-500 to-teal-600',
      description: 'Counselling, financial aid, and family support',
      programs: ['Family Service Centre', 'Financial Assistance', 'Crisis Support'],
      count: '5 Services'
    },
    {
      id: 'youth',
      title: 'Youth Development',
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Leadership and skills development for ages 18-35',
      programs: ['Youth Club', 'Leadership Seminars', 'Mentoring'],
      count: '4 Programs'
    },
    {
      id: 'community',
      title: 'Community Outreach',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600',
      description: 'Bringing SINDA services to your neighborhood',
      programs: ['Door Knocking', 'SINDA Bus', 'Community Events'],
      count: '6 Initiatives'
    }
  ];

  // AI Agent Functions
  const generateLeads = useCallback(() => {
    const leads = [
      { name: 'Arjun Patel', phone: '+65 9234 5678', interest: 'STEP Program', score: 85 },
      { name: 'Kavitha Reddy', phone: '+65 8345 6789', interest: 'Financial Aid', score: 92 }
    ];
    
    setAiAgents(prev => ({
      ...prev,
      leadGeneration: {
        ...prev.leadGeneration,
        lastRun: new Date().toLocaleString(),
        leads: prev.leadGeneration.leads + leads.length
      }
    }));

    const newLog = {
      id: Date.now(),
      agent: 'Lead Generation AI',
      action: `Generated ${leads.length} new qualified leads`,
      timestamp: new Date().toLocaleString(),
      type: 'success'
    };
    
    setAgentLogs(prev => [newLog, ...prev.slice(0, 9)]);
    addMessage(`🤖 Lead Generation AI: Successfully generated ${leads.length} new qualified leads`, false, { aiAgent: 'LeadGen' });
  }, []);

  const processTickets = useCallback(() => {
    const actions = [
      'Auto-prioritized 12 urgent tickets based on keywords',
      'Assigned 8 tickets to appropriate agents based on expertise',
      'Escalated 3 emergency cases to supervisors'
    ];
    
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];
    
    setAiAgents(prev => ({
      ...prev,
      ticketManager: {
        ...prev.ticketManager,
        lastAction: new Date().toLocaleString(),
        processed: prev.ticketManager.processed + 10
      }
    }));

    const newLog = {
      id: Date.now(),
      agent: 'Ticket Manager AI',
      action: selectedAction,
      timestamp: new Date().toLocaleString(),
      type: 'info'
    };
    
    setAgentLogs(prev => [newLog, ...prev.slice(0, 9)]);
    addMessage(`🎫 Ticket Manager AI: ${selectedAction}`, false, { aiAgent: 'TicketManager' });
  }, []);

  const handleEmails = useCallback(() => {
    const emailActions = [
      'Categorized 25 incoming emails by urgency and topic',
      'Auto-responded to 18 FAQ inquiries with template responses',
      'Forwarded 7 complex queries to appropriate specialists'
    ];
    
    const selectedAction = emailActions[Math.floor(Math.random() * emailActions.length)];
    
    setAiAgents(prev => ({
      ...prev,
      emailHandler: {
        ...prev.emailHandler,
        lastEmail: new Date().toLocaleString(),
        handled: prev.emailHandler.handled + 15
      }
    }));

    const newLog = {
      id: Date.now(),
      agent: 'Email Handler AI',
      action: selectedAction,
      timestamp: new Date().toLocaleString(),
      type: 'success'
    };
    
    setAgentLogs(prev => [newLog, ...prev.slice(0, 9)]);
    addMessage(`📧 Email Handler AI: ${selectedAction}`, false, { aiAgent: 'EmailHandler' });
  }, []);

  const runAllAgents = useCallback(() => {
    addMessage('🚀 Running all AI agents...', false, { aiAgent: 'System' });
    setTimeout(generateLeads, 1000);
    setTimeout(processTickets, 2000);
    setTimeout(handleEmails, 3000);
    setTimeout(() => {
      addMessage('✅ All AI agents completed their tasks successfully!', false, { aiAgent: 'System' });
    }, 4000);
  }, [generateLeads, processTickets, handleEmails]);

  // Add message functionality
  const addMessage = useCallback((content, isUser = false, metadata = {}) => {
    const newMessage = {
      id: messageId,
      content,
      isUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  // SIMPLIFIED API call function
  const callAPI = async (userMessage) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          messages: messages.slice(-5),
          userInfo: {},
          conversationStage: 'general'
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data = await response.json();
      return data.message || "I'm here to help you with SINDA programs and services.";
    } catch (error) {
      console.error('API Error:', error);
      
      // Smart fallback responses
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('step') || lowerMessage.includes('tuition')) {
        return `📚 **STEP Tuition Program**

Our flagship education program offers:
• **Cost**: Only $10-15 per hour (heavily subsidized)
• **Levels**: Primary 1-6, Secondary 1-5, JC1-2
• **Subjects**: English, Math, Science, Mother Tongue
• **Eligibility**: Per capita income ≤ $1,600

📞 **Apply now**: Call 1800 295 3333`;
      }
      
      if (lowerMessage.includes('financial') || lowerMessage.includes('help')) {
        return `💰 **Financial Assistance Available**

SINDA offers:
• Emergency Aid: Immediate cash assistance
• Monthly Support: Ongoing financial help
• Bill Payment: Utilities, rent, medical expenses

📞 Call **1800 295 3333** for immediate help
🏢 Visit: 1 Beatty Road, Singapore 209943`;
      }
      
      if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency')) {
        return `🚨 **Emergency Support Available**

**IMMEDIATE HELP**: Call **1800 295 3333** right now!

SINDA provides 24/7 crisis intervention and emergency assistance.

Don't wait - call now for immediate assistance!`;
      }
      
      return `I'm here to help with SINDA programs! 

📞 Call: **1800 295 3333** (24/7)
🏢 Visit: 1 Beatty Road, Singapore 209943

**Popular programs:**
🎓 STEP tuition program
👨‍👩‍👧‍👦 Family financial assistance  
🎯 Youth leadership programs

What would you like to know about?`;
    }
  };

  // SIMPLIFIED message sending
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await callAPI(userMessage);
      addMessage(response, false, { aiGenerated: true });
    } catch (error) {
      addMessage("I'm having technical difficulties, but I can still help! Call 1800 295 3333 for immediate assistance.", false);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle program clicks
  const handleProgramClick = (categoryTitle) => {
    const programMessage = `Tell me about ${categoryTitle}`;
    addMessage(programMessage, true);
    setIsTyping(true);

    let response = "";
    const lowerTitle = categoryTitle.toLowerCase();

    if (lowerTitle.includes('education')) {
      response = `🎓 **Education Programs at SINDA**

**STEP (SINDA Tutorials for Enhanced Performance)**:
• Cost: Only $10-15 per hour (heavily subsidized)
• Levels: Primary 1-6, Secondary 1-5, JC1-2
• Subjects: English, Math, Science, Mother Tongue
• Small classes with qualified teachers

**Other Programs:**
• STEP Plus: Holistic development
• A-Level Tuition: JC support
• SINDA Bursary: Tertiary education aid

**Eligibility**: Per capita income ≤ $1,600
📞 Apply: Call 1800 295 3333`;

    } else if (lowerTitle.includes('family')) {
      response = `👨‍👩‍👧‍👦 **Family Services at SINDA**

**SINDA Family Service Centre**:
• Individual & family counselling
• Crisis intervention & support
• Case management services

**Financial Assistance:**
• Emergency cash assistance
• Monthly support
• Bill payment help
• Medical expenses support

**Support Available**: 24/7 crisis counselling
📞 Need help? Call 1800 295 3333 immediately`;

    } else if (lowerTitle.includes('youth')) {
      response = `🎯 **Youth Development (Ages 18-35)**

**SINDA Youth Club (SYC)**:
• Leadership development workshops
• Networking with professionals
• Community service projects

**Programs:**
• Youth Leaders' Seminar
• Corporate Mentoring
• Youth Awards (150+ recipients annually)

**Benefits**: Build networks, develop leadership skills
📞 Join: Call 1800 295 3333`;

    } else if (lowerTitle.includes('community')) {
      response = `🤝 **Community Outreach Programs**

**Direct Engagement:**
• Door Knocking Exercise: Direct family outreach
• SINDA Bus: Mobile services
• Community Events: Festivals & workshops

**Annual Programs:**
• Back To School Festival
• Project Give: Volunteer opportunities
• Cultural celebrations

📞 Get involved: Call 1800 295 3333`;

    } else {
      response = `**SINDA Programs Overview**

🎓 **Education**: STEP tuition, bursaries
👨‍👩‍👧‍👦 **Family**: Counselling, financial aid
🎯 **Youth**: Leadership development (ages 18-35)
🤝 **Community**: Outreach programs

📞 Hotline: 1800 295 3333 (24/7)
🏢 Address: 1 Beatty Road, Singapore 209943

Which area interests you most?`;
    }

    setTimeout(() => {
      addMessage(response, false, { programInfo: true, category: categoryTitle });
      setIsTyping(false);
    }, 1000);
  };

  // CRM Dashboard Component (unchanged)
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">SINDA CRM Dashboard</h2>
            <p className="text-blue-100">Real-time system overview and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{crmData.realTimeMetrics.activeUsers}</div>
              <div className="text-xs text-blue-200">Active Users</div>
            </div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tickets</p>
              <p className="text-3xl font-bold text-blue-600">{crmData.analytics.activeTickets}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageCircle className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <p className="text-3xl font-bold text-green-600">{crmData.analytics.resolvedToday}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-3xl font-bold text-purple-600">{crmData.analytics.avgResponseTime}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-3xl font-bold text-yellow-600">{crmData.analytics.satisfactionScore}/5</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowTicketModal(true)}
          className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Plus className="text-blue-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">New Ticket</p>
        </button>
        
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <UserCheck className="text-green-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">Add Contact</p>
        </button>
        
        <button 
          onClick={() => setShowWhatsAppModal(true)}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="text-emerald-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
        </button>
        
        <button 
          onClick={() => setShowAiAgentsModal(true)}
          className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Bot className="text-purple-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">AI Agents</p>
        </button>
      </div>

      {/* AI Agents Status Panel */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">AI Agents Status</h3>
            <p className="text-indigo-100">Automated lead generation, ticket management, and email handling</p>
          </div>
          <button
            onClick={runAllAgents}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Bot size={20} />
            Run All Agents
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Lead Generation AI</h4>
            <p className="text-sm text-indigo-100">Generated: {aiAgents.leadGeneration.leads} leads</p>
            <button
              onClick={generateLeads}
              className="mt-2 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Generate Leads
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Ticket Manager AI</h4>
            <p className="text-sm text-indigo-100">Processed: {aiAgents.ticketManager.processed} tickets</p>
            <button
              onClick={processTickets}
              className="mt-2 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Process Tickets
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Email Handler AI</h4>
            <p className="text-sm text-indigo-100">Handled: {aiAgents.emailHandler.handled} emails</p>
            <button
              onClick={handleEmails}
              className="mt-2 bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Handle Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // FIXED Chat Interface with working input
  const ChatInterface = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button
            onClick={goBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-sm"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">AI Assistant</h2>
          <p className="text-gray-600">Intelligent CRM assistance powered by AI</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-blue-200 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Bot className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">SINDA CRM Assistant</h3>
              <p className="text-blue-100 text-sm">AI-Powered • CRM Integrated • Multi-language</p>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot size={48} className="mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you with CRM tasks?</h4>
              <p className="text-gray-500 mb-6">Ask me about contacts, tickets, reports, or analytics</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  { text: 'Generate new leads', action: generateLeads },
                  { text: 'Process pending tickets', action: processTickets },
                  { text: 'Handle incoming emails', action: handleEmails },
                  { text: 'Run all AI agents', action: runAllAgents }
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={suggestion.action}
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow ${
                msg.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* SIMPLIFIED WORKING INPUT */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about contacts, tickets, analytics..."
              className="flex-1 bg-blue-50/50 border border-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // FIXED Assistant Interface with working input
  const AssistantInterface = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <p className="text-blue-100 text-sm">AI-Powered • Active Users: {crmData.realTimeMetrics.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Explore Our Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category.title)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-500 hover:shadow-lg text-left group hover:scale-105"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{category.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">How can I help you today?</h4>
              <p className="text-gray-500 mb-6">Ask me about SINDA programs, eligibility, or application processes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  { text: 'Tell me about STEP tuition', action: () => handleProgramClick('Education Programs') },
                  { text: 'Financial assistance options', action: () => handleProgramClick('Family Services') },
                  { text: 'Youth development programs', action: () => handleProgramClick('Youth Development') },
                  { text: 'Community outreach initiatives', action: () => handleProgramClick('Community Outreach') }
                ].map((help, index) => (
                  <button
                    key={index}
                    onClick={help.action}
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105"
                  >
                    {help.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                msg.isUser 
                  ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-blue-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!msg.isUser && msg.metadata?.programInfo && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      Program Info
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">SINDA Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* SIMPLIFIED WORKING INPUT */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about SINDA programs, eligibility, or how to apply..."
              className="flex-1 bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl transition-all duration-300"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Other CRM views (simplified but functional)
  const ContactsView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button onClick={goBack} className="bg-white p-3 rounded-xl border">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Contacts Management</h2>
          <p className="text-gray-600">Comprehensive contact management interface</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crmData.contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{contact.avatar}</div>
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p>📱 {contact.phone}</p>
                <p>💼 {contact.programs.join(', ')}</p>
                <p>📅 Last contact: {contact.lastContact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TicketsView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button onClick={goBack} className="bg-white p-3 rounded-xl border">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Support Tickets</h2>
          <p className="text-gray-600">Ticket management and tracking interface</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          {crmData.tickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                  <p className="text-gray-600">{ticket.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Contact: {ticket.contact}</span>
                    <span>Agent: {ticket.agent}</span>
                    <span>Created: {ticket.created}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button onClick={goBack} className="bg-white p-3 rounded-xl border">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl flex-1">
          <h2 className="text-2xl font-bold mb-2">CRM Analytics Dashboard</h2>
          <p className="text-blue-100">Comprehensive insights and performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Contacts', value: crmData.analytics.totalContacts.toLocaleString(), icon: Users },
          { label: 'Aid Distributed', value: `$${(crmData.analytics.financialAidDistributed / 1000000).toFixed(1)}M`, icon: DollarSign },
          { label: 'Job Placements', value: crmData.analytics.jobPlacements, icon: Award },
          { label: 'Active Tickets', value: crmData.analytics.activeTickets, icon: FileText }
        ].map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{kpi.value}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={crmData.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="contacts" 
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Simple modals
  const WhatsAppModal = () => showWhatsAppModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Connect via WhatsApp</h3>
          <button onClick={() => setShowWhatsAppModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Connect with SINDA via WhatsApp for instant support.</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Open WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  const TicketModal = () => showTicketModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Ticket</h3>
          <button onClick={() => setShowTicketModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Subject" className="w-full border rounded-lg px-3 py-2" />
          <textarea placeholder="Description" rows="4" className="w-full border rounded-lg px-3 py-2" />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );

  const ContactModal = () => showContactModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Contact</h3>
          <button onClick={() => setShowContactModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border rounded-lg px-3 py-2" />
          <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" />
          <input type="tel" placeholder="Phone" className="w-full border rounded-lg px-3 py-2" />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );

  const AiAgentsModal = () => showAiAgentsModal && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">AI Agents Management</h3>
            <p className="text-gray-600">Monitor and control automated AI agents</p>
          </div>
          <button onClick={() => setShowAiAgentsModal(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Lead Generation AI</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-green-700">Active</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Leads Generated:</span>
                <span className="ml-2 font-medium">{aiAgents.leadGeneration.leads}</span>
              </div>
              <button
                onClick={generateLeads}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Generate Leads Now
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Ticket Manager AI</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-blue-700">Active</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Tickets Processed:</span>
                <span className="ml-2 font-medium">{aiAgents.ticketManager.processed}</span>
              </div>
              <button
                onClick={processTickets}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Process Tickets Now
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Email Handler AI</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-purple-700">Active</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Emails Handled:</span>
                <span className="ml-2 font-medium">{aiAgents.emailHandler.handled}</span>
              </div>
              <button
                onClick={handleEmails}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Handle Emails Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Global AI Controls</h4>
          <div className="flex gap-4">
            <button
              onClick={runAllAgents}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Bot size={20} />
              Run All Agents
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-colors">
              Pause All Agents
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent AI Activity</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {agentLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity. Run an AI agent to see logs here.</p>
            ) : (
              agentLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{log.agent}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.type === 'success' ? 'bg-green-100 text-green-700' :
                          log.type === 'info' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{log.action}</p>
                    </div>
                    <span className="text-xs text-gray-400">{log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Header with Platform Switcher */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SINDA Platform</h1>
              <p className="text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                AI-Powered Community Support • Since 1991
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setPlatform('assistant')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  platform === 'assistant' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <MessageCircle size={18} />
                Assistant
              </button>
              <button
                onClick={() => setPlatform('crm')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  platform === 'crm' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <BarChart3 size={18} />
                CRM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Platform */}
      {platform === 'crm' && (
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'contacts', label: 'Contacts', icon: Users },
              { id: 'tickets', label: 'Tickets', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: PieChart },
              { id: 'chat', label: 'AI Assistant', icon: Bot }
            ].map((nav) => {
              const IconComponent = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => navigateToView(nav.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                    currentView === nav.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent size={16} />
                  {nav.label}
                </button>
              );
            })}
          </div>

          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'contacts' && <ContactsView />}
          {currentView === 'tickets' && <TicketsView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'chat' && <ChatInterface />}
        </div>
      )}

      {/* Assistant Platform */}
      {platform === 'assistant' && (
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCurrentStep('chat')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                currentStep === 'chat' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <MessageCircle size={16} />
              Chat
            </button>
          </div>

          {currentStep === 'chat' && <AssistantInterface />}
        </div>
      )}

      {/* Modals */}
      <WhatsAppModal />
      <TicketModal />
      <ContactModal />
      <AiAgentsModal />
      
      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm py-6 px-6">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">System Status: Operational</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-blue-500" />
              <span className="text-gray-600">Hotline: 1800 295 3333</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-gray-600">1 Beatty Road, Singapore 209943</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-blue-500" />
              <span className="text-gray-600">queries@sinda.org.sg</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <Lock size={16} className="text-green-500" />
            <span>Secure & Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedSINDAPlatform;
