import { Task, User, Page } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: 'user-3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/40/40' },
  { id: 'user-4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
];

export const MOCK_PAGES: Page[] = [
    { id: 'page-1', title: 'Q4 Product Roadmap', type: 'page' },
    { id: 'page-2', title: 'API Design Specification v2', type: 'page' },
    { id: 'page-3', title: 'Marketing Launch Plan', type: 'page' },
    { id: 'page-4', title: 'User Research Findings', type: 'page' },
];
//text

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design the new landing page',
    priority: 'high',
    status: 'inprogress',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['design', 'web'],
    description: 'Create a Figma mockup for the new v2 landing page, focusing on conversion rates.',
    subtasks: [
        { id: 'sub-1', title: 'Create initial wireframes', completed: true },
        { id: 'sub-2', title: 'Develop component library', completed: false },
        { id: 'sub-3', title: 'Design final mockup', completed: false },
    ],
    comments: [
        { id: 'comment-3', authorId: 'user-4', content: 'Looks great so far! Can we try a version with a darker color palette?', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'task-2',
    title: 'Implement user authentication',
    priority: 'critical',
    status: 'todo',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['backend', 'security'],
    description: 'Set up JWT-based authentication for the main API.',
    subtasks: [
        { id: 'sub-4', title: 'Setup database schema', completed: true },
        { id: 'sub-5', title: 'Implement OAuth endpoints', completed: true },
        { id: 'sub-6', title: 'Write integration tests', completed: false },
    ]
  },
  {
    id: 'task-3',
    title: 'Fix the search bar bug on mobile',
    priority: 'medium',
    status: 'blocked',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['bug', 'mobile'],
    description: 'The search bar is not rendering correctly on iOS devices. Blocked by API team.',
    subtasks: [],
    comments: [
        { id: 'comment-1', authorId: 'user-1', content: "Just checking in on the status of this. Any updates from the API team?", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 'comment-2', authorId: 'user-3', content: "Still blocked. I've pinged them again.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 'task-4',
    title: 'Write documentation for the API',
    priority: 'low',
    status: 'done',
    assigneeId: 'user-4',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['docs'],
    description: 'Document all public endpoints using Swagger/OpenAPI.',
    comments: []
  },
  {
    id: 'task-5',
    title: 'Setup CI/CD pipeline',
    priority: 'high',
    status: 'todo',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['devops'],
    description: 'Configure GitHub Actions to automate testing and deployment.',
     subtasks: [
        { id: 'sub-7', title: 'Configure build step', completed: true },
        { id: 'sub-8', title: 'Configure test step', completed: false },
        { id: 'sub-9', title: 'Configure deployment to staging', completed: false },
    ]
  },
  {
    id: 'task-6',
    title: 'User testing for the new feature',
    priority: 'medium',
    status: 'inprogress',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['ux', 'research'],
    description: 'Conduct user interviews to gather feedback on the new dashboard.'
  },
  {
    id: 'task-7',
    title: 'Refactor the state management',
    priority: 'low',
    status: 'todo',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['tech-debt', 'frontend'],
    description: 'Migrate from context API to a more robust state management library.'
  },
  {
    id: 'task-8',
    title: 'Update third-party dependencies',
    priority: 'low',
    status: 'done',
    assigneeId: 'user-4',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['maintenance'],
    description: 'Run `npm update` and resolve any breaking changes.'
  },
    {
    id: 'task-9',
    title: 'Plan Q4 product roadmap',
    priority: 'critical',
    status: 'inprogress',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['planning', 'strategy'],
    description: 'Define key initiatives and epics for the upcoming quarter.'
  },
  {
    id: 'task-10',
    title: 'Onboard new marketing intern',
    priority: 'medium',
    status: 'done',
    assigneeId: 'user-4',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['hr'],
    description: 'Provide necessary training materials and access.'
  },
];
