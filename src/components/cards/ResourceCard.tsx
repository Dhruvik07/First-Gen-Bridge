import type { ResourceCard as ResourceCardType } from "@/types";
import TagChip from "@/components/common/TagChip";
import Icon from "@/components/common/Icon";

export interface ResourceCardProps {
  resource: ResourceCardType;
  className?: string;
}

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

export default function ResourceCard({
  resource,
  className = "",
}: ResourceCardProps) {
  const approvedReviews = resource.reviews.filter((r) => r.approved);

  return (
    <div
      className={[
        "bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col",
        "hover:shadow-card-hover transition-all duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="text-headline-md text-on-surface mb-2">
        {resource.title}
      </h3>

      <p className="text-body-md text-on-surface-variant mb-3">
        {resource.plainLanguageDescription}
      </p>

      <p className="text-label-bold text-on-surface mb-1">Who it's for</p>
      <p className="text-body-md text-on-surface-variant mb-3">
        {resource.intendedAudience}
      </p>

      {/* First 2 access steps */}
      {resource.accessSteps.length > 0 && (
        <div className="mb-3">
          <p className="text-label-bold text-on-surface mb-1">How to access</p>
          <ol className="list-decimal list-inside text-body-md text-on-surface-variant space-y-1">
            {resource.accessSteps.slice(0, 2).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {resource.accessSteps.length > 2 && (
            <p className="text-label-sm text-on-surface-variant mt-1">
              +{resource.accessSteps.length - 2} more steps
            </p>
          )}
        </div>
      )}

      {/* Reviews count */}
      {approvedReviews.length > 0 && (
        <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mb-3">
          <Icon name="rate_review" size={16} />
          {approvedReviews.length} student review{approvedReviews.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Language flags */}
      {resource.availableLanguages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resource.availableLanguages.map((lang) => (
            <TagChip key={lang} label={lang} variant="secondary" icon="translate" />
          ))}
        </div>
      )}

      {/* Resource tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {resource.tags.map((tag) => (
            <TagChip
              key={tag}
              label={tagLabels[tag] ?? tag}
              variant="surface"
            />
          ))}
        </div>
      )}
    </div>
  );
}
