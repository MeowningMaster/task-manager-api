import { TObject, TSchema } from '@sinclair/typebox'
import { FastifySchema } from 'fastify'

export interface RouteSchema extends FastifySchema {
    body?: TSchema
    querystring?: TObject
    params?: TObject
    response?: { [Key: number]: TSchema }
}
