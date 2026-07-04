const SaveRestaurant = require('../models/Saves/SavedRestaurantModel.js')
const SaveReel = require('../models/Saves/SavedReelModel.js')

const mongoose = require('mongoose')

class SaveRepoImpl {

    async saveRestaurant({ userId, restId }) {
        return await SaveRestaurant.create({
            uid: userId,
            restaurantId: restId
        });
    }




    async unsaveRestaurant(id) {


        return await SaveRestaurant.findByIdAndDelete({ _id: id })

    }

    async getByRestId({ restId, userId }) {

        return await SaveRestaurant.findOne({
            restaurantId: restId,
            uid: userId
        })
    }


    async saveReel({ userId, reelId }) {
        return await SaveReel.create({
            uid: userId,
            reelId: reelId
        });
    }




    async unsaveReel(id) {


        return await SaveReel.findByIdAndDelete({ _id: id })

    }

    async getByReelId({ reelId, userId }) {

        return await SaveReel.findOne({
            reelId: reelId,
            uid: userId
        })
    } 

}

module.exports = SaveRepoImpl