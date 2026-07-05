import { ReviewDTO } from "../../dtos/input/Review/CreateReviewDTO";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IReviewRepository from "../../interfaces/repositories/ReviewRepository";
import IStorageService from "../../interfaces/services/StorageService";

export default class ReviewRestaurant {
  constructor(private readonly reviewRepo:IReviewRepository,private readonly mediaRepo:IMediaRepository,private readonly storageService:IStorageService) {
    
  }

  async execute(userId:string,dto:ReviewDTO) {
    
    const {restaurantId,text,rating,files}=dto
    const review = await this.reviewRepo.createReview({ userId, restaurantId, text });


    const ratingDoc = await this.reviewRepo.createRating({
      reviewId: (review as any)._id,
      ...rating,
    });


    let mediaDocs = [];
    if (files && files.length > 0) {
      for (const file of files) {
        
        const url = await this.storageService.uploadFile(file, "reviews");

        
        const mediaDoc = await this.mediaRepo.save({
          url: url as string,
          type: file.mimetype.startsWith("video") ? "video" : "image",
          ownerType: "review",
          ownerId: (review as any)._id,
          uploadedBy: userId,
        });

        mediaDocs.push(mediaDoc);
      }
    }

   
    return {
      review,
      rating: ratingDoc,
      media: mediaDocs,
    };
  }
}
