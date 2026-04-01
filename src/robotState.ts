export const robotState = {
  robot: {
    status: "active",
    battery: 65,
    internetConnected: true,
    latencyMs: 14,
    firmwareVersion: "v2.4.0 EDU",
  },

  user: {
    name: "Ana",
    level: 5,
  },

  session: {
    currentMode: "creative",
    currentScreen: "Building",
    currentScreenDetail: "placing base structure",
    currentStep: 3,
    totalSteps: 10,
    durationSec: 744,
    timeInStepSec: 45,
  },

  pieces: {
    connected: 3,
    total: 5,
    status: "ok",
  },

  performance: {
    overallProgress: 30,
    successRate: 88,
    errors: 2,
    currentLevel: 4,
    modeProgress: {
      guided: 75,
      creative: 40,
      memory: 90,
      challenges: 15,
    },
    history: [
      { time: 0, value: 70 },
      { time: 1, value: 72 },
      { time: 2, value: 75 },
      { time: 3, value: 73 },
      { time: 4, value: 78 },
    ],
    monthlyHistory: [
      { month: "Jan", value: 68 },
      { month: "Feb", value: 72 },
      { month: "Mar", value: 75 },
      { month: "Apr", value: 70 },
      { month: "May", value: 78 },
      { month: "Jun", value: 81 },
    ],
  },

  ai: {
    enabled: true,
    lastAction: "show_hint",
    message: "Hint displayed after inactivity.",
  },

  alerts: [
    {
      id: "a1",
      severity: "error",
      message: "Wrong piece placed in current slot.",
      active: true,
    },
    {
      id: "a2",
      severity: "warning",
      message: "No interaction detected for 45 seconds.",
      active: true,
    },
    {
      id: "a3",
      severity: "info",
      message: "Battery reached 15%. Recommend finishing soon.",
      active: true,
    },
  ],
};