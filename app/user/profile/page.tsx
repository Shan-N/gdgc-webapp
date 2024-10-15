'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import AHHHHBACKKKKK from '@/components/back-button'


const supabase = createClient()

interface Profile {
  username: string
  full_name: string
  website: string
  avatar_url: string
  current_year: string
  current_branch: string
  phone_number: string
  instagram_url: string
  github_url: string
  linkedin_url: string
  rfid_tag: string
  prn: string
}

export default function UserProfile() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    website: '',
    avatar_url: '',
    current_year: '',
    current_branch: '',
    phone_number: '',
    instagram_url: '',
    github_url: '',
    linkedin_url: '',
    rfid_tag: '',
    prn: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const validatePRN = (prn: string): boolean => {
    const re = /^[a-zA-Z0-9]{9}$/;
    return re.test(prn);
  };

  useEffect(() => {
    let ignore = false

    async function getProfile() {
      setLoading(true)
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error fetching user:', error)
        setLoading(false)
        return
      }

      if (!user) {
        setLoading(false)
        return
      }

      if (!ignore) {
        setUser(user)

        try {
          const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch profile')
          }

          const { data } = await response.json()
          if (data) {
            setProfile(data)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [])

  async function updateProfile(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return
  
    if (!validatePRN(profile.prn)) {
      alert('Invalid PRN. It should be 9 alphanumeric characters.')
      return
    }

    setLoading(true)
  
    const updates = {
      ...profile,
      updated_at: new Date().toISOString(),
    }
  
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }
      alert('Profile updated successfully!')
    
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }


  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 250 * 1024) { // 250KB limit
        alert('File size exceeds 250KB limit. Please choose a smaller file.')
        return
      }
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setSrc(reader.result as string)
        setCropModalOpen(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    setImageRef(img)
  }, [])


  const getCroppedImg = useCallback((image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg', 1)
    })
  }, [])

  const uploadCroppedImage = useCallback(async () => {
    if (completedCrop && imageRef && user) {
      try {
        const croppedImageBlob = await getCroppedImg(imageRef, completedCrop)
        const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' })

        setLoading(true)

        const fileExt = 'jpg'
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: urlData, error: urlError } = await supabase.storage
          .from('avatars')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 year expiry

        if (urlError) {
          throw urlError
        }

        const updates = {
          avatar_url: urlData.signedUrl,
        }

        const response = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error('Failed to update avatar')
        }

        setProfile({ ...profile, avatar_url: urlData.signedUrl })
        alert('Avatar updated successfully!')
      } catch (error) {
        console.error('Error uploading avatar:', error)
        alert('Error uploading avatar')
      } finally {
        setLoading(false)
        setCropModalOpen(false)
      }
    }
  }, [completedCrop, imageRef, user, getCroppedImg, profile])

  async function changePassword() {
    if (!newPassword) {
      alert('Please enter a new password')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        throw error
      }

      alert('Password changed successfully')
      setNewPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error changing password')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Loading user data...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>No active session</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p>Please sign in to view your profile.</p>
            <Button onClick={() => router.push('/user/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 mt-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <AHHHHBACKKKKK />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
            <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crop Avatar</DialogTitle>
                </DialogHeader>
                {src && (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                  >
                    <img src={src} onLoad={(e) => onImageLoaded(e.currentTarget)} alt="Crop me" />
                  </ReactCrop>
                )}
                <DialogFooter>
                  <Button onClick={uploadCroppedImage}>Upload Cropped Image</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24 cursor-pointer relative group">
                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                    <AvatarFallback>
                      {profile.username ? profile.username.slice(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onSelectFile}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </Avatar>
                  <div className='truncate'>
                    <h3 className="font-medium">{profile.full_name || 'Your Name'}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-blue-500 cursor-pointer mt-1">Click avatar to upload new photo</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username || ''}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website || ''}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={profile.phone_number || ''}
                      onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentYear">Current Year</Label>
                    <Select
                      value={profile.current_year}
                      onValueChange={(value) => setProfile({ ...profile, current_year: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First">First</SelectItem>
                        <SelectItem value="Second">Second</SelectItem>
                        <SelectItem value="Third">Third</SelectItem>
                        <SelectItem value="Fourth">Fourth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentBranch">Current Branch</Label>
                    <Select
                      value={profile.current_branch}
                      onValueChange={(value) => setProfile({ ...profile, current_branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Computer Engineering (AIML Edition)">Computer Engineering (AIML Edition)</SelectItem>
                        <SelectItem value="Computer Engineering (Regional Edition)">Computer Engineering (Regional Edition)</SelectItem>
                        <SelectItem value="Electronics and Telecommunication">Electronics and Telecommunication</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prn">PRN</Label>
                    <Input
                      id="prn"
                      value={profile.prn || ''}
                      onChange={(e) => setProfile({ ...profile, prn: e.target.value })}
                      maxLength={9}
                    />
                    {profile.prn && !validatePRN(profile.prn) && (
                      <p className="text-red-500 text-xs mt-1">PRN must be 9 alphanumeric characters</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      type="url"
                      value={profile.instagram_url || ''}
                      onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={profile.github_url || ''}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>RFID</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rfidTag">RFID Tag</Label>
                  <Input
                    id="rfidTag"
                    value={profile.rfid_tag || ''}
                    onChange={(e) => setProfile({ ...profile, rfid_tag: e.target.value })}
                    disabled
                    />
                    <span className="text-gray-500 text-xs">
                      <i className="fas fa-lock" aria-hidden="true"></i>
                      Assigned by admin
                    </span>
                </div>
              </form>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" type="button" onClick={changePassword}>
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
  
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Button className="w-full" type="submit" disabled={loading} onClick={updateProfile}>
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}