/*
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/components/auth-provider'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      await signUp(data.email, data.password, data.name)
      toast({
        title: 'Success',
        description: 'Your account has been created successfully.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error creating your account.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <>
        <Card className="mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create your ServerPilot account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    {...register('password')}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        <Toaster />
      </>
  )
}
*/