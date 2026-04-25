import Link from "next/link";
import WinCard from "@/components/cards/WinCard";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import type { ArchiveEntry } from "@/types";

// TODO: Replace MOCK_WINS with API call to GET /api/community/win-board
/* ── Mock win data ── */
const MOCK_WINS: { entry: ArchiveEntry; studentName?: string }[] = [
  {
    entry: {
      id: "w-1",
      studentId: "s-1",
      type: "communication_draft",
      description: "Sent my first email to a professor asking for a recommendation letter. They said yes!",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 86400000),
    },
    studentName: "Maria G.",
  },
  {
    entry: {
      id: "w-2",
      studentId: "s-2",
      type: "mentor_session",
      description: "Had my first mentor session and finally understand how to read my financial aid package.",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 172800000),
    },
  },
  {
    entry: {
      id: "w-3",
      studentId: "s-3",
      type: "community_contribution",
      description: "Helped three other first-gen students fill out their FAFSA applications this week.",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 259200000),
    },
    studentName: "Deshawn T.",
  },
  {
    entry: {
      id: "w-4",
      studentId: "s-4",
      type: "custom",
      description: "Got an A on my midterm after using the study strategies my mentor shared. First A in college!",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 345600000),
    },
    studentName: "Priya K.",
  },
  {
    entry: {
      id: "w-5",
      studentId: "s-5",
      type: "communication_draft",
      description: "Used the Communication Coach to negotiate a deadline extension. My professor was really understanding.",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 432000000),
    },
  },
  {
    entry: {
      id: "w-6",
      studentId: "s-6",
      type: "mentor_session",
      description: "Completed my first semester without dropping a single class. My mentor helped me plan my schedule.",
      sharedToWinBoard: true,
      createdAt: new Date(Date.now() - 518400000),
    },
    studentName: "Jordan M.",
  },
];

export default function WinBoardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-md">
          <div>
            <div className="flex items-center gap-3 mb-xs">
              <Icon name="emoji_events" size={36} filled className="text-secondary" />
              <h1 className="text-headline-xl text-on-surface">Win Board</h1>
            </div>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Every win matters — big or small. Celebrate your progress and cheer on your peers.
            </p>
          </div>
          <Link href="/ai-coach/communication">
            <Button variant="primary" size="lg" icon="add">
              Share a Win
            </Button>
          </Link>
        </div>

        {/* Win grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {MOCK_WINS.map(({ entry, studentName }) => (
            <WinCard key={entry.id} entry={entry} studentName={studentName} />
          ))}
        </div>

        {/* Back link */}
        <div className="mt-lg text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-label-bold text-primary-container hover:underline min-h-[44px]"
          >
            <Icon name="arrow_back" size={18} />
            Back to Community Space
          </Link>
        </div>
      </div>
    </div>
  );
}
