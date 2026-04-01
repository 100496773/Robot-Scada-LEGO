import { robotState } from "../robotState";

export default function ScadaDashboard() {
  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Robot SCADA Dashboard</h1>

      <h2>Robot Status</h2>
      <p>Status: {robotState.robot.status}</p>
      <p>Battery: {robotState.robot.battery}%</p>
      <p>
        Internet: {robotState.robot.internetConnected ? "Connected" : "Disconnected"}
      </p>
      <p>
        Pieces: {robotState.pieces.connected}/{robotState.pieces.total}
      </p>

      <h2>User Session</h2>
      <p>User: {robotState.user.name}</p>
      <p>Mode: {robotState.session.currentMode}</p>
      <p>Screen: {robotState.session.currentScreen}</p>
      <p>Detail: {robotState.session.currentScreenDetail}</p>
      <p>
        Step: {robotState.session.currentStep}/{robotState.session.totalSteps}
      </p>
      <p>Time in step: {robotState.session.timeInStepSec}s</p>

      <h2>Performance</h2>
      <p>Progress: {robotState.performance.overallProgress}%</p>
      <p>Success rate: {robotState.performance.successRate}%</p>
      <p>Errors: {robotState.performance.errors}</p>

      <h2>AI</h2>
      <p>Last action: {robotState.ai.lastAction}</p>
      <p>Message: {robotState.ai.message}</p>

      <h2>Alerts</h2>
      {robotState.alerts.map((alert) => (
        <p key={alert.id}>
          [{alert.severity}] {alert.message}
        </p>
      ))}
    </div>
  );
}