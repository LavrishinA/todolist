export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export enum ResponseStatuses {
    succeeded = 0,
    failed = 1,
}

export enum FilterType {
    All = "all",
    Active = "active",
    Completed = "completed",
}
