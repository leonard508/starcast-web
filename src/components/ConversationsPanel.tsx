'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Client, Conversation, Message, Participant } from '@twilio/conversations'

interface ConversationData {
  sid: string
  friendlyName: string
  lastMessage?: Message
  unreadCount: number
  participants: Participant[]
  createdAt: Date
}

interface MessageData {
  sid: string
  body: string
  author: string
  dateCreated: Date
  index: number
  media?: any[]
}

export default function ConversationsPanel() {
  const [client, setClient] = useState<Client | null>(null)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [identity] = useState(`agent-${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeConversations()
    return () => {
      if (client) {
        client.shutdown()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeConversations = async () => {
    try {
      // Get access token
      const response = await fetch('/api/twilio/access-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identity: identity,
          endpointId: `starcast-admin-${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get access token')
      }

      const { token } = await response.json()

      // Initialize Conversations client
      const conversationClient = new Client(token)
      
      // Set up event listeners before connecting
      conversationClient.on('conversationAdded', (conversation) => {
        console.log('New conversation added:', conversation.sid)
        loadConversations(conversationClient)
      })

      conversationClient.on('conversationRemoved', (conversation) => {
        console.log('Conversation removed:', conversation.sid)
        loadConversations(conversationClient)
      })

      conversationClient.on('messageAdded', (message) => {
        console.log('New message:', message.body)
        if (activeConversation && message.conversation.sid === activeConversation.sid) {
          loadMessages(activeConversation)
        }
        loadConversations(conversationClient) // Update conversation list
      })

      conversationClient.on('participantJoined', (participant) => {
        console.log('Participant joined:', participant.identity)
        loadConversations(conversationClient)
      })

      // Initialize client - some versions don't have initialize method
      try {
        if (typeof (conversationClient as any).initialize === 'function') {
          await (conversationClient as any).initialize()
        }
      } catch (initError) {
        console.log('Client initialize not available, continuing:', initError)
      }
      setClient(conversationClient)
      await loadConversations(conversationClient)
      setLoading(false)

    } catch (error) {
      console.error('Failed to initialize conversations:', error)
      setLoading(false)
    }
  }

  const loadConversations = async (conversationClient: Client) => {
    try {
      const conversationsPaginator = await conversationClient.getSubscribedConversations()
      const conversationsList: ConversationData[] = []

      for (const conversation of conversationsPaginator.items) {
        const participants = await conversation.getParticipants()
        const messages = await conversation.getMessages(1) // Get last message
        
        conversationsList.push({
          sid: conversation.sid,
          friendlyName: conversation.friendlyName || `Conversation ${conversation.sid.slice(-4)}`,
          lastMessage: messages.items[0] || undefined,
          unreadCount: (conversation as any).unreadMessagesCount || 
                      (typeof conversation.getUnreadMessagesCount === 'function' 
                        ? await conversation.getUnreadMessagesCount() 
                        : 0),
          participants: participants.map(p => p),
          createdAt: conversation.dateCreated || new Date()
        })
      }

      // Sort by most recent activity
      conversationsList.sort((a, b) => {
        const aTime = a.lastMessage?.dateCreated || a.createdAt
        const bTime = b.lastMessage?.dateCreated || b.createdAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })

      setConversations(conversationsList)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadMessages = async (conversation: Conversation) => {
    try {
      const messagesPaginator = await conversation.getMessages(50)
      const messagesList: MessageData[] = messagesPaginator.items.map(message => ({
        sid: message.sid,
        body: message.body || '',
        author: message.author || 'Unknown',
        dateCreated: message.dateCreated || new Date(),
        index: message.index,
        media: message.media ? Object.values(message.media) : undefined
      }))

      setMessages(messagesList.reverse()) // Show oldest first
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const selectConversation = async (conversationSid: string) => {
    if (!client) return

    try {
      const conversation = await client.getConversationBySid(conversationSid)
      setActiveConversation(conversation)
      await loadMessages(conversation)
      
      // Mark as read
      await conversation.setAllMessagesRead()
      if (client) {
        loadConversations(client) // Refresh to update unread counts
      }
    } catch (error) {
      console.error('Failed to select conversation:', error)
    }
  }

  const sendMessage = async () => {
    if (!activeConversation || !newMessage.trim() || sending) return

    setSending(true)
    try {
      await activeConversation.sendMessage(newMessage)
      setNewMessage('')
      await loadMessages(activeConversation)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const createNewConversation = async (customerPhone: string) => {
    if (!client) return

    try {
      const conversation = await client.createConversation({
        friendlyName: `Customer ${customerPhone}`,
        uniqueName: `customer-${customerPhone.replace(/[^0-9]/g, '')}-${Date.now()}`
      })

      // Add customer as participant
      await conversation.add(customerPhone)
      
      if (client) {
        await loadConversations(client)
      }
      setActiveConversation(conversation)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Conversations</h3>
          <button
            onClick={() => {
              const phone = prompt('Enter customer phone number:')
              if (phone) createNewConversation(phone)
            }}
            className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            New Conversation
          </button>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.map((conv) => (
            <div
              key={conv.sid}
              onClick={() => selectConversation(conv.sid)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversation?.sid === conv.sid ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{conv.friendlyName}</h4>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage.body}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {conv.participants.length} participant(s)
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">{activeConversation.friendlyName}</h3>
              <p className="text-sm text-gray-600">
                Conversation ID: {activeConversation.sid}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.sid}
                  className={`flex ${message.author === identity ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.author === identity
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.body}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatTime(message.dateCreated)} • {message.author}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}