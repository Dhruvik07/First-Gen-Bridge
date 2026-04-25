import type { ResourceCard as ResourceCardType } from "@/types";
import ResourceCard from "@/components/cards/ResourceCard";
import Icon from "@/components/common/Icon";
import Link from "next/link";

// TODO: Replace mock data with API call — fetch('/api/resources?q=...&institutionId=...')
// Will use searchResources() from @/services/resource with personalization profile from session
/* ── Mock resource data with realistic first-gen content ── */
const mockResources: ResourceCardType[] = [
  {
    id: "res-1",
    institutionId: "inst-1",
    title: "Emergency Financial Aid Fund",
    plainLanguageDescription:
      "If you have an unexpected expense like a car repair, medical bill, or textbook cost, this fund can help. You can get up to $500 within 3 business days. You do not need to pay it back.",
    intendedAudience:
      "Any enrolled student facing an unexpected financial emergency. No minimum GPA required.",
    accessSteps: [
      "Go to the Financial Aid Office in Room 201 of the Student Services Building.",
      "Ask for the Emergency Aid Application — it is one page.",
      "Describe your situation in 2-3 sentences. You do not need receipts.",
      "Submit the form at the front desk or email it to emergencyaid@university.edu.",
      "You will hear back within 3 business days by email.",
    ],
    whatToExpect:
      "A staff member will review your application. They may ask one follow-up question. Most students are approved. The money goes directly to your student account or as a check.",
    reviews: [
      {
        id: "rev-1",
        studentId: "student-1",
        content: "I was scared to ask for help but the staff was so kind. Got approved in 2 days.",
        approved: true,
        createdAt: new Date("2024-11-15"),
      },
      {
        id: "rev-2",
        studentId: "student-2",
        content: "This saved me when my laptop broke. Simple process, no judgment.",
        approved: true,
        createdAt: new Date("2024-10-20"),
      },
    ],
    availableLanguages: ["English", "Spanish"],
    tags: ["flexible_scheduling"],
  },
  {
    id: "res-2",
    institutionId: "inst-1",
    title: "Free Tutoring Center",
    plainLanguageDescription:
      "Get free one-on-one or small group help with any class. Tutors are students who did well in the same courses. Walk-ins welcome, or book ahead online.",
    intendedAudience:
      "All enrolled students. Tutoring is available for most 100- and 200-level courses.",
    accessSteps: [
      "Visit the Tutoring Center on the 2nd floor of the Library.",
      "Sign in at the front desk with your student ID.",
      "Tell them which class you need help with.",
      "A tutor will work with you for up to 1 hour.",
    ],
    whatToExpect:
      "Tutors will ask what you are working on and help you understand the material. They will not do your homework for you, but they will help you figure it out.",
    reviews: [
      {
        id: "rev-3",
        studentId: "student-3",
        content: "The math tutors are amazing. I went from a D to a B in one semester.",
        approved: true,
        createdAt: new Date("2024-12-01"),
      },
    ],
    availableLanguages: ["English", "Spanish", "Mandarin"],
    tags: ["evening_accessible", "asynchronous"],
  },
  {
    id: "res-3",
    institutionId: "inst-1",
    title: "Campus Childcare Assistance Program",
    plainLanguageDescription:
      "If you are a parent, this program helps pay for childcare while you are in class or studying. You can get up to $3,000 per semester toward daycare or babysitting costs.",
    intendedAudience:
      "Student parents enrolled in at least 6 credit hours. Priority given to single parents and low-income families.",
    accessSteps: [
      "Contact the Family Resource Center at familyresources@university.edu.",
      "Fill out the Childcare Assistance Application (available online or in person).",
      "Provide proof of enrollment and your class schedule.",
      "The center will match you with approved childcare providers near campus.",
    ],
    whatToExpect:
      "Processing takes about 1-2 weeks. A coordinator will help you find childcare that fits your schedule. Payments go directly to the childcare provider.",
    reviews: [],
    availableLanguages: ["English", "Spanish"],
    tags: ["childcare", "flexible_scheduling"],
  },
  {
    id: "res-4",
    institutionId: "inst-1",
    title: "Disability Resource Center",
    plainLanguageDescription:
      "If you have a disability or health condition that affects your learning, this office helps you get accommodations like extra test time, note-taking help, or accessible materials.",
    intendedAudience:
      "Students with documented disabilities or health conditions. You can also start the process if you think you might need support but do not have documentation yet.",
    accessSteps: [
      "Call or visit the Disability Resource Center in the Student Union, Room 105.",
      "Schedule an intake meeting — this is a private conversation about your needs.",
      "Bring any documentation you have (doctor's note, IEP, etc.). If you do not have any, they can help you get started.",
      "Your coordinator will create an accommodation plan with you.",
      "Share your accommodation letter with your professors at the start of each semester.",
    ],
    whatToExpect:
      "The intake meeting is about 30 minutes. Staff are trained to be supportive and confidential. You decide which accommodations to use each semester.",
    reviews: [
      {
        id: "rev-4",
        studentId: "student-4",
        content: "They helped me even before I had official paperwork. Very patient and understanding.",
        approved: true,
        createdAt: new Date("2024-09-10"),
      },
    ],
    availableLanguages: ["English"],
    tags: ["accommodation_pathway", "disability_specific"],
  },
];

/* ── Deadline alert items ── */
const deadlineAlerts = [
  { label: "FAFSA Renewal Deadline", date: "March 1, 2025", icon: "payments" },
  { label: "Summer Housing Application", date: "April 15, 2025", icon: "home" },
  { label: "Scholarship Essay Submissions", date: "February 28, 2025", icon: "edit_note" },
];

/* ── Page component ── */
export default function ResourceHubPage() {
  const resources = mockResources;
  const hasResults = resources.length > 0;

  return (
    <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-lg">
      <div className="max-w-[1200px] mx-auto px-gutter py-lg">
        {/* Page header */}
        <h1 className="text-headline-xl text-on-surface mb-xs tracking-tight">
          Tailored Resource Hub
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Describe what you need in your own words. We will find the right campus resources for you — no jargon, no runaround.
        </p>

        {/* Natural-language search input */}
        <div className="mt-md">
          <div className="relative">
            <Icon
              name="search"
              size={22}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="search"
              placeholder="Try: &quot;I need help paying for textbooks&quot; or &quot;Where do I get a tutor for chemistry?&quot;"
              aria-label="Search resources in plain language"
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest pl-12 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>

        {/* Bento grid */}
        <div className="mt-md grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Featured resource — 8 cols */}
          <div className="col-span-1 md:col-span-8 bg-primary-container text-on-primary rounded-xl p-margin min-h-[320px] flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="inline-block bg-secondary-container text-on-secondary-container text-label-sm font-semibold px-3 py-1 rounded-full mb-4">
                Recommended for You
              </span>
              <h2 className="text-headline-lg text-white mb-2">
                Emergency Financial Aid Fund
              </h2>
              <p className="text-body-lg text-white/90 max-w-lg">
                Unexpected expense? Get up to $500 within 3 business days — no repayment needed. This fund is here for moments when life throws you a curveball.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/resources/res-1"
                className="inline-flex items-center gap-2 bg-white text-primary-container font-semibold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors min-h-[44px]"
              >
                Learn More
                <Icon name="arrow_forward" size={18} />
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors min-h-[44px]"
              >
                <Icon name="bookmark_border" size={18} />
                Save
              </button>
            </div>
          </div>

          {/* Deadline alerts — 4 cols */}
          <div className="col-span-1 md:col-span-4 bg-secondary-container text-on-secondary-container rounded-xl p-margin">
            <h3 className="text-headline-md mb-3 flex items-center gap-2">
              <Icon name="notifications_active" size={24} />
              Deadline Alerts
            </h3>
            <div className="space-y-4">
              {deadlineAlerts.map((alert) => (
                <div
                  key={alert.label}
                  className="flex items-start gap-3 bg-white/20 rounded-lg p-3"
                >
                  <Icon name={alert.icon} size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-label-bold">{alert.label}</p>
                    <p className="text-label-sm opacity-80">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category cards — 4 cols each */}
          <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-sm">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-3">
              <Icon name="school" size={24} className="text-on-primary-fixed" />
            </div>
            <h3 className="text-headline-md text-on-surface mb-1">Academic Support</h3>
            <p className="text-body-md text-on-surface-variant mb-3">
              Tutoring, study groups, writing help, and academic advising — all free.
            </p>
            <Link
              href="/resources?category=academic"
              className="inline-flex items-center gap-1 text-label-bold text-primary-container hover:underline min-h-[44px]"
            >
              Explore
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-sm">
            <div className="w-12 h-12 rounded-full bg-[#fff4cc] flex items-center justify-center mb-3">
              <Icon name="work" size={24} className="text-on-surface" />
            </div>
            <h3 className="text-headline-md text-on-surface mb-1">Career Guidance</h3>
            <p className="text-body-md text-on-surface-variant mb-3">
              Resume reviews, internship leads, interview prep, and career counseling.
            </p>
            <Link
              href="/resources?category=career"
              className="inline-flex items-center gap-1 text-label-bold text-primary-container hover:underline min-h-[44px]"
            >
              Explore
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-sm">
            <div className="w-12 h-12 rounded-full bg-[#e2e2e2] flex items-center justify-center mb-3">
              <Icon name="health_and_safety" size={24} className="text-on-surface" />
            </div>
            <h3 className="text-headline-md text-on-surface mb-1">Health &amp; Wellness</h3>
            <p className="text-body-md text-on-surface-variant mb-3">
              Counseling, health services, food pantry, and wellness programs.
            </p>
            <Link
              href="/resources?category=health"
              className="inline-flex items-center gap-1 text-label-bold text-primary-container hover:underline min-h-[44px]"
            >
              Explore
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        {/* Results section */}
        <section className="mt-lg" aria-label="Resource results">
          <h2 className="text-headline-md text-on-surface mb-sm">
            All Resources
          </h2>

          {hasResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {resources.map((resource) => (
                <Link key={resource.id} href={`/resources/${resource.id}`} className="block">
                  <ResourceCard resource={resource} />
                </Link>
              ))}
            </div>
          ) : (
            /* No-results state */
            <div className="flex flex-col items-center justify-center py-xl text-center">
              <Icon name="search_off" size={64} className="text-on-surface-variant mb-4" />
              <h3 className="text-headline-md text-on-surface mb-2">
                No resources found
              </h3>
              <p className="text-body-lg text-on-surface-variant max-w-md mb-6">
                We could not find resources matching your search. This might mean your campus does not have this resource yet. Help us fix that!
              </p>
              {/* TODO: Wire to POST /api/resources/gap-report with studentId and institutionId from session */}
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-primary-container text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary transition-colors min-h-[44px]"
              >
                <Icon name="flag" size={20} />
                Submit a Gap Report
              </button>
              <p className="text-label-sm text-on-surface-variant mt-3">
                Your report helps your school understand what students need.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
