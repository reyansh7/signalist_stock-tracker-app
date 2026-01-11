'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import { headers } from "next/headers";

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpData) => {
  try {
    const response = await auth.api.signUpEmail({ body: { email, password, name: fullName }})

    if(response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry
        }
      })
      return { success: true, data: response }
    }
    return { success: false, error: 'Failed to create account' }
  } catch (e) {
    console.log('Sign up failed', e)
    return { success: false, error: e instanceof Error ? e.message : 'Sign up failed' }
  }
}

export const signInWithEmail = async ({ email, password}: SignUpData) => {
  try {
    const response = await auth.api.signInEmail({ body: { email, password }})

      return { success: true, data: response }
    }
    catch (e) {
    console.log('Sign in failed', e)
    return { success: false, error: e instanceof Error ? e.message : 'Sign in failed' }
  }
} 
  

export const signOut = async () => {
  try {
    await auth.api.signOut({headers: await headers()});
  } catch (e) {
    console.log('Sign out failed', e)
    return{ success: false, error:'Sign out failed' }
  }
}


