'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConversationsPanel from '@/components/ConversationsPanel'
import WhatsAppMessages from '@/components/WhatsAppMessages'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  type: 'user' | 'customer' | 'lead'
  lastContact?: string
  status: 'active' | 'inactive'
}

interface Message {
  id: string
  contactId: string
  type: 'email' | 'whatsapp'
  direction: 'sent' | 'received'
  subject?: string
  content: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: string
  readAt?: string
}

interface Template {
  id: string
  name: string
  type: 'email' | 'whatsapp'
  subject?: string
  content: string
  variables: string[]
  category: 'welcome' | 'approval' | 'rejection' | 'marketing' | 'support'
}

const predefinedTemplates: Template[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    type: 'email',
    subject: 'Welcome to Starcast ISP - Application Received',
    content: `Dear {{firstName}},

Thank you for choosing Starcast ISP! We've received your application for the {{packageName}} package.

Application Details:
- Package: {{packageName}}
- Provider: {{providerName}}
- Application ID: {{applicationId}}
- Status: Under Review

Our team will review your application and contact you within 24 hours.

Best regards,
The Starcast Team`,
    variables: ['firstName', 'packageName', 'providerName', 'applicationId'],
    category: 'welcome'
  },
  {
    id: 'approval-email',
    name: 'Application Approved',
    type: 'email',
    subject: '🎉 Your Internet Application has been Approved!',
    content: `Dear {{firstName}},

Congratulations! Your application for {{packageName}} has been approved.

Next Steps:
1. Our installation team will contact you within 1-2 business days
2. Schedule your installation appointment
3. Prepare payment for your first month's service

Contact: 087 550 0000

Welcome to the Starcast family!

Best regards,
The Starcast Team`,
    variables: ['firstName', 'packageName'],
    category: 'approval'
  },
  {
    id: 'rejection-email',
    name: 'Application Declined',
    type: 'email',
    subject: 'Application Update - Starcast ISP',
    content: `Dear {{firstName}},

Thank you for your interest in Starcast ISP. After reviewing your application for {{packageName}}, we regret to inform you that we cannot proceed at this time.

Reason: {{rejectionReason}}

We are continuously expanding our coverage areas and will notify you when service becomes available in your area.

Contact us: info@starcast.co.za | 087 550 0000

Best regards,
The Starcast Team`,
    variables: ['firstName', 'packageName', 'rejectionReason'],
    category: 'rejection'
  },
  {
    id: 'whatsapp-welcome',
    name: 'WhatsApp Welcome',
    type: 'whatsapp',
    content: `Hi {{firstName}}! 👋

Welcome to Starcast ISP! Your application for {{packageName}} is being reviewed.

We'll update you soon. Reply STOP to opt out.

- Team Starcast`,
    variables: ['firstName', 'packageName'],
    category: 'welcome'
  },
  {
    id: 'whatsapp-approved',
    name: 'WhatsApp Approval',
    type: 'whatsapp',
    content: `🎉 Great news {{firstName}}!

Your {{packageName}} application is APPROVED! 

Our team will call you within 48 hours to schedule installation.

Questions? Reply to this message.

- Team Starcast`,
    variables: ['firstName', 'packageName'],
    category: 'approval'
  },
  {
    id: 'whatsapp-services',
    name: 'WiFi & TV Services',
    type: 'whatsapp',
    content: `WiFi & TV Setup Solutions:

📶 WiFi Coverage Problems?
- Install extra routers for better coverage
- Mesh systems for seamless connectivity
- Get WiFi everywhere in your home & backyard
- Professional WiFi optimization

📺 Home Entertainment Systems:
- TV installations & setup
- Sound system configurations
- Smart home integrations
- Entertainment center design

We have solutions for you!

Shop & Book:
🛒 Buy online: http://starcast.co.za
📅 Arrange booking & installation
🔧 Professional setup included

Contact our team:
📞 Call: 087 250 2788
📧 Email: support@starcast.co.za

Transform your home connectivity & entertainment!`,
    variables: [],
    category: 'marketing'
  }
]

export default function MessagesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'conversations' | 'compose' | 'templates' | 'history' | 'contacts' | 'analytics'>('conversations')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages] = useState<Message[]>([])
  const [templates] = useState<Template[]>(predefinedTemplates)
  
  // Compose form state
  const [composeType, setComposeType] = useState<'email' | 'whatsapp'>('email')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customSubject, setCustomSubject] = useState('')
  const [customContent, setCustomContent] = useState('')
  const [sending, setSending] = useState(false)
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType] = useState<'all' | 'email' | 'whatsapp'>('all')

  useEffect(() => {
    checkAuth()
    loadContacts()
    loadMessages()
    
    // Handle URL parameters for pre-selected user
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('user')
    const userEmail = urlParams.get('email')
    const userName = urlParams.get('name')
    
    if (userId && userEmail) {
      setSelectedContacts([userId])
      setCustomSubject(`Message for ${userName || userEmail}`)
    }
  }, [])

  const checkAuth = async () => {
    try {
      // Check if user is authenticated as admin by trying to fetch a protected endpoint
      const response = await fetch('/api/applications', { 
        credentials: 'include',
        method: 'HEAD' // Just check auth without getting data
      })
      
      if (response.status === 401 || response.status === 403) {
        // Not authenticated or not admin, redirect to login
        router.push('/login?redirect=/admin/messages')
        return
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login?redirect=/admin/messages')
    }
  }

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setContacts(data.data.map((user: any) => ({
          id: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          phone: user.phone,
          type: 'user',
          status: user.active ? 'active' : 'inactive',
          lastContact: user.updatedAt
        })))
      }
    } catch (error) {
      console.error('Failed to load contacts:', error)
    }
  }

  const loadMessages = async () => {
    // TODO: Implement message history API
    // Messages are now handled by WhatsAppMessages component
    console.log('Message history loading handled by WhatsApp component')
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setCustomSubject(template.subject || '')
      setCustomContent(template.content)
      setComposeType(template.type)
    }
  }

  const replaceVariables = (content: string, contact: Contact, extraData?: any) => {
    return content
      .replace(/{{firstName}}/g, contact.firstName)
      .replace(/{{lastName}}/g, contact.lastName)
      .replace(/{{email}}/g, contact.email)
      .replace(/{{phone}}/g, contact.phone || '')
      .replace(/{{packageName}}/g, extraData?.packageName || '[Package Name]')
      .replace(/{{providerName}}/g, extraData?.providerName || '[Provider Name]')
      .replace(/{{applicationId}}/g, extraData?.applicationId || '[Application ID]')
      .replace(/{{rejectionReason}}/g, extraData?.rejectionReason || '[Rejection Reason]')
  }

  const handleSendMessage = async () => {
    if (selectedContacts.length === 0 || !customContent) {
      alert('Please select contacts and add message content')
      return
    }

    setSending(true)
    
    try {
      const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id))
      
      for (const contact of selectedContactsData) {
        const finalContent = replaceVariables(customContent, contact)
        const finalSubject = replaceVariables(customSubject, contact)
        
        const endpoint = composeType === 'email' ? '/api/send-email' : '/api/send-whatsapp'
        
        const payload = composeType === 'email' 
          ? {
              to: contact.email,
              subject: finalSubject,
              message: finalContent,
              customerName: `${contact.firstName} ${contact.lastName}`
            }
          : {
              to: contact.phone,
              message: finalContent
            }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorText = await response.text()
          const contactInfo = composeType === 'email' ? contact.email : contact.phone
          console.error(`Failed to send ${composeType} to ${contactInfo}:`, errorText)
          throw new Error(`Failed to send ${composeType} to ${contactInfo}: ${errorText}`)
        } else {
          const contactInfo = composeType === 'email' ? contact.email : contact.phone
          console.log(`Successfully sent ${composeType} to ${contactInfo}`)
        }
      }

      alert(`Messages sent successfully to ${selectedContacts.length} contacts!`)
      setSelectedContacts([])
      setCustomContent('')
      setCustomSubject('')
      setSelectedTemplate('')
      
    } catch (error) {
      console.error('Error sending messages:', error)
      alert('Failed to send messages. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messaging Dashboard</h1>
              <p className="text-gray-600">Send emails and WhatsApp messages to customers</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'conversations', label: 'Live Chat', icon: '💬' },
                { id: 'whatsapp', label: 'WhatsApp Messages', icon: '📱' },
                { id: 'compose', label: 'Compose', icon: '✉️' },
                { id: 'templates', label: 'Templates', icon: '📝' },
                { id: 'contacts', label: 'Contacts', icon: '👥' },
                { id: 'history', label: 'History', icon: '📋' },
                { id: 'analytics', label: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Live Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Real-Time Customer Conversations</h3>
            <ConversationsPanel />
          </div>
        )}

        {/* WhatsApp Messages Tab */}
        {(activeTab as string) === 'whatsapp' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">WhatsApp Customer Messages</h3>
            <WhatsAppMessages />
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contacts Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Select Recipients</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <button
                  onClick={() => setSelectedContacts(selectedContacts.length === filteredContacts.length ? [] : filteredContacts.map(c => c.id))}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedContacts.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  ({selectedContacts.length} selected)
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredContacts.map((contact) => (
                  <label key={contact.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, contact.id])
                        } else {
                          setSelectedContacts(selectedContacts.filter(id => id !== contact.id))
                        }
                      }}
                      className="mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="text-sm text-gray-500">
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Composer */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
              
              {/* Message Type Selection */}
              <div className="mb-4">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={composeType === 'email'}
                      onChange={(e) => setComposeType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <span className="mr-2">📧</span>
                      Email
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="whatsapp"
                      checked={composeType === 'whatsapp'}
                      onChange={(e) => setComposeType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <span className="mr-2">📱</span>
                      WhatsApp
                    </span>
                  </label>
                </div>
              </div>

              {/* Template Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template...</option>
                  {templates
                    .filter(t => t.type === composeType)
                    .map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Subject (Email only) */}
              {composeType === 'email' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Message Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder={composeType === 'email' ? 'Enter your email message...' : 'Enter your WhatsApp message...'}
                  rows={composeType === 'email' ? 12 : 6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Available variables: {`{{firstName}}, {{lastName}}, {{email}}, {{packageName}}, {{applicationId}}`}
                </div>
              </div>

              {/* Send Button */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedContacts.length} recipient(s) selected
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || selectedContacts.length === 0 || !customContent}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : `Send ${composeType === 'email' ? 'Email' : 'WhatsApp'}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Message Templates</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Create Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.type === 'email' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {template.type === 'email' ? '📧 Email' : '📱 WhatsApp'}
                    </span>
                  </div>
                  
                  {template.subject && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 mb-3 max-h-20 overflow-hidden">
                    {template.content.substring(0, 150)}...
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.category === 'welcome' ? 'bg-purple-100 text-purple-800' :
                      template.category === 'approval' ? 'bg-green-100 text-green-800' :
                      template.category === 'rejection' ? 'bg-red-100 text-red-800' :
                      template.category === 'marketing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {template.category}
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('compose')
                        handleTemplateSelect(template.id)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Management</h3>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{contact.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contact.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContacts([contact.id])
                            setActiveTab('compose')
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Message History</h3>
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📨</div>
              <p>Message history will appear here</p>
              <p className="text-sm">Send some messages to see them in history</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Messaging Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Emails Sent</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">WhatsApp Messages</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">0%</div>
                <div className="text-sm text-gray-600">Open Rate</div>
              </div>
            </div>

            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p>Analytics data will appear here</p>
              <p className="text-sm">Start sending messages to see analytics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}