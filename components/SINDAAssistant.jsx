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
  Pie,
  Line
} from 'recharts';

// Integrated SINDA Platform with both CRM and Assistant
const IntegratedSINDAPlatform = () => {
  // Shared state between CRM and Assistant
  const [platform, setPlatform] = useState('assistant'); // 'assistant' or 'crm'
  const [viewHistory, setViewHistory] = useState([platform]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  
  // CRM specific state
  const [currentView, setCurrentView] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  // Enhanced language support
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
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
    }
  }, [viewHistory]);

  const canGoBack = viewHistory.length > 1;

  // SINDA CRM DATA
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
        avatar: '👩🏽‍💼',
        satisfactionScore: 4.8,
        address: 'Blk 123 Tampines Ave 5 #05-678',
        occupation: 'Administrative Assistant',
        familySize: 4,
        monthlyIncome: 2800,
        language: 'Tamil',
        joinDate: '2024-03-15',
        totalAssistance: 5200
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
        avatar: '👨🏽‍💻',
        satisfactionScore: 4.6,
        address: 'Blk 456 Jurong West Ave 1 #12-345',
        occupation: 'IT Support',
        familySize: 3,
        monthlyIncome: 3200,
        language: 'Hindi',
        joinDate: '2024-05-22',
        totalAssistance: 1500
      },
      {
        id: 3,
        name: 'Meera Nair',
        email: 'meera.nair@email.com',
        phone: '+65 9876 5432',
        status: 'active',
        programs: ['Education Support', 'Financial Aid'],
        lastContact: '2025-06-18',
        priority: 'high',
        notes: 'Single mother, 3 children in school',
        avatar: '👩🏽‍🏫',
        satisfactionScore: 4.9,
        address: 'Blk 789 Toa Payoh Lor 2 #08-234',
        occupation: 'Teacher',
        familySize: 4,
        monthlyIncome: 2400,
        language: 'Malayalam',
        joinDate: '2023-11-08',
        totalAssistance: 8700
      }
    ],
    tickets: [
      {
        id: 'TK-2025-001',
        subject: 'STEP Tuition Application',
        contact: 'Priya Sharma',
        contactId: 1,
        status: 'open',
        priority: 'high',
        agent: 'Sarah Chen',
        agentId: 1,
        created: '2025-06-17 09:30',
        updated: '2025-06-17 14:22',
        category: 'education',
        description: 'Application for STEP tuition program for 2 children',
        messages: 5,
        channel: 'whatsapp',
        estimatedResolution: '2025-06-19',
        tags: ['STEP', 'Application', 'Urgent'],
        resolution: null,
        timeSpent: 2.5
      },
      {
        id: 'TK-2025-002',
        subject: 'Emergency Financial Assistance',
        contact: 'Meera Nair',
        contactId: 3,
        status: 'in-progress',
        priority: 'urgent',
        agent: 'David Tan',
        agentId: 2,
        created: '2025-06-18 08:15',
        updated: '2025-06-18 11:30',
        category: 'financial',
        description: 'Urgent financial assistance for medical bills',
        messages: 8,
        channel: 'phone',
        estimatedResolution: '2025-06-18',
        tags: ['Emergency', 'Medical', 'Financial Aid'],
        resolution: null,
        timeSpent: 3.2
      },
      {
        id: 'TK-2025-003',
        subject: 'Youth Club Enrollment',
        contact: 'Rajesh Kumar',
        contactId: 2,
        status: 'resolved',
        priority: 'medium',
        agent: 'Sarah Chen',
        agentId: 1,
        created: '2025-06-16 14:20',
        updated: '2025-06-17 16:45',
        category: 'youth',
        description: 'Enrollment in youth leadership program',
        messages: 3,
        channel: 'email',
        estimatedResolution: '2025-06-17',
        tags: ['Youth Club', 'Leadership', 'Enrollment'],
        resolution: 'Successfully enrolled in next batch starting July 1st',
        timeSpent: 1.8
      }
    ],
    agents: [
      {
        id: 1,
        name: 'Sarah Chen',
        status: 'online',
        activeTickets: 12,
        resolvedToday: 8,
        avatar: '👩🏻‍💼',
        specialization: ['Education', 'Family Services'],
        languages: ['English', 'Tamil'],
        experience: '3 years',
        rating: 4.9,
        workload: 85
      },
      {
        id: 2,
        name: 'David Tan',
        status: 'online',
        activeTickets: 15,
        resolvedToday: 12,
        avatar: '👨🏻‍💼',
        specialization: ['Financial Aid', 'Crisis Support'],
        languages: ['English', 'Hindi', 'Malay'],
        experience: '5 years',
        rating: 4.8,
        workload: 92
      },
      {
        id: 3,
        name: 'Priya Gopal',
        status: 'away',
        activeTickets: 8,
        resolvedToday: 6,
        avatar: '👩🏽‍💼',
        specialization: ['Youth Programs', 'Community Outreach'],
        languages: ['Tamil', 'Malayalam', 'English'],
        experience: '4 years',
        rating: 4.7,
        workload: 68
      }
    ],
    analytics: {
      totalContacts: 8456,
      activeTickets: 247,
      resolvedToday: 89,
      avgResponseTime: '12 minutes',
      satisfactionScore: 4.8,
      whatsappMessages: 2134,
      phoneCallsToday: 45,
      emergencyCases: 12,
      totalProgramEnrollments: 1247,
      financialAidDistributed: 2100000,
      jobPlacements: 567,
      monthlyGrowth: 15.7,
      retentionRate: 94.3
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

  // SINDA Program Categories
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
      { name: 'Kavitha Reddy', phone: '+65 8345 6789', interest: 'Financial Aid', score: 92 },
      { name: 'Suresh Kumar', phone: '+65 7456 7890', interest: 'Youth Club', score: 78 },
      { name: 'Deepika Nair', phone: '+65 6567 8901', interest: 'Family Counseling', score: 88 }
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
      details: leads,
      type: 'success'
    };
    
    setAgentLogs(prev => [newLog, ...prev.slice(0, 9)]);
    addMessage(`🤖 Lead Generation AI: Successfully generated ${leads.length} new qualified leads with an average score of ${Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length)}%`, false, { aiAgent: 'LeadGen' });
  }, []);

  const processTickets = useCallback(() => {
    const actions = [
      'Auto-prioritized 12 urgent tickets based on keywords',
      'Assigned 8 tickets to appropriate agents based on expertise',
      'Escalated 3 emergency cases to supervisors',
      'Updated 15 ticket statuses based on response patterns'
    ];
    
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];
    
    setAiAgents(prev => ({
      ...prev,
      ticketManager: {
        ...prev.ticketManager,
        lastAction: new Date().toLocaleString(),
        processed: prev.ticketManager.processed + Math.floor(Math.random() * 10) + 5
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
      'Forwarded 7 complex queries to appropriate specialists',
      'Identified 5 potential crisis situations requiring immediate attention',
      'Scheduled 12 follow-up emails for pending applications'
    ];
    
    const selectedAction = emailActions[Math.floor(Math.random() * emailActions.length)];
    
    setAiAgents(prev => ({
      ...prev,
      emailHandler: {
        ...prev.emailHandler,
        lastEmail: new Date().toLocaleString(),
        handled: prev.emailHandler.handled + Math.floor(Math.random() * 15) + 10
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
      metadata: {
        ...metadata,
        responseTime: isUser ? null : Math.random() * 2 + 0.5
      }
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageId(prev => prev + 1);
  }, [messageId]);

  // OpenAI Integration
  const callOpenAI = async (userMessage, conversationHistory = []) => {
    if (!apiKey) {
      return "Please set your OpenAI API key to enable AI-powered conversations. Click the settings button to add your API key.";
    }

    try {
      const systemPrompt = `You are a SINDA CRM assistant helping staff manage contacts, tickets, and programs. You have access to:
      
1. Contact Management: ${crmData.contacts.length} contacts in the system
2. Ticket Management: ${crmData.tickets.length} active tickets
3. Agent Management: ${crmData.agents.length} agents available
4. Analytics: Real-time metrics and reporting

Key SINDA Programs:
- Education Support (STEP, Bursaries, ITE Support)
- Family Services (Counseling, Financial Aid, Crisis Support)
- Youth Development (Youth Club, Leadership, Mentoring)
- Community Outreach (Door-to-door, Events, Advocacy)

Help with CRM tasks like finding contacts, updating tickets, generating reports, and providing insights from the data.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-6),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return `I'm having trouble connecting to the AI service. I can still help you navigate the CRM system manually. Current system status: ${crmData.analytics.activeTickets} active tickets, ${crmData.analytics.totalContacts} total contacts.`;
    }
  };

  // Handle message sending with AI integration
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, true);
    setInputMessage('');
    setIsTyping(true);

    const conversationHistory = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content
    }));

    try {
      const response = await callOpenAI(userMessage, conversationHistory);
      addMessage(response, false, { aiGenerated: true });
    } catch (error) {
      addMessage("I'm experiencing technical difficulties. Here's what I can tell you: We have " + crmData.analytics.activeTickets + " active tickets and " + crmData.analytics.totalContacts + " contacts in the system.", false);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isTyping, addMessage, messages, callOpenAI]);

  // Handle program button clicks for Assistant
  const handleProgramClick = useCallback(async (categoryTitle) => {
    const programMessage = `Tell me about ${categoryTitle}`;
    
    // Add user message
    addMessage(programMessage, true);
    setIsTyping(true);

    // Generate appropriate response based on category
    let response = "";
    const lowerTitle = categoryTitle.toLowerCase();

    if (lowerTitle.includes('education')) {
      response = `🎓 **Education Programs at SINDA**

**STEP (SINDA Tutorials for Enhanced Performance)** - Our flagship program:
• **Cost:** Only $10-15 per hour (heavily subsidized)
• **Levels:** Primary 1-6, Secondary 1-5, JC1-2
• **Subjects:** English, Math, Science, Mother Tongue
• **Features:** Small classes, qualified teachers, MOE-aligned materials
• **Locations:** Multiple centres across Singapore

**Other Education Support:**
• **STEP Plus:** Holistic development & life skills
• **A-Level Tuition:** Specialized JC support
• **ITE Programs:** Support for technical education students
• **SINDA Bursary:** Financial aid for tertiary education
• **GUIDE Programme:** Academic mentoring
• **Excellence Awards:** Recognition for outstanding students

**Eligibility:** Per capita income ≤ $1,600, Singapore citizens/PRs of Indian descent

📞 **Apply now:** Call 1800 295 3333 or visit 1 Beatty Road`;

    } else if (lowerTitle.includes('family')) {
      response = `👨‍👩‍👧‍👦 **Family Services at SINDA**

**SINDA Family Service Centre** - Only self-help group with dedicated FSC:
• Individual & family counselling
• Crisis intervention & support
• Case management services
• Family life programs
• Referral services

**Financial Assistance Programs:**
• **Emergency Aid:** Immediate cash assistance
• **Monthly Support:** Ongoing financial help
• **Bill Payment:** Utilities, rent, medical expenses
• **School Fees:** Education-related costs

**Specialized Programs:**
• **Project Athena:** Empowerment for single mothers
• **Prisons Outreach:** Support for families of incarcerated individuals

**Support Available:**
• Crisis counselling (24/7)
• Social worker assessment
• Confidential support
• Multi-language assistance

**Eligibility:** Per capita income ≤ $1,600 for financial aid

📞 **Need help?** Call 1800 295 3333 immediately - we're here for you!`;

    } else if (lowerTitle.includes('youth')) {
      response = `🎯 **Youth Development Programs (Ages 18-35)**

**SINDA Youth Club (SYC)** - Established 2010:
• Leadership development workshops
• Networking with young professionals
• Community service projects
• Social activities & events

**Leadership Development:**
• **Youth Leaders' Seminar:** Intensive leadership training
• **Corporate Mentoring:** Industry professional guidance
• Communication & project management skills
• Real-world experience opportunities

**Recognition Programs:**
• **SINDA Youth Awards:** Annual excellence recognition
• **150+ recipients** each year
• Categories: Academic, community service, leadership
• Government officials at ceremonies

**Benefits of Joining:**
• Build professional networks
• Develop leadership skills
• Give back to community
• Career advancement opportunities

**How to Join:**
📞 Call 1800 295 3333
🏢 Visit 1 Beatty Road, Singapore
💻 Email queries@sinda.org.sg

Ready to become a community leader?`;

    } else if (lowerTitle.includes('community')) {
      response = `🤝 **Community Outreach Programs**

**Direct Community Engagement:**
• **Door Knocking Exercise:** Direct outreach to heartland families
• **SINDA Bus:** Mobile services bringing programs to your area
• **Community Events:** Festivals, workshops, and gatherings

**Annual Community Programs:**
• **Back To School Festival:** School supplies & vouchers
• **Project Give:** Community volunteering opportunities
• **Cultural Celebrations:** Festivals and heritage events

**Outreach Locations:**
• Heartland areas with Indian families
• Underserved neighborhoods
• Community centers & void decks
• Shopping malls & public spaces

**Services Brought to You:**
• Program registration assistance
• Information about available support
• Preliminary needs assessment
• Connection to appropriate services

**Community Impact:**
• Reaching families who need help most
• Building stronger neighborhoods
• Connecting people to opportunities
• Creating support networks

**Get Involved:**
📞 Volunteer: Call 1800 295 3333
🏢 Visit: 1 Beatty Road for more info
🤝 Join community events and activities

Together, we build stronger communities!`;

    } else {
      response = `**SINDA Programs Overview**

We offer comprehensive support across four key areas:

🎓 **Education:** STEP tuition, bursaries, academic support
👨‍👩‍👧‍👦 **Family:** Counselling, financial aid, crisis intervention
🎯 **Youth:** Leadership development, mentoring (ages 18-35)
🤝 **Community:** Outreach programs, volunteer opportunities

**Contact Information:**
📞 Hotline: 1800 295 3333 (24/7)
🏢 Address: 1 Beatty Road, Singapore 209943
📧 Email: queries@sinda.org.sg

Which area would you like to explore in detail?`;
    }

    // Simulate typing delay for better UX
    setTimeout(() => {
      addMessage(response, false, {
        aiGenerated: false,
        programInfo: true,
        category: categoryTitle
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);

  }, [addMessage]);

  // Dashboard Component for CRM
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Real-time Status Bar */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tickets</p>
              <p className="text-3xl font-bold text-blue-600">{crmData.analytics.activeTickets}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={12} />
                +12% from yesterday
              </p>
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
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={12} />
                Target: 100/day
              </p>
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
              <p className="text-xs text-purple-600 flex items-center gap-1">
                <Clock size={12} />
                Target: &lt;15 min
              </p>
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
              <p className="text-xs text-yellow-600 flex items-center gap-1">
                <Star size={12} />
                From 450 reviews
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Star className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowTicketModal(true)}
          className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Plus className="text-blue-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">New Ticket</p>
          <p className="text-xs text-gray-600 mt-1">Create support ticket</p>
        </button>
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <UserCheck className="text-green-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">Add Contact</p>
          <p className="text-xs text-gray-600 mt-1">Register new client</p>
        </button>
        <button 
          onClick={() => setShowWhatsAppModal(true)}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="text-emerald-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
          <p className="text-xs text-gray-600 mt-1">Quick messaging</p>
        </button>
        <button 
          onClick={() => setShowAiAgentsModal(true)}
          className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Bot className="text-purple-600 mb-3" size={24} />
          <p className="text-sm font-semibold text-gray-800">AI Agents</p>
          <p className="text-xs text-gray-600 mt-1">Manage AI automation</p>
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
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Lead Generation AI</h4>
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-indigo-100">Generated: {aiAgents.leadGeneration.leads} leads</p>
            <p className="text-xs text-indigo-200">Last run: {aiAgents.leadGeneration.lastRun}</p>
            <button
              onClick={generateLeads}
              className="mt-2 bg-green-500/20 hover:bg-green-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Generate Leads
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Ticket Manager AI</h4>
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-indigo-100">Processed: {aiAgents.ticketManager.processed} tickets</p>
            <p className="text-xs text-indigo-200">Last action: {aiAgents.ticketManager.lastAction}</p>
            <button
              onClick={processTickets}
              className="mt-2 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Process Tickets
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Email Handler AI</h4>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-indigo-100">Handled: {aiAgents.emailHandler.handled} emails</p>
            <p className="text-xs text-indigo-200">Last email: {aiAgents.emailHandler.lastEmail}</p>
            <button
              onClick={handleEmails}
              className="mt-2 bg-yellow-500/20 hover:bg-yellow-500/30 px-3 py-1 rounded text-xs transition-colors"
            >
              Handle Emails
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity and Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tickets</h3>
          <div className="space-y-3">
            {crmData.tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{ticket.subject}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{ticket.contact} • {ticket.created}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Status</h3>
          <div className="space-y-3">
            {crmData.agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{agent.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{agent.name}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'online' ? 'bg-green-400' : 
                        agent.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-500">{agent.activeTickets} active tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{agent.resolvedToday}</div>
                  <div className="text-xs text-gray-500">resolved today</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Chat Interface for CRM
  const ChatInterface = () => (
    <div className="space-y-6">
      {/* Page Header with Back Button */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button
            onClick={goBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-sm"
            title="Go Back"
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
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Bot className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA CRM Assistant</h3>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  AI-Powered • CRM Integrated • Multi-language
                  {!apiKey && <span className="text-yellow-200">• Configure API Key</span>}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-sm border border-white/30"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="text-gray-800">
                    {lang.flag} {lang.native}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setShowApiKeyInput(true)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300"
                title="Configure OpenAI API Key"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* CRM Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">CRM Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { action: 'Find contact by name', icon: Search, color: 'blue', onClick: () => addMessage('Find contact by name', true) },
              { action: 'Generate leads with AI', icon: Bot, color: 'green', onClick: generateLeads },
              { action: 'Process tickets automatically', icon: AlertTriangle, color: 'orange', onClick: processTickets },
              { action: 'Handle emails with AI', icon: Mail, color: 'purple', onClick: handleEmails }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-400 rounded-xl p-4 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <IconComponent className="text-blue-600 mb-2" size={20} />
                  <p className="text-sm font-medium text-gray-800">{item.action}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot size={48} className="mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                {languages[selectedLanguage].greeting}
              </h4>
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
                  {!msg.isUser && msg.metadata?.aiGenerated && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      AI
                    </span>
                  )}
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
                  <span className="text-sm text-gray-600">CRM Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about contacts, tickets, analytics, or any CRM task..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
                rows="2"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple placeholder views for CRM
  const ContactsView = () => (
    <div className="space-y-6">
      {/* Page Header with Back Button */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button
            onClick={goBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-sm"
            title="Go Back"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Contacts Management</h2>
          <p className="text-gray-600">Comprehensive contact management interface</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crmData.contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{contact.avatar}</div>
                <div>
                  <h3 className="font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.occupation}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p>📧 {contact.email}</p>
                <p>📱 {contact.phone}</p>
                <p>💼 {contact.programs.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TicketsView = () => (
    <div className="space-y-6">
      {/* Page Header with Back Button */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button
            onClick={goBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-sm"
            title="Go Back"
          >
            <ChevronLeft size={20} />
            Back
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
      {/* Analytics Header with Back Button */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button
            onClick={goBack}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-800 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-sm"
            title="Go Back"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">CRM Analytics Dashboard</h2>
              <p className="text-blue-100">Comprehensive insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Contacts', value: crmData.analytics.totalContacts.toLocaleString(), change: '+15.7%', icon: Users, color: 'blue' },
          { label: 'Aid Distributed', value: `$${(crmData.analytics.financialAidDistributed / 1000000).toFixed(1)}M`, change: '+23.4%', icon: DollarSign, color: 'green' },
          { label: 'Job Placements', value: crmData.analytics.jobPlacements, change: '+18.2%', icon: Award, color: 'purple' },
          { label: 'Retention Rate', value: `${crmData.analytics.retentionRate}%`, change: '+2.1%', icon: Target, color: 'cyan' }
        ].map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{kpi.label}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="text-green-500 mr-1" size={16} />
                    <span className="text-green-600 text-sm">{kpi.change}</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={crmData.monthlyData}>
              <defs>
                <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="contacts" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorContacts)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Program Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Program Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={crmData.programDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {crmData.programDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {crmData.programDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{backgroundColor: item.color}}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Components for CRM
  const WhatsAppModal = () => (
    showWhatsAppModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Connect via WhatsApp</h3>
            <button onClick={() => setShowWhatsAppModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <p className="text-gray-600 mb-4">Connect with SINDA via WhatsApp for instant support.</p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  );

  const TicketModal = () => (
    showTicketModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Create New Ticket</h3>
            <button onClick={() => setShowTicketModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Description"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Ticket
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ContactModal = () => (
    showContactModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New Contact</h3>
            <button onClick={() => setShowContactModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add Contact
            </button>
          </div>
        </div>
      </div>
    )
  );

  // API Key Input Modal
  const ApiKeyInput = () => (
    showApiKeyInput && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">OpenAI API Configuration</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Enter your OpenAI API key to enable AI-powered CRM assistance.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowApiKeyInput(false);
                if (apiKey) {
                  addMessage("Great! I'm now AI-powered and ready to help you with CRM tasks.", false);
                }
              }}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowApiKeyInput(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  // AI Agents Management Modal
  const AiAgentsModal = () => (
    showAiAgentsModal && (
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

          {/* Agent Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Lead Generation AI</h4>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium text-green-700">Active</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Leads Generated:</span>
                  <span className="ml-2 font-medium">{aiAgents.leadGeneration.leads}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Last Run:</span>
                  <span className="ml-2 font-medium">{aiAgents.leadGeneration.lastRun}</span>
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Ticket Manager AI</h4>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium text-blue-700">Active</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Tickets Processed:</span>
                  <span className="ml-2 font-medium">{aiAgents.ticketManager.processed}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Last Action:</span>
                  <span className="ml-2 font-medium">{aiAgents.ticketManager.lastAction}</span>
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
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Email Handler AI</h4>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium text-purple-700">Active</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Emails Handled:</span>
                  <span className="ml-2 font-medium">{aiAgents.emailHandler.handled}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Last Email:</span>
                  <span className="ml-2 font-medium">{aiAgents.emailHandler.lastEmail}</span>
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

          {/* Global Controls */}
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
              <button className="bg-green-200 hover:bg-green-300 text-green-700 px-6 py-3 rounded-lg transition-colors">
                Schedule Automation
              </button>
            </div>
          </div>

          {/* Activity Logs */}
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
                        {log.details && (
                          <div className="mt-2 text-xs text-gray-500">
                            {log.details.map((detail, idx) => (
                              <div key={idx} className="bg-gray-100 rounded px-2 py-1 mt-1">
                                {detail.name} - {detail.interest} (Score: {detail.score}%)
                              </div>
                            ))}
                          </div>
                        )}
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
    )
  );

  // SINDA Assistant Chat Interface
  const AssistantInterface = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 overflow-hidden shadow-2xl animate-slide-up">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-wave"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-glow">
                <BookOpen className="text-white animate-pulse" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">SINDA Assistant</h3>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  AI-Powered • Active Users: {crmData.realTimeMetrics.activeUsers}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110"
                title="View Analytics Dashboard"
              >
                <BarChart3 size={20} />
              </button>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-sm border border-white/30"
              >
                {Object.entries(languages).map(([key, lang]) => (
                  <option key={key} value={key} className="text-gray-800">
                    {lang.flag} {lang.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Program Categories Quick Access */}
        <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 p-6 border-b border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Explore Our Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleProgramClick(category.title)}
                  className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:border-blue-400 rounded-xl p-4 transition-all duration-500 hover:shadow-lg text-left group hover:scale-105 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {category.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{category.count}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/30 to-white/50 backdrop-blur-sm">
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="text-blue-400 mb-4 animate-bounce-gentle">
                <MessageCircle size={48} className="mx-auto" />
              </div>
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
                    className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg p-3 text-sm text-left transition-all duration-300 hover:shadow-md hover:scale-105 animate-slide-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {help.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{animationDelay: `${index * 0.05}s`}}>
              <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                msg.isUser 
                  ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-blue-200'
              } ${msg.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
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
            <div className="flex justify-start animate-slide-up">
              <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg">
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

        {/* Input Area */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-blue-200">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about SINDA programs, eligibility, or how to apply..."
                className="w-full resize-none bg-blue-50/50 border border-blue-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm transition-all duration-300"
                rows="2"
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 disabled:transform-none animate-glow"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Dashboard for Assistant
  const AssistantAnalyticsDashboard = () => {
    // Use the same data as CRM analytics
    return (
      <div className="space-y-8 p-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Users</p>
                <p className="text-3xl font-bold text-blue-600 mt-2 animate-counter">{crmData.realTimeMetrics.activeUsers}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 text-xs">+15% from last week</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl animate-bounce-gentle">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Families Helped</p>
                <p className="text-3xl font-bold text-cyan-600 mt-2 animate-counter">{crmData.analytics.totalContacts.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 text-xs">+234 this month</span>
                </div>
              </div>
              <div className="bg-cyan-100 p-3 rounded-xl animate-bounce-gentle">
                <Heart className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Financial Aid</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2 animate-counter">${(crmData.analytics.financialAidDistributed / 1000000).toFixed(1)}M</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 text-xs">Distributed this year</span>
                </div>
              </div>
              <div className="bg-indigo-100 p-3 rounded-xl animate-bounce-gentle">
                <DollarSign className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-100 shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Job Placements</p>
                <p className="text-3xl font-bold text-teal-600 mt-2 animate-counter">{crmData.analytics.jobPlacements}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 text-xs">+89 this quarter</span>
                </div>
              </div>
              <div className="bg-teal-100 p-3 rounded-xl animate-bounce-gentle">
                <Award className="text-teal-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Engagement Trend */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Monthly Engagement</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="text-green-600 text-sm font-medium">+24% growth</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={crmData.monthlyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #3B82F6',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="contacts" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorUsers)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Program Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 shadow-lg animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Program Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={crmData.programDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {crmData.programDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #06B6D4',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {crmData.programDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{backgroundColor: item.color}}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Overlay for Assistant
  const AnalyticsOverlay = () => (
    showAnalytics && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Real-time Analytics Dashboard</h2>
              <button 
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110"
              >
                <XCircle size={24} />
              </button>
            </div>
            <AssistantAnalyticsDashboard />
          </div>
        </div>
      </div>
    )
  );

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Header with Platform Switcher */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-200 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg animate-glow">
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
            {/* Platform Switcher */}
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
          {/* CRM Navigation */}
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
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-glow'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent size={16} />
                  {nav.label}
                </button>
              );
            })}
          </div>

          {/* CRM Main Content */}
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
          {/* Assistant Navigation */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCurrentView('chat')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                currentView === 'chat' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-glow' 
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <MessageCircle size={16} />
              Chat
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                currentView === 'analytics' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg animate-glow' 
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>

          {/* Assistant Main Content */}
          {currentView === 'chat' && <AssistantInterface />}
          {currentView === 'analytics' && <AssistantAnalyticsDashboard />}
        </div>
      )}

      {/* Modals */}
      <WhatsAppModal />
      <TicketModal />
      <ContactModal />
      <AiAgentsModal />
      <ApiKeyInput />
      <AnalyticsOverlay />
      
      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-200 mt-12 animate-slide-up">
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

      {/* Enhanced Styling */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0.8); 
            opacity: 0.6; 
          }
          40% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }

        @keyframes float-medium {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(90deg); 
          }
        }

        @keyframes float-fast {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-25px) rotate(270deg); 
          }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.6); 
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }

        @keyframes wave {
          0%, 100% { 
            transform: translateX(0) scaleX(1); 
          }
          50% { 
            transform: translateX(10px) scaleX(1.05); 
          }
        }

        @keyframes counter {
          from { 
            opacity: 0;
            transform: scale(0.5);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 4s ease-in-out infinite;
        }

        .animate-counter {
          animation: counter 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntegratedSINDAPlatform;
