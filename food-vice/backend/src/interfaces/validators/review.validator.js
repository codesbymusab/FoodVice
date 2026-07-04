
const z = require('zod');
const fileSchema = require('./file.validator');


const ratingSchema = z.object({
  food: z.coerce.number().min(0).max(5).default(0),
  service: z.coerce.number().min(0).max(5).default(0),
  ambience: z.coerce.number().min(0).max(5).default(0),
  price: z.coerce.number().min(0).max(5).default(0),
  
});



const reviewSchema = z.object({
    userId: z.string({error:"UserID is required"}),
    restaurantId: z.string({ error: 'RestaurantID is required' }),
    text: z.string({error:"Description is required"}),
    files:z.array(fileSchema).optional(),
    rating: z
    .string({error:"No rating provided"})
    .transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        throw new Error("Invalid JSON in rating field");
      }
    })
    .pipe(ratingSchema).transform((obj)=>{
        const overall=(obj.food+obj.ambience+obj.price+obj.service)/4
        return {...obj,overall}
    })
})

module.exports = reviewSchema


