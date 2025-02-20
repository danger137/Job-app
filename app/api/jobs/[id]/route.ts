import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const jobId = params.id;

  const jobIdInt = parseInt(jobId, 10);

  const existingJob = await prisma.job.findUnique({
    where: { id: jobIdInt },
  });

  if (!existingJob) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const body = await req.json();
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobIdInt },
    data: {
      title: body.title || existingJob.title,
      description: body.description || existingJob.description,
      category: body.category || existingJob.category,
      location: body.location || existingJob.location,
      salary: body.salary || existingJob.salary,
    },
  });

  return NextResponse.json(updatedJob, { status: 200 });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  if (!params || !params.id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const jobId = parseInt(params.id, 10);


  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });
  if (!existingJob) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  await prisma.application.deleteMany({
    where: { jobId: jobId },
  });
  const deletedJob = await prisma.job.delete({
    where: { id: jobId },
  });

  return NextResponse.json({ deletedJob: deletedJob ?? {} }, { status: 200 });
}
