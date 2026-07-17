"use client";

import { useEffect, useMemo, useState } from "react";

type Hazard = "storm" | "wildfire" | "outage" | "flood";
type Need = "medication" | "mobility" | "medical-device" | "pet" | "child" | "language";

const hazards: { id: Hazard; icon: string; label: string; detail: string }[] = [
  { id: "storm", icon: "\u26C8", label: "Severe storm", detail: "Tornado, hurricane, or winter storm" },
  { id: "wildfire", icon: "\u25B2", label: "Wildfire", detail: "Smoke, evacuation, or fast-moving fire" },
  { id: "outage", icon: "\u26A1", label: "Power outage", detail: "Short or extended loss of power" },
  { id: "flood", icon: "\u224B", label: "Flood", detail: "Flash flood or rising water" },
];

const needs: { id: Need; icon: string; label: string }[] = [
  { id: "medication", icon: "\u271A", label: "Daily medication" },
  { id: "mobility", icon: "\u25CE", label: "Mobility support" },
  { id: "medical-device", icon: "\u25C8", label: "Powered medical device" },
  { id: "pet", icon: "\u2665", label: "Pet or service animal" },
  { id: "child", icon: "\u2600", label: "Baby or young child" },
  { id: "language", icon: "A", label: "Language support" },
];

const hazardTasks: Record<Hazard, string[]> = {
  storm: [
    "Choose a small interior room on the lowest safe floor as your shelter spot.",
    "Move helmets, sturdy shoes, flashlights, and a whistle into the shelter area.",
    "Turn on local weather alerts and know the difference between a watch and a warning.",
  ],
  wildfire: [
    "Identify two evacuation routes and a meeting place outside the affected area.",
    "Place masks, goggles, water, and your go-bag beside the main exit.",
    "Keep windows closed and set indoor air to recirculate when smoke arrives.",
  ],
  outage: [
    "Charge phones and backup batteries; keep one power bank reserved for emergencies.",
    "Put flashlights where everyone can reach them and avoid using candles.",
    "Keep refrigerator and freezer doors closed to protect food for as long as possible.",
  ],
  flood: [
    "Move people, medicines, devices, and important documents to higher ground early.",
    "Plan a route that avoids low roads, bridges, and moving water.",
    "Never walk or drive through floodwater; turn around and choose another route.",
  ],
};

const needTasks: Record<Need, string> = {
  medication: "Pack a 7-day medicine supply, copies of prescriptions, and a written dose schedule.",
  mobility: "Keep mobility aids beside you and choose an evacuation helper plus a backup helper.",
  "medical-device": "Label the device, record its power needs, and contact the provider about backup power options.",
  pet: "Pack food, water, a carrier or leash, records, and a recent photo of your animal.",
  child: "Add diapers, feeding supplies, comfort items, and an age-appropriate ID card to the go-bag.",
  language: "Print key emergency phrases and write down a bilingual contact who can help by phone.",
};

const baseTasks = [
  "Save local emergency services and one out-of-area contact in every phone.",
  "Pack water, shelf-stable food, a first-aid kit, radio, batteries, and copies of IDs.",
  "Choose one nearby meeting place and one out-of-neighborhood meeting place.",
];

const steps = ["Risk", "Household", "Plan"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [hazard, setHazard] = useState<Hazard | null>(null);
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [people, setPeople] = useState(2);
  const [contact, setContact] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ready-together-plan");
    if (!stored) return;
    try {
      const value = JSON.parse(stored);
      setHazard(value.hazard ?? null);
      setSelectedNeeds(value.selectedNeeds ?? []);
      setPeople(value.people ?? 2);
      setContact(value.contact ?? "");
    } catch {
      localStorage.removeItem("ready-together-plan");
    }
  }, []);

  const plan = useMemo(() => {
    if (!hazard) return [];
    return [...hazardTasks[hazard], ...selectedNeeds.map((need) => needTasks[need]), ...baseTasks];
  }, [hazard, selectedNeeds]);

  const selectedHazard = hazards.find((item) => item.id === hazard);

  function toggleNeed(need: Need) {
    setSelectedNeeds((current) =>
      current.includes(need) ? current.filter((item) => item !== need) : [...current, need],
    );
  }

  function savePlan() {
    localStorage.setItem(
      "ready-together-plan",
      JSON.stringify({ hazard, selectedNeeds, people, contact }),
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function downloadPlan() {
    const text = [
      "READYTOGETHER EMERGENCY PLAN",
      `Primary risk: ${selectedHazard?.label}`,
      `Household size: ${people}`,
      `Out-of-area contact: ${contact || "Not added"}`,
      "",
      ...plan.map((task, index) => `${index + 1}. ${task}`),
      "",
      "If anyone is in immediate danger, contact local emergency services.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "readytogether-emergency-plan.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="ReadyTogether home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>ReadyTogether</span>
        </a>
        <div className="nav-note"><span className="status-dot" /> Private by design</div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow">Free · private · works on any device</div>
        <h1>Emergencies are hard.<br /><em>Your plan shouldn’t be.</em></h1>
        <p className="hero-copy">
          Build a personalized household emergency plan in under a minute. No account, no tracking,
          and your information stays on this device.
        </p>
        <a className="hero-link" href="#planner">Build my plan <span aria-hidden="true">↓</span></a>
        <div className="trust-row" aria-label="Product benefits">
          <span>✓ No sign-up</span><span>✓ Accessible</span><span>✓ Downloadable</span>
        </div>
      </section>

      <section className="planner-shell" id="planner" aria-labelledby="planner-title">
        <aside className="planner-intro">
          <div>
            <p className="section-kicker">Your safety plan</p>
            <h2 id="planner-title">Small steps now.<br />Less panic later.</h2>
            <p>Answer a few simple questions. We’ll turn them into an action list made for your household.</p>
          </div>
          <div className="privacy-card">
            <span className="privacy-icon" aria-hidden="true">⌂</span>
            <div><strong>Stays on your device</strong><br /><span>We never receive your answers.</span></div>
          </div>
        </aside>

        <div className="planner-card">
          <ol className="stepper" aria-label="Planner progress">
            {steps.map((label, index) => (
              <li key={label} className={index === step ? "active" : index < step ? "done" : ""}>
                <span>{index < step ? "✓" : index + 1}</span>{label}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="step-panel">
              <p className="step-label">Step 1 of 3</p>
              <h3>What are you preparing for?</h3>
              <p className="muted">Choose the risk that matters most right now. You can make another plan later.</p>
              <div className="option-grid hazard-grid">
                {hazards.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`option-card ${hazard === item.id ? "selected" : ""}`}
                    onClick={() => setHazard(item.id)}
                    aria-pressed={hazard === item.id}
                  >
                    <span className="option-icon" aria-hidden="true">{item.icon}</span>
                    <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                    <span className="radio-dot" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="actions"><button className="primary" disabled={!hazard} onClick={() => setStep(1)}>Continue <span>→</span></button></div>
            </div>
          )}

          {step === 1 && (
            <div className="step-panel">
              <p className="step-label">Step 2 of 3</p>
              <h3>Who does your plan support?</h3>
              <p className="muted">Select everything that applies. These details create the right preparation steps.</p>
              <label className="number-field">
                <span>People in household</span>
                <span className="counter">
                  <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Remove one person">−</button>
                  <output aria-live="polite">{people}</output>
                  <button type="button" onClick={() => setPeople(Math.min(20, people + 1))} aria-label="Add one person">+</button>
                </span>
              </label>
              <div className="option-grid needs-grid">
                {needs.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`need-chip ${selectedNeeds.includes(item.id) ? "selected" : ""}`}
                    onClick={() => toggleNeed(item.id)}
                    aria-pressed={selectedNeeds.includes(item.id)}
                  ><span aria-hidden="true">{item.icon}</span>{item.label}</button>
                ))}
              </div>
              <label className="text-field">
                <span>Out-of-area contact <small>(optional)</small></span>
                <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Name and phone number" />
              </label>
              <div className="actions split"><button className="secondary" onClick={() => setStep(0)}>← Back</button><button className="primary" onClick={() => setStep(2)}>Create my plan <span>→</span></button></div>
            </div>
          )}

          {step === 2 && (
            <div className="step-panel plan-panel">
              <div className="plan-heading">
                <div><p className="step-label">Your plan is ready</p><h3>{selectedHazard?.label} plan</h3></div>
                <span className="plan-badge">{plan.length} actions</span>
              </div>
              <p className="muted">For {people} {people === 1 ? "person" : "people"}{selectedNeeds.length ? ` with ${selectedNeeds.length} additional ${selectedNeeds.length === 1 ? "need" : "needs"}` : ""}.</p>
              <ol className="plan-list">
                {plan.map((task, index) => <li key={task}><span>{index + 1}</span><p>{task}</p></li>)}
              </ol>
              {contact && <div className="contact-card"><span>Out-of-area contact</span><strong>{contact}</strong></div>}
              <div className="actions plan-actions">
                <button className="secondary" onClick={() => setStep(1)}>Edit answers</button>
                <button className="secondary" onClick={savePlan}>{saved ? "✓ Saved" : "Save on device"}</button>
                <button className="primary" onClick={downloadPlan}>Download plan <span>↓</span></button>
                <button className="print-link" onClick={() => window.print()}>Print instead</button>
              </div>
              <p className="disclaimer">This tool supports preparedness and does not replace official emergency guidance. In immediate danger, contact local emergency services.</p>
            </div>
          )}
        </div>
      </section>

      <section className="how-it-helps">
        <p className="section-kicker">Why it matters</p>
        <h2>Preparedness should work<br />for every household.</h2>
        <div className="impact-grid">
          <article><span>01</span><h3>Personal, not generic</h3><p>Recommendations change based on the hazard and the people you care for.</p></article>
          <article><span>02</span><h3>Private from the start</h3><p>No login, database, or personal-data collection. Your plan remains yours.</p></article>
          <article><span>03</span><h3>Useful without internet</h3><p>Download or print the plan so it is available when power or service is not.</p></article>
        </div>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">R</span><span>ReadyTogether</span></a><p>Built to make safety simpler for everyone.</p><p>TechCommons Hacks 2026</p></footer>
    </main>
  );
}
