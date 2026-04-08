import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = CreateProjectSchema.parse(body)

    const project = await db.project.create({
      data: {
        name,
        description,
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
