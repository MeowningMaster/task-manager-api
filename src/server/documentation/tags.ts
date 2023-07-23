type TagObject = {
    name: string
    description?: string
}

export type TagsObjects = typeof tagsObjects
export const tagsObjects = [
    { name: 'user' },
    { name: 'task' },
    { name: 'email' },
] as const satisfies readonly TagObject[]

export type Tags = {
    [Key in TagsObjects[number]['name']]: Key
}
