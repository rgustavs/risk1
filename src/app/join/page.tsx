'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn } from 'lucide-react'

export default function JoinSession() {
  const [joinCode, setJoinCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode || !displayName) return

    setJoining(true)
    setError('')

    try {
      // Dummy logic for now until session join logic is fully implemented
      console.log('Joining session', joinCode, 'as', displayName)
      await new Promise(resolve => setTimeout(resolve, 500))
      setError('Session joining logic to be implemented')
    } catch (err) {
      console.error('Failed to join', err)
      setError('Failed to join session. Please check the code.')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join Session</CardTitle>
          <CardDescription>Enter the code provided by your facilitator to join the risk voting workshop.</CardDescription>
        </CardHeader>
        <form onSubmit={handleJoin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="joinCode" className="text-sm font-medium">Session Code</label>
              <Input
                id="joinCode"
                placeholder="E.g., A1B2C3"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                disabled={joining}
                maxLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">Your Display Name</label>
              <Input
                id="displayName"
                placeholder="How you will appear in the session"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={joining}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={joining || !joinCode || !displayName} className="w-full text-lg h-12">
              {joining ? 'Joining...' : <><LogIn className="mr-2 h-5 w-5" /> Join Workshop</>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
