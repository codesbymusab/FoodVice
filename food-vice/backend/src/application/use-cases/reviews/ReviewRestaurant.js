class ReviewRestaurant {
  constructor(reviewRepo, mediaRepo,storageService) {
    this.reviewRepo = reviewRepo;
    this.mediaRepo = mediaRepo;
    this.storageService=storageService
  }

  async execute({ userId, restaurantId, text, rating, files }) {
    if (!userId || !restaurantId || !text || !rating) {
      throw new Error("userId, restaurantId, text, and rating are required");
    }

    const review = await this.reviewRepo.createReview({ userId, restaurantId, text });


    const ratingDoc = await this.reviewRepo.createRating({
      reviewId: review._id,
      ...rating,
    });


    let mediaDocs = [];
    if (files && files.length > 0) {
      for (const file of files) {
        
        const url = await this.storageService.uploadFile(file, "reviews");

        
        const mediaDoc = await this.mediaRepo.save({
          url,
          type: file.mimetype.startsWith("video") ? "video" : "image",
          ownerType: "review",
          ownerId: review._id,
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

module.exports = ReviewRestaurant;
