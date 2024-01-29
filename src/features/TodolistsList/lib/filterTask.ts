import { TaskItemArgs } from "features/TodolistsList/api"
import { FilterType, TaskStatuses } from "shared/lib"

export const filterTasks = (tasks: Array<TaskItemArgs>, filter: FilterType): Array<TaskItemArgs> => {
    if (filter === FilterType.All) return tasks
    if (filter === FilterType.Active) return tasks.filter((t) => t.status === TaskStatuses.New)
    if (filter === FilterType.Completed) return tasks.filter((t) => t.status === TaskStatuses.Completed)
    return tasks
}
