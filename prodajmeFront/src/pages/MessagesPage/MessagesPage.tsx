import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import axiosClient from '../../api/axiosClient'
import { getProductLabel, isProductDeleted } from '../../api/productTypes'
import { useAuth } from '../../context/AuthContext'
import styles from './MessagesPage.module.css'

interface MessageUser {
  id: number
  name?: string
  firstName?: string
  lastName?: string
  username?: string
  email?: string
}

interface MessageProduct {
  id: number
  title?: string
  status?: string
}

interface MessageItem {
  id: number
  text: string
  dateSent?: string
  sender?: MessageUser
  receiver?: MessageUser
  product?: MessageProduct
}

interface ApiResponse<TData> {
  data?: TData
  message?: string
}

interface Conversation {
  key: string
  product: MessageProduct
  otherUser: MessageUser
  messages: MessageItem[]
  lastMessage: MessageItem
}

const extractMessages = (payload: MessageItem[] | ApiResponse<{ messages?: MessageItem[] }>): MessageItem[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const messages = payload?.data?.messages
  return Array.isArray(messages) ? messages : []
}

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

const formatPersonName = (user?: MessageUser) => {
  if (!user) {
    return 'Nepoznat korisnik'
  }

  const fullName = [user.firstName ?? user.name, user.lastName].filter(Boolean).join(' ').trim()
  return fullName || user.username || user.email || `Korisnik #${user.id}`
}

const formatDate = (dateSent?: string) => {
  if (!dateSent) {
    return 'N/A'
  }

  return new Date(dateSent).toLocaleString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const toTimestamp = (dateSent?: string) => {
  if (!dateSent) {
    return 0
  }

  const timestamp = Date.parse(dateSent)
  return Number.isFinite(timestamp) ? timestamp : 0
}

function MessagesPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const [allMessages, setAllMessages] = useState<MessageItem[]>([])
  const [activeConversationKey, setActiveConversationKey] = useState<string | null>(null)
  const [draftMessage, setDraftMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const [receivedResponse, sentResponse] = await Promise.all([
          axiosClient.get(`/api/messages/received/${currentUser.id}`),
          axiosClient.get(`/api/messages/sent/${currentUser.id}`),
        ])

        const mergedMessages = [...extractMessages(receivedResponse.data), ...extractMessages(sentResponse.data)]
        const uniqueMessages = Array.from(
          new Map(mergedMessages.map((message) => [message.id, message])).values(),
        )

        setAllMessages(uniqueMessages)
      } catch (caughtError) {
        setError(readErrorMessage(caughtError, 'Došlo je do greške pri učitavanju poruka.'))
      } finally {
        setLoading(false)
      }
    }

    void loadMessages()
  }, [currentUser?.id])

  const conversations = useMemo<Conversation[]>(() => {
    if (!currentUser?.id) {
      return []
    }

    const groupedConversations = new Map<string, Conversation>()

    for (const message of allMessages) {
      const productId = message.product?.id
      const senderId = message.sender?.id
      const receiverId = message.receiver?.id

      if (!productId || !senderId || !receiverId) {
        continue
      }

      const isOwnMessage = senderId === currentUser.id
      const otherUser = isOwnMessage ? message.receiver : message.sender

      if (!otherUser?.id) {
        continue
      }

      const conversationKey = `${productId}-${otherUser.id}`
      const existingConversation = groupedConversations.get(conversationKey)

      if (existingConversation) {
        existingConversation.messages.push(message)
        continue
      }

      groupedConversations.set(conversationKey, {
        key: conversationKey,
        product: message.product ?? { id: productId },
        otherUser,
        messages: [message],
        lastMessage: message,
      })
    }

    const normalizedConversations = Array.from(groupedConversations.values()).map((conversation) => {
      const sortedMessages = [...conversation.messages].sort((first, second) => {
        const diff = toTimestamp(first.dateSent) - toTimestamp(second.dateSent)
        return diff !== 0 ? diff : first.id - second.id
      })

      return {
        ...conversation,
        messages: sortedMessages,
        lastMessage: sortedMessages[sortedMessages.length - 1],
      }
    })

    return normalizedConversations.sort(
      (first, second) => toTimestamp(second.lastMessage.dateSent) - toTimestamp(first.lastMessage.dateSent),
    )
  }, [allMessages, currentUser?.id])

  useEffect(() => {
    if (conversations.length === 0) {
      setActiveConversationKey(null)
      return
    }

    const exists = conversations.some((conversation) => conversation.key === activeConversationKey)

    if (!exists) {
      setActiveConversationKey(conversations[0].key)
    }
  }, [conversations, activeConversationKey])

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.key === activeConversationKey) ?? null,
    [conversations, activeConversationKey],
  )

  const handleSendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedConversation || !currentUser?.id || !draftMessage.trim()) {
      return
    }

    try {
      setSending(true)
      setError('')
      const response = await axiosClient.post<ApiResponse<{ message?: MessageItem }>>('/api/messages', {
        text: draftMessage.trim(),
        sender: { id: currentUser.id },
        receiver: { id: selectedConversation.otherUser.id },
        product: { id: selectedConversation.product.id },
      })

      const createdMessage = response.data?.data?.message

      setAllMessages((previousMessages) => [
        ...previousMessages,
        createdMessage ?? {
          id: Date.now(),
          text: draftMessage.trim(),
          dateSent: new Date().toISOString(),
          sender: { id: currentUser.id },
          receiver: { id: selectedConversation.otherUser.id },
          product: selectedConversation.product,
        },
      ])
      setDraftMessage('')
    } catch (caughtError) {
      setError(readErrorMessage(caughtError, 'Slanje poruke nije uspelo.'))
    } finally {
      setSending(false)
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Poruke</h1>
        <Link to="/" className={styles.backLink}>
          Nazad na oglase
        </Link>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje poruka...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && conversations.length > 0 && (
        <div className={styles.chatLayout}>
          <aside className={styles.conversationList}>
            {conversations.map((conversation) => (
              <button
                key={conversation.key}
                type="button"
                className={`${styles.conversationItem} ${conversation.key === activeConversationKey ? styles.conversationItemActive : ''}`}
                onClick={() => setActiveConversationKey(conversation.key)}
              >
                <p className={styles.conversationTitle}>{getProductLabel(conversation.product)}</p>
                <p className={styles.conversationSubTitle}>{formatPersonName(conversation.otherUser)}</p>
                <p className={styles.conversationPreview}>{conversation.lastMessage.text}</p>
                <p className={styles.conversationDate}>{formatDate(conversation.lastMessage.dateSent)}</p>
              </button>
            ))}
          </aside>

          <section className={styles.chatPanel}>
            {selectedConversation ? (
              <>
                <div className={styles.chatHeader}>
                  <h2>
                    {isProductDeleted(selectedConversation.product) ? (
                      <span className={styles.deletedProductLabel}>{getProductLabel(selectedConversation.product)}</span>
                    ) : (
                      <a href={`/products/${selectedConversation.product.id}`} className={styles.productLink}>
                        {getProductLabel(selectedConversation.product)}
                      </a>
                    )}
                  </h2>
                  <p>Sa: {formatPersonName(selectedConversation.otherUser)}</p>
                </div>

                <div className={styles.chatMessages}>
                  {selectedConversation.messages.map((message) => {
                    const isOwnMessage = message.sender?.id === currentUser?.id

                    return (
                      <article
                        key={message.id}
                        className={`${styles.chatBubble} ${isOwnMessage ? styles.chatBubbleOwn : styles.chatBubbleOther}`}
                      >
                        <p>{message.text}</p>
                        <span>{formatDate(message.dateSent)}</span>
                      </article>
                    )
                  })}
                </div>

                <form className={styles.replyForm} onSubmit={handleSendReply}>
                  <textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Napišite odgovor..."
                    rows={3}
                    required
                  />
                  <button type="submit" disabled={sending || !draftMessage.trim()}>
                    {sending ? 'Slanje...' : 'Pošalji'}
                  </button>
                </form>
              </>
            ) : (
              <p className={styles.stateText}>Izaberite konverzaciju sa leve strane.</p>
            )}
          </section>
        </div>
      )}

      {!loading && !error && conversations.length === 0 && <p className={styles.stateText}>Nemate poruka.</p>}
    </section>
  )
}

export default MessagesPage
