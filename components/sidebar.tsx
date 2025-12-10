"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useLanguage, type Language } from "@/contexts/language-context"
import { useRuralMode } from "@/contexts/rural-mode-context"
import { useEffect } from "react"
import {
  User,
  Globe,
  LogOut,
  X,
  ChevronRight,
  Phone,
  Mail,
  Lock,
  Calendar,
  MapPin,
  UserCircle,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  AlertCircle,
  Droplet,
  AlertTriangle,
  Activity,
  Pill,
  Mountain,
  Twitch,
} from "lucide-react"

type SidebarView =
  | "main"
  | "profile"
  | "language"
  | "editProfile"
  | "changePassword"
  | "emergencyInfo"
  | "editEmergencyInfo"
  | "ruralMode"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage()
  const { isRuralMode, setIsRuralMode, location, setLocation, detectRuralFromAddress, gpsLocation, classificationResult } = useRuralMode()
  const [currentView, setCurrentView] = useState<SidebarView>("main")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: "Ahmad bin Hassan",
    icNumber: "850612-01-5234",
    phoneNumber: "+60 12-345 6789",
    email: "ahmad.hassan@email.com",
    dateOfBirth: "12 June 1985",
    address: "No. 12, Rumah Panjang Meranti Kampung Meranti, Siburan 94200, Serian Sarawak",
    emergencyContact: "+60 12-987 6543",
  })

  const [editedProfile, setEditedProfile] = useState(profileData)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Emergency info state
  const [emergencyInfo, setEmergencyInfo] = useState({
    bloodType: "B+",
    allergies: "Penicillin, Shellfish",
    healthConditions: "Hypertension, Type 2 Diabetes",
    medications: "Metformin 500mg, Lisinopril 10mg",
    emergencyContactName: "Siti binti Hassan",
    emergencyContactPhone: "+60 12-987 6543",
  })

  const [editedEmergencyInfo, setEditedEmergencyInfo] = useState(emergencyInfo)

  // Auto-detect rural mode from address on mount and when address changes
  useEffect(() => {
    if (profileData.address) {
      const isRural = detectRuralFromAddress(profileData.address)
      // Always auto-enable if address is rural, regardless of current state
      if (isRural) {
        setIsRuralMode(true)
        // Auto-populate location from address if it's rural
        if (!location || location === profileData.address) {
          setLocation(profileData.address)
        }
      }
    }
  }, [profileData.address, detectRuralFromAddress, setIsRuralMode, setLocation])

  const handleSaveProfile = () => {
    setProfileData(editedProfile)
    // Check if new address is rural
    const isRural = detectRuralFromAddress(editedProfile.address)
    if (isRural) {
      setIsRuralMode(true)
      if (!location || location === profileData.address) {
        setLocation(editedProfile.address)
      }
    }
    setCurrentView("profile")
  }

  const handleSavePassword = () => {
    // Password save logic would go here
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setCurrentView("profile")
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const handleSaveEmergencyInfo = () => {
    setEmergencyInfo(editedEmergencyInfo)
    setCurrentView("emergencyInfo")
  }

  const languageOptions: { code: Language; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "ms", name: "Bahasa Melayu", nativeName: "Bahasa Melayu" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  ]

  const renderMainMenu = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t("settings")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{profileData.fullName}</p>
            <p className="text-sm text-muted-foreground">{profileData.icNumber}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-2">
        <button
          onClick={() => setCurrentView("profile")}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">{t("profile")}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => setCurrentView("emergencyInfo")}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium text-foreground">{t("emergencyInfo")}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => setCurrentView("language")}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <span className="font-medium text-foreground block">{t("language")}</span>
              <span className="text-xs text-muted-foreground">
                {languageOptions.find((l) => l.code === language)?.nativeName}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => setCurrentView("ruralMode")}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <span className="font-medium text-foreground block">Rural Mode</span>
              <span className="text-xs text-muted-foreground">
                {isRuralMode ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button onClick={onLogout} variant="destructive" className="w-full flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  )

  const renderProfileView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("main")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{t("profile")}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Picture */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <p className="font-semibold text-foreground">{profileData.fullName}</p>
        </div>

        {/* Personal Information */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">{t("personalInfo")}</h3>
            <Button size="sm" variant="ghost" onClick={() => setCurrentView("editProfile")} className="text-primary">
              {t("edit")}
            </Button>
          </div>
          <div className="space-y-3">
            <ProfileInfoRow icon={User} label={t("fullName")} value={profileData.fullName} />
            <ProfileInfoRow icon={Calendar} label={t("icNumber")} value={profileData.icNumber} />
            <ProfileInfoRow icon={Phone} label={t("phoneNumber")} value={profileData.phoneNumber} />
            <ProfileInfoRow icon={Mail} label={t("email")} value={profileData.email} />
            <ProfileInfoRow icon={Calendar} label={t("dateOfBirth")} value={profileData.dateOfBirth} />
            <ProfileInfoRow icon={MapPin} label={t("address")} value={profileData.address} />
            <ProfileInfoRow icon={Phone} label={t("emergencyContact")} value={profileData.emergencyContact} />
          </div>
        </Card>

        {/* Security */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-4">{t("security")}</h3>
          <button
            onClick={() => setCurrentView("changePassword")}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{t("changePassword")}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </Card>
      </div>
    </div>
  )

  const renderEditProfileView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("profile")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {t("edit")} {t("profile")}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-sm text-muted-foreground">
              {t("fullName")}
            </Label>
            <Input
              id="fullName"
              value={editedProfile.fullName}
              onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="text-sm text-muted-foreground">
              {t("phoneNumber")}
            </Label>
            <Input
              id="phoneNumber"
              value={editedProfile.phoneNumber}
              onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={editedProfile.email}
              onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-sm text-muted-foreground">
              {t("address")}
            </Label>
            <Input
              id="address"
              value={editedProfile.address}
              onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContact" className="text-sm text-muted-foreground">
              {t("emergencyContact")}
            </Label>
            <Input
              id="emergencyContact"
              value={editedProfile.emergencyContact}
              onChange={(e) => setEditedProfile({ ...editedProfile, emergencyContact: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" onClick={() => setCurrentView("profile")} className="flex-1 bg-transparent">
          {t("cancel")}
        </Button>
        <Button onClick={handleSaveProfile} className="flex-1">
          {t("save")}
        </Button>
      </div>
    </div>
  )

  const renderChangePasswordView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("profile")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{t("changePassword")}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-sm text-muted-foreground">
              {t("currentPassword")}
            </Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-sm text-muted-foreground">
              {t("newPassword")}
            </Label>
            <div className="relative mt-1">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
              {t("confirmPassword")}
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" onClick={() => setCurrentView("profile")} className="flex-1 bg-transparent">
          {t("cancel")}
        </Button>
        <Button onClick={handleSavePassword} className="flex-1">
          {t("save")}
        </Button>
      </div>
    </div>
  )

  const renderLanguageView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("main")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{t("selectLanguage")}</h2>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-2">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                language === lang.code ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
              }`}
            >
              <div className="text-left">
                <p className="font-medium text-foreground">{lang.nativeName}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
              {language === lang.code && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEmergencyInfoView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("main")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{t("emergencyInfo")}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Alert Banner */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">{t("emergencyInfoAlert")}</p>
            <p className="text-xs text-destructive/80 mt-1">{t("emergencyInfoDescription")}</p>
          </div>
        </div>

        {/* Emergency Information */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">{t("medicalInformation")}</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentView("editEmergencyInfo")}
              className="text-primary"
            >
              {t("edit")}
            </Button>
          </div>
          <div className="space-y-3">
            <EmergencyInfoRow icon={Droplet} label={t("bloodType")} value={emergencyInfo.bloodType} />
            <EmergencyInfoRow icon={AlertTriangle} label={t("allergies")} value={emergencyInfo.allergies} />
            <EmergencyInfoRow icon={Activity} label={t("healthConditions")} value={emergencyInfo.healthConditions} />
            <EmergencyInfoRow icon={Pill} label={t("currentMedications")} value={emergencyInfo.medications} />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-4">{t("emergencyContact")}</h3>
          <div className="space-y-3">
            <EmergencyInfoRow icon={User} label={t("contactName")} value={emergencyInfo.emergencyContactName} />
            <EmergencyInfoRow icon={Phone} label={t("phoneNumber")} value={emergencyInfo.emergencyContactPhone} />
          </div>
        </Card>
      </div>
    </div>
  )

  const renderRuralModeView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("main")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Rural Mode</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
          <Mountain className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Rural Healthcare Access</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enable this mode if you live in rural areas (e.g., Sarawak, Sabah) to access specialized transport options like boats and helicopters, and book home visits from doctors.
            </p>
          </div>
        </div>

        {/* Rural Mode Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-foreground">Enable Rural Mode</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Access specialized transport and home visit services
              </p>
            </div>
            <div
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                isRuralMode ? "bg-accent" : "bg-secondary"
              }`}
              onClick={() => setIsRuralMode(!isRuralMode)}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isRuralMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </Card>

        {/* Location Input */}
        {isRuralMode && (
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3">Your Location</h3>
            <div className="space-y-2">
              <Label htmlFor="ruralLocation" className="text-sm text-muted-foreground">
                Enter your location (e.g., Long Semadoh, Sarawak)
              </Label>
              <Input
                id="ruralLocation"
                placeholder="Enter your rural location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
              {profileData.address && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs px-0 h-auto mt-1"
                  onClick={() => {
                    setLocation(profileData.address)
                  }}
                >
                  <MapPin className="w-3 h-3 mr-1" /> Use profile address: {profileData.address}
                </Button>
              )}
              {detectRuralFromAddress(profileData.address) && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-2 mt-2">
                  <p className="text-xs text-foreground">
                    <strong>Auto-detected:</strong> Your address appears to be in a rural area. Rural mode has been enabled.
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                This helps us allocate the right transport and services for your area.
              </p>
            </div>
          </Card>
        )}

        {/* GPS Detection Info */}
        {gpsLocation && classificationResult && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h3 className="font-medium text-foreground mb-2 text-sm">GPS Detection</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{classificationResult.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium capitalize">{classificationResult.method}</span>
                  </div>
                  {classificationResult.confidence && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium capitalize">{classificationResult.confidence}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-medium text-right">
                      {gpsLocation.lat.toFixed(4)}, {gpsLocation.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </Card>
        )}
      </div>
    </div>
  )

  const renderEditEmergencyInfoView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("emergencyInfo")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {t("edit")} {t("emergencyInfo")}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="bloodType" className="text-sm text-muted-foreground">
              {t("bloodType")}
            </Label>
            <Input
              id="bloodType"
              value={editedEmergencyInfo.bloodType}
              onChange={(e) => setEditedEmergencyInfo({ ...editedEmergencyInfo, bloodType: e.target.value })}
              placeholder="A+, B+, O-, etc."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="allergies" className="text-sm text-muted-foreground">
              {t("allergies")}
            </Label>
            <Input
              id="allergies"
              value={editedEmergencyInfo.allergies}
              onChange={(e) => setEditedEmergencyInfo({ ...editedEmergencyInfo, allergies: e.target.value })}
              placeholder={t("allergiesPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="healthConditions" className="text-sm text-muted-foreground">
              {t("healthConditions")}
            </Label>
            <Input
              id="healthConditions"
              value={editedEmergencyInfo.healthConditions}
              onChange={(e) => setEditedEmergencyInfo({ ...editedEmergencyInfo, healthConditions: e.target.value })}
              placeholder={t("healthConditionsPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="medications" className="text-sm text-muted-foreground">
              {t("currentMedications")}
            </Label>
            <Input
              id="medications"
              value={editedEmergencyInfo.medications}
              onChange={(e) => setEditedEmergencyInfo({ ...editedEmergencyInfo, medications: e.target.value })}
              placeholder={t("medicationsPlaceholder")}
              className="mt-1"
            />
          </div>
          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-4">{t("emergencyContact")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyContactName" className="text-sm text-muted-foreground">
                  {t("contactName")}
                </Label>
                <Input
                  id="emergencyContactName"
                  value={editedEmergencyInfo.emergencyContactName}
                  onChange={(e) =>
                    setEditedEmergencyInfo({ ...editedEmergencyInfo, emergencyContactName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone" className="text-sm text-muted-foreground">
                  {t("phoneNumber")}
                </Label>
                <Input
                  id="emergencyContactPhone"
                  value={editedEmergencyInfo.emergencyContactPhone}
                  onChange={(e) =>
                    setEditedEmergencyInfo({ ...editedEmergencyInfo, emergencyContactPhone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" onClick={() => setCurrentView("emergencyInfo")} className="flex-1 bg-transparent">
          {t("cancel")}
        </Button>
        <Button onClick={handleSaveEmergencyInfo} className="flex-1">
          {t("save")}
        </Button>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute top-0 left-0 w-[85%] h-full bg-background z-50 shadow-xl animate-in slide-in-from-left duration-300">
        {currentView === "main" && renderMainMenu()}
        {currentView === "profile" && renderProfileView()}
        {currentView === "editProfile" && renderEditProfileView()}
        {currentView === "changePassword" && renderChangePasswordView()}
        {currentView === "language" && renderLanguageView()}
        {currentView === "emergencyInfo" && renderEmergencyInfoView()}
        {currentView === "editEmergencyInfo" && renderEditEmergencyInfoView()}
        {currentView === "ruralMode" && renderRuralModeView()}
      </div>
    </>
  )
}

function ProfileInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground break-words">{value}</p>
      </div>
    </div>
  )
}

function EmergencyInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground break-words">{value}</p>
      </div>
    </div>
  )
}
