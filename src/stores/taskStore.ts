import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockTasks, type Task } from '@/mock/mockData'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>(mockTasks)

    const tasksByStatus = computed(() => ({
        todo: tasks.value.filter(t => t.status === 'todo'),
        in_progress: tasks.value.filter(t => t.status === 'in_progress'),
        review: tasks.value.filter(t => t.status === 'review'),
        done: tasks.value.filter(t => t.status === 'done'),
    }))

    function moveTask(taskId: string, newStatus: Task['status']) {
        const task = tasks.value.find(t => t.id === taskId)
        if (task) task.status = newStatus
    }

    function addTask(task: Task) {
        tasks.value.push(task)
    }

    function updateTask(taskId: string, updates: Partial<Task>) {
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) Object.assign(tasks.value[index], updates)
    }

    function deleteTask(taskId: string) {
        tasks.value = tasks.value.filter(t => t.id !== taskId)
    }

    return { tasks, tasksByStatus, moveTask, addTask, updateTask, deleteTask }
})