import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref([
        { title: 'Total Tasks', value: 124, icon: 'CheckSquare', iconBg: 'bg-blue-500', trend: 12 },
        { title: 'Completed', value: 78, icon: 'Trophy', iconBg: 'bg-green-500', trend: 8 },
        { title: 'In Progress', value: 32, icon: 'Activity', iconBg: 'bg-yellow-500', trend: -3 },
        { title: 'Overdue', value: 5, icon: 'AlertTriangle', iconBg: 'bg-red-500', trend: 2 }
    ])

    const activities = ref([
        { id: 1, user: 'John', action: 'completed task "Setup project"', time: '2 hours ago', icon: 'CheckCircle' },
        { id: 2, user: 'Jane', action: 'added comment on "Design system"', time: '5 hours ago', icon: 'MessageSquare' }
    ])

    const upcomingTasks = ref([
        { id: 1, title: 'Review PR', dueDate: '2025-05-15', priority: 'high', assignees: [{ name: 'John' }] }
    ])

    const kanbanTasks = ref({
        todo: [{ id: 1, title: 'Write docs', priority: 'normal', assignees: [] }],
        in_progress: [],
        review: [],
        done: []
    })

    return { stats, activities, upcomingTasks, kanbanTasks }
})