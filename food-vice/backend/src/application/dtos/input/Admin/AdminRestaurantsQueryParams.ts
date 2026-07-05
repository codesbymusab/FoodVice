import { z } from 'zod'

export const adminRestaurantQuerySchema = z.object({
  status: z.string().optional(),
  flagged: z.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type AdminRestaurantQueryParams = z.infer<typeof adminRestaurantQuerySchema>

export const adminAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type AdmminAuditLogsQueryParams = z.infer<typeof adminAuditLogsQuerySchema>

export const adminUsersQuerySchema = z.object({
  role: z.enum(['user', 'moderator', 'admin']).optional(),
})

export type AdminUsersQueryParams = z.infer<typeof adminUsersQuerySchema>

export const adminCreateRestaurantSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  priceCategory: z.string().optional(),
  locationId: z.string().optional(),
})

export type AdminCreateRestDTO = z.infer<typeof adminCreateRestaurantSchema>


export const adminUpdateRestaurantSchema = adminCreateRestaurantSchema.partial()

export const adminSetUserRoleSchema = z.object({
  role: z.enum(['user', 'moderator', 'admin']),
})

export type AdminSetUserRoleDTO=z.infer<typeof adminSetUserRoleSchema>