'use client'

import React, { useState, useEffect } from 'react'

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
}

export default function WhatsAppMessages() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    loadMessages()
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadMessages, 10000)
    return () => clearInterval(interval)
  }, [selectedConversation])

  const loadMessages = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedConversation) {
        params.append('phone', selectedConversation)
      }
      params.append('limit', '100')

      const response = await fetch(`/api/whatsapp/messages?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.data.messages)
        setConversations(data.data.conversations)
        setError(null)
      } else {
        throw new Error('Failed to load messages')
      }
    } catch (err) {
      setError('Failed to load WhatsApp messages')
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const sendReply = async () => {
    if (!selectedConversation || !replyMessage.trim()) return

    setSendingReply(true)
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
        setReplyMessage('')
        // Reload messages to show the sent message
        await loadMessages()
      } else {
        const errorData = await response.json()
        alert(`Failed to send message: ${errorData.error}`)
      }
    } catch (err) {
      alert('Failed to send message')
      console.error('Error sending reply:', err)
    } finally {
      setSendingReply(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove +27 and add 0 prefix for South African numbers
    if (phone.startsWith('+27')) {
      return '0' + phone.slice(3)
    }
    return phone
  }

  const filteredMessages = selectedConversation 
    ? messages.filter(msg => 
        msg.fromNumber === selectedConversation || 
        msg.toNumber === selectedConversation
      )
    : messages

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading WhatsApp messages...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-3">
              <button
                onClick={loadMessages}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
          <p className="text-sm text-gray-500">{conversations.length} active</p>
        </div>
        <div className="overflow-y-auto h-full">
          <div
            className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
              !selectedConversation ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => setSelectedConversation(null)}
          >
            <div className="font-medium">📱 All Messages</div>
            <div className="text-sm text-gray-500">{messages.length} total messages</div>
          </div>
          {conversations.map((conv) => (
            <div
              key={conv.phoneNumber}
              className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                selectedConversation === conv.phoneNumber 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : ''
              }`}
              onClick={() => setSelectedConversation(conv.phoneNumber)}
            >
              <div className="font-medium">
                {conv.profileName || formatPhoneNumber(conv.phoneNumber)}
              </div>
              <div className="text-sm text-gray-500">
                {formatPhoneNumber(conv.phoneNumber)} • {conv.messageCount} messages
              </div>
              <div className="text-xs text-gray-400">
                {formatTime(conv.lastMessageAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Display */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">
            {selectedConversation 
              ? `Chat with ${formatPhoneNumber(selectedConversation)}`
              : 'All WhatsApp Messages'
            }
          </h3>
          <p className="text-sm text-gray-500">
            {filteredMessages.length} messages
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages found
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.direction === 'OUTGOING' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.direction === 'OUTGOING'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="break-words">{message.messageBody}</div>
                  <div className={`text-xs mt-1 ${
                    message.direction === 'OUTGOING' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.direction === 'INCOMING' && message.profileName && (
                      <span>{message.profileName} • </span>
                    )}
                    {formatTime(message.createdAt)}
                    {message.isAutoResponse && (
                      <span className="ml-1">🤖</span>
                    )}
                    {message.status && (
                      <span className="ml-1">
                        {message.status === 'DELIVERED' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Input */}
        {selectedConversation && (
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendReply()
                  }
                }}
                disabled={sendingReply}
              />
              <button
                onClick={sendReply}
                disabled={sendingReply || !replyMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingReply ? '...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}