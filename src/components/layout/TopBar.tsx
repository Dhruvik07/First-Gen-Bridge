import Icon from "@/components/common/Icon";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";

export default function TopBar() {
  return (
    <header className="bg-white dark:bg-gray-950 border-b border-[#E0E0E0] dark:border-gray-800 flex justify-between items-center w-full px-6 py-4 z-50 shrink-0">
      {/* Mobile: FirstBridge logo text */}
      <span className="text-xl font-black text-[#8C1D40] dark:text-white tracking-tighter lg:hidden">
        FirstBridge
      </span>

      {/* Desktop: search bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          placeholder="Search mentors, resources..."
          aria-label="Search mentors, resources"
          className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors"
        />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-4 ml-auto">
        <AccessibilityToolbar />

        <button
          type="button"
          aria-label="Notifications"
          className="text-[#8C1D40] dark:text-[#FFC627] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors p-2 rounded-full active:opacity-80"
        >
          <Icon name="notifications" />
        </button>

        <button
          type="button"
          aria-label="Help"
          className="text-[#8C1D40] dark:text-[#FFC627] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors p-2 rounded-full active:opacity-80"
        >
          <Icon name="help_outline" />
        </button>

        {/* Profile avatar placeholder with user initials */}
        <div
          className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center bg-primary-container text-on-primary-container text-sm font-bold select-none"
          aria-label="User profile"
          role="img"
        >
          JS
        </div>
      </div>
    </header>
  );
}
