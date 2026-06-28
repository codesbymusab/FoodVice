class UploadReel {
    constructor(mediaRepo,reelRepo,storageService) {
        this.mediaRepo = mediaRepo;
        this.storageService = storageService;
        this.reelRepo = reelRepo
    }

    async execute(data) {


        const { title, description, tags, userId, file } = data

        if (!userId) throw new Error('UserId required')
        if (!file) throw new Error("File required");
        if (!title) throw new Error('Title required')
        if (!description) throw new Error('Description is required')
       
        const url = await this.storageService.uploadFile(file, "reels");

        const reel = await this.reelRepo.createReel({
            title: title, description: description, tags: tags, userId: userId
        })
        

        const media = await this.mediaRepo.save({
            url,
            type: "video",
            ownerType: "reel",
            ownerId: reel._id,
            uploadedBy: userId,
        });



        return media;
    }
}

module.exports = UploadReel
