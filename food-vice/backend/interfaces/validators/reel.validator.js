const z=require('zod')

const reelSchema=z.object({
    title: z.string({error:"Title is required"}).min(2).max(100),
    description: z.string({error:"Description is required"}).min(2).max(500,{error:"Max 500 characters"}),
    file: z.file({error:"Video not uploaded"}),
    tags: z.array(z.string({error:"Invalid Tags"})).min(0).max(10)
})

module.exports=reelSchema