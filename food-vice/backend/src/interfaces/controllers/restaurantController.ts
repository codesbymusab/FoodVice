const RestaurantViewModel = require('../../infrastructure/database/mongodb/models/Restaurant/RestaurantViewModel')
const mongoose = require('mongoose')

import { Request, Response } from 'express'
import GetRecommendedRestaurants from '../../application/use-cases/restaurants/GetRecommendedRest'
import GetTopRatedyRestaurants from '../../application/use-cases/restaurants/GetTopRatedRest'
import GetNearbyyRestaurants from '../../application/use-cases/restaurants/GetNearbyRest'
import GetSimilarRestaurants from '../../application/use-cases/restaurants/GetSimilarRest'
import GetCusines from '../../application/use-cases/restaurants/GetCuisines'
import GetRestaurantPhotos from '../../application/use-cases/restaurants/GetRestaurantPhotos'
import GetSavedRestaurants from '../../application/use-cases/saves/GetSavedRestaurants'
import GetTrendingRestaurants from '../../application/use-cases/restaurants/GetTrendingRestaurants'
import { PostViewParams, restCuisinesParams, RestDetailsQueryParams, RestListQueryParams } from '../../application/dtos/input/Restaurant/RestaurantQueryParams'
import  GetRestaurantDetails  from '../../application/use-cases/restaurants/GetRestaurantDetails'

export default class RestaurantController {

    constructor(
        private getRecomRest: GetRecommendedRestaurants,
        private getTopRest: GetTopRatedyRestaurants,
        private getNearRest: GetNearbyyRestaurants,
        private getRestDetails: GetRestaurantDetails,
        private getSimRest: GetSimilarRestaurants,
        private getCuis: GetCusines,
        private getPhotos: GetRestaurantPhotos,
        private getSavedRest: GetSavedRestaurants,
        private getTrendRest: GetTrendingRestaurants,


    ) {
        this.recommendedRest = this.recommendedRest.bind(this)
        this.nearbyRest = this.nearbyRest.bind(this)
        this.topRatedRest = this.topRatedRest.bind(this)
        this.similarRest = this.similarRest.bind(this)
        this.restDetails = this.restDetails.bind(this)
        this.restCuisines = this.restCuisines.bind(this)
        this.restPhotos = this.restPhotos.bind(this)
        this.savedRestaurants = this.savedRestaurants.bind(this)
        this.trendingRestaurants = this.trendingRestaurants.bind(this)
        this.postView = this.postView.bind(this)
    }

    async recommendedRest(req: Request, res: Response) {

        try {





            const userId = req.userId as string

            const result = await this.getRecomRest.execute(userId, req.validatedQuery as RestListQueryParams)

            if (result) {
                return res.status(200).json({ success: true, message: 'Recommended Restaurants', ...result });
            }

            return res.status(400).json({ success: false, message: 'Failed to load Restaurants' });


        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ success: false, message: err })
        }

    }

    async topRatedRest(req: Request, res: Response) {

        try {



            const userId = req.userId as string

            const result = await this.getTopRest.execute(userId, req.validatedQuery as RestListQueryParams)

            if (result) {
                return res.status(200).json({ success: true, message: 'Top Rated Restaurants', ...result });
            }

            return res.status(400).json({ succes: false, message: 'Failed to load Restaurants' });


        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ success: false, message: err })
        }

    }


    async nearbyRest(req: Request, res: Response) {

        try {



            const userId = req.userId as string

            const result = await this.getNearRest.execute(userId, req.validatedQuery as RestListQueryParams)

            if (result) {
                return res.status(200).json({ details: result });
            }

            return res.status(400).json({ message: 'Failed to load Restaurants' });


        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }

    }


    async restDetails(req: Request, res: Response) {



        try {

            const restId = req.params.id as string
            const userId = req.userId as string


            const restDetails = await this.getRestDetails.execute(userId, restId, req.validatedQuery as RestDetailsQueryParams)

            if (restDetails) {
                return res.status(200).json({ details: restDetails });
            }

            return res.status(400).json({ message: 'Restaurant not found' });


        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }


    }

    async similarRest(req: Request, res: Response) {


        try {

            const restId = req.params.id as string

            const result = await this.getSimRest.execute(restId, req.validatedQuery as RestListQueryParams)

            if (result) {
                return res.status(200).json({ details: result });
            }

            return res.status(400).json({ message: 'Restaurant not found' });


        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }




    }

    async restCuisines(req: Request, res: Response) {
        try {

            const {restId} = req.validatedQuery as restCuisinesParams
            const result = await this.getCuis.execute({restId})

            if (result) {
                return res.status(200).json({ result });
            }

            return res.status(400).json({ message: 'Failed to load cuisines' });
        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }
    }



    async restPhotos(req: Request, res: Response) {
        try {

            const restId = req.params.id as string
            const photos = await this.getPhotos.execute({ restId: restId })

            if (photos) {
                return res.status(200).json({ photos });
            }

            return res.status(400).json({ message: 'Failed to load reviews' });
        }
        catch (err) {
            console.error(err)
            return res.status(400).json({ message: err })
        }
    }



    async savedRestaurants(req: Request, res: Response) {
        try {
            const userId = req.userId as string

            const result = await this.getSavedRest.execute({ userId });
            res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ err: err });
        }
    }



    async trendingRestaurants(req: Request, res: Response) {
        try {

            const userId = req.userId as string
            const data = await this.getTrendRest.execute(
                userId,
                req.validatedQuery as RestListQueryParams
            );

            return res.status(200).json({ details: data });
        } catch (err) {
            console.error("trending err:", err);
            return res.status(500).json({ message: err });
        }
    };


    async postView(req: Request, res: Response) {
        try {
            const restaurantId = req.params.id;
            const { meta } = req.validatedBody as PostViewParams
            const userId = (req as any).userId
            const view = new RestaurantViewModel({
                restaurantId: new mongoose.Types.ObjectId(restaurantId),
                uid: new mongoose.Types.ObjectId(userId),
                meta: meta || {}
            });

            await view.save();
            return res.status(201).json({ message: "view recorded" });

        } catch (err) {
            console.error("postView err:", err);
            return res.status(500).json({ message: err });
        }
    };

}