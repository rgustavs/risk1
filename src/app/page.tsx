'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Project } from '@prisma/client'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })

      if (res.ok) {
        setName('')
        setDescription('')
        fetchProjects()
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error?.toString() || 'Failed to create project')
      }
    } catch (error) {
      setError('Network error — is the server running?')
      console.error('Failed to create project', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-2">Manage your risk voting workshops.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
          <Card>
            <form onSubmit={handleCreateProject}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Project Name</label>
                  <Input
                    id="name"
                    placeholder="E.g., Q3 Enterprise Risk Assessment"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={creating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                  <Input
                    id="description"
                    placeholder="Brief description of the project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={creating}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                {error && (
                  <p className="text-sm text-destructive w-full">{error}</p>
                )}
                <Button type="submit" disabled={creating || !name} className="w-full">
                  {creating ? 'Creating...' : <><PlusCircle className="mr-2 h-4 w-4" /> Create Project</>}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No projects found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter>
                    <Link href={`/projects/${project.id}`} className="w-full">
                      <Button variant="outline" className="w-full">Open Project</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t text-center">
        <h3 className="text-lg font-medium mb-4">Participant?</h3>
        <Link href="/join">
          <Button variant="secondary" size="lg">Join a Session via Code</Button>
        </Link>
      </div>
    </div>
  )
}
