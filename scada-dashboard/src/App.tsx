import { useEffect, useState } from "react";
import ScadaDashboard from "./components/ScadaDashboard";
import { robotState as initialRobotState } from "./robotState";

export default function App() {
  const [state, setState] = useState(initialRobotState);

  // =========================
  // 🔘 ACCIONES (BOTONES)
  // =========================
  const clearAlerts = () => {
    setState((prev) => ({
      ...prev,
      alerts: [],
    }));
  };
  const actions = {
    clearAlerts,
    
    wrongPiece: () => {
      setState((prev) => ({
        ...prev,
        performance: {
          ...prev.performance,
          errors: prev.performance.errors + 1,
        },
        alerts: [
          {
            id: `a-${Date.now()}`,
            severity: "error",
            message: "Wrong piece placed manually.",
            active: true,
          },
          ...prev.alerts,
        ].slice(0, 6),
        ai: {
          ...prev.ai,
          lastAction: "manual_error",
          message: "User triggered wrong piece event.",
        },
      }));
    },

    nextStep: () => {
      setState((prev) => ({
        ...prev,
        session: {
          ...prev.session,
          currentStep:
            prev.session.currentStep < prev.session.totalSteps
              ? prev.session.currentStep + 1
              : 1,
          timeInStepSec: 0,
        },
        performance: {
          ...prev.performance,
          overallProgress:
            prev.session.currentStep < prev.session.totalSteps
              ? Math.min(prev.performance.overallProgress + 10, 100)
              : 0,
        },
      }));
    },

    lowBattery: () => {
      setState((prev) => ({
        ...prev,
        robot: {
          ...prev.robot,
          battery: Math.max(prev.robot.battery - 15, 5),
        },
        alerts: [
          {
            id: `a-${Date.now()}`,
            severity: "warning",
            message: "Battery manually reduced.",
            active: true,
          },
          ...prev.alerts,
        ].slice(0, 6),
      }));
    },
  };

  // =========================
  // ⏱️ LOOP AUTOMÁTICO (SCADA REAL)
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const newDuration = prev.session.durationSec + 1;
        let newTimeInStep = prev.session.timeInStepSec + 1;

        let newAlerts = [...prev.alerts];
        let newAi = { ...prev.ai };

        let newStep = prev.session.currentStep;
        let newProgress = prev.performance.overallProgress;
        let newErrors = prev.performance.errors;
        let newSuccessRate = prev.performance.successRate;
        let newBattery = prev.robot.battery;

        // ⏸️ alerta por inactividad
        if (
          newTimeInStep === 60 &&
          !prev.alerts.some((alert) => alert.message.includes("60 seconds"))
        ) {
          newAlerts = [
            {
              id: `a-${Date.now()}`,
              severity: "warning",
              message: "No interaction detected for 60 seconds.",
              active: true,
            },
            ...newAlerts,
          ];

          newAi = {
            ...prev.ai,
            lastAction: "suggest_break",
            message: "Break suggested after inactivity.",
          };
        }

        // 🔁 avanzar paso automático
        if (newTimeInStep >= 20) {
          if (prev.session.currentStep < prev.session.totalSteps) {
            newStep = prev.session.currentStep + 1;
            newProgress = Math.min(prev.performance.overallProgress + 10, 100);
          } else {
            newStep = 1;
            newProgress = 0;
          }

          newTimeInStep = 0;

          // ⚠️ error aleatorio
          if (Math.random() < 0.3) {
            newErrors += 1;

            newAlerts = [
              {
                id: `a-${Date.now()}`,
                severity: "error",
                message: "Wrong piece detected.",
                active: true,
              },
              ...newAlerts,
            ];

            newAi = {
              ...prev.ai,
              lastAction: "show_hint",
              message: "Hint displayed.",
            };
          } else {
            newAi = {
              ...prev.ai,
              lastAction: "none",
              message: "System stable.",
            };
          }

          // 🔋 batería baja lenta
          newBattery = Math.max(prev.robot.battery - 1, 10);
        }

        // 📊 success rate coherente
        newSuccessRate = Math.max(50, Math.min(100, 100 - newErrors * 4));

        // 📈 gráfica dinámica suave
        const previousValue =
          prev.performance.history.length > 0
            ? prev.performance.history[prev.performance.history.length - 1].value
            : 70;

        const targetValue = Math.max(
          20,
          Math.min(100, newSuccessRate - Math.floor(Math.random() * 6))
        );

        const smoothedValue = Math.round(
          previousValue * 0.7 + targetValue * 0.3
        );

        const newHistory = [
          ...prev.performance.history,
          {
            time: prev.performance.history.length,
            value: smoothedValue,
          },
        ].slice(-12);

        return {
          ...prev,
          robot: {
            ...prev.robot,
            battery: newBattery,
          },
          session: {
            ...prev.session,
            durationSec: newDuration,
            timeInStepSec: newTimeInStep,
            currentStep: newStep,
          },
          performance: {
            ...prev.performance,
            overallProgress: newProgress,
            errors: newErrors,
            successRate: newSuccessRate,
            history: newHistory,
          },
          ai: newAi,
          alerts: newAlerts.slice(0, 6),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🎯 RENDER
  // =========================

  return <ScadaDashboard state={state} actions={actions} />;
}