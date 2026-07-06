
import IMediaRepository from '../../../../application/interfaces/repositories/MediaRepository'
const Media = require('../models/MediaModel')
const mongoose = require('mongoose')

class MediaRepoImpl implements IMediaRepository {

    async save({ url, type, ownerType, ownerId, uploadedBy }: { url: string, type: 'video' | 'image', ownerType: string, ownerId: string, uploadedBy: string }): Promise<unknown> {
        const media = new Media({ url, type, ownerType, ownerId, uploadedBy });
        return await media.save();
    }

    async getByOwnerId({ ownerId, limitCount }: { ownerId: string, limitCount: number }): Promise<unknown>{

        if (limitCount === 1)
            return await Media.findOne({ ownerId: ownerId })

        return await Media.aggregate([
            { "$match": { "ownerId": new mongoose.Types.ObjectId(ownerId) } },
            { $limit: limitCount },
        ]).exec()
    }

}

export default MediaRepoImpl