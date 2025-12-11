"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Share2,
  ChevronRight,
  Activity,
  Beaker,
  Stethoscope,
  Syringe,
  Eye,
  Calendar,
  Building2,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Check,
} from "lucide-react"

const records = [
  {
    id: 1,
    type: "Lab Results",
    title: "Blood Test Results",
    date: "Dec 1, 2025",
    hospital: "HUKM",
    icon: Beaker,
    category: "Laboratory",
  },
  {
    id: 2,
    type: "Consultation",
    title: "General Checkup Notes",
    date: "Nov 15, 2025",
    hospital: "Klinik Kesihatan Ampang",
    icon: Stethoscope,
    category: "Clinical",
  },
  {
    id: 3,
    type: "Vaccination",
    title: "COVID-19 Booster",
    date: "Oct 20, 2025",
    hospital: "PPUM",
    icon: Syringe,
    category: "Immunization",
  },
  {
    id: 4,
    type: "Imaging",
    title: "Chest X-Ray",
    date: "Sep 5, 2025",
    hospital: "Hospital Kuala Lumpur",
    icon: Eye,
    category: "Imaging",
  },
  {
    id: 5,
    type: "Lab Results",
    title: "HbA1c Test",
    date: "Aug 10, 2025",
    hospital: "HUKM",
    icon: Beaker,
    category: "Laboratory",
  },
  {
    id: 6,
    type: "Consultation",
    title: "Diabetes Review",
    date: "Jul 20, 2025",
    hospital: "PPUM",
    icon: Stethoscope,
    category: "Clinical",
  },
]

const vitalHistory = [
  { label: "Blood Pressure", value: "128/82", unit: "mmHg", status: "normal", trend: "stable" },
  { label: "Blood Sugar", value: "6.2", unit: "mmol/L", status: "elevated", trend: "down" },
  { label: "Heart Rate", value: "72", unit: "bpm", status: "normal", trend: "stable" },
  { label: "BMI", value: "24.5", unit: "kg/m²", status: "normal", trend: "up" },
]

const vitalTrends = [
  {
    name: "Blood Pressure",
    unit: "mmHg",
    data: [
      { date: "Jul", systolic: 135, diastolic: 88 },
      { date: "Aug", systolic: 132, diastolic: 85 },
      { date: "Sep", systolic: 130, diastolic: 84 },
      { date: "Oct", systolic: 129, diastolic: 83 },
      { date: "Nov", systolic: 128, diastolic: 82 },
      { date: "Dec", systolic: 128, diastolic: 82 },
    ],
  },
  {
    name: "Blood Sugar (Fasting)",
    unit: "mmol/L",
    data: [
      { date: "Jul", value: 7.2 },
      { date: "Aug", value: 6.8 },
      { date: "Sep", value: 6.5 },
      { date: "Oct", value: 6.4 },
      { date: "Nov", value: 6.3 },
      { date: "Dec", value: 6.2 },
    ],
  },
]

const immunizations = [
  { id: 1, name: "COVID-19 Booster (4th dose)", date: "Oct 20, 2025", location: "PPUM", status: "completed" },
  { id: 2, name: "Influenza Vaccine", date: "Sep 15, 2025", location: "Klinik Kesihatan Ampang", status: "completed" },
  { id: 3, name: "COVID-19 Booster (3rd dose)", date: "Apr 10, 2025", location: "HUKM", status: "completed" },
  { id: 4, name: "Tetanus Booster", date: "Jan 5, 2024", location: "Hospital KL", status: "completed" },
  { id: 5, name: "Hepatitis B (3rd dose)", date: "Mar 20, 2020", location: "PPUM", status: "completed" },
]

export function RecordsScreen() {
  const [selectedRecord, setSelectedRecord] = useState<(typeof records)[0] | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "Laboratory" | "Clinical" | "Imaging" | "Immunization">("all")
  const [showVitalTrends, setShowVitalTrends] = useState(false)
  const [showImmunizations, setShowImmunizations] = useState(false)
  const [downloadedId, setDownloadedId] = useState<number | null>(null)

  const handleDownload = (id: number) => {
    setDownloadedId(id)
    setTimeout(() => setDownloadedId(null), 2000)
  }

  if (showVitalTrends) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowVitalTrends(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Vital Trends</h1>
        </header>

        {vitalTrends.map((vital) => (
          <Card key={vital.name} className="p-4">
            <h2 className="font-medium mb-4">{vital.name}</h2>

            {/* Simple bar chart visualization */}
            <div className="space-y-3">
              {vital.data.map((point, index) => {
                const value = "systolic" in point ? point.systolic : point.value
                const maxValue = "systolic" in vital.data[0] ? 150 : 8
                const percentage = (value / maxValue) * 100

                return (
                  <div key={point.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{point.date}</span>
                    <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-16 text-right">
                      {"systolic" in point ? `${point.systolic}/${point.diastolic}` : point.value} {vital.unit}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">6-month trend</span>
              <div className="flex items-center gap-1 text-accent">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Improving</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (showImmunizations) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowImmunizations(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Immunization Records</h1>
        </header>

        <div className="space-y-3">
          {immunizations.map((imm) => (
            <Card key={imm.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Syringe className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{imm.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{imm.location}</p>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      <Check className="w-3 h-3 mr-1" /> {imm.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{imm.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (selectedRecord) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setSelectedRecord(null)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-semibold">Record Details</h1>
        </header>

        <Card className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <selectedRecord.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-1 text-xs">
                {selectedRecord.category}
              </Badge>
              <h2 className="text-lg font-semibold">{selectedRecord.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedRecord.type}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{selectedRecord.date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{selectedRecord.hospital}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-secondary/30 flex flex-col items-center justify-center min-h-[200px]">
          <FileText className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground text-center mb-2">Document Preview</p>
          <p className="text-xs text-muted-foreground text-center">
            {selectedRecord.title} - {selectedRecord.date}
          </p>
        </Card>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => handleDownload(selectedRecord.id)}
            disabled={downloadedId === selectedRecord.id}
          >
            {downloadedId === selectedRecord.id ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Downloaded
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" /> Download
              </>
            )}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>
    )
  }

  const filteredRecords = activeTab === "all" ? records : records.filter((r) => r.category === activeTab)

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold">Medical Records</h1>
        <p className="text-sm text-muted-foreground">Your complete health history</p>
      </header>

      {/* Health Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Latest Vitals</h2>
          <Badge variant="secondary">Dec 1, 2025</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {vitalHistory.map((vital) => (
            <div key={vital.label} className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{vital.label}</span>
                <div className="flex items-center gap-1">
                  {vital.trend === "up" && <TrendingUp className="w-3 h-3 text-chart-3" />}
                  {vital.trend === "down" && <TrendingDown className="w-3 h-3 text-accent" />}
                  <div className={`w-2 h-2 rounded-full ${vital.status === "normal" ? "bg-accent" : "bg-chart-3"}`} />
                </div>
              </div>
              <p className="font-semibold">
                {vital.value} <span className="text-xs font-normal text-muted-foreground">{vital.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["all", "Laboratory", "Clinical", "Imaging", "Immunization"] as const).map((tab) => (
          <Badge
            key={tab}
            variant={activeTab === tab ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" ? "All Records" : tab}
          </Badge>
        ))}
      </div>

      {/* Records List */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          {activeTab === "all" ? "Recent Records" : `${activeTab} Records`}
        </h2>
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No {activeTab.toLowerCase()} records found</p>
            </Card>
          ) : (
            filteredRecords.map((record) => {
              const Icon = record.icon
              return (
                <Card
                  key={record.id}
                  className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{record.title}</h3>
                      <p className="text-xs text-muted-foreground">{record.type}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{record.date}</span>
                        <span>•</span>
                        <span className="truncate">{record.hospital}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => setShowVitalTrends(true)}
          >
            <Activity className="w-6 h-6 text-primary mb-2" />
            <h3 className="text-sm font-medium">Vital Trends</h3>
            <p className="text-xs text-muted-foreground">View history</p>
          </Card>
          <Card
            className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => setShowImmunizations(true)}
          >
            <Syringe className="w-6 h-6 text-accent mb-2" />
            <h3 className="text-sm font-medium">Immunizations</h3>
            <p className="text-xs text-muted-foreground">View all</p>
          </Card>
        </div>
      </section>
    </div>
  )
}
