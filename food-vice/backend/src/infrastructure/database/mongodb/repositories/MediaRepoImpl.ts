// @ts-nocheck
import IMediaRepository from '../../../../application/interfaces/repositories/MediaRepository'
const Media = require('../models/MediaModel')
const mongoose = require('mongoose')

class MediaRepoImpl implements IMediaRepository {

    async save(mediaData) {
        const media = new Media(mediaData);
        return await media.save();
    }

    async getByOwnerId({ ownerId, limitCount = 1 }) {

        if (limitCount === 1)
            return await Media.findOne({ ownerId: ownerId })

        return await Media.aggregate([
            { "$match": { "ownerId": new mongoose.Types.ObjectId(ownerId) } },
            { $limit: limitCount },
        ]).exec()
    }

}

export default MediaRepoImpl