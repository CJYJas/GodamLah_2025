"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "ms" | "zh" | "ta"

interface Translations {
  [key: string]: {
    en: string
    ms: string
    zh: string
    ta: string
  }
}

export const translations: Translations = {
  // Common
  welcome: { en: "Welcome back", ms: "Selamat kembali", zh: "欢迎回来", ta: "மீண்டும் வரவேற்கிறோம்" },
  profile: { en: "Profile", ms: "Profil", zh: "个人资料", ta: "சுயவிவரம்" },
  language: { en: "Language", ms: "Bahasa", zh: "语言", ta: "மொழி" },
  logout: { en: "Log Out", ms: "Log Keluar", zh: "登出", ta: "வெளியேறு" },
  settings: { en: "Settings", ms: "Tetapan", zh: "设置", ta: "அமைப்புகள்" },
  save: { en: "Save Changes", ms: "Simpan Perubahan", zh: "保存更改", ta: "மாற்றங்களைச் சேமி" },
  cancel: { en: "Cancel", ms: "Batal", zh: "取消", ta: "ரத்து செய்" },
  edit: { en: "Edit", ms: "Edit", zh: "编辑", ta: "திருத்து" },

  // Profile
  personalInfo: { en: "Personal Information", ms: "Maklumat Peribadi", zh: "个人信息", ta: "தனிப்பட்ட தகவல்" },
  fullName: { en: "Full Name", ms: "Nama Penuh", zh: "全名", ta: "முழு பெயர்" },
  icNumber: { en: "IC Number", ms: "Nombor IC", zh: "身份证号码", ta: "IC எண்" },
  phoneNumber: { en: "Phone Number", ms: "Nombor Telefon", zh: "电话号码", ta: "தொலைபேசி எண்" },
  email: { en: "Email", ms: "Emel", zh: "电子邮件", ta: "மின்னஞ்சல்" },
  dateOfBirth: { en: "Date of Birth", ms: "Tarikh Lahir", zh: "出生日期", ta: "பிறந்த தேதி" },
  address: { en: "Address", ms: "Alamat", zh: "地址", ta: "முகவரி" },
  emergencyContact: { en: "Emergency Contact", ms: "Hubungan Kecemasan", zh: "紧急联系人", ta: "அவசர தொடர்பு" },
  security: { en: "Security", ms: "Keselamatan", zh: "安全", ta: "பாதுகாப்பு" },
  changePassword: { en: "Change Password", ms: "Tukar Kata Laluan", zh: "更改密码", ta: "கடவுச்சொல்லை மாற்று" },
  currentPassword: { en: "Current Password", ms: "Kata Laluan Semasa", zh: "当前密码", ta: "தற்போதைய கடவுச்சொல்" },
  newPassword: { en: "New Password", ms: "Kata Laluan Baru", zh: "新密码", ta: "புதிய கடவுச்சொல்" },
  confirmPassword: { en: "Confirm Password", ms: "Sahkan Kata Laluan", zh: "确认密码", ta: "கடவுச்சொல்லை உறுதிப்படுத்து" },

  // Emergency Info
  emergencyInfo: { en: "Emergency Info", ms: "Maklumat Kecemasan", zh: "紧急信息", ta: "அவசர தகவல்" },
  emergencyInfoAlert: {
    en: "Critical Medical Information",
    ms: "Maklumat Perubatan Kritikal",
    zh: "重要医疗信息",
    ta: "முக்கியமான மருத்துவ தகவல்",
  },
  emergencyInfoDescription: {
    en: "This information will be accessible to medical staff in case of emergency",
    ms: "Maklumat ini boleh diakses oleh kakitangan perubatan semasa kecemasan",
    zh: "紧急情况下，医务人员可以访问此信息",
    ta: "அவசர காலத்தில் மருத்துவ பணியாளர்கள் இந்த தகவலை அணுகலாம்",
  },
  medicalInformation: { en: "Medical Information", ms: "Maklumat Perubatan", zh: "医疗信息", ta: "மருத்துவ தகவல்" },
  bloodType: { en: "Blood Type", ms: "Jenis Darah", zh: "血型", ta: "இரத்த வகை" },
  allergies: { en: "Allergies", ms: "Alahan", zh: "过敏史", ta: "ஒவ்வாமை" },
  healthConditions: { en: "Health Conditions", ms: "Keadaan Kesihatan", zh: "健康状况", ta: "சுகாதார நிலைகள்" },
  currentMedications: { en: "Current Medications", ms: "Ubat Semasa", zh: "当前用药", ta: "தற்போதைய மருந்துகள்" },
  contactName: { en: "Contact Name", ms: "Nama Kenalan", zh: "联系人姓名", ta: "தொடர்பு பெயர்" },
  allergiesPlaceholder: {
    en: "List all known allergies",
    ms: "Senaraikan semua alahan yang diketahui",
    zh: "列出所有已知过敏源",
    ta: "அறியப்பட்ட அனைத்து ஒவ்வாமைகளையும் பட்டியலிடுங்கள்",
  },
  healthConditionsPlaceholder: {
    en: "List chronic conditions or diseases",
    ms: "Senaraikan keadaan kronik atau penyakit",
    zh: "列出慢性疾病或病症",
    ta: "நாள்பட்ட நிலைமைகள் அல்லது நோய்களை பட்டியலிடுங்கள்",
  },
  medicationsPlaceholder: {
    en: "List all medications you're taking",
    ms: "Senaraikan semua ubat yang anda ambil",
    zh: "列出您正在服用的所有药物",
    ta: "நீங்கள் எடுக்கும் அனைத்து மருந்துகளையும் பட்டியலிடுங்கள்",
  },

  // Language
  selectLanguage: { en: "Select Language", ms: "Pilih Bahasa", zh: "选择语言", ta: "மொழியைத் தேர்ந்தெடுக்கவும்" },
  english: { en: "English", ms: "Bahasa Inggeris", zh: "英语", ta: "ஆங்கிலம்" },
  malay: { en: "Bahasa Melayu", ms: "Bahasa Melayu", zh: "马来语", ta: "மலாய்" },
  chinese: { en: "中文 (Chinese)", ms: "Bahasa Cina", zh: "中文", ta: "சீனம்" },
  tamil: { en: "தமிழ் (Tamil)", ms: "Bahasa Tamil", zh: "泰米尔语", ta: "தமிழ்" },

  // Navigation
  home: { en: "Home", ms: "Utama", zh: "主页", ta: "முகப்பு" },
  appointments: { en: "Appointments", ms: "Temujanji", zh: "预约", ta: "சந்திப்புகள்" },
  transport: { en: "Transport", ms: "Pengangkutan", zh: "交通", ta: "போக்குவரத்து" },
  medicine: { en: "Medicine", ms: "Ubat", zh: "药物", ta: "மருந்து" },
  records: { en: "Records", ms: "Rekod", zh: "记录", ta: "பதிவுகள்" },

  // Home Screen
  healthSummary: {
    en: "Your Health Summary",
    ms: "Ringkasan Kesihatan Anda",
    zh: "您的健康摘要",
    ta: "உங்கள் சுகாதார சுருக்கம்",
  },
  nextAppointment: { en: "Next Appointment", ms: "Temujanji Seterusnya", zh: "下次预约", ta: "அடுத்த சந்திப்பு" },
  activePrescriptions: {
    en: "Active Prescriptions",
    ms: "Preskripsi Aktif",
    zh: "活跃处方",
    ta: "செயலில் உள்ள மருந்துச்சீட்டுகள்",
  },
  quickActions: { en: "Quick Actions", ms: "Tindakan Pantas", zh: "快速操作", ta: "விரைவு செயல்கள்" },
  book: { en: "Book", ms: "Tempah", zh: "预约", ta: "முன்பதிவு" },
  refill: { en: "Refill", ms: "Isi Semula", zh: "续药", ta: "மீள்நிரப்பு" },
  upcomingAppointment: {
    en: "Upcoming Appointment",
    ms: "Temujanji Akan Datang",
    zh: "即将到来的预约",
    ta: "வரவிருக்கும் சந்திப்பு",
  },
  viewAll: { en: "View all", ms: "Lihat semua", zh: "查看全部", ta: "அனைத்தையும் காண்க" },
  viewDetails: { en: "View Details", ms: "Lihat Butiran", zh: "查看详情", ta: "விவரங்களைக் காண்க" },
  reschedule: { en: "Reschedule", ms: "Jadual Semula", zh: "重新安排", ta: "மறுதிட்டமிடு" },
  medicineReminders: { en: "Medicine Reminders", ms: "Peringatan Ubat", zh: "服药提醒", ta: "மருந்து நினைவூட்டல்கள்" },
  taken: { en: "Taken", ms: "Diambil", zh: "已服用", ta: "எடுத்தது" },
  upcoming: { en: "Upcoming", ms: "Akan Datang", zh: "即将", ta: "வரவிருக்கும்" },
  missed: { en: "Missed", ms: "Terlepas", zh: "错过", ta: "தவறவிட்டது" },
  refillNeeded: {
    en: "Prescription Refill Needed",
    ms: "Perlu Isi Semula Preskripsi",
    zh: "需要续药",
    ta: "மருந்துச்சீட்டு மீள்நிரப்பு தேவை",
  },
  medications: { en: "Medications", ms: "Ubat-ubatan", zh: "药物", ta: "மருந்துகள்" },
  generalCheckup: { en: "General Checkup", ms: "Pemeriksaan Umum", zh: "普通检查", ta: "பொது பரிசோதனை" },

  // Notifications
  notifications: { en: "Notifications", ms: "Pemberitahuan", zh: "通知", ta: "அறிவிப்புகள்" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
