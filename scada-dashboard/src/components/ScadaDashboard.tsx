import { useState } from "react";
type ScadaDashboardProps = {
  state: typeof import("../robotState").robotState;
  actions: {
    wrongPiece: () => void;
    nextStep: () => void;
    lowBattery: () => void;
    clearAlerts: () => void;
  };
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getModeLabel(mode: string) {
  switch (mode) {
    case "guided":
      return "Guided";
    case "memory":
      return "Memory";
    case "creative":
      return "Creative";
    case "challenges":
      return "Challenges";
    default:
      return mode;
  }
}

function getAlertStyles(severity: string) {
  switch (severity) {
    case "error":
      return {
        container: "bg-pink-50 border-l-4 border-pink-500",
        icon: "text-pink-500",
        iconName: "error",
      };
    case "warning":
      return {
        container: "bg-violet-50 border-l-4 border-violet-600",
        icon: "text-violet-600",
        iconName: "psychology",
      };
    default:
      return {
        container: "bg-blue-50 border-l-4 border-blue-600",
        icon: "text-blue-600",
        iconName: "info",
      };
  }
}

function buildChartPath(points: { time: number; value: number }[]) {
  if (!points.length) return "";

  const width = 800;
  const height = 120;
  const maxValue = 100;
  const stepX = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - (point.value / maxValue) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export default function ScadaDashboard({ state, actions }: ScadaDashboardProps) {
  const [chartView, setChartView] = useState<"history" | "realtime">("realtime");
  const initials = getInitials(state.user.name);
  const sessionTime = formatDuration(state.session.durationSec);
  const stepTime = `${state.session.timeInStepSec}s`;
  const currentMode = getModeLabel(state.session.currentMode);
  const chartPath = buildChartPath(state.performance.history || []);
  const latestPoint =
    state.performance.history?.[state.performance.history.length - 1] || null;

  return (
      <div className="text-on-surface min-h-screen h-screen flex flex-col p-4 gap-4 overflow-hidden">
        <header className="flex justify-between items-center w-full bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg border border-white/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-xl">smart_toy</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Robot SCADA
            </h1>
            <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-wider">
              Educational Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
              {state.robot.internetConnected ? "Live Connection" : "Offline"}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-none">
                {state.user.name}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                Level {state.user.level}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* BOTONES DE CONTROL */}
      <div className="flex gap-3">
        <button
          onClick={actions.wrongPiece}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-bold shadow hover:bg-pink-600 transition"
        >
          Wrong Piece
        </button>

        <button
          onClick={actions.nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow hover:bg-blue-700 transition"
        >
          Next Step
        </button>

        <button
          onClick={actions.lowBattery}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold shadow hover:bg-orange-600 transition"
        >
          Low Battery
        </button>
      </div>

      <main className="grid grid-cols-12 grid-rows-6 gap-4 flex-grow overflow-hidden">
        <section className="col-span-3 row-span-3">
          <div className="bg-white p-5 rounded-xl shadow-lg h-full flex flex-col border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">
                  settings_remote
                </span>
                Robot Status
              </h2>
              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black tracking-widest">
                LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-grow">
              <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3 border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 text-2xl">
                  battery_5_bar
                </span>
                <div>
                  <p className="text-[9px] text-blue-600/70 font-bold uppercase">Battery</p>
                  <p className="text-lg font-black">{state.robot.battery}%</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-3 border border-blue-100">
                <span className="material-symbols-outlined text-blue-600 text-2xl">wifi</span>
                <div>
                  <p className="text-[9px] text-blue-600/70 font-bold uppercase">Network</p>
                  <p className="text-lg font-black">
                    {state.robot.internetConnected ? "Stable" : "Disconnected"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-violet-50 rounded-lg flex flex-col justify-center border border-violet-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-violet-600 text-2xl">
                    extension
                  </span>
                  <div>
                    <p className="text-[9px] text-violet-600/70 font-bold uppercase">Build</p>
                    <p className="text-lg font-black">
                      {state.pieces.connected}/{state.pieces.total} Pcs
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg flex items-center gap-3 border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">
                  play_circle
                </span>
                <div>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase">State</p>
                  <p className="text-lg font-black capitalize">{state.robot.status}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-2 bg-emerald-100 rounded-lg text-center">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                {state.pieces.status === "error"
                  ? "System Warning"
                  : state.pieces.status === "warning"
                  ? "Check Pieces"
                  : "System Optimal"}
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-6 row-span-3">
          <div className="bg-white p-5 rounded-xl shadow-lg h-full flex flex-col border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-orange-100 shadow-sm bg-orange-50 flex items-center justify-center text-orange-500 font-bold">
                    {initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white">
                    LVL {state.user.level}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {state.user.name}
                  </h2>
                  <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">
                    Session active
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 text-right">
                <p className="text-[9px] text-orange-500 font-black uppercase leading-none mb-1">
                  Session
                </p>
                <p className="text-2xl font-black text-orange-500 leading-none">
                  {sessionTime}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-[8px] text-violet-600 font-black uppercase mb-1">Mode</p>
                <span className="text-[10px] font-bold text-violet-600">{currentMode}</span>
              </div>

              <div className="text-center p-2 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[8px] text-blue-600 font-black uppercase mb-1">View</p>
                <span className="text-[10px] font-bold text-blue-600">
                  {state.session.currentScreen}
                </span>
              </div>

              <div className="text-center p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[8px] text-emerald-600 font-black uppercase mb-1">Step</p>
                <span className="text-[10px] font-bold text-emerald-600">
                  {state.session.currentStep} of {state.session.totalSteps}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border-l-4 border-blue-600 mb-4">
              <p className="text-[9px] text-blue-600 font-black uppercase mb-0.5">
                Live Objective
              </p>
              <p className="text-xs font-semibold text-slate-900">
                {state.session.currentScreenDetail}
              </p>
            </div>

            <div className="space-y-3 flex-grow">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                    <span>Guided</span>
                    <span className="text-blue-600">
                      {state.performance.modeProgress?.guided ?? 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${state.performance.modeProgress?.guided ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                    <span>Creative</span>
                    <span className="text-orange-500">
                      {state.performance.modeProgress?.creative ?? 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full"
                      style={{ width: `${state.performance.modeProgress?.creative ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                    <span>Memory</span>
                    <span className="text-violet-600">
                      {state.performance.modeProgress?.memory ?? 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                    <div
                      className="bg-violet-600 h-full"
                      style={{ width: `${state.performance.modeProgress?.memory ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                    <span>Challenge</span>
                    <span className="text-pink-500">
                      {state.performance.modeProgress?.challenges ?? 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="bg-pink-500 h-full"
                      style={{ width: `${state.performance.modeProgress?.challenges ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wide">
                    Course Progress
                  </span>
                  <span className="text-[11px] font-black text-blue-600">
                    {state.performance.overallProgress}% Complete
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 p-0.5">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${state.performance.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-3 row-span-3">
          <div className="bg-white p-5 rounded-xl shadow-lg h-full flex flex-col border border-slate-100">
            <h2 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-600 text-lg">insights</span>
              Cognitive Score
            </h2>

            <div className="flex justify-around items-center mb-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="#00C897"
                      strokeDasharray="175.8"
                      strokeDashoffset={175.8 - (175.8 * state.performance.successRate) / 100}
                      strokeWidth="4"
                    />
                  </svg>
                  <span className="text-lg font-black text-emerald-600">
                    {state.performance.successRate}%
                  </span>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase mt-2">Success</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-2xl font-black text-pink-500">
                    {state.performance.errors}
                  </span>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase mt-2">Mistakes</p>
              </div>
            </div>

            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-slate-500">Skill Level</span>
                <span className="text-xs font-black text-violet-600">
                  Level {state.performance.currentLevel}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-grow rounded-full ${
                      index < state.performance.currentLevel
                        ? "bg-violet-600"
                        : "bg-violet-200"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-3 bg-pink-50 rounded-xl flex items-center justify-between border border-pink-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500 text-lg">timer</span>
                <span className="text-[10px] font-bold">Step Time</span>
              </div>
              <span className="text-[10px] font-black text-pink-500 bg-white px-2 py-0.5 rounded-full border border-pink-100">
                {stepTime} {state.session.timeInStepSec >= 45 ? "⚠️" : ""}
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-8 row-span-2">
          <div className="bg-white p-5 rounded-xl shadow-lg h-full flex flex-col border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">
                  show_chart
                </span>
                Engagement Metrics
              </h2>
              <div className="flex gap-2 p-1 bg-blue-100/50 rounded-full">
                <button
                  onClick={() => setChartView("history")}
                  className={`px-3 py-1 text-[9px] font-black rounded-full transition ${
                    chartView === "history"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-blue-600"
                  }`}
                >
                  HISTORY
                </button>

                <button
                  onClick={() => setChartView("realtime")}
                  className={`px-3 py-1 text-[9px] font-black rounded-full transition ${
                    chartView === "realtime"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-blue-600"
                  }`}
                >
                  REAL-TIME
                </button>
              </div>
            </div>

            <div className="flex-grow relative bg-blue-50 rounded-lg border border-blue-100 p-4 overflow-hidden">
              {chartView === "realtime" ? (
                <>
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 120">
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#0064FF"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />

                    {latestPoint && (
                      <circle
                        cx={
                          state.performance.history.length > 1
                            ? (800 / (state.performance.history.length - 1)) *
                              (state.performance.history.length - 1)
                            : 0
                        }
                        cy={120 - (latestPoint.value / 100) * 120}
                        fill="#0064FF"
                        r="5"
                        stroke="white"
                        strokeWidth="2"
                      />
                    )}
                  </svg>

                  <div className="absolute top-4 left-[62.5%] -translate-x-1/2 bg-white border border-blue-600 px-3 py-1 rounded-lg shadow-md text-[9px] font-black text-blue-600">
                    {latestPoint ? `${latestPoint.value}% Engagement` : "No data"}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-end gap-4 px-4">
                  {state.performance.monthlyHistory.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-[10px] font-black text-blue-600">{item.value}%</div>
                      <div
                        className="w-full max-w-[52px] bg-blue-600 rounded-t-lg"
                        style={{ height: `${item.value}%` }}
                      ></div>
                      <div className="text-[10px] font-bold text-slate-500">{item.month}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-3 px-1">
              {chartView === "realtime" ? (
                <>
                  <span className="text-[9px] font-black text-slate-400">OLDER</span>
                  <span className="text-[9px] font-black text-slate-400">MID</span>
                  <span className="text-[9px] font-black text-blue-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                    CURRENT
                  </span>
                  <span className="text-[9px] font-black text-slate-400">LIVE</span>
                </>
              ) : (
                <>
                  <span className="text-[9px] font-black text-slate-400">Monthly average engagement</span>
                  <span className="text-[9px] font-black text-blue-600">
                    {Math.round(
                      state.performance.monthlyHistory.reduce((acc, item) => acc + item.value, 0) /
                        state.performance.monthlyHistory.length
                    )}
                    % avg
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="col-span-4 row-span-2">
          <div className="bg-white p-5 rounded-xl shadow-lg h-full flex flex-col border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500 text-lg">
                  notification_important
                </span>
                System Alerts
              </h2>
              <button
                onClick={actions.clearAlerts}
                className="text-[9px] font-black text-blue-600 uppercase hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-grow">
              {state.alerts.map((alert) => {
                const styles = getAlertStyles(alert.severity);

                return (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg flex gap-3 ${styles.container}`}
                  >
                    <span className={`material-symbols-outlined text-sm ${styles.icon}`}>
                      {styles.iconName}
                    </span>
                    <div className="flex-grow">
                      <p className="text-[10px] font-black text-slate-900 leading-tight capitalize">
                        {alert.severity}
                      </p>
                      <p className="text-[9px] text-slate-500 line-clamp-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="col-span-12 row-span-1">
          <footer className="glass-panel h-full rounded-xl flex justify-around items-center border border-white/60 shadow-lg px-8">
            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                System Integrity
              </p>
              <p className="text-xs font-black text-emerald-600">
                {state.pieces.status === "error" ? "Warning" : "Optimum"}
              </p>
            </div>

            <div className="h-6 w-px bg-blue-100"></div>

            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Response Time
              </p>
              <p className="text-xs font-black text-blue-600">
                {state.robot.latencyMs ?? 14}ms
              </p>
            </div>

            <div className="h-6 w-px bg-blue-100"></div>

            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                AI Action
              </p>
              <p className="text-xs font-black text-violet-600">
                {state.ai.lastAction || "none"}
              </p>
            </div>

            <div className="h-6 w-px bg-blue-100"></div>

            <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Build Version
              </p>
              <p className="text-xs font-black text-slate-900">
                {state.robot.firmwareVersion ?? "v2.4.0 EDU"}
              </p>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}