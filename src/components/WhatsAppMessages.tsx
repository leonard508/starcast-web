'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/auth-client'

interface WhatsAppMessage {
  id: string
  messageId: string
  direction: 'INCOMING' | 'OUTGOING'
  fromNumber: string
  toNumber: string
  messageBody: string
  profileName?: string
  status: string
  isAutoResponse: boolean
  escalated: boolean
  sentAt?: string
  receivedAt?: string
  createdAt: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    phone?: string
  }
}

interface Conversation {
  phoneNumber: string
  profileName?: string
  messageCount: number
  lastMessageAt: string
  unreadCount?: number
  lastMessage?: string
  isOnline?: boolean
}

export default function WhatsAppMessages() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [, setMessageStatus] = useState<{[key: string]: string}>({})
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      
      const params = new URLSearchParams()
      if (selectedConversation) {
        params.append('phone', selectedConversation)
      }
      params.append('limit', '100')

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
      }

      const response = await fetch(`/api/whatsapp/messages?${params}`, {
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        const newMessages = data.data.messages || []
        const newConversations = data.data.conversations || []

        // Enhance conversations with last message preview and unread count
        const enhancedConversations = newConversations.map((conv: any) => {
          const conversationMessages = newMessages.filter((msg: WhatsAppMessage) => 
            msg.fromNumber === conv.phoneNumber || msg.toNumber === conv.phoneNumber
          )
          const lastMsg = conversationMessages[0] // Messages are sorted by createdAt desc
          
          return {
            ...conv,
            lastMessage: lastMsg?.messageBody?.substring(0, 50) + (lastMsg?.messageBody?.length > 50 ? '...' : '') || 'No messages',
            unreadCount: conversationMessages.filter((msg: WhatsAppMessage) => 
              msg.direction === 'INCOMING' && msg.status !== 'READ'
            ).length,
            isOnline: Math.random() > 0.5 // Simulate online status
          }
        })

        setMessages(newMessages)
        setConversations(enhancedConversations)
        setError(null)

        // Update message status tracking
        const statusMap: {[key: string]: string} = {}
        newMessages.forEach((msg: WhatsAppMessage) => {
          statusMap[msg.id] = msg.status
        })
        setMessageStatus(statusMap)

      } else {
        throw new Error('Failed to load messages')
      }
    } catch (err) {
      setError('Failed to load WhatsApp messages')
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedConversation])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedConversation, loadMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout
    if (isTyping) {
      typingTimeout = setTimeout(() => setIsTyping(false), 3000)
    }
    return () => clearTimeout(typingTimeout)
  }, [isTyping])

  const sendReply = async () => {
    if (!selectedConversation || !replyMessage.trim()) return

    setSendingReply(true)
    setIsTyping(false) // Stop typing indicator when sending
    
    // Optimistically add message to UI
    const tempMessage: WhatsAppMessage = {
      id: `temp-${Date.now()}`,
      messageId: `temp-${Date.now()}`,
      direction: 'OUTGOING',
      fromNumber: '+27872502788', // Your WhatsApp number
      toNumber: selectedConversation,
      messageBody: replyMessage.trim(),
      status: 'SENDING',
      isAutoResponse: false,
      escalated: false,
      createdAt: new Date().toISOString()
    }
    
    setMessages(prev => [tempMessage, ...prev])
    setReplyMessage('')
    
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          to: selectedConversation,
          message: replyMessage.trim()
        })
      })

      if (response.ok) {
        // Remove temp message and reload to get real message with proper ID
        setTimeout(() => loadMessages(), 1000)
      } else {
        const errorData = await response.json()
        // Remove temp message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
        alert(`Failed to send message: ${errorData.error}`)
      }
    } catch (err) {
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
      alert('Failed to send message')
      console.error('Error sending reply:', err)
    } finally {
      setSendingReply(false)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyMessage(e.target.value)
    setIsTyping(true)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (messageDate.getTime() === today.getTime() - (24 * 60 * 60 * 1000)) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove +27 and add 0 prefix for South African numbers
    if (phone.startsWith('+27')) {
      return '0' + phone.slice(3)
    }
    return phone
  }

  const getMessageStatusIcon = (status: string, isOutgoing: boolean) => {
    if (!isOutgoing) return null
    
    switch (status.toLowerCase()) {
      case 'sending': return '🕐'
      case 'sent': return '✓'
      case 'delivered': return '✓✓'
      case 'read': return '✓✓'
      default: return '✓'
    }
  }

  const getAvatar = (phoneNumber: string, profileName?: string) => {
    const initials = profileName ? profileName.substring(0, 2).toUpperCase() : phoneNumber.slice(-2)
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500']
    const colorIndex = phoneNumber.charCodeAt(phoneNumber.length - 1) % colors.length
    return { initials, colorClass: colors[colorIndex] }
  }

  const filteredConversations = conversations.filter(conv => 
    searchTerm === '' || 
    (conv.profileName && conv.profileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    formatPhoneNumber(conv.phoneNumber).includes(searchTerm) ||
    conv.phoneNumber.includes(searchTerm)
  )

  const filteredMessages = selectedConversation 
    ? messages.filter(msg => 
        msg.fromNumber === selectedConversation || 
        msg.toNumber === selectedConversation
      )
    : messages

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading conversations...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-red-800">Connection Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={loadMessages}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">WhatsApp Business</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-green-700 px-2 py-1 rounded-full">
                {conversations.length} chats
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-white border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
          {/* All Messages Option */}
          <div
            className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-colors ${
              !selectedConversation ? 'bg-green-50 border-l-4 border-l-green-500' : ''
            }`}
            onClick={() => setSelectedConversation(null)}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                📱
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="font-medium text-gray-900">All Messages</div>
                <div className="text-sm text-gray-500 truncate">
                  {messages.length} total messages
                </div>
              </div>
            </div>
          </div>

          {/* Individual Conversations */}
          {filteredConversations.map((conv) => {
            const avatar = getAvatar(conv.phoneNumber, conv.profileName)
            return (
              <div
                key={conv.phoneNumber}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-colors ${
                  selectedConversation === conv.phoneNumber 
                    ? 'bg-green-50 border-l-4 border-l-green-500' 
                    : ''
                }`}
                onClick={() => setSelectedConversation(conv.phoneNumber)}
              >
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className={`w-12 h-12 ${avatar.colorClass} rounded-full flex items-center justify-center text-white font-semibold text-sm relative`}>
                    {avatar.initials}
                    {conv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">
                        {conv.profileName || formatPhoneNumber(conv.phoneNumber)}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {formatTime(conv.lastMessageAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </div>
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-2">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {formatPhoneNumber(conv.phoneNumber)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-100 p-4 border-b">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getAvatar(selectedConversation).colorClass} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {getAvatar(selectedConversation).initials}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {conversations.find(c => c.phoneNumber === selectedConversation)?.profileName || 
                     formatPhoneNumber(selectedConversation)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatPhoneNumber(selectedConversation)} • 
                    {conversations.find(c => c.phoneNumber === selectedConversation)?.isOnline ? ' Online' : ' Last seen recently'}
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    📞
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    📹
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    ⋮
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {filteredMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg">No messages yet</p>
                  <p className="text-sm">Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((message, index) => {
                    const isOutgoing = message.direction === 'OUTGOING'
                    const showTime = index === 0 || 
                      new Date(filteredMessages[index - 1].createdAt).getTime() - new Date(message.createdAt).getTime() > 300000 // 5 minutes

                    return (
                      <div key={message.id}>
                        {showTime && (
                          <div className="text-center my-4">
                            <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                              isOutgoing
                                ? 'bg-green-500 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none'
                            } ${message.status === 'SENDING' ? 'opacity-70' : ''}`}
                          >
                            <div className="break-words whitespace-pre-wrap">{message.messageBody}</div>
                            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                              isOutgoing ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {message.isAutoResponse && (
                                <span className="text-blue-400" title="Auto-response">🤖</span>
                              )}
                              {isOutgoing && (
                                <span className={message.status === 'read' ? 'text-blue-400' : ''}>
                                  {getMessageStatusIcon(message.status, isOutgoing)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-sm rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  📎
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendReply()
                      }
                    }}
                    disabled={sendingReply}
                  />
                  <button className="absolute right-2 top-2 p-1 text-gray-600 hover:bg-gray-200 rounded-full">
                    😊
                  </button>
                </div>
                <button
                  onClick={sendReply}
                  disabled={sendingReply || !replyMessage.trim()}
                  className={`p-2 rounded-full transition-colors ${
                    replyMessage.trim() 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-400'
                  } disabled:opacity-50`}
                >
                  {sendingReply ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-8xl mb-6">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">WhatsApp Business Dashboard</h2>
              <p className="text-gray-500 mb-4">Select a conversation to start messaging</p>
              <div className="bg-white p-4 rounded-lg shadow-sm max-w-md">
                <h3 className="font-medium text-gray-800 mb-2">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{conversations.length}</div>
                    <div className="text-gray-500">Active Chats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                    <div className="text-gray-500">Total Messages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}