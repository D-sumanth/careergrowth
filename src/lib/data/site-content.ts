export const siteConfig = {
  name: "Career Growth Studio",
  consultantName: "Priya Shah",
  email: "hello@careergrowthstudio.co.uk",
  phone: "+44 20 7946 0123",
  whatsapp: "https://wa.me/447700900123",
  location: "London, United Kingdom",
  instagram: "https://www.instagram.com",
  linkedin: "https://www.linkedin.com",
};

export const services = [
  {
    slug: "one-to-one-career-guidance",
    title: "One-to-one career guidance",
    description: "Personal strategy sessions for students and graduates who want sharper direction, more confidence, and a clear plan.",
    who: "Students unsure how to target the right roles or structure their job search.",
    included: ["Career target review", "Graduate-market strategy", "Action plan and follow-up notes"],
    duration: "60 minutes",
    pricePence: 8900,
    accent: "from-amber-200 via-white to-rose-100",
  },
  {
    slug: "cv-resume-review",
    title: "Resume / CV review",
    description: "Detailed, UK-market-focused CV feedback that helps recruiters understand your value quickly.",
    who: "Students not getting interviews, or those preparing for graduate scheme deadlines.",
    included: ["Written feedback", "Positioning advice", "Achievement-focused rewrites"],
    duration: "3 working day turnaround",
    pricePence: 4900,
    accent: "from-sky-200 via-white to-cyan-100",
  },
  {
    slug: "linkedin-profile-review",
    title: "LinkedIn profile review",
    description: "Improve visibility, clarity, and recruiter confidence with a profile that supports your CV.",
    who: "Students who want stronger networking and a more professional online brand.",
    included: ["Headline rewrite", "About section guidance", "Featured section ideas"],
    duration: "45 minutes or async review",
    pricePence: 3900,
    accent: "from-emerald-200 via-white to-lime-100",
  },
  {
    slug: "interview-preparation",
    title: "Interview preparation",
    description: "Practical interview coaching with competency frameworks, market awareness, and honest feedback.",
    who: "Candidates preparing for interviews, assessment centres, or final rounds.",
    included: ["Mock questions", "Story refinement", "Delivery feedback"],
    duration: "75 minutes",
    pricePence: 10900,
    accent: "from-violet-200 via-white to-fuchsia-100",
  },
  {
    slug: "job-search-strategy-session",
    title: "Job search strategy session",
    description: "Create a better search system, sharper application process, and more sustainable momentum.",
    who: "Students applying widely without traction or struggling with consistency.",
    included: ["Target role mapping", "Application tracker review", "Networking priorities"],
    duration: "60 minutes",
    pricePence: 7900,
    accent: "from-orange-200 via-white to-yellow-100",
  },
  {
    slug: "workshops-and-webinars",
    title: "Workshops / webinars",
    description: "Live group sessions on CVs, LinkedIn, interviews, confidence, and the UK graduate market.",
    who: "Students who want focused teaching in a more affordable group format.",
    included: ["Live training", "Q&A", "Optional replay where available"],
    duration: "90 to 120 minutes",
    pricePence: 2900,
    accent: "from-teal-200 via-white to-cyan-100",
  },
  {
    slug: "premium-packages",
    title: "Premium packages / bundles",
    description: "A bundled support path for students who want expert help across multiple stages of the journey.",
    who: "Students who want ongoing support instead of a one-off session.",
    included: ["Strategy call", "CV review", "LinkedIn review", "Interview prep"],
    duration: "Multi-session support",
    pricePence: 18900,
    accent: "from-stone-200 via-white to-amber-100",
  },
];

export const packages = [
  {
    title: "Graduate Launch Pack",
    description: "Career strategy, CV review, and LinkedIn refresh for students preparing for the next recruitment cycle.",
    pricePence: 18900,
  },
  {
    title: "Interview Confidence Pack",
    description: "Two interview-prep sessions plus tailored answer feedback for high-stakes applications.",
    pricePence: 15900,
  },
  {
    title: "Job Search Reset Pack",
    description: "A structured reset for students who have been applying for months without enough traction.",
    pricePence: 21900,
  },
];

export const workshops = [
  {
    slug: "graduate-job-search-masterclass",
    title: "Graduate Job Search Masterclass",
    summary: "A practical workshop on applications, recruiter expectations, and building momentum in the UK market.",
    startsAt: "2026-05-12T18:00:00.000Z",
    endsAt: "2026-05-12T20:00:00.000Z",
    pricePence: 2900,
    seatLimit: 40,
    sold: 24,
    status: "Upcoming",
  },
  {
    slug: "linkedin-for-international-students",
    title: "LinkedIn for International Students",
    summary: "How to build credibility, network intentionally, and make recruiters understand your direction.",
    startsAt: "2026-06-03T18:30:00.000Z",
    endsAt: "2026-06-03T20:00:00.000Z",
    pricePence: 2400,
    seatLimit: 30,
    sold: 12,
    status: "Upcoming",
  },
  {
    slug: "cv-bootcamp-replay",
    title: "CV Bootcamp Replay",
    summary: "A replay and downloadable workbook for students who missed the live workshop.",
    startsAt: "2026-03-01T18:00:00.000Z",
    endsAt: "2026-03-01T20:00:00.000Z",
    pricePence: 1900,
    seatLimit: 999,
    sold: 84,
    status: "Past",
  },
];

export const testimonials = [
  {
    name: "Neha R.",
    role: "Graduate Analyst",
    university: "University of Birmingham",
    quote: "The advice was practical, kind, and very honest. My CV finally sounded like someone UK employers would actually want to interview.",
    service: "CV Review",
  },
  {
    name: "Aman G.",
    role: "Business Operations Associate",
    university: "University of Manchester",
    quote: "I stopped applying randomly and started applying with purpose. That shift changed everything for me.",
    service: "Career Guidance",
  },
  {
    name: "Ritika S.",
    role: "Graduate Consultant",
    university: "University of Warwick",
    quote: "The interview coaching helped me sound more grounded and confident without feeling rehearsed.",
    service: "Interview Prep",
  },
];

export const faqs = [
  {
    question: "Do you work mainly with international students?",
    answer: "Yes. The core audience is international students and graduates in the UK, especially Indian students navigating the graduate market, profile building, and visa-aware career decisions.",
  },
  {
    question: "Do I need to know exactly what job I want before booking?",
    answer: "No. Many students book because they need help narrowing options and understanding what is realistic for their profile and timeline.",
  },
  {
    question: "How are workshops delivered?",
    answer: "Workshops are delivered online in UK time, with optional replay access when enabled for that event.",
  },
  {
    question: "Can I upload my CV safely?",
    answer: "Yes. The upload flow is designed for private document handling, with MIME/type restrictions and storage abstraction so you can later switch to S3 or another secure provider.",
  },
];

export const blogPosts = [
  {
    slug: "uk-graduate-job-market-guide",
    title: "What the UK graduate job market looks like right now",
    excerpt: "A grounded guide to recruitment timelines, employer expectations, and where students often lose momentum.",
    topic: "Graduate Jobs",
    publishedAt: "2026-04-10T08:00:00.000Z",
    content:
      "The strongest candidates do three things early: choose a realistic role family, tailor evidence rather than responsibilities, and build a system for applications that does not collapse under pressure. International students benefit from being especially clear about strengths, timelines, and employer fit.",
  },
  {
    slug: "linkedin-profile-for-international-students",
    title: "How to make your LinkedIn profile work harder for you",
    excerpt: "A better headline, stronger About section, and useful Featured links can shift recruiter confidence quickly.",
    topic: "LinkedIn",
    publishedAt: "2026-04-04T08:00:00.000Z",
    content:
      "Your LinkedIn profile should not repeat your CV word for word. It should reinforce your direction, help recruiters understand your ambition, and make it easier for contacts to remember you.",
  },
  {
    slug: "interview-answers-that-sound-natural",
    title: "Interview answers that sound natural, not over-rehearsed",
    excerpt: "Structure matters, but sounding human matters too. Here is how to prepare without becoming robotic.",
    topic: "Interviews",
    publishedAt: "2026-03-28T08:00:00.000Z",
    content:
      "Strong interview answers balance structure with real judgment. Use clear examples, but leave room for natural delivery and reflection.",
  },
];
