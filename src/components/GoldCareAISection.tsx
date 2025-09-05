import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import { Check, Edit3, RefreshCw, ChevronDown, ChevronUp, Timer, Video, FileText, Stethoscope, Pill, TestTube, FilePlus2, ClipboardList, Send, Settings, Search, History, AlertTriangle, ShieldCheck, ExternalLink, Save, Keyboard, ArrowDown, ArrowUp } from "lucide-react";

// shadcn/ui primitives
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Types
type ProvenanceItem =
  | { type: "transcript"; ts: string; text?: string }
  | { type: "intake"; question: string; answer: string }
  | { type: "prior_note"; date: string; author?: string }
  | { type: "lab"; loinc: string; value?: string; date?: string };

type SafetyItem = { severity: "info" | "warning" | "error"; code: string; msg: string };

type SuggestedOrder = { loinc: string; name: string; dx: string[] };

type SuggestedRx = { rxnorm: string; drug: string; sig: string; qty: number; refills: number };

type BlockType =
  | "chief_hpi"
  | "ros"
  | "med_recon"
  | "allergy_recon"
  | "pe"
  | "assessment"
  | "plan"
  | "orders"
  | "rx"
  | "referrals"
  | "patient_summary"
  | "coding";

type Block = {
  block_id: string;
  type: BlockType;
  title: string;
  content_md: string;
  rationale?: string;
  suggested_orders?: SuggestedOrder[];
  suggested_rx?: SuggestedRx[];
  safety?: SafetyItem[];
  provenance?: ProvenanceItem[];
  accept_actions?: { write?: string; stage?: "orders" | "rx" | "referrals" | "instructions" | "superbill" }[];
};

// Mock data helpers
const mockBlocks: Block[] = [
  { block_id: "s-cc-hpi", type: "chief_hpi", title: "Chief Complaint & HPI", rationale: "Synthesized from transcript + intake.", content_md: "Patient reports 3 days of wheeze and cough, worse at night. Denies fever." , provenance: [ {type:"transcript", ts:"00:02:11-00:03:04", text:"...cough worse at night..."}, {type:"intake", question:"Cough?", answer:"Yes"} ], accept_actions: [{write:"note.s.append"}] },
  { block_id: "s-ros", type: "ros", title: "ROS (targeted)", rationale: "Auto-included systems relevant to complaint.", content_md: "Respiratory: wheeze, nocturnal cough. GI: no reflux. GU: no dysuria.", provenance: [ {type:"transcript", ts:"00:04:12-00:04:40"} ], accept_actions: [{write:"note.s.append"}] },
  { block_id: "o-medrec", type: "med_recon", title: "Medication Reconciliation", rationale: "Intake diff against active med list.", content_md: "- new: Montelukast 10 mg qHS\n- changed: Fluticasone 110 mcg BID → 220 mcg BID\n- confirmed: Albuterol HFA PRN", provenance: [ {type:"intake", question:"Current meds", answer:"Listed"}, {type:"prior_note", date:"2025-07-18", author:"NP Lee"} ], accept_actions: [{write:"history.medications"}] },
  { block_id: "o-allergy", type: "allergy_recon", title: "Allergies", rationale: "Recon from chart + intake.", content_md: "- Penicillin (rash) — 2019\n- Nuts (anaphylaxis) — patient carries epinephrine.", provenance: [ {type:"intake", question:"Allergies?", answer:"Penicillin, nuts"} ], accept_actions: [{write:"history.allergies"}] },
  { block_id: "o-pe", type: "pe", title: "Physical Exam summary", rationale: "From transcript + today's vitals.", content_md: "Gen: no distress. Lungs: mild expiratory wheeze. Vitals: HR 88, BP 122/76, SpO2 97%.", provenance: [ {type:"transcript", ts:"00:10:02-00:10:40"} ], accept_actions: [{write:"note.o.append"}] },
  { block_id: "a-assess", type: "assessment", title: "Assessment", rationale: "Condensed problem list with severity & rationale.", content_md: "- Asthma exacerbation (moderate) — nocturnal symptoms, wheeze.\n- Allergic rhinitis — seasonal.", provenance: [ {type:"prior_note", date:"2025-05-03", author:"Dr Gomez"} ], accept_actions: [{write:"note.a.append"}] },
  { block_id: "p-plan", type: "plan", title: "Plan", rationale: "Guideline-informed plan.", content_md: "- Start budesonide-formoterol 80/4.5: 2 puffs BID.\n- Rescue: albuterol HFA PRN.\n- Avoid smoke; spacer education today.", suggested_orders: [ {loinc:"1975-2", name:"IgE total", dx:["J45.901"]} ], suggested_rx: [ {rxnorm:"617314", drug:"Budesonide-formoterol 80/4.5", sig:"2 puffs BID", qty:1, refills:1} ], safety: [ {severity:"warning", code:"INTERACTION", msg:"Formoterol with propranolol may reduce effectiveness."} ], provenance: [ {type:"intake", question:"Nocturnal sx?", answer:"Yes"} ], accept_actions: [{write:"note.plan.append"},{stage:"orders"},{stage:"rx"}] },
  { block_id: "o-orders", type: "orders", title: "Proposed Orders — Labs/Imaging", rationale: "Based on assessment.", content_md: "CBC, IgE total; consider spirometry next visit.", suggested_orders: [ {loinc:"718-7", name:"Hemoglobin [Mass/volume] in Blood", dx:["J45.901"]} ], provenance: [ {type:"lab", loinc:"718-7", value:"12.8 g/dL", date:"2024-12-10"} ], accept_actions: [{stage:"orders"}] },
  { block_id: "o-rx", type: "rx", title: "Proposed Prescriptions", rationale: "Dose and SIG auto-drafted.", content_md: "Budesonide-formoterol 80/4.5: 2 puffs BID x30d; Albuterol HFA: 2 puffs q4-6h PRN.", suggested_rx: [ {rxnorm:"617314", drug:"Budesonide-formoterol 80/4.5", sig:"2 puffs BID", qty:1, refills:1} ], safety: [ {severity:"info", code:"PREGNANCY", msg:"Safe in pregnancy."} ], provenance: [ {type:"prior_note", date:"2025-02-11"} ], accept_actions: [{stage:"rx"}] },
  { block_id: "o-ref", type: "referrals", title: "Referrals", rationale: "If poor control persists.", content_md: "Allergy/Immunology — evaluate aeroallergen sensitivity; attach CCD.", provenance: [ {type:"prior_note", date:"2025-01-06"} ], accept_actions: [{stage:"referrals"}] },
  { block_id: "p-summary", type: "patient_summary", title: "Patient Summary (lay) — EN", rationale: "5th-grade reading level.", content_md: "You have asthma symptoms. Use your daily inhaler morning and night. Use your rescue inhaler when you are short of breath. Avoid smoke.", provenance: [ {type:"intake", question:"Primary language", answer:"EN"} ], accept_actions: [{stage:"instructions"}] },
  { block_id: "p-coding", type: "coding", title: "Coding/Superbill", rationale: "ICD-10 + CPT with why.", content_md: "ICD-10: J45.901 (Asthma exacerbation). CPT: 99214 — MDM: moderate (rx management).", provenance: [ {type:"prior_note", date:"2025-06-09"} ], accept_actions: [{stage:"superbill"}] },
];

// Utility components
const MonoPill: React.FC<React.PropsWithChildren<{tone?: "default"|"blue"|"green"|"amber"|"red"}>> = ({children, tone = "default"}) => (
  <span className={`font-mono text-xs px-1.5 py-0.5 rounded border ${toneColor(tone)} whitespace-nowrap`}>{children}</span>
);

function toneColor(tone: string){
  switch(tone){
    case "blue": return "bg-blue-50 text-blue-700 border-blue-200";
    case "green": return "bg-green-50 text-green-700 border-green-200";
    case "amber": return "bg-amber-50 text-amber-700 border-amber-200";
    case "red": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-muted text-foreground/80 border-border";
  }
}

function safetyTone(s: SafetyItem){
  if(s.severity === "error") return "red";
  if(s.severity === "warning") return "amber";
  return "blue";
}

// Main component
export function GoldCareAISection(){
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [streaming, setStreaming] = useState<boolean>(true);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const commitEnabled = Object.values(accepted).some(Boolean);
  const [controls, setControls] = useState({ mode: "Brief", rigor: "Strict", voice: "Plain", scope: "12m", clinic: "general" });

  // Stage collectors
  const staged = useMemo(() => {
    const orders: SuggestedOrder[] = [];
    const rx: SuggestedRx[] = [];
    const referrals: string[] = [];
    const instructions: string[] = [];
    const superbill: string[] = [];
    blocks.forEach(b => {
      if(!accepted[b.block_id]) return;
      if(b.suggested_orders) orders.push(...b.suggested_orders);
      if(b.suggested_rx) rx.push(...b.suggested_rx);
      if(b.type === "referrals") referrals.push(b.content_md);
      if(b.type === "patient_summary") instructions.push(b.content_md);
      if(b.type === "coding") superbill.push(b.content_md);
    });
    return {orders, rx, referrals, instructions, superbill};
  }, [blocks, accepted]);

  // Simulate streaming blocks
  useEffect(() => {
    let i = 0;
    setBlocks([]);
    setStreaming(true);
    const id = setInterval(()=>{
      setBlocks(prev => (i < mockBlocks.length ? [...prev, mockBlocks[i++]] : prev));
      if(i >= mockBlocks.length){ clearInterval(id); setStreaming(false); }
    }, 250);
    return () => clearInterval(id);
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)){
        e.preventDefault();
        setSavedAt(Date.now());
        return;
      }
      if(e.shiftKey && (e.key === 'F')){
        e.preventDefault();
        // Commit: no-op mock
        alert('Committed all accepted items.');
        return;
      }
      if(e.shiftKey && (e.key === 'O')){
        e.preventDefault();
        document.getElementById('staging-rail')?.focus();
        return;
      }
      if(e.key === 'ArrowDown'){
        e.preventDefault();
        setFocusedIndex(i => Math.min(i+1, blocks.length-1));
        scrollIntoViewCentered(focusedIndex+1);
        return;
      }
      if(e.key === 'ArrowUp'){
        e.preventDefault();
        setFocusedIndex(i => Math.max(i-1, 0));
        scrollIntoViewCentered(focusedIndex-1);
        return;
      }
      const b = blocks[focusedIndex];
      if(!b) return;
      if(e.key === 'Enter'){
        e.preventDefault();
        tryAccept(b);
        return;
      }
      if(e.key.toLowerCase() === 'e'){
        e.preventDefault();
        setEditing(prev => ({...prev, [b.block_id]: !prev[b.block_id]}));
        return;
      }
      if(e.key.toLowerCase() === 'r'){
        e.preventDefault();
        // regenerate mock
        setBlocks(prev => prev.map(x => x.block_id === b.block_id ? {...x, content_md: x.content_md + "\n(Regenerated at " + new Date().toLocaleTimeString() + ")"} : x));
        return;
      }
      if(e.key.toLowerCase() === 'a'){
        e.preventDefault();
        // accept all visible (center)
        setBlocks(prev => { prev.forEach(pb => tryAccept(pb, true)); return [...prev]; });
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [blocks, focusedIndex, accepted]);

  function scrollIntoViewCentered(idx: number){
    const el = document.querySelector(`[data-block-index="${idx}"]`);
    if(el && centerRef.current){
      el.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  function blockedBySafety(b: Block){
    return (b.safety||[]).some(s => s.severity !== 'info');
  }

  function tryAccept(b: Block, silent = false){
    if(blockedBySafety(b)){
      if(!silent) alert('Resolve safety warnings before accepting.');
      return;
    }
    setAccepted(prev => ({...prev, [b.block_id]: true}));
  }

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen bg-background text-foreground">
        <HeaderBar controls={controls} onControlsChange={setControls} commitEnabled={commitEnabled} savedAt={savedAt} />
        <Separator />
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Left Rail */}
          <aside className="col-span-3 xl:col-span-2 space-y-4">
            <PatientHeader />
            <LeftRail />
          </aside>

          {/* Center - AI Stream */}
          <main ref={centerRef} className="col-span-6 xl:col-span-7 space-y-3">
            <AnimatePresence>
              {blocks.map((b, idx) => (
                <motion.div key={b.block_id} data-block-index={idx}
                  initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-6}}
                >
                  <AIBlockCard
                    block={b}
                    isFocused={idx === focusedIndex}
                    accepted={!!accepted[b.block_id]}
                    expanded={!!expanded[b.block_id]}
                    editing={!!editing[b.block_id]}
                    onToggleExpand={() => setExpanded(prev => ({...prev, [b.block_id]: !prev[b.block_id]}))}
                    onToggleEdit={() => setEditing(prev => ({...prev, [b.block_id]: !prev[b.block_id]}))}
                    onAccept={() => tryAccept(b)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {streaming && <SkeletonBlock />}
          </main>

          {/* Right Rail - Staging */}
          <aside id="staging-rail" tabIndex={0} className="col-span-3 xl:col-span-3 space-y-3 focus:outline-none">
            <StagingRail staged={staged} commitEnabled={commitEnabled} />
          </aside>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Header bar with actions and AI controls
function HeaderBar({commitEnabled, controls, onControlsChange, savedAt}:{commitEnabled:boolean, controls:any, onControlsChange:(v:any)=>void, savedAt:number|null}){
  return (
    <div className="w-full px-4 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-medium">GoldCare AI</Badge>
        <span className="text-sm text-muted-foreground">Encounter Control Tower</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="secondary" className="gap-2"><Check className="h-4 w-4"/>Accept All</Button>
        <Button size="sm" disabled={!commitEnabled} className="gap-2"><Send className="h-4 w-4"/>Commit & Finalize</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2"><Settings className="h-4 w-4"/>AI Controls</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Mode</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={controls.mode==='Brief'} onCheckedChange={()=>onControlsChange({...controls, mode:'Brief'})}>Brief</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={controls.mode==='Thorough'} onCheckedChange={()=>onControlsChange({...controls, mode:'Thorough'})}>Thorough</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Rigor</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={controls.rigor==='Strict'} onCheckedChange={()=>onControlsChange({...controls, rigor:'Strict'})}>Strict</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={controls.rigor==='Flexible'} onCheckedChange={()=>onControlsChange({...controls, rigor:'Flexible'})}>Flexible</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Voice</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={controls.voice==='Plain'} onCheckedChange={()=>onControlsChange({...controls, voice:'Plain'})}>Plain</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={controls.voice==='Bilingual'} onCheckedChange={()=>onControlsChange({...controls, voice:'Bilingual'})}>Bilingual (ES/EN)</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Scope</DropdownMenuLabel>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, scope:'today'})}>Today only</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, scope:'12m'})}>Last 12 months</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, scope:'all'})}>All history</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Clinic preset</DropdownMenuLabel>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, clinic:'pediatrics'})}>Pediatrics</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, clinic:'womens'})}>Women's health</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>onControlsChange({...controls, clinic:'sports'})}>Sports med</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost"><Keyboard className="h-4 w-4"/></Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <div>↓/↑ Move • Enter Accept • E Edit • R Regenerate • A Accept all</div>
              <div>Shift+O Staging • Cmd/Ctrl+S Save • Shift+F Commit</div>
            </div>
          </TooltipContent>
        </Tooltip>
        {savedAt && <span className="text-xs text-muted-foreground flex items-center gap-1"><Save className="h-3 w-3"/>Saved {new Date(savedAt).toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}

function PatientHeader(){
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="truncate">Jane Smith • 34F • MRN 102938</span>
          <Badge variant="secondary" className="gap-1"><Timer className="h-3 w-3"/>12:44</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Televisit • Sep 5, 2025</span>
          <Button size="sm" variant="outline" className="gap-1"><Video className="h-3 w-3"/>Join Meeting</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeftRail(){
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="py-3"><CardTitle className="text-sm">Transcript Navigator</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-40 pr-3">
            {Array.from({length:6}).map((_,i)=> (
              <div key={i} className="py-1.5">
                <div className="text-xs text-muted-foreground">Pt {i%2?"":"and MD"} • 00:0{i}:1{i}</div>
                <div className="text-sm truncate">...cough worse at night, wheeze when climbing stairs...</div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Intake Diff</CardTitle>
          <Button size="sm" variant="secondary">Accept all updates</Button>
        </CardHeader>
        <CardContent className="pt-0 space-y-1.5 text-sm">
          <div className="flex items-center gap-2"><Badge className="bg-green-100 text-green-800" variant="secondary">new</Badge><span>Montelukast 10 mg nightly</span></div>
          <div className="flex items-center gap-2"><Badge className="bg-amber-100 text-amber-800" variant="secondary">changed</Badge><span>Fluticasone 110 → 220 mcg</span></div>
          <div className="flex items-center gap-2"><Badge variant="outline">confirmed</Badge><span>Albuterol HFA PRN</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-3"><CardTitle className="text-sm">Timeline Peek</CardTitle></CardHeader>
        <CardContent className="pt-0 text-sm space-y-1.5">
          <div className="flex items-center justify-between"><span>LDL</span><span className="flex items-center gap-1"><ArrowDown className="h-3 w-3"/>98</span></div>
          <div className="flex items-center justify-between"><span>A1c</span><span className="flex items-center gap-1"><ArrowUp className="h-3 w-3"/>6.2%</span></div>
          <div className="flex items-center justify-between"><span>Med change</span><span className="text-muted-foreground">+1</span></div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIBlockCard({block, accepted, expanded, editing, onToggleExpand, onToggleEdit, onAccept, isFocused}:{block:Block, accepted:boolean, expanded:boolean, editing:boolean, onToggleExpand:()=>void, onToggleEdit:()=>void, onAccept:()=>void, isFocused:boolean}){
  const safety = block.safety || [];
  const gated = safety.some(s => s.severity !== 'info');
  return (
    <Card className={`transition shadow-sm ${isFocused ? 'ring-2 ring-blue-300' : ''}`}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {iconFor(block.type)}
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {block.title}
              {accepted && <Badge className="bg-green-600">✅ Accepted</Badge>}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {block.rationale && <span className="text-xs text-muted-foreground hidden md:inline">{block.rationale}</span>}
            <ProvenanceChips items={block.provenance||[]} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Safety badges */}
        {safety.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {safety.map((s, i) => (
              <Badge key={i} className={toneColor(safetyTone(s)) + ' border'}>
                <AlertTriangle className="h-3 w-3 mr-1"/>{s.code}: {s.msg}
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        {editing ? (
          <Textarea defaultValue={block.content_md} className="min-h-[120px]" />
        ) : (
          <div className="prose prose-sm max-w-none">
            {block.content_md.split('\n').map((line, idx) => (
              <p key={idx}>
                <HoverCard>
                  <HoverCardTrigger className="underline decoration-dotted underline-offset-2 cursor-help">{line}</HoverCardTrigger>
                  <HoverCardContent className="text-xs w-80">Hover source preview (transcript/intake/lab)</HoverCardContent>
                </HoverCard>
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAccept} disabled={gated || accepted} className="gap-1"><Check className="h-4 w-4"/>Accept <span className="hidden sm:inline">(Enter)</span></Button>
          <Button size="sm" variant="secondary" onClick={onToggleEdit} className="gap-1"><Edit3 className="h-4 w-4"/>Edit (E)</Button>
          <Button size="sm" variant="outline" className="gap-1"><RefreshCw className="h-4 w-4"/>Regenerate (R)</Button>
          <Button size="sm" variant="ghost" onClick={onToggleExpand} className="gap-1">
            {expanded ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
            Details
          </Button>
        </div>

        {expanded && (
          <div className="rounded-lg border p-2 text-xs space-y-2">
            {block.suggested_orders && block.suggested_orders.length > 0 && (
              <div>
                <div className="font-medium mb-1 flex items-center gap-1"><TestTube className="h-3 w-3"/>Suggested Orders</div>
                <div className="space-y-1">
                  {block.suggested_orders.map((o, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MonoPill tone="blue">LOINC {o.loinc}</MonoPill>
                        <span>{o.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {o.dx.map(dx => <MonoPill key={dx}>ICD-10 {dx}</MonoPill>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {block.suggested_rx && block.suggested_rx.length > 0 && (
              <div>
                <div className="font-medium mb-1 flex items-center gap-1"><Pill className="h-3 w-3"/>Suggested Prescriptions</div>
                <div className="space-y-1">
                  {block.suggested_rx.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MonoPill tone="blue">RxNorm {r.rxnorm}</MonoPill>
                        <span>{r.drug}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{r.sig} • #{r.qty} • {r.refills} refills</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function iconFor(t: BlockType){
  const c = "h-4 w-4 text-muted-foreground";
  switch(t){
    case "chief_hpi": return <FileText className={c}/>;
    case "ros": return <ClipboardList className={c}/>;
    case "med_recon": return <Pill className={c}/>;
    case "allergy_recon": return <AlertTriangle className={c}/>;
    case "pe": return <Stethoscope className={c}/>;
    case "assessment": return <History className={c}/>;
    case "plan": return <FilePlus2 className={c}/>;
    case "orders": return <TestTube className={c}/>;
    case "rx": return <Pill className={c}/>;
    case "referrals": return <ExternalLink className={c}/>;
    case "patient_summary": return <FileText className={c}/>;
    case "coding": return <ClipboardList className={c}/>;
  }
}

function ProvenanceChips({items}:{items:ProvenanceItem[]}){
  if(items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((p, i) => (
        <HoverCard key={i}>
          <HoverCardTrigger asChild>
            <Badge variant="outline" className="font-mono text-[10px]">
              {p.type === 'transcript' && <>Transcript {p.ts}</>}
              {p.type === 'intake' && <>Intake</>}
              {p.type === 'prior_note' && <>Prior {p.date}</>}
              {p.type === 'lab' && <>Lab {p.loinc}</>}
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs w-80">
            {p.type === 'transcript' && <div><div className="font-medium mb-1">Transcript</div><div className="text-muted-foreground">{p.ts}</div><div>{p.text||"..."}</div></div>}
            {p.type === 'intake' && <div><div className="font-medium mb-1">Intake Q/A</div><div className="text-muted-foreground">{p.question}</div><div>{p.answer}</div></div>}
            {p.type === 'prior_note' && <div><div className="font-medium mb-1">Prior note</div><div className="text-muted-foreground">{p.date}</div></div>}
            {p.type === 'lab' && <div><div className="font-medium mb-1">Lab</div><div className="text-muted-foreground">LOINC {p.loinc}</div><div>{p.value||""} {p.date||""}</div></div>}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

function SkeletonBlock(){
  return (
    <Card className="opacity-70">
      <CardHeader className="py-3">
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

function StagingRail({staged, commitEnabled}:{staged:{orders: SuggestedOrder[]; rx: SuggestedRx[]; referrals: string[]; instructions: string[]; superbill: string[]}, commitEnabled:boolean}){
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2"><TestTube className="h-4 w-4"/>Orders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm space-y-2">
          {staged.orders.length === 0 && <div className="text-muted-foreground">None</div>}
          {staged.orders.map((o,i)=> (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2"><MonoPill tone="blue">LOINC {o.loinc}</MonoPill><span>{o.name}</span></div>
              <div className="flex items-center gap-1">{o.dx.map(dx => <MonoPill key={dx}>ICD-10 {dx}</MonoPill>)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2"><Pill className="h-4 w-4"/>Prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm space-y-2">
          {staged.rx.length === 0 && <div className="text-muted-foreground">None</div>}
          {staged.rx.map((r,i)=> (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2"><MonoPill tone="blue">RxNorm {r.rxnorm}</MonoPill><span>{r.drug}</span></div>
              <div className="text-xs text-muted-foreground">{r.sig} • #{r.qty} • {r.refills}R</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2"><ExternalLink className="h-4 w-4"/>Referrals</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm space-y-2">
          {staged.referrals.length === 0 && <div className="text-muted-foreground">None</div>}
          {staged.referrals.map((r,i)=> (<div key={i}>{r}</div>))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4"/>Patient Instructions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm space-y-2">
          {staged.instructions.length === 0 && <div className="text-muted-foreground">None</div>}
          {staged.instructions.map((t,i)=> (<div key={i} className="p-2 rounded border bg-muted/30">{t}</div>))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4"/>Superbill</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm space-y-2">
          {staged.superbill.length === 0 && <div className="text-muted-foreground">None</div>}
          {staged.superbill.map((t,i)=> (<div key={i} className="text-sm">{t}</div>))}
        </CardContent>
      </Card>

      <Button size="sm" disabled={!commitEnabled} className="w-full gap-2"><Send className="h-4 w-4"/>Commit all</Button>
    </div>
  );
}