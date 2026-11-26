import { type Page, type Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Header Elements
  readonly searchInput: Locator;
  readonly themeToggle: Locator;
  readonly aiCopilotButton: Locator;
  readonly userProfile: Locator;
  readonly tenantAdminLabel: Locator;

  // Left Navigation Items
  readonly navHome: Locator;
  readonly navUsers: Locator;
  readonly navCourses: Locator;
  readonly navLearningPaths: Locator;
  readonly navBranches: Locator;
  readonly navSkills: Locator;
  readonly navParticipants: Locator;
  readonly navNotifications: Locator;
  readonly navCategory: Locator;
  readonly navTemplate: Locator;
  readonly navSettings: Locator;

  // KPI Cards / Headings
  readonly headingDashboard: Locator;
  readonly kpiTotalUsers: Locator;
  readonly kpiActiveCourses: Locator;
  readonly kpiCompletionRate: Locator;
  readonly kpiSkillCoverage: Locator;

  // Charts & Analytics Sections
  readonly onboardingTrendSection: Locator;
  readonly courseCompletionSection: Locator;
  readonly departmentSkillSection: Locator;

  // Quick Action Buttons
  readonly btnCreateCourse: Locator;
  readonly btnAddUser: Locator;
  readonly btnAddSkill: Locator;
  readonly btnCreateLearningPath: Locator;
  readonly btnCreateBranch: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header Elements
    this.searchInput = page
      .getByPlaceholder(/Search courses, users, reports/i)
      .or(page.getByRole('textbox', { name: /search/i }));
    this.themeToggle = page
      .locator(
        'button[aria-label*="theme" i], button:has(svg.lucide-moon), button:has(svg.lucide-sun)'
      )
      .first();
    this.aiCopilotButton = page.getByRole('button', {
      name: /AI Copilot|Copilot/i,
    });
    this.userProfile = page
      .getByText(/UserOne Admin|Tenant Administrator/i)
      .first();
    this.tenantAdminLabel = page.getByText('Tenant Administrator', {
      exact: false,
    });

    // Left Navigation Items
    this.navHome = page.getByRole('link', { name: 'Home' });
    this.navUsers = page.getByRole('link', { name: 'Users' });
    this.navCourses = page.getByRole('link', { name: 'Courses' });
    this.navLearningPaths = page.getByRole('link', { name: 'Learning Paths' });
    this.navBranches = page.getByRole('link', { name: 'Branches' });
    this.navSkills = page.getByRole('link', { name: 'Skills' });
    this.navParticipants = page.getByRole('link', { name: 'Participants' });
    this.navNotifications = page.getByRole('link', { name: 'Notifications' });
    this.navCategory = page.getByRole('link', { name: 'Category' });
    this.navTemplate = page.getByRole('link', { name: 'Template' });
    this.navSettings = page.getByRole('link', { name: 'Settings' });

    // KPI Cards / Headings
    this.headingDashboard = page.getByRole('heading', { name: 'Dashboard' });
    this.kpiTotalUsers = page.getByRole('heading', { name: 'Total Users' });
    this.kpiActiveCourses = page.getByRole('heading', { name: 'Active Courses' });
    this.kpiCompletionRate = page.getByRole('heading', {
      name: 'Completion Rate',
    });
    this.kpiSkillCoverage = page.getByRole('heading', {
      name: 'Skill Coverage Index',
    });

    // Charts & Analytics Sections
    this.onboardingTrendSection = page.getByText(
      'Participants Onboarding Trend'
    );
    this.courseCompletionSection = page.getByText(
      'Course Completion Analytics'
    );
    this.departmentSkillSection = page.getByText('Department Skill Coverage');

    // Quick Action Buttons
    this.btnCreateCourse = page.getByRole('button', { name: 'Create Course' });
    this.btnAddUser = page.getByRole('button', { name: 'Add User' });
    this.btnAddSkill = page.getByRole('button', { name: 'Add Skill' });
    this.btnCreateLearningPath = page.getByRole('button', {
      name: 'Create Learning Path',
    });
    this.btnCreateBranch = page.getByRole('button', { name: 'Create Branch' });
  }

  async goto() {
    await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  }

  async waitForDashboardLoad() {
    await this.page.waitForURL(/\/dashboard/);
    await this.kpiTotalUsers.first().waitFor({ state: 'visible' });
  }
}
