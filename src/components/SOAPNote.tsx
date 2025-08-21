import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";

interface AISuggestionProps {
  text: string;
  onInsert: (text: string) => void;
  onDismiss: () => void;
}

interface SOAPNoteProps {
  onContentChange?: (content: SOAPContent) => void;
}

interface SOAPContent {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

function AISuggestion({ text, onInsert, onDismiss }: AISuggestionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setHasOverflow(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text, isExpanded]);

  return (
    <div className="mt-4 p-4 rounded-lg bg-surface border border-border">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 16 16">
              <g clipPath="url(#clip0_1036_3138)">
                <path d="M13 9C13.0012 9.20386 12.9393 9.40311 12.8227 9.57033C12.7061 9.73754 12.5405 9.86451 12.3487 9.93375L9.12498 11.125L7.93748 14.3512C7.86716 14.5423 7.73992 14.7072 7.57295 14.8236C7.40598 14.9401 7.2073 15.0025 7.00373 15.0025C6.80015 15.0025 6.60147 14.9401 6.4345 14.8236C6.26753 14.7072 6.1403 14.5423 6.06998 14.3512L4.87498 11.125L1.64873 9.9375C1.45768 9.86718 1.29281 9.73995 1.17634 9.57298C1.05988 9.406 0.997437 9.20733 0.997437 9.00375C0.997437 8.80017 1.05988 8.6015 1.17634 8.43452C1.29281 8.26755 1.45768 8.14032 1.64873 8.07L4.87498 6.875L6.06248 3.64875C6.1328 3.45771 6.26003 3.29283 6.427 3.17637C6.59397 3.0599 6.79265 2.99746 6.99623 2.99746C7.1998 2.99746 7.39848 3.0599 7.56545 3.17637C7.73242 3.29283 7.85965 3.45771 7.92998 3.64875L9.12498 6.875L12.3512 8.0625C12.5431 8.13237 12.7086 8.26008 12.8248 8.42801C12.941 8.59594 13.0022 8.7958 13 9ZM9.49998 3H10.5V4C10.5 4.13261 10.5527 4.25979 10.6464 4.35355C10.7402 4.44732 10.8674 4.5 11 4.5C11.1326 4.5 11.2598 4.44732 11.3535 4.35355C11.4473 4.25979 11.5 4.13261 11.5 4V3H12.5C12.6326 3 12.7598 2.94732 12.8535 2.85355C12.9473 2.75979 13 2.63261 13 2.5C13 2.36739 12.9473 2.24021 12.8535 2.14645C12.7598 2.05268 12.6326 2 12.5 2H11.5V1C11.5 0.867392 11.4473 0.740215 11.3535 0.646447C11.2598 0.552678 11.1326 0.5 11 0.5C10.8674 0.5 10.7402 0.552678 10.6464 0.646447C10.5527 0.740215 10.5 0.867392 10.5 1V2H9.49998C9.36737 2 9.24019 2.05268 9.14642 2.14645C9.05266 2.24021 8.99998 2.36739 8.99998 2.5C8.99998 2.63261 9.05266 2.75979 9.14642 2.85355C9.24019 2.94732 9.36737 3 9.49998 3ZM15 5H14.5V4.5C14.5 4.36739 14.4473 4.24021 14.3535 4.14645C14.2598 4.05268 14.1326 4 14 4C13.8674 4 13.7402 4.05268 13.6464 4.14645C13.5527 4.24021 13.5 4.36739 13.5 4.5V5H13C12.8674 5 12.7402 5.05268 12.6464 5.14645C12.5527 5.24021 12.5 5.36739 12.5 5.5C12.5 5.63261 12.5527 5.75979 12.6464 5.85355C12.7402 5.94732 12.8674 6 13 6H13.5V6.5C13.5 6.63261 13.5527 6.75979 13.6464 6.85355C13.7402 6.94732 13.8674 7 14 7C14.1326 7 14.2598 6.94732 14.3535 6.85355C14.4473 6.75979 14.5 6.63261 14.5 6.5V6H15C15.1326 6 15.2598 5.94732 15.3535 5.85355C15.4473 5.75979 15.5 5.63261 15.5 5.5C15.5 5.36739 15.4473 5.24021 15.3535 5.14645C15.2598 5.05268 15.1326 5 15 5Z"/>
              </g>
              <defs>
                <clipPath id="clip0_1036_3138">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="text-sm font-semibold text-fg">GoldCare AI</span>
          <span className="text-xs text-fg-muted">Suggestion</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => onInsert(text)}
            className="text-sm font-medium text-primary hover:text-primary/80 h-auto p-0"
          >
            Insert above
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-sm font-medium text-fg-muted hover:text-fg h-auto p-0"
          >
            Dismiss
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <p 
          ref={textRef}
          className={`text-sm text-fg leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
        >
          {text}
        </p>
        {hasOverflow && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-primary hover:text-primary/80 h-auto p-0"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </div>
  );
}

interface SOAPSectionProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onDismissSuggestion: (index: number) => void;
}

function SOAPSection({ title, placeholder, value, onChange, suggestions, onDismissSuggestion }: SOAPSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.setSelectionRange(start + text.length, start + text.length);
        textarea.focus();
      }, 0);
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-fg">
          {title} Notes
        </label>
        <p className="text-sm text-fg-muted">
          Document relevant {title.toLowerCase()} information for this encounter
        </p>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[120px] p-3 bg-surface text-fg placeholder:text-fg-muted border border-border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={placeholder}
        />
      </div>

      {/* AI Suggestions */}
      {suggestions.map((suggestion, index) => (
        <AISuggestion
          key={index}
          text={suggestion}
          onInsert={insertText}
          onDismiss={() => onDismissSuggestion(index)}
        />
      ))}
    </section>
  );
}

export function SOAPNote({ onContentChange }: SOAPNoteProps) {
  const [content, setContent] = useState<SOAPContent>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  const [suggestions] = useState({
    subjective: [
      "Patient reports experiencing persistent headaches for the past 3 days, described as throbbing pain located in the frontal region, rated 7/10 in severity. Pain is worse in the morning and improves slightly with over-the-counter ibuprofen.",
      "Patient denies fever, nausea, or visual disturbances. No recent head trauma. Patient works long hours at computer and reports increased stress at work recently."
    ],
    objective: [
      "Vital Signs: BP 135/85, HR 78, RR 16, Temp 98.6°F, O2 Sat 99% on room air. Patient appears comfortable, alert and oriented x3.",
      "HEENT: PERRLA, EOMI, no papilledema noted on ophthalmoscopy. TMs clear bilaterally. Neck supple, no lymphadenopathy. No nuchal rigidity."
    ],
    assessment: [
      "Primary: Tension-type headache (G44.209) - likely related to stress and prolonged computer use. Secondary: Mild hypertension (I10) - noted elevated BP, patient reports no known history of hypertension."
    ],
    plan: [
      "1. Tension headache management: Continue ibuprofen 400mg q6h PRN, recommend stress reduction techniques, ergonomic workstation evaluation. 2. Blood pressure monitoring: Recheck BP in 2 weeks, consider home monitoring. 3. Follow-up in 2-4 weeks or sooner if headaches worsen or new symptoms develop."
    ]
  });

  const [activeSuggestions, setActiveSuggestions] = useState({
    subjective: [...suggestions.subjective],
    objective: [...suggestions.objective],
    assessment: [...suggestions.assessment],
    plan: [...suggestions.plan]
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const updateContent = (section: keyof SOAPContent, value: string) => {
    const newContent = { ...content, [section]: value };
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const dismissSuggestion = (section: keyof typeof activeSuggestions, index: number) => {
    setActiveSuggestions(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // In a real app, this would save to backend
      setLastSaved(new Date());
    }, 60000); // Save every 60 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content]);

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes === 0) return "Auto-saved just now";
    if (diffInMinutes === 1) return "Auto-saved 1 min ago";
    return `Auto-saved ${diffInMinutes} min ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-fg">
            <FileText className="h-6 w-6 text-primary" />
            SOAP Note
          </h1>
          <p className="text-fg-muted">Document subjective, objective, assessment, and plan</p>
        </div>
        <Badge variant="secondary" className="bg-surface text-fg-muted border border-border">
          <Clock className="h-3 w-3 mr-1" />
          {formatLastSaved(lastSaved)}
        </Badge>
      </div>

      {/* SOAP Sections */}
      <div className="space-y-8">
        <SOAPSection
          title="Subjective"
          placeholder="What brings the patient here today? Include chief complaint, history of present illness, medications, allergies..."
          value={content.subjective}
          onChange={(value) => updateContent('subjective', value)}
          suggestions={activeSuggestions.subjective}
          onDismissSuggestion={(index) => dismissSuggestion('subjective', index)}
        />

        <SOAPSection
          title="Objective"
          placeholder="Document vital signs, physical examination findings, relevant diagnostic results..."
          value={content.objective}
          onChange={(value) => updateContent('objective', value)}
          suggestions={activeSuggestions.objective}
          onDismissSuggestion={(index) => dismissSuggestion('objective', index)}
        />

        <SOAPSection
          title="Assessment"
          placeholder="Clinical impression, differential diagnosis, ICD-10 codes..."
          value={content.assessment}
          onChange={(value) => updateContent('assessment', value)}
          suggestions={activeSuggestions.assessment}
          onDismissSuggestion={(index) => dismissSuggestion('assessment', index)}
        />

        <SOAPSection
          title="Plan"
          placeholder="Treatment plan, medications, follow-up instructions, patient education..."
          value={content.plan}
          onChange={(value) => updateContent('plan', value)}
          suggestions={activeSuggestions.plan}
          onDismissSuggestion={(index) => dismissSuggestion('plan', index)}
        />
      </div>
    </div>
  );
}