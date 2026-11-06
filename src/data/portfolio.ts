// All site content lives here. Numbers are the measured ones from each project's repo/docs;
// edit freely, but keep claims you can defend in an interview.

export const profile = {
  name: "Vishnu Priya Taduka",
  initials: "VP",
  role: "AI engineer",
  tagline: "I build LLM agents, retrieval pipelines and backends, and the tests, evals and telemetry that prove they work.",
  location: "Hyderabad, India",
  email: "vishnupriya.taduka@gmail.com",
  github: "https://github.com/VP-TT",
  linkedin: "https://linkedin.com/in/vishnu-priya-taduka-685482303",
  about: [
    "I'm a final-year Computer Science student at KMIT, Hyderabad, and I've spent two internships on the unglamorous half of AI engineering: evaluation, validation layers that catch silent failures, edge-case testing before release, and tracing what models actually do in production.",
    "My projects follow the same instinct. A payments API that can't double-charge and a load test that found why it was slow. A PR-review agent with a sandbox, budgets and an eval harness. A video QA system that cites the second it got its answer from.",
  ],
};

export const stats = [
  { value: "9.3", label: "CGPA at KMIT" },
  { value: "2", label: "AI engineering internships" },
  { value: "15", label: "merged open-source PRs" },
  { value: "1 of 4", label: "winners from 7,000+ (Centific Hackathon)" },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Model AI Engineering Intern",
    company: "Centific",
    period: "Jun 2026 — Present",
    location: "Hyderabad",
    points: [
      "Own model evaluation, threshold tuning and edge-case testing for a real-time video analytics system, validating detection behaviour on safety-critical scenarios before each deployment.",
      "Built multi-class action-recognition modules with temporal reasoning and optimised the inference path for real-time performance on live feeds.",
      "Improved search and RAG-based retrieval in an internal meeting-intelligence platform so generated insights draw on more relevant context.",
    ],
    stack: ["Python", "OpenCV", "YOLOv8", "RAG"],
  },
  {
    role: "AI Engineer Intern",
    company: "Nexoraa AI",
    period: "May 2026 — Jun 2026",
    location: "Hyderabad",
    points: [
      "Designed and ran structured tests for the plugin components of an AI workflow engine.",
      "Built build-time and runtime validation layers checking schema integrity and semantic correctness across pipeline components, reducing silent failures in production.",
      "Integrated Langfuse telemetry to trace token usage, latency and model behaviour, making regressions visible.",
      "Designed dependency graphs for multi-step execution ordering and conflict detection; modelled concurrent states with Petri nets.",
    ],
    stack: ["Python", "Langfuse", "Schema validation", "Petri nets"],
  },
];

export type Category = "ai" | "backend" | "health" | "mobile";

export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  categories: Category[];
  hue: [number, number]; // cover gradient hues (oklch)
  glyph: string;          // short monogram on the cover
  stack: string[];
  highlights: string[];   // shown as metric chips; measured or factual only
  body: string[];         // detail paragraphs in the expanded card
  repo: string;
  demo?: string;
  featured?: boolean;
  context?: string;       // e.g. hackathon
  hidden?: boolean;       // keep the entry but leave it off the site
};

export const projects: Project[] = [
  {
    slug: "ledgerline",
    name: "Ledgerline",
    oneLiner: "A bill-payment and rewards API that never charges twice: not on retries, races or gateway timeouts.",
    categories: ["backend"],
    hue: [155, 200],
    glyph: "Lℓ",
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "Flyway", "jqwik", "Testcontainers", "k6"],
    highlights: ["0 double charges in 1,000 parallel payments", "p95 1.4 s → 35–57 ms at 200 payments/s", "127 tests incl. property-based"],
    body: [
      "Exactly-once money movement from four mechanisms working together: idempotency keys for client retries, row locks for concurrent spends, a transactional outbox so the ledger write and the gateway call can't diverge, and a state machine that treats a gateway timeout as unknown, never as failed.",
      "Everything sits on a double-entry ledger enforced by the database itself: a deferred trigger rejects any unbalanced entry and the ledger is append-only. Signed webhooks, partial refunds with proportional reward clawback, nightly reconciliation against the gateway's report, and retention jobs round it out.",
      "A k6 load test showed p95 at 1.4 s. Sampling pg_stat_activity revealed 552 of 593 samples waiting on row locks: every payment queued on one shared clearing account. Removing that lock (it protected no rule) and fixing the outbox relay brought p95 to 35–57 ms.",
    ],
    repo: "https://github.com/VP-TT/ledgerline",
    featured: true,
  },
  {
    slug: "prism",
    name: "PRism",
    oneLiner: "A GitHub App that reviews pull requests with a tool-calling agent, then learns which comments developers accept.",
    categories: ["ai", "backend"],
    hue: [285, 330],
    glyph: "Pr",
    stack: ["TypeScript", "OpenAI tools", "Express", "BullMQ", "PostgreSQL", "Docker", "Langfuse", "React"],
    highlights: ["6 agent tools incl. sandboxed lint & tests", "step, token & time budgets", "94 tests"],
    body: [
      "On every PR the agent reads the diff, reads and greps the repo, and runs the repo's own linter and tests inside a Docker container with no network, a read-only filesystem and all capabilities dropped. It posts one review with severity-ranked inline comments, each validated against lines actually in the diff.",
      "Bounded by 15 steps, per-tool caps, a 200k-token budget and a 5-minute timeout. Prompt-injection defences wrap every piece of PR content as untrusted data; commands come only from config read at the base commit, never from the model.",
      "Reactions, replies, code changes on the commented line and resolved threads feed an acceptance rate on a React dashboard, with a Langfuse trace for every review and an offline eval harness of planted-bug PRs. Runs on gpt-4.1 or fully local via Ollama.",
    ],
    repo: "https://github.com/VP-TT/prism",
    featured: true,
  },
  {
    slug: "vidsense",
    name: "VidSense",
    oneLiner: "Ask a video a question and get an answer that cites the exact moment, fully local.",
    categories: ["ai"],
    hue: [20, 60],
    glyph: "Vs",
    stack: ["Python", "Whisper", "CLIP", "DTW", "ChromaDB", "LangChain", "Ollama", "Streamlit"],
    highlights: ["banded DTW: 8M → 71k cells on a 4-hour video", "retrieval in milliseconds", "112 tests"],
    body: [
      "Whisper transcribes speech; CLIP embeds frames, and temporal K-means picks keyframes that stay in time order. A banded dynamic-time-warping pass aligns every sentence with the scene it belongs to, so chunks follow the video's real structure.",
      "Questions retrieve scene-aligned chunks from ChromaDB; a vision-language model (Qwen2.5-VL) inspects the actual frames for visual details, and DeepSeek-R1 answers with clickable [mm:ss] citations in a Streamlit player.",
      "Includes an evaluation harness that scores retrieval against a random-ranking baseline and answers by match and LLM judge, with an ActivityNet-QA loader.",
    ],
    repo: "https://github.com/VP-TT/vidsense",
    featured: true,
  },
  {
    slug: "cura",
    name: "Cura",
    oneLiner: "A healthcare chatbot built on proxy tuning: a small LoRA-tuned medical expert steers a language model at decoding time.",
    categories: ["ai", "health"],
    hue: [340, 10],
    glyph: "Cu",
    stack: ["PyTorch", "PEFT / LoRA", "Apollo-2B", "FastAPI", "React", "Node.js", "MongoDB"],
    highlights: ["proxy tuning (Liu et al., 2024)", "LoRA-tuned Apollo-2B expert", "JWT auth & chat history"],
    body: [
      "Instead of fine-tuning a large model, Cura tunes a small one and adds the difference between the tuned expert's and untuned anti-expert's next-token logits to a base model at every decoding step: the base model gains the behaviour without any weight updates.",
      "A FastAPI inference server hosts Apollo-2B with the project's LoRA adapter; a Node/Express API with MongoDB handles accounts and saved chat sessions; the React + TypeScript front end has light and dark themes and a responsive chat UI.",
    ],
    repo: "https://github.com/VP-TT/Cura",
    featured: true,
  },
  {
    slug: "rosella",
    name: "Rosella",
    oneLiner: "A mobile app for early PCOS detection, combining symptom-based ML with ultrasound image classification.",
    categories: ["mobile", "health", "ai"],
    hue: [330, 300],
    glyph: "Ro",
    stack: ["Flutter", "Dart", "Firebase", "ML", "CNN"],
    highlights: ["dual prediction: symptoms + ultrasound", "Android & iOS", "health tracking"],
    body: [
      "Two detection paths: a machine-learning model over clinical parameters and symptoms, and a CNN that classifies ultrasound images. Users get a detailed report and can track symptoms and health metrics over time.",
      "Built with Flutter for Android and iOS on Firebase Authentication, Cloud Firestore and Firebase Storage.",
    ],
    repo: "https://github.com/VP-TT/Rosella",
  },
  {
    slug: "noc-copilot",
    name: "NOC Copilot",
    oneLiner: "An offline network-operations copilot that forecasts degradation before the SLA breaks and explains it with cited remediation.",
    categories: ["ai"],
    hue: [215, 250],
    glyph: "Nc",
    stack: ["Python", "Streamlit", "RAG", "Time series"],
    highlights: ["measures lead time before SLA breach", "cite-or-abstain answers", "100% offline / air-gapped"],
    body: [
      "Built for mission-critical, air-gapped WANs where faults cascade. Live telemetry becomes a rising risk score with measurable lead time, and the copilot emits a structured remediation card with a citation from local runbooks, abstaining rather than inventing a source.",
      "A Streamlit operator console with animated playback across four fault scenarios, topology view, precision/recall/false-positive rate per scenario, and a reactive-vs-predictive comparison.",
    ],
    repo: "https://github.com/VP-TT/NOC-Copilot",
    demo: "https://youtu.be/O8VrDtAuETs",
    context: "ISRO Bharatiya Antariksh Hackathon",
  },
  {
    slug: "medtriage",
    name: "MedTriage",
    oneLiner: "An OpenEnv benchmark where agents work through emergency-department workflows instead of one-shot questions.",
    categories: ["ai", "health"],
    hue: [0, 30],
    glyph: "Mt",
    stack: ["Python", "OpenEnv", "Pydantic", "Docker"],
    highlights: ["4 clinical tasks", "patients deteriorate if care is delayed", "deterministic rubric graders"],
    body: [
      "Agents gather history, order tests, stabilise and decide: triage (ESI level), differential diagnosis, safe treatment avoiding allergies and contraindications, and disposition.",
      "Episodes are multi-step with time and resource pressure; graders give partial credit with safety penalties, so the benchmark rewards careful clinical reasoning rather than lucky single answers.",
    ],
    repo: "https://github.com/VP-TT/MedTriage",
  },
  {
    slug: "talqs",
    name: "TALQS",
    oneLiner: "Transformers built from scratch in PyTorch for Indian legal question answering and summarisation.",
    categories: ["ai"],
    hue: [45, 85],
    glyph: "Tq",
    stack: ["PyTorch", "Transformers", "NLP"],
    highlights: ["no pre-trained models", "abstractive QA", "judgment summarisation"],
    body: [
      "Two Transformer models implemented from the ground up: one answers questions about court judgments with abstractive answers, the other produces concise summaries of lengthy judgments.",
    ],
    repo: "https://github.com/VP-TT/t_alqs",
  },
  {
    slug: "clinique",
    name: "Clinique",
    oneLiner: "Clinical-trial data-quality intelligence across 16 studies and 6,237 patients (Novartis NEST 2.0).",
    categories: ["ai", "health"],
    hue: [175, 140],
    glyph: "Cq",
    stack: ["Python", "scikit-learn", "XGBoost", "Streamlit", "Plotly"],
    highlights: ["16 trials · 6,237 patients", "risk model at 85.5% accuracy", "context-aware quality index"],
    body: [
      "Rule-based validation flags problematic records; a context-aware data-quality index adapts to trial phase and timeline; anomaly detection and a priority score rank interventions.",
      "Compared logistic regression, random forest and XGBoost on precision and recall; the final risk model reached 85.5% accuracy predicting future deterioration. An interactive ROI calculator models the impact of process changes.",
    ],
    repo: "https://github.com/VP-TT/Nest2.0_PS1",
    context: "Novartis NEST 2.0",
  },
  {
    slug: "autoverifymd",
    hidden: true, // prototype with mocked agents; set to false to show it
    name: "AutoVerifyMD",
    oneLiner: "A multi-agent prototype that validates and maintains healthcare provider directories.",
    categories: ["ai", "health", "backend"],
    hue: [195, 230],
    glyph: "Av",
    stack: ["FastAPI", "SQLAlchemy", "React", "Tailwind", "Recharts"],
    highlights: ["scraper · enrichment · QA agents", "verification dashboard", "prototype"],
    body: [
      "An orchestrator coordinates specialised agents (web scraping, enrichment, quality checks) to validate provider details, with a dashboard for validation stats, flagged records and verification history.",
    ],
    repo: "https://github.com/VP-TT/AutoVerifyMD",
  },
];

export const categories: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & LLMs" },
  { id: "backend", label: "Backend" },
  { id: "health", label: "Health" },
  { id: "mobile", label: "Mobile" },
];

export const openSource = {
  summary: "GSSoC '25 (rank 154) and Hacktoberfest: 15 merged pull requests across 6 projects.",
  contributions: [
    { repo: "supriya46788/Research-Paper-Organizer", merged: 9, what: "Gemini-powered chatbot with a Node server, paper summaries, login/sign-up, Terms & Privacy, UI work" },
    { repo: "Anshkaran7/git-aura", merged: 2, what: "Profile “roast” feature and Terms/Privacy pop-up (Next.js, Supabase)" },
    { repo: "openml-stack/SentiLog-AI", merged: 1, what: "Google OAuth for login and sign-up" },
    { repo: "Abhishek-Verma0/Secure-Credential-Manager-With-Key-Encryption", merged: 1, what: "Dark-mode toggle" },
    { repo: "Deepika14145/QuickFactChecker", merged: 1, what: "Git authentication" },
    { repo: "byteom/Interview01", merged: 1, what: "Hover and transition polish" },
  ],
};

export const achievements = [
  { title: "Winner, Centific Hackathon", detail: "Core AI/ML Engineering track, 2026: one of 4 winners from 7,000+ applicants; solved 3 problem statements solo in 7 days." },
  { title: "Top 10 of 120+ teams", detail: "ISRO Bharatiya Antariksh Hackathon." },
  { title: "Rank 705", detail: "Amazon ML Challenge 2026." },
  { title: "Rank 154", detail: "GirlScript Summer of Code 2025 (open source)." },
  { title: "Finalist", detail: "Hyderabad BITS Hackathon, 2024." },
  { title: "Olympiads", detail: "Gold, National Mathematics Olympiad; 2 Golds, International English Olympiad. 300+ LeetCode problems in Java." },
];

export const skills = {
  Languages: ["Python", "Java", "TypeScript", "JavaScript", "C++", "SQL", "Dart"],
  "AI / ML": ["PyTorch", "LangChain", "RAG", "Hugging Face", "LoRA / PEFT", "OpenAI tools", "CLIP", "Whisper", "YOLOv8", "OpenCV", "scikit-learn", "XGBoost"],
  "Backend & data": ["Spring Boot", "FastAPI", "Express", "PostgreSQL", "MongoDB", "Redis / BullMQ", "ChromaDB", "Docker"],
  "Quality & ops": ["Testcontainers", "Property-based testing", "k6", "Langfuse", "Evals", "GitHub Actions"],
  Frontend: ["React", "Next.js", "Tailwind", "Streamlit", "Flutter"],
};
