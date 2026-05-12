export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'member' | 'viewer'
    status: 'online' | 'offline' | 'away'
}

export interface Workspace {
    id: string
    name: string
    slug: string
    members: User[]
}

export interface Project {
    id: string
    name: string
    workspaceId: string
    color: string
}

export interface Task {
    id: string
    title: string
    description: string
    status: 'todo' | 'in_progress' | 'review' | 'done'
    priority: 'urgent' | 'high' | 'normal' | 'low'
    assigneeId?: string
    dueDate?: string
    labels: string[]
    projectId: string
    createdAt: string
    updatedAt: string
    checklist: { id: string; text: string; completed: boolean }[]
    comments: { id: string; userId: string; text: string; createdAt: string }[]
    attachments: { id: string; name: string; url: string }[]
}

export const mockUsers: User[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@ex.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'admin', status: 'online' },
    { id: '2', name: 'Jamie Lee', email: 'jamie@ex.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'member', status: 'online' },
    { id: '3', name: 'Taylor Chen', email: 'taylor@ex.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'member', status: 'away' },
]

export const mockWorkspaces: Workspace[] = [
    { id: 'ws1', name: 'Acme Inc', slug: 'acme', members: mockUsers },
    { id: 'ws2', name: 'Personal', slug: 'personal', members: [mockUsers[0]] },
]

export const mockProjects: Project[] = [
    { id: 'proj1', name: 'Marketing Site', workspaceId: 'ws1', color: '#6366f1' },
    { id: 'proj2', name: 'Mobile App', workspaceId: 'ws1', color: '#10b981' },
    { id: 'proj3', name: 'Home', workspaceId: 'ws2', color: '#f59e0b' },
]

export const mockTasks: Task[] = [
    {
        id: 't1',
        title: 'Design system updates',
        description: 'Update button variants and dark mode',
        status: 'in_progress',
        priority: 'high',
        assigneeId: '1',
        dueDate: '2026-05-20',
        labels: ['design', 'ui'],
        projectId: 'proj1',
        createdAt: '2026-05-10T10:00:00Z',
        updatedAt: '2026-05-12T08:00:00Z',
        checklist: [{ id: 'c1', text: 'Prepare Figma', completed: true }, { id: 'c2', text: 'Implement Tailwind', completed: false }],
        comments: [{ id: 'cm1', userId: '2', text: 'Great start!', createdAt: '2026-05-11T09:00:00Z' }],
        attachments: [{ id: 'a1', name: 'design-system.fig', url: '#' }],
    },
    // add more tasks for all statuses
]