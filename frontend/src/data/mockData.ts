export interface TrendData {
  time: string;
  pH: number;
  turbidity: number;
  tds: number;
  dissolvedOxygen: number;
  healthScore: number;
}

export type RiskLevel = "Stable" | "Watch" | "High" | "Critical";

export interface WaterSource {
  id: string;
  name: string;
  type: "Lake" | "Reservoir" | "Pond" | "River" | "Well";
  location: string;
  latitude: number;
  longitude: number;
  risk: RiskLevel;
  healthScore: number; // 0-100
  pH: number;
  turbidity: number; // NTU
  tds: number; // mg/L
  temperature: number; // °C
  dissolvedOxygen: number; // mg/L
  trendDirection: "improving" | "stable" | "deteriorating";
  historicalTrend: TrendData[];
  updatedTime: string;
  publicWarning: boolean;
  publicMessage: string;
  publicSuitability: {
    drinking: "Not Recommended" | "Caution" | "Permissible with Treatment";
    domestic: "Safe" | "Caution" | "Restricted";
    irrigation: "Safe" | "Caution" | "Restricted";
    recreation: "Safe" | "Caution" | "Restricted";
    aquaculture: "Safe" | "Caution" | "Restricted";
  };
}

export interface Alert {
  id: string;
  sourceId: string;
  sourceName: string;
  type: "turbidity" | "prediction" | "tds" | "dissolvedOxygen" | "general";
  title: string;
  description: string;
  severity: "Warning" | "High" | "Critical";
  timestamp: string;
  acknowledged: boolean;
}

export interface SensorProbe {
  id: string;
  parameter: string;
  sensorType: string;
  status: "Healthy" | "Warning" | "Offline";
  currentValue: string;
  battery: number;
  signalStrength: "Excellent" | "Good" | "Fair" | "Poor";
  lastUptime: string;
}

export interface WaterUseCategory {
  id: "drinking" | "domestic" | "irrigation" | "recreation" | "aquaculture";
  title: string;
  icon: string;
  shortDescription: string;
  safetyThresholds: string;
}

export const waterUseOptions: WaterUseCategory[] = [
  {
    id: "drinking",
    title: "Drinking",
    icon: "GlassWater",
    shortDescription: "Direct human consumption and culinary preparation.",
    safetyThresholds: "Turbidity < 1 NTU, TDS < 300 mg/L, pH 6.5 - 8.5",
  },
  {
    id: "domestic",
    title: "Domestic Use",
    icon: "Home",
    shortDescription: "Bathing, dishwashing, laundry, and sanitation.",
    safetyThresholds: "Turbidity < 5 NTU, TDS < 500 mg/L, pH 6.5 - 8.5",
  },
  {
    id: "irrigation",
    title: "Irrigation",
    icon: "Sprout",
    shortDescription: "Agricultural crops, home gardens, and community landscaping.",
    safetyThresholds: "TDS < 1000 mg/L, pH 6.0 - 8.5",
  },
  {
    id: "recreation",
    title: "Swimming / Recreation",
    icon: "Waves",
    shortDescription: "Direct skin contact sports, swimming, and boating.",
    safetyThresholds: "DO > 5.0 mg/L, Turbidity < 10 NTU, pH 6.5 - 8.5",
  },
  {
    id: "aquaculture",
    title: "Aquaculture",
    icon: "Fish",
    shortDescription: "Fish farming, aquatic breeding, and biodiversity conservation.",
    safetyThresholds: "DO > 5.0 mg/L, Ammonia minimal, pH 6.8 - 8.0",
  },
];

export const mockWaterSources: WaterSource[] = [
  {
    id: "source-hebbal",
    name: "Hebbal Lake",
    type: "Lake",
    location: "North Bengaluru",
    latitude: 13.0458,
    longitude: 77.5913,
    risk: "Stable",
    healthScore: 91,
    pH: 7.2,
    turbidity: 4.8,
    tds: 296,
    temperature: 26.8,
    dissolvedOxygen: 6.4,
    trendDirection: "stable",
    updatedTime: "10 mins ago",
    publicWarning: false,
    publicMessage: "Water quality condition is within nominal baseline parameters.",
    publicSuitability: {
      drinking: "Caution",
      domestic: "Safe",
      irrigation: "Safe",
      recreation: "Safe",
      aquaculture: "Safe",
    },
    historicalTrend: [
      { time: "06:00", pH: 7.1, turbidity: 4.6, tds: 290, dissolvedOxygen: 6.5, healthScore: 92 },
      { time: "09:00", pH: 7.2, turbidity: 4.7, tds: 292, dissolvedOxygen: 6.5, healthScore: 92 },
      { time: "12:00", pH: 7.2, turbidity: 4.9, tds: 298, dissolvedOxygen: 6.3, healthScore: 90 },
      { time: "15:00", pH: 7.3, turbidity: 4.8, tds: 295, dissolvedOxygen: 6.4, healthScore: 91 },
      { time: "18:00", pH: 7.2, turbidity: 4.8, tds: 296, dissolvedOxygen: 6.4, healthScore: 91 },
    ],
  },
  {
    id: "source-jakkur",
    name: "Jakkur Lake",
    type: "Lake",
    location: "North-East Bengaluru",
    latitude: 13.0768,
    longitude: 77.6083,
    risk: "Watch",
    healthScore: 73,
    pH: 7.0,
    turbidity: 9.7,
    tds: 348,
    temperature: 27.4,
    dissolvedOxygen: 5.8,
    trendDirection: "deteriorating",
    updatedTime: "15 mins ago",
    publicWarning: true,
    publicMessage: "Recent water-quality deterioration is under investigation. Exercise caution for recreational contact.",
    publicSuitability: {
      drinking: "Not Recommended",
      domestic: "Caution",
      irrigation: "Safe",
      recreation: "Caution",
      aquaculture: "Caution",
    },
    historicalTrend: [
      { time: "06:00", pH: 7.3, turbidity: 7.2, tds: 310, dissolvedOxygen: 6.2, healthScore: 80 },
      { time: "09:00", pH: 7.2, turbidity: 8.1, tds: 325, dissolvedOxygen: 6.0, healthScore: 77 },
      { time: "12:00", pH: 7.1, turbidity: 8.9, tds: 335, dissolvedOxygen: 5.9, healthScore: 75 },
      { time: "15:00", pH: 7.0, turbidity: 9.4, tds: 342, dissolvedOxygen: 5.8, healthScore: 74 },
      { time: "18:00", pH: 7.0, turbidity: 9.7, tds: 348, dissolvedOxygen: 5.8, healthScore: 73 },
    ],
  },
  {
    id: "source-tg-halli",
    name: "Thippagondanahalli Reservoir",
    type: "Reservoir",
    location: "West Arkavathy Valley",
    latitude: 12.9667,
    longitude: 77.3467,
    risk: "High",
    healthScore: 49,
    pH: 6.9,
    turbidity: 17.6,
    tds: 412,
    temperature: 28.1,
    dissolvedOxygen: 4.9,
    trendDirection: "deteriorating",
    updatedTime: "5 mins ago",
    publicWarning: true,
    publicMessage: "Water-quality deterioration predicted by monitoring algorithms. Inflow runoff monitoring activated.",
    publicSuitability: {
      drinking: "Not Recommended",
      domestic: "Caution",
      irrigation: "Caution",
      recreation: "Restricted",
      aquaculture: "Restricted",
    },
    historicalTrend: [
      { time: "06:00", pH: 7.3, turbidity: 11.2, tds: 340, dissolvedOxygen: 5.7, healthScore: 68 },
      { time: "09:00", pH: 7.2, turbidity: 13.5, tds: 365, dissolvedOxygen: 5.4, healthScore: 61 },
      { time: "12:00", pH: 7.0, turbidity: 15.1, tds: 388, dissolvedOxygen: 5.1, healthScore: 55 },
      { time: "15:00", pH: 6.9, turbidity: 16.8, tds: 405, dissolvedOxygen: 5.0, healthScore: 51 },
      { time: "18:00", pH: 6.9, turbidity: 17.6, tds: 412, dissolvedOxygen: 4.9, healthScore: 49 },
    ],
  },
  {
    id: "source-pond-04",
    name: "Community Pond 04",
    type: "Pond",
    location: "Anekal Sub-district",
    latitude: 12.7112,
    longitude: 77.6974,
    risk: "Critical",
    healthScore: 28,
    pH: 6.5,
    turbidity: 34.2,
    tds: 521,
    temperature: 29.2,
    dissolvedOxygen: 3.8,
    trendDirection: "deteriorating",
    updatedTime: "Just now",
    publicWarning: true,
    publicMessage: "A critical water-quality warning is active. Rapid turbidity spike and oxygen depletion detected. Avoid use.",
    publicSuitability: {
      drinking: "Not Recommended",
      domestic: "Restricted",
      irrigation: "Restricted",
      recreation: "Restricted",
      aquaculture: "Restricted",
    },
    historicalTrend: [
      { time: "06:00", pH: 6.9, turbidity: 19.5, tds: 440, dissolvedOxygen: 4.8, healthScore: 46 },
      { time: "09:00", pH: 6.8, turbidity: 24.2, tds: 470, dissolvedOxygen: 4.4, healthScore: 39 },
      { time: "12:00", pH: 6.6, turbidity: 29.0, tds: 495, dissolvedOxygen: 4.1, healthScore: 34 },
      { time: "15:00", pH: 6.5, turbidity: 32.8, tds: 515, dissolvedOxygen: 3.9, healthScore: 30 },
      { time: "18:00", pH: 6.5, turbidity: 34.2, tds: 521, dissolvedOxygen: 3.8, healthScore: 28 },
    ],
  },
  {
    id: "source-ulsoor",
    name: "Ulsoor Lake",
    type: "Lake",
    location: "Central Bengaluru",
    latitude: 12.9833,
    longitude: 77.6200,
    risk: "Stable",
    healthScore: 87,
    pH: 7.3,
    turbidity: 5.3,
    tds: 312,
    temperature: 27.1,
    dissolvedOxygen: 6.1,
    trendDirection: "stable",
    updatedTime: "22 mins ago",
    publicWarning: false,
    publicMessage: "Water quality condition is within nominal baseline parameters.",
    publicSuitability: {
      drinking: "Caution",
      domestic: "Safe",
      irrigation: "Safe",
      recreation: "Safe",
      aquaculture: "Safe",
    },
    historicalTrend: [
      { time: "06:00", pH: 7.2, turbidity: 5.0, tds: 305, dissolvedOxygen: 6.2, healthScore: 88 },
      { time: "09:00", pH: 7.3, turbidity: 5.1, tds: 308, dissolvedOxygen: 6.2, healthScore: 88 },
      { time: "12:00", pH: 7.4, turbidity: 5.4, tds: 315, dissolvedOxygen: 6.0, healthScore: 86 },
      { time: "15:00", pH: 7.3, turbidity: 5.3, tds: 312, dissolvedOxygen: 6.1, healthScore: 87 },
      { time: "18:00", pH: 7.3, turbidity: 5.3, tds: 312, dissolvedOxygen: 6.1, healthScore: 87 },
    ],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    sourceId: "source-pond-04",
    sourceName: "Community Pond 04",
    type: "turbidity",
    title: "Critical: Rapid Turbidity Increase",
    description: "Rapid turbidity increase detected (34.2 NTU). Exceeds ecological safety limit (>25 NTU).",
    severity: "Critical",
    timestamp: "8 mins ago",
    acknowledged: false,
  },
  {
    id: "alert-2",
    sourceId: "source-tg-halli",
    sourceName: "Thippagondanahalli Reservoir",
    type: "prediction",
    title: "High: Water-Quality Deterioration Predicted",
    description: "AI predictive algorithms indicate 87% probability of significant water quality deterioration in next 48h.",
    severity: "High",
    timestamp: "18 mins ago",
    acknowledged: false,
  },
  {
    id: "alert-3",
    sourceId: "source-jakkur",
    sourceName: "Jakkur Lake",
    type: "tds",
    title: "Warning: TDS Trend Increasing",
    description: "TDS readings have increased by +12% across consecutive telemetry windows, approaching watch threshold.",
    severity: "Warning",
    timestamp: "45 mins ago",
    acknowledged: false,
  },
];

export const mockSensorProbes: SensorProbe[] = [
  {
    id: "probe-ph",
    parameter: "pH Sensor",
    sensorType: "Glass Electrode Potentiometric",
    status: "Healthy",
    currentValue: "7.15 pH",
    battery: 94,
    signalStrength: "Excellent",
    lastUptime: "99.8%",
  },
  {
    id: "probe-turb",
    parameter: "Turbidity Sensor",
    sensorType: "Optical Nephelometric (90° Scatter)",
    status: "Warning",
    currentValue: "17.6 NTU",
    battery: 82,
    signalStrength: "Good",
    lastUptime: "99.4%",
  },
  {
    id: "probe-tds",
    parameter: "TDS Sensor",
    sensorType: "Toroidal Conductivity Probe",
    status: "Healthy",
    currentValue: "412 mg/L",
    battery: 89,
    signalStrength: "Excellent",
    lastUptime: "99.9%",
  },
  {
    id: "probe-temp",
    parameter: "Temperature Sensor",
    sensorType: "Platinum RTD PT100",
    status: "Healthy",
    currentValue: "28.1 °C",
    battery: 91,
    signalStrength: "Excellent",
    lastUptime: "99.9%",
  },
  {
    id: "probe-do",
    parameter: "Dissolved Oxygen Sensor",
    sensorType: "Optical Luminescent DO Probe",
    status: "Warning",
    currentValue: "4.9 mg/L",
    battery: 48,
    signalStrength: "Fair",
    lastUptime: "97.2%",
  },
];

export interface IncidentRecord {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Investigating" | "Resolved";
  assignedTeam: string;
  reportedAt: string;
  summary: string;
}

export const mockIncidents: IncidentRecord[] = [
  {
    id: "INC-2026-089",
    sourceId: "source-pond-04",
    sourceName: "Community Pond 04",
    title: "Organic Inflow & Hypoxia Surge",
    priority: "Critical",
    status: "Investigating",
    assignedTeam: "Rapid Response Unit Anekal",
    reportedAt: "Today, 06:45 AM",
    summary: "Sensor array triggered critical turbidity (>34 NTU) and low DO (<3.8 mg/L) alerts. Emergency aerators deployed.",
  },
  {
    id: "INC-2026-084",
    sourceId: "source-tg-halli",
    sourceName: "Thippagondanahalli Reservoir",
    title: "Arkavathy Inflow Parameter Drift",
    priority: "High",
    status: "Open",
    assignedTeam: "Catchment Protection Wing",
    reportedAt: "Yesterday, 04:30 PM",
    summary: "Predictive model flagged high risk of chemical stratification due to seasonal upstream discharge.",
  },
  {
    id: "INC-2026-077",
    sourceId: "source-jakkur",
    sourceName: "Jakkur Lake",
    title: "Elevated Conductivity in North Inlet",
    priority: "Medium",
    status: "Resolved",
    assignedTeam: "Wetland Operations Team",
    reportedAt: "Aug 18, 2026",
    summary: "TDS anomaly traced to construction runoff filter bypass. Temporary containment barriers restored.",
  },
];

export interface InspectionRecord {
  id: string;
  sourceName: string;
  inspector: string;
  date: string;
  type: "Routine Surveillance" | "Emergency Audit" | "Probe Calibration";
  status: "Completed" | "Scheduled" | "In Review";
  findings: string;
}

export const mockInspections: InspectionRecord[] = [
  {
    id: "INS-4401",
    sourceName: "Hebbal Lake",
    inspector: "Dr. Arvind Rao",
    date: "Aug 19, 2026",
    type: "Routine Surveillance",
    status: "Completed",
    findings: "Aeration systems functioning within expected parameters. Water clarity index high.",
  },
  {
    id: "INS-4402",
    sourceName: "Community Pond 04",
    inspector: "Field Officer S. Meena",
    date: "Aug 20, 2026",
    type: "Emergency Audit",
    status: "In Review",
    findings: "Sample collection complete for lab GC-MS and microbial assay. Visual turbidity aligns with optical sensors.",
  },
  {
    id: "INS-4403",
    sourceName: "Thippagondanahalli Reservoir",
    inspector: "Catchment Team B",
    date: "Aug 22, 2026",
    type: "Probe Calibration",
    status: "Scheduled",
    findings: "Scheduled quarterly optical sensor wiper blade replacement and probe buffer calibration.",
  },
];

export interface LabVerificationRecord {
  sampleId: string;
  sourceName: string;
  collectedAt: string;
  testedAt: string;
  certifiedBy: string;
  status: "Certified" | "Pending Lab Analysis" | "Discrepancy Flagged";
  parameters: {
    bod: string;
    cod: string;
    fecalColiform: string;
    heavyMetals: string;
  };
}

export const mockLabRecords: LabVerificationRecord[] = [
  {
    sampleId: "LAB-BLR-2026-902",
    sourceName: "Hebbal Lake",
    collectedAt: "Aug 16, 2026",
    testedAt: "Aug 18, 2026",
    certifiedBy: "State Water Testing Laboratory (KSPCB)",
    status: "Certified",
    parameters: {
      bod: "3.2 mg/L (Conforms)",
      cod: "14.5 mg/L (Conforms)",
      fecalColiform: "<10 MPN/100ml",
      heavyMetals: "Below detection threshold",
    },
  },
  {
    sampleId: "LAB-BLR-2026-914",
    sourceName: "Community Pond 04",
    collectedAt: "Aug 20, 2026",
    testedAt: "In Progress",
    certifiedBy: "State Environmental Chemistry Lab",
    status: "Pending Lab Analysis",
    parameters: {
      bod: "Awaiting incubation (5-day)",
      cod: "Analysis underway",
      fecalColiform: "Plating in progress",
      heavyMetals: "Spectrometry scheduled",
    },
  },
  {
    sampleId: "LAB-BLR-2026-889",
    sourceName: "Thippagondanahalli Reservoir",
    collectedAt: "Aug 12, 2026",
    testedAt: "Aug 15, 2026",
    certifiedBy: "Central Water Quality Monitoring Institute",
    status: "Certified",
    parameters: {
      bod: "6.8 mg/L (Marginal)",
      cod: "28.0 mg/L (Watch)",
      fecalColiform: "45 MPN/100ml",
      heavyMetals: "Lead/Cadmium safe",
    },
  },
];