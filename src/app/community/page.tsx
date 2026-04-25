"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import type { Channel, ChannelCategory, Post, StudyBuddyMatch } from "@/types";

// TODO: Replace CHANNELS mock data with API call to GET /api/community/channels
// TODO: Fetch recommended channels via GET /api/community/channels?recommend=true with profile params
/* ── Channel data organized by category ── */
const CHANNELS: (Channel & { recommended?: boolean })[] = [
  // Major-specific
  { id: "ch-1", name: "First-Gen CS", category: "major", description: "Computer science students supporting each other", recommended: true },
  { id: "ch-2", name: "First-Gen Pre-Med", category: "major", description: "Pre-med students sharing tips and resources" },
  { id: "ch-3", name: "First-Gen Business", category: "major", description: "Business majors navigating internships and networking" },
  // Identity
  { id: "ch-4", name: "First-Gen Immigrant", category: "identity", description: "Navigating college as an immigrant student", recommended: true },
  { id: "ch-5", name: "First-Gen Rural", category: "identity", description: "Students from rural communities" },
  { id: "ch-6", name: "First-Gen Parent", category: "identity", description: "Balancing parenting and academics" },
  { id: "ch-7", name: "First-Gen Veteran", category: "identity", description: "Veterans transitioning to college life" },
  // Challenge
  { id: "ch-8", name: "Financial Stress", category: "challenge", description: "Managing money and finding aid", recommended: true },
  { id: "ch-9", name: "Imposter Syndrome", category: "challenge", description: "You belong here — let's talk about it" },
  { id: "ch-10", name: "Family Pressure", category: "challenge", description: "Navigating family expectations" },
  { id: "ch-11", name: "Work-Life Balance", category: "challenge", description: "Juggling work, school, and life" },
];

const CATEGORY_LABELS: Record<ChannelCategory, string> = {
  major: "Major-Specific",
  identity: "Identity",
  challenge: "Challenge",
  win_board: "Win Board",
};

const CATEGORY_ICONS: Record<ChannelCategory, string> = {
  major: "school",
  identity: "diversity_3",
  challenge: "psychology",
  win_board: "emoji_events",
};

// TODO: Replace MOCK_POSTS with API call to GET /api/community/posts?channelId=<id>
/* ── Mock posts ── */
const MOCK_POSTS: Post[] = [
  {
    id: "p-1", channelId: "ch-1", authorId: "student-1", anonymous: false,
    content: "Just got my first internship offer! I had no idea how to write a cover letter six months ago. If anyone needs help with theirs, happy to share what I learned.",
    moderationStatus: "approved", createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "p-2", channelId: "ch-1", authorId: "student-2", anonymous: true,
    content: "Does anyone else feel lost in data structures? I'm the only one in my family who codes and I have nobody to ask for help at home.",
    moderationStatus: "approved", createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "p-3", channelId: "ch-1", authorId: "student-3", anonymous: false,
    content: "Free tutoring at the learning center helped me go from a C to an A in algorithms. Don't sleep on campus resources!",
    moderationStatus: "approved", createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: "p-4", channelId: "ch-1", authorId: "student-4", anonymous: true,
    content: "I almost dropped out last semester because I couldn't afford a laptop. The emergency fund office saved me. Ask if you need help — it's not shameful.",
    moderationStatus: "pending", createdAt: new Date(Date.now() - 28800000),
  },
  {
    id: "p-5", channelId: "ch-8", authorId: "student-5", anonymous: false,
    content: "Tip: FAFSA opens October 1st. Fill it out the first week — some aid is first-come, first-served. I missed out freshman year because I didn't know.",
    moderationStatus: "approved", createdAt: new Date(Date.now() - 43200000),
  },
];

// TODO: Replace MOCK_BUDDY_MATCHES with API call to POST /api/community/study-buddy
/* ── Mock study buddy matches ── */
const MOCK_BUDDY_MATCHES: (StudyBuddyMatch & { name: string })[] = [
  { studentId: "you", matchedStudentId: "s-10", major: "Computer Science", course: "CS 201", name: "Alex R." },
  { studentId: "you", matchedStudentId: "s-11", major: "Computer Science", course: "CS 201", name: "Jordan M." },
];

/* ── Mock author names ── */
const AUTHOR_NAMES: Record<string, string> = {
  "student-1": "Maria G.",
  "student-3": "Deshawn T.",
  "student-5": "Priya K.",
};

/* ── Moderation status badge ── */
function ModerationBadge({ status }: { status: Post["moderationStatus"] }) {
  const config: Record<Post["moderationStatus"], { label: string; className: string; icon: string }> = {
    approved: { label: "Approved", className: "bg-secondary-container text-on-secondary-container", icon: "check_circle" },
    pending: { label: "Pending Review", className: "bg-surface-container-high text-on-surface-variant", icon: "schedule" },
    flagged: { label: "Flagged", className: "bg-error-container text-on-error-container", icon: "flag" },
    removed: { label: "Removed", className: "bg-surface-variant text-on-surface-variant", icon: "block" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-medium ${c.className}`}>
      <Icon name={c.icon} size={12} />
      {c.label}
    </span>
  );
}

/* ── Time ago helper ── */
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Main page component ── */
export default function CommunityPage() {
  const [selectedChannelId, setSelectedChannelId] = useState("ch-1");
  const [postContent, setPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [buddyMajor, setBuddyMajor] = useState("");
  const [buddyCourse, setBuddyCourse] = useState("");
  const [buddyResults, setBuddyResults] = useState<(StudyBuddyMatch & { name: string })[] | null>(null);

  const selectedChannel = CHANNELS.find((c) => c.id === selectedChannelId)!;
  const channelPosts = posts.filter((p) => p.channelId === selectedChannelId);
  const categories: ChannelCategory[] = ["major", "identity", "challenge"];

  // TODO: Replace with POST /api/community (create post via API)
  function handleSubmitPost() {
    if (!postContent.trim()) return;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      channelId: selectedChannelId,
      authorId: "current-user",
      anonymous: isAnonymous,
      content: postContent.trim(),
      moderationStatus: "pending",
      createdAt: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostContent("");
    setIsAnonymous(false);
  }

  // TODO: Replace with POST /api/community/study-buddy (find study buddy via API)
  function handleFindBuddy() {
    if (!buddyMajor.trim() || !buddyCourse.trim()) return;
    setBuddyResults(MOCK_BUDDY_MATCHES);
  }

  return (
    <div className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-headline-xl text-on-surface mb-xs">Community Space</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Connect with peers who understand your journey. Share experiences, ask questions, and celebrate wins together.
        </p>

        {/* Weekly prompt banner */}
        <div className="mt-md bg-secondary-container rounded-xl p-md flex items-start gap-3" role="region" aria-label="Weekly community prompt">
          <Icon name="campaign" size={24} filled className="text-on-secondary-container shrink-0 mt-0.5" />
          <div>
            <p className="text-label-bold text-on-secondary-container">This week&apos;s prompt:</p>
            <p className="text-body-md text-on-secondary-container">
              What&apos;s one thing you wish you&apos;d known your first week?
            </p>
          </div>
        </div>

        {/* Main content: sidebar + posts */}
        <div className="mt-md flex flex-col lg:flex-row gap-gutter">
          {/* Channel sidebar (desktop) / tabs (mobile) */}
          <nav className="lg:w-64 shrink-0" aria-label="Community channels">
            {/* Mobile: horizontal scrollable tabs */}
            <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-2 min-w-max">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className={[
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium whitespace-nowrap transition-colors min-h-[44px]",
                      selectedChannelId === ch.id
                        ? "bg-primary-container text-white"
                        : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
                    ].join(" ")}
                  >
                    {ch.recommended && <Icon name="star" size={14} filled />}
                    {ch.name}
                  </button>
                ))}
                <Link
                  href="/community/win-board"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-label-sm font-medium whitespace-nowrap bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors min-h-[44px]"
                >
                  <Icon name="emoji_events" size={14} filled />
                  Win Board
                </Link>
              </div>
            </div>

            {/* Desktop: vertical sidebar */}
            <div className="hidden lg:block bg-surface-container-lowest border border-outline-variant rounded-xl p-sm">
              {categories.map((cat) => (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2 px-2">
                    <Icon name={CATEGORY_ICONS[cat]} size={16} className="text-on-surface-variant" />
                    <span className="text-label-bold text-on-surface-variant uppercase tracking-wide text-[0.65rem]">
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </div>
                  {CHANNELS.filter((c) => c.category === cat).map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannelId(ch.id)}
                      className={[
                        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-label-bold text-left transition-colors min-h-[44px]",
                        selectedChannelId === ch.id
                          ? "bg-primary-container text-white"
                          : "text-on-surface hover:bg-surface-container-high",
                      ].join(" ")}
                    >
                      {ch.recommended && <Icon name="star" size={14} filled className="text-secondary shrink-0" />}
                      <span className="truncate">{ch.name}</span>
                    </button>
                  ))}
                </div>
              ))}
              {/* Win Board link */}
              <div className="border-t border-outline-variant pt-3 mt-3">
                <Link
                  href="/community/win-board"
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-label-bold text-on-surface hover:bg-surface-container-high transition-colors min-h-[44px]"
                >
                  <Icon name="emoji_events" size={18} filled className="text-secondary" />
                  Win Board
                  <Icon name="arrow_forward" size={16} className="ml-auto text-on-surface-variant" />
                </Link>
              </div>
            </div>
          </nav>

          {/* Posts area */}
          <div className="flex-1 min-w-0 space-y-md">
            {/* Channel header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
                <Icon name={CATEGORY_ICONS[selectedChannel.category]} size={20} />
              </div>
              <div>
                <h2 className="text-headline-md text-on-surface">{selectedChannel.name}</h2>
                <p className="text-label-sm text-on-surface-variant">{selectedChannel.description}</p>
              </div>
            </div>

            {/* Post creation form */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <label htmlFor="post-content" className="text-label-bold text-on-surface mb-2 block">
                Share something with the community
              </label>
              <textarea
                id="post-content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind? Share a tip, ask a question, or just say hi…"
                rows={3}
                className="w-full rounded-lg border border-outline-variant bg-surface p-3 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
              <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-label-bold text-on-surface-variant flex items-center gap-1">
                    <Icon name="visibility_off" size={16} />
                    Post anonymously
                  </span>
                </label>
                <Button variant="primary" size="md" icon="send" onClick={handleSubmitPost} disabled={!postContent.trim()}>
                  Post
                </Button>
              </div>
            </div>

            {/* Post list */}
            <div className="space-y-3">
              {channelPosts.length === 0 ? (
                <div className="text-center py-xl">
                  <Icon name="forum" size={48} className="text-on-surface-variant mb-3 mx-auto block" />
                  <p className="text-body-lg text-on-surface-variant">No posts in this channel yet. Be the first to share!</p>
                </div>
              ) : (
                channelPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-card-hover transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <Icon name={post.anonymous ? "visibility_off" : "person"} size={16} className="text-on-surface-variant" />
                      </div>
                      <span className="text-label-bold text-on-surface">
                        {post.anonymous ? "Anonymous Student" : (AUTHOR_NAMES[post.authorId] ?? "You")}
                      </span>
                      <span className="text-label-sm text-on-surface-variant">·</span>
                      <time className="text-label-sm text-on-surface-variant">{timeAgo(post.createdAt)}</time>
                      <ModerationBadge status={post.moderationStatus} />
                    </div>
                    <p className="text-body-md text-on-surface">{post.content}</p>
                  </article>
                ))
              )}
            </div>

            {/* Study Buddy Matching */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="group_add" size={24} className="text-primary-container" />
                <h3 className="text-headline-md text-on-surface">Find a Study Buddy</h3>
              </div>
              <p className="text-body-md text-on-surface-variant mb-4">
                Match with peers in your major and courses for study sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <label htmlFor="buddy-major" className="text-label-bold text-on-surface mb-1 block">Major</label>
                  <input
                    id="buddy-major"
                    type="text"
                    value={buddyMajor}
                    onChange={(e) => setBuddyMajor(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="buddy-course" className="text-label-bold text-on-surface mb-1 block">Course</label>
                  <input
                    id="buddy-course"
                    type="text"
                    value={buddyCourse}
                    onChange={(e) => setBuddyCourse(e.target.value)}
                    placeholder="e.g. CS 201"
                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>
              </div>
              <Button variant="secondary" size="md" icon="search" onClick={handleFindBuddy} disabled={!buddyMajor.trim() || !buddyCourse.trim()}>
                Find Study Buddy
              </Button>

              {/* Match results */}
              {buddyResults && (
                <div className="mt-4 space-y-2">
                  <p className="text-label-bold text-on-surface">
                    <Icon name="check_circle" size={16} filled className="text-secondary inline-block align-text-bottom mr-1" />
                    {buddyResults.length} match{buddyResults.length !== 1 ? "es" : ""} found!
                  </p>
                  {buddyResults.map((match) => (
                    <div
                      key={match.matchedStudentId}
                      className="flex items-center gap-3 rounded-lg bg-surface-container-high p-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
                        <Icon name="person" size={20} />
                      </div>
                      <div>
                        <p className="text-label-bold text-on-surface">{match.name}</p>
                        <p className="text-label-sm text-on-surface-variant">{match.major} · {match.course}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">Connect</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
