'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { requireUser } from '@/lib/authorization';
import { revalidatePath } from 'next/cache';

const ProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  college: z.string().max(150).optional().default(''),
  degree: z.string().max(100).optional().default(''),
  branch: z.string().max(100).optional().default(''),
  graduationYear: z.coerce.number().min(2000).max(2040).optional().nullable(),
  targetRole: z.string().min(1, 'Target role is required').max(100),
  targetCompanies: z.array(z.string()).default([]),
  experienceLevel: z.string().default('Fresher (0-1 yrs)'),
  strongestSkills: z.array(z.string()).default([]),
  weakestSkills: z.array(z.string()).default([]),
  dailyGoalMinutes: z.coerce.number().min(5).max(180).default(30),
  confidenceLevel: z.coerce.number().min(0).max(100).default(50),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

export async function getProfileAction() {
  const user = await requireUser();

  const userWithProfile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      resumes: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      interviews: {
        select: { id: true, overallScore: true, status: true },
      },
    },
  });

  if (!userWithProfile) {
    throw new Error('User not found');
  }

  // Calculate authentic completion percentage
  let completedWeight = 0;
  if (userWithProfile.name) completedWeight += 20;
  if (userWithProfile.profile?.college) completedWeight += 15;
  if (userWithProfile.profile?.degree) completedWeight += 10;
  if (userWithProfile.profile?.targetRole) completedWeight += 20;
  if (userWithProfile.profile?.targetCompanies?.length) completedWeight += 15;
  if (userWithProfile.profile?.strongestSkills?.length) completedWeight += 10;
  if (userWithProfile.resumes.length > 0) completedWeight += 10;

  return {
    user: {
      id: userWithProfile.id,
      name: userWithProfile.name,
      email: userWithProfile.email,
      role: userWithProfile.role,
      createdAt: userWithProfile.createdAt,
    },
    profile: userWithProfile.profile,
    completionPercent: Math.min(100, completedWeight),
    latestResume: userWithProfile.resumes[0] || null,
    totalInterviews: userWithProfile.interviews.length,
  };
}

export async function updateProfileAction(rawInput: ProfileUpdateInput) {
  const user = await requireUser();
  const parsed = ProfileUpdateSchema.parse(rawInput);

  // Update user display name
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.name },
  });

  // Calculate completion
  let completedWeight = 20; // name is present
  if (parsed.college) completedWeight += 15;
  if (parsed.degree) completedWeight += 10;
  if (parsed.targetRole) completedWeight += 20;
  if (parsed.targetCompanies.length > 0) completedWeight += 15;
  if (parsed.strongestSkills.length > 0) completedWeight += 10;

  // Upsert Profile
  const updatedProfile = await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      college: parsed.college || null,
      degree: parsed.degree || null,
      branch: parsed.branch || null,
      graduationYear: parsed.graduationYear || null,
      targetRole: parsed.targetRole,
      targetCompanies: parsed.targetCompanies,
      experienceLevel: parsed.experienceLevel,
      strongestSkills: parsed.strongestSkills,
      weakestSkills: parsed.weakestSkills,
      dailyGoalMinutes: parsed.dailyGoalMinutes,
      confidenceLevel: parsed.confidenceLevel,
      completionPercent: Math.min(100, completedWeight),
    },
    update: {
      college: parsed.college || null,
      degree: parsed.degree || null,
      branch: parsed.branch || null,
      graduationYear: parsed.graduationYear || null,
      targetRole: parsed.targetRole,
      targetCompanies: parsed.targetCompanies,
      experienceLevel: parsed.experienceLevel,
      strongestSkills: parsed.strongestSkills,
      weakestSkills: parsed.weakestSkills,
      dailyGoalMinutes: parsed.dailyGoalMinutes,
      confidenceLevel: parsed.confidenceLevel,
      completionPercent: Math.min(100, completedWeight),
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'PROFILE_UPDATED',
      resource: 'Profile',
      metadata: { targetRole: parsed.targetRole },
    },
  });

  revalidatePath('/profile');
  revalidatePath('/dashboard');

  return { success: true, profile: updatedProfile };
}
