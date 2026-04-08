import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

function handlePrismaError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Database connection failed:', error.message)
    return NextResponse.json(
      { error: 'Database connection failed. Check DATABASE_URL configuration.' },
      { status: 503 }
    )
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Database request error:', error.code, error.message)
    return NextResponse.json(
      { error: 'Database request failed' },
      { status: 500 }
    )
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return handlePrismaError(error)
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
    return handlePrismaError(error)
  }
}
