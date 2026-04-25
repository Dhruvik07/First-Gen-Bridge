import type { ResourceCard as ResourceCardType } from "@/types";
import TagChip from "@/components/common/TagChip";
import Icon from "@/components/common/Icon";
import Link from "next/link";

// TODO: Replace mock data with API call — fetch('/api/resources/[id]')
// Will use getResourceCard() from @/services/resource
/* ── Mock resource data (keyed by id) ── */
const resourceData: Record<string, ResourceCardType> = {
  "res-1": {
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
        content:
          "I was scared to ask for help but the staff was so kind. Got approved in 2 days.",
        approved: true,
        createdAt: new Date("2024-11-15"),
      },
      {
        id: "rev-2",
        studentId: "student-2",
        content:
          "This saved me when my laptop broke. Simple process, no judgment.",
        approved: true,
        createdAt: new Date("2024-10-20"),
      },
    ],
    availableLanguages: ["English", "Spanish"],
    tags: ["flexible_scheduling"],
  },
  "res-2": {
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
        content:
          "The math tutors are amazing. I went from a D to a B in one semester.",
        approved: true,
        createdAt: new Date("2024-12-01"),
      },
    ],
    availableLanguages: ["English", "Spanish", "Mandarin"],
    tags: ["evening_accessible", "asynchronous"],
  },
  "res-3": {
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
  "res-4": {
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
        content:
          "They helped me even before I had official paperwork. Very patient and understanding.",
        approved: true,
        createdAt: new Date("2024-09-10"),
      },
    ],
    availableLanguages: ["English"],
    tags: ["accommodation_pathway", "disability_specific"],
  },
};

const tagLabels: Record<string, string> = {
  visa_relevant: "Visa Relevant",
  childcare: "Childcare",
  flexible_scheduling: "Flexible Schedule",
  evening_accessible: "Evening Access",
  asynchronous: "Async",
  accommodation_pathway: "Accommodations",
  disability_specific: "Disability Support",
  crisis: "Crisis",
};

/* ── Not found state ── */
function ResourceNotFound() {
  return (
    <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-lg">
      <div className="max-w-[1200px] mx-auto px-gutter py-xl flex flex-col items-center justify-center text-center">
        <Icon name="search_off" size={64} className="text-on-surface-variant mb-4" />
        <h1 className="text-headline-md text-on-surface mb-2">Resource not found</h1>
        <p className="text-body-lg text-on-surface-variant mb-6">
          We could not find a resource with that ID. It may have been removed or the link may be incorrect.
        </p>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 bg-primary-container text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary transition-colors min-h-[44px]"
        >
          <Icon name="arrow_back" size={18} />
          Back to Resource Hub
        </Link>
      </div>
    </div>
  );
}

/* ── Page component (params is Promise-based in Next.js 15+) ── */
export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = resourceData[id];

  if (!resource) {
    return <ResourceNotFound />;
  }

  const approvedReviews = resource.reviews.filter((r) => r.approved);

  return (
    <div className="flex-1 overflow-y-auto w-full pb-24 md:pb-lg">
      <div className="max-w-[1200px] mx-auto px-gutter py-lg">
        {/* Back link */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-1 text-label-bold text-primary-container hover:underline mb-md"
        >
          <Icon name="arrow_back" size={18} />
          Back to Resource Hub
        </Link>

        {/* Resource header */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg">
          <h1 className="text-headline-lg text-on-surface mb-3">
            {resource.title}
          </h1>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tagLabels[tag] ?? tag}
                  variant="primary"
                />
              ))}
            </div>
          )}

          {/* Plain-language description */}
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            {resource.plainLanguageDescription}
          </p>
        </div>

        {/* Details grid */}
        <div className="mt-md grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Intended audience */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h2 className="text-headline-md text-on-surface mb-2 flex items-center gap-2">
              <Icon name="group" size={24} />
              Who it is for
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {resource.intendedAudience}
            </p>
          </div>

          {/* What to expect */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h2 className="text-headline-md text-on-surface mb-2 flex items-center gap-2">
              <Icon name="info" size={24} />
              What to expect
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {resource.whatToExpect}
            </p>
          </div>
        </div>

        {/* Access steps — full numbered list */}
        <div className="mt-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="checklist" size={24} />
            How to access this resource
          </h2>
          <ol className="space-y-4">
            {resource.accessSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-primary-container text-white text-label-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-body-md text-on-surface-variant pt-1">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Peer reviews */}
        <div className="mt-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md md:p-lg">
          <h2 className="text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <Icon name="rate_review" size={24} />
            Student Reviews
            {approvedReviews.length > 0 && (
              <span className="text-label-sm text-on-surface-variant font-normal">
                ({approvedReviews.length})
              </span>
            )}
          </h2>

          {approvedReviews.length > 0 ? (
            <div className="space-y-4">
              {approvedReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-outline-variant pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="text-body-md text-on-surface leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">
                    — Student review
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No reviews yet. Be the first to share your experience!
            </p>
          )}

          {/* Review submission form (static UI) */}
          <div className="mt-6 pt-6 border-t border-outline-variant">
            <h3 className="text-label-bold text-on-surface mb-3">
              Share your experience
            </h3>
            <textarea
              placeholder="How was your experience with this resource? Your review helps other first-gen students."
              aria-label="Write a review for this resource"
              rows={3}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {/* TODO: Wire to POST /api/resources/[id]/review with studentId from session */}
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 bg-primary-container text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary transition-colors min-h-[44px]"
            >
              <Icon name="send" size={18} />
              Submit Review
            </button>
            <p className="text-label-sm text-on-surface-variant mt-2">
              Reviews are checked before they appear to keep things helpful and safe.
            </p>
          </div>
        </div>

        {/* Available languages */}
        {resource.availableLanguages.length > 0 && (
          <div className="mt-md bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h2 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Icon name="translate" size={24} />
              Available Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {resource.availableLanguages.map((lang) => (
                <TagChip key={lang} label={lang} variant="secondary" icon="translate" />
              ))}
            </div>
          </div>
        )}

        {/* Gap report section */}
        <div className="mt-md bg-surface-container-high border border-outline-variant rounded-xl p-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-headline-md text-on-surface mb-1 flex items-center gap-2">
              <Icon name="flag" size={24} />
              Something missing?
            </h3>
            <p className="text-body-md text-on-surface-variant">
              If this resource does not cover what you need, let us know. Your feedback helps your school fill gaps in support.
            </p>
          </div>
          {/* TODO: Wire to POST /api/resources/gap-report with studentId and institutionId from session */}
          <button
            type="button"
            className="shrink-0 inline-flex items-center gap-2 border border-outline text-on-surface font-semibold px-5 py-2.5 rounded-lg hover:bg-surface-container-high transition-colors min-h-[44px]"
          >
            <Icon name="edit_note" size={18} />
            Submit Gap Report
          </button>
        </div>
      </div>
    </div>
  );
}
