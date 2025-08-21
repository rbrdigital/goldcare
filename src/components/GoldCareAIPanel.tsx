export function GoldCareAIPanel() {
  return (
    <aside className="h-full bg-surface border-l border-border flex flex-col" data-testid="panel-goldcare-ai">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-fg">GoldCare AI</span>
            <span className="text-xs text-fg-muted">Insights</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-fg-muted">
          Automated suggestions based on recent encounters, vitals, and history. Use clinical judgment to confirm.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
        {/* Card 1 */}
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-fg">Dr. Sarah Johnson</div>
              <div className="text-xs text-fg-muted">Annual Wellness Visit · Aug 18, 2025 · 10:15 AM</div>
            </div>
            <span className="text-xs text-fg-muted">Wellness & Preventive Care</span>
          </div>
          <p className="mt-2 text-sm text-fg">
            AI notes stable vitals and prior borderline LDL. Recommend a fasting lipid panel in 12 weeks,
            continue current exercise plan, and replace refined carbs with high-fiber options. Offer WellnessU modules on
            metabolic health and schedule a brief telehealth check-in to review results and adherence.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-fg">Dr. Mark Lee</div>
              <div className="text-xs text-fg-muted">Acute Viral Treatment · Aug 05, 2025 · 09:30 AM</div>
            </div>
            <span className="text-xs text-fg-muted">Acute Care</span>
          </div>
          <p className="mt-2 text-sm text-fg">
            AI suggests hydration, rest, zinc, vitamin D, and symptom monitoring for 72 hours. Book a follow-up if fever
            persists or O₂ dips. Provide the GoldCare Acute Viral Pack overview and send a same-day message with
            red-flag guidance and a link to schedule urgent telehealth if symptoms escalate.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-fg">Dr. Emily Carter</div>
              <div className="text-xs text-fg-muted">Long COVID Care · Jul 22, 2025 · 11:00 AM</div>
            </div>
            <span className="text-xs text-fg-muted">Recovery & Rehab</span>
          </div>
          <p className="mt-2 text-sm text-fg">
            AI flags ongoing fatigue and light exertional intolerance. Recommend graded activity, sleep hygiene,
            electrolyte support, and post-viral nutrition. Enroll patient in WellnessU recovery track and schedule a
            30-day reassessment. Document PEM triggers and consider HRV tracking to calibrate weekly effort.
          </p>
        </div>

        {/* Card 4 */}
        <div className="rounded-lg border border-border bg-bg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-fg">Dr. Noah Patel</div>
              <div className="text-xs text-fg-muted">Nutritional Counseling · Jul 02, 2025 · 03:45 PM</div>
            </div>
            <span className="text-xs text-fg-muted">Lifestyle & Nutrition</span>
          </div>
          <p className="mt-2 text-sm text-fg">
            AI recommends a Mediterranean-leaning plan emphasizing fiber, omega-3s, and reduced ultra-processed foods.
            Align meals with personal preferences and faith practices. Offer a 14-day meal template and invite a check-in
            to review adherence, lipid response, and fasting glucose trends.
          </p>
        </div>
      </div>
    </aside>
  );
}