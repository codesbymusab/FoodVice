// 
import ISaveRepository from '../../../../application/interfaces/repositories/SaveRepository'
const SaveRestaurant = require('../models/Saves/SavedRestaurantModel.js')
const SaveReel = require('../models/Saves/SavedReelModel.js')

const mongoose = require('mongoose')

class SaveRepoImpl implements ISaveRepository {

    async saveRestaurant({ userId, restId }: { userId: string; restId: string } ): Promise<unknown> {
        return await SaveRestaurant.create({
            uid: userId,
            restaurantId: restId
        });
    }




    async unsaveRestaurant(id: string): Promise<unknown> {


        return await SaveRestaurant.findByIdAndDelete({ _id: id })

    }

    async getByRestId({ restId, userId }: { restId: string; userId: string }): Promise<unknown> {

        return await SaveRestaurant.findOne({
            restaurantId: restId,
            uid: userId
        })
    }


    async saveReel({ userId, reelId }: { userId: string; reelId: string }): Promise<unknown>    {
        return await SaveReel.create({
            uid: userId,
            reelId: reelId
        });
    }




    async unsaveReel(id: string): Promise<unknown> {


        return await SaveReel.findByIdAndDelete({ _id: id })

    }

    async getByReelId({ reelId, userId }: { reelId: string; userId: string }) {

        return await SaveReel.findOne({
            reelId: reelId,
            uid: userId
        })
    } 

}

export default SaveRepoImpl