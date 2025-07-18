import React, { useState, useRef } from 'react'
import { useArtifact } from '@artifact/client/hooks'
import { User, Camera, Edit, CheckCircle, X } from 'lucide-react'

import type { UserProfile } from '../types/account.ts'
import useFileUrl from '../hooks/useFileUrl.ts'

interface ProfileProps {
  userProfile?: UserProfile
  setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile>>
  saveProfile?: (profile: UserProfile) => void | Promise<void>
  skeleton?: boolean
}

const ProfileSection: React.FC<ProfileProps> = ({
  userProfile,
  setUserProfile,
  saveProfile,
  skeleton
}) => {
  const artifact = useArtifact()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pictureUrl = useFileUrl(userProfile?.profilePicture)

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(userProfile?.name ?? '')

  if (skeleton) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  const handleProfilePictureChange = () => {
    fileInputRef.current?.click()
  }

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'image/jpeg') {
      alert('Please upload a JPEG image')
      return
    }

    const buf = await file.arrayBuffer()
    if (!artifact) return
    artifact.files.write.binary('profile.jpg', new Uint8Array(buf))

    const updated = { ...userProfile!, profilePicture: 'profile.jpg' }
    setUserProfile!(updated)
    await saveProfile?.(updated)
  }

  const startEditingName = () => {
    setTempName(userProfile!.name)
    setEditingName(true)
  }

  const saveName = async () => {
    if (tempName.trim()) {
      const updated = {
        ...userProfile!,
        name: tempName
      }
      setUserProfile!(updated)
      await saveProfile?.(updated)
    }
    setEditingName(false)
  }

  const cancelNameEdit = () => {
    setEditingName(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-lg font-medium mb-4">Profile Information</h2>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-gray-300">
            {pictureUrl ? (
              <img
                src={pictureUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          <input
            ref={fileInputRef}
            onChange={onFileSelected}
            type="file"
            accept="image/jpeg"
            className="hidden"
          />
          <button
            onClick={handleProfilePictureChange}
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
            aria-label="Change profile picture"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            {editingName ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={saveName}
                  className="p-2 text-green-500 hover:text-green-700 transition-colors"
                  aria-label="Save name"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={cancelNameEdit}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Cancel editing"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="text-lg font-medium">{userProfile!.name}</div>
                <button
                  onClick={startEditingName}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Edit name"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="text-gray-600">{userProfile!.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
