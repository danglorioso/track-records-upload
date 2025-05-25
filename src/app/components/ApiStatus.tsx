'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://track-api-pbqe.onrender.com'

type Status = 'online' | 'offline' | 'booting'

export default function ApiStatus() {
  const [status, setStatus] = useState<Status>('booting')

  const checkStatus = async () => {
    try {
      const res = await axios.get(API_URL, { timeout: 3000 })
      if (res.data.status === 'API is running') {
        setStatus('online')
      } else {
        setStatus('offline')
      }
    } catch {
      setStatus('offline')
    }
  }

  const wakeApi = async () => {
    setStatus('booting')
    try {
      await axios.get(API_URL)
      setTimeout(checkStatus, 5000) // Recheck after some time
    } catch {
      setStatus('offline')
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const statusMap = {
    online: {
      text: 'API ready',
      color: 'bg-green-500',
    },
    booting: {
      text: 'Waking up...',
      color: 'bg-orange-400',
    },
    offline: {
      text: 'Sleeping (click to wake)',
      color: 'bg-red-500',
    },
  }

  const { text, color } = statusMap[status]

  return (
    <div
      className="fixed top-2 left-2 flex items-center gap-2 text-sm text-white bg-blue/70 px-3 py-1 rounded-full shadow border border-gray-400 z-50 cursor-pointer hover:bg-blue"
      onClick={status === 'offline' ? wakeApi : undefined}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span>{text}</span>
    </div>
  )
}
