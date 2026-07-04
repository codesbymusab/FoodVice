import { z } from 'zod'  

const fileSchema = require('./file.validator');

const reelSchema = z.object({
    userId:z.string({error:"User ID is required"}),
    title: z.string({ error: "Title is required" }).min(2).max(100),
    description: z.string({ error: "Description is required" }).min(2).max(500, { error: "Max 500 characters" }),
    tags: z.string({error:"Incorrect tags format"})
    .transform((str:string) => {
      try {
        return JSON.parse(str);
      } catch {
        throw new Error("Invalid JSON in tags field");
      }
    }
    ).pipe(z.array(z.string({error:'Invalid Tag'}))).optional(),
    file:fileSchema

})

export type UploadReelDTO = z.infer<typeof reelSchema>