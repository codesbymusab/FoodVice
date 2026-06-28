import {describe,it,expect} from 'vitest'
import ReelRepoImpl from '../infrastructure/database/mongodb/repositories/ReelRepoImpl'
const { cursorPaginateReels } = require('../shared/utils/cursorPagination')
const GetRecentReels = require('../application/use-cases/reels/GetRecentReels')
const mongodbConfig = require('../infrastructure/database/mongodb/config/db')
const dotenv = require('dotenv')
const mongoose=require('mongoose')
const ObjectId=mongoose.Types.ObjectId

const data= [
   {
            "_id": "69fd9b153c2ed13ff8559dbb",
            "title": "Ao Jashan Manaen at Jashan Restaurant",
            "description": "Celebrate with friends and family at Jashan Restaurant Lahore — festive vibes and great food.",
            "views": 75,
            "tags": [
                {
                    "_id": "69fb52d7ad8d4bc2082af40a",
                    "name": "jashan"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb52d7ad8d4bc2082af40b",
                    "name": "restaurant"
                }
            ],
            "createdAt": "2026-05-08T08:13:09.020Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227979357-9.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=Fj16Dc6xrq%2BfJRkl24u3A4ALVKF%2B9n0hU2ezx7aZr60f14sO8XOkTIBw0D5QQSukPse0AM7gzUenKfNsobowp0hkgH%2BQhJeO%2ByaJdBx9P2kUUHUuflNxtHT1mAJURSrYPJ3q4ig4MgFpKo74n2Ydp0UJUudw3bWWC8gkejkKFFrxNWpUgzUO6fz5JKM3WEU2mVCGotUVHJPFNHmklNCtI1K7OLOV3pVhG6WCZUMUJbHRB8XqFwGrfDLYeQg01GCtTWVsEJGET8E64niVfA9y1S79VQzuXOR8nyA2J%2FjDWMzjPnb%2BRJkBpAM0KLYaiUN7RzbqYrHvthFm2XIYgYwsMw%3D%3D",
            "likeCount": 3,
            "commentCount": 1,
            "saveCount": 2,
            "isLikedByUser": true,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9b038fce9ec27eadde7f",
            "title": "Chinese Food Hits Different at The Great Blend",
            "description": "Bold Chinese flavors at The Great Blend, Valencia Lahore — food that truly hits different.",
            "views": 33,
            "tags": [
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                },
                {
                    "_id": "69fb52c9ad8d4bc2082af407",
                    "name": "chinese"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5244ad8d4bc2082af3f3",
                    "name": "foodie"
                },
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                }
            ],
            "createdAt": "2026-05-08T08:12:51.461Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227954330-8.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=TxDUYzzFRis%2F%2F0V3s6Eqz7AaJV6Ula9l82hl8T34IxCEvfWZNnBdv8EWYXiWJt3k5eKfQiiEOo2dHk%2FGKaxwuB6f%2Bir8c2wS50i2o3QaP5XLa8gPKeQY7F%2B9jBpasH%2FQThzjoMFXTCv12CbLSalKbQFsuPUXKsLy4OpwaUYkf4BCRE3cDoqIrD0MPZpTAxMhAnvPZBKSOdvG6FjDazM6F9%2Fa9%2FXbarlBTjMebKQ0xso3DCRMReKMeCZYFOBlhfPqDc47w84r%2Fj0yZ8tnw%2ByrANdJH8rQWaSNIWnbmzWbjNGEK%2BcpVwH%2BImSyQP1na%2BqysvSkzaZ25uiPRsX0K%2BjTuw%3D%3D",
            "likeCount": 1,
            "commentCount": 1,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9af28fce9ec27eadde7d",
            "title": "Best Momos in Lahore",
            "description": "Discover the tastiest Momos in Lahore — a fusion of flavors loved by locals.",
            "views": 24,
            "tags": [
                {
                    "_id": "69fb5284ad8d4bc2082af3fa",
                    "name": "streetfood"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb52b4ad8d4bc2082af404",
                    "name": "momos"
                }
            ],
            "createdAt": "2026-05-08T08:12:34.018Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227945922-7.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=UzWTcme32ygC3Elyni8ojPlGUvbkrwxOv4hnFUI5xw%2BddM2IkqvgXPsezpOFhQYWW7dGgge2JtG9j50aFh%2Bsm4SEUq2IxRBA1pED9Bi8SN3yow2O9%2B8I1UaDzC5P7oZJ%2FUXIgw5t3q7mTdkUXOpz%2FE7gd2XrxZkmFT%2FRH5zA9SKDn%2FyZCGB8FzZ3xYZO%2FAbznXxNitUtza3bPKRHlqJoAZX2Lva3MQzPYjONrzhSYmTmL4ek9h5F5PlluxMj18C%2BKVLPMPIfiWlordd0ChHoQ27zpEl7%2Fb3hAZS3gg%2Fo8KqiugMHhG6qIE5%2BlTAPVY8RZS5rM55LYVRq%2BmYBVlTu%2Fg%3D%3D",
            "likeCount": 2,
            "commentCount": 1,
            "saveCount": 2,
            "isLikedByUser": true,
            "isSavedByUser": true
        },
        {
            "_id": "69fd9ae93c2ed13ff8559db5",
            "title": "Haveli Restaurant Lahore",
            "description": "Traditional Lahori cuisine with stunning views at Haveli Restaurant Lahore.",
            "views": 12,
            "tags": [
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                },
                {
                    "_id": "69fb52a5ad8d4bc2082af401",
                    "name": "haveli"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                }
            ],
            "createdAt": "2026-05-08T08:12:25.710Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227939935-6.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=LogDLqCAC6Jbz5aQQj8C4mARLvcsx7Wu9pUMqPoq4WpD8VQ9t5lDfE%2FMvXTc7U9q%2FLh9W8%2FXEjhx4r9S7gLO6IDQ0czVb1UwwlFBCYPTpOAIDhDBGm6ew79UwDuRAA4dHu%2FF7pU87fMrPCTsYT4wNoBVecqI4nSmjbypG1n3m0cIP%2FsiJfu1ZYSndDjYM2yXL5PpvqirfzzegNSP44AHAvlBMDrMAU7MzSM%2BOzResEvzbO6R%2BLOyNZCUE4NLXAPH%2BddcOcV44%2BhrH0FD2kRmWy53mw34vIveNScL0eWqXkNgZpiYB4jAAmDxtEXM%2FLTpHZewl%2BQ1czhY81pPuDSFzg%3D%3D",
            "likeCount": 1,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": true,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9ae38fce9ec27eadde79",
            "title": "ETEN Fine Dining Lahore",
            "description": "ETEN offers the best economical fine dining in Lahore — quality meets affordability.",
            "views": 12,
            "tags": [
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                },
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                }
            ],
            "createdAt": "2026-05-08T08:12:19.637Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227925552-5.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=gv%2B1PZ%2BB3bAqUliTcKqBAbxhTXgbBITY%2BWUfPZcbd%2FUov5pcLde6m%2BJC5kR%2FgUHSa%2B1aFBVqPnKQHHq3haFKESJULOyyxM0r0Iat%2Br9DMTMQW3%2FzUEVUK5RIG0RUONLfS%2FZzqPM018vfQjT5Ty6M%2FFKZSDw%2BBP5dhtH6Te2wmQ9tx%2Fd2m3asmiC9%2BZeJvg7Bn%2FeF7n%2F81NGJ%2BdCUuoV2y2l3%2FpvjbG8tPLPJ8vyEXaSv%2BwctfiaOygPO2YvJicDDCc5S%2F5bUHdF4FvcqW0UJW31rL4d251VZXzciuvOF90UzLmfVZ5fQ%2BBjQ7hxmGU23xIiGPN%2BUGFEyZXowV0ljKg%3D%3D",
            "likeCount": 0,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9ad58fce9ec27eadde77",
            "title": "Lal Qila Restaurant Lahore",
            "description": "Grand dining experience at Lal Qila Lahore — Lahori food, street food vibes, and viral taste.",
            "views": 7,
            "tags": [
                {
                    "_id": "69fb5284ad8d4bc2082af3fc",
                    "name": "lahorifood"
                },
                {
                    "_id": "69fb5284ad8d4bc2082af3fb",
                    "name": "viral"
                },
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                },
                {
                    "_id": "69fb5284ad8d4bc2082af3fa",
                    "name": "streetfood"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                },
                {
                    "_id": "69fb5244ad8d4bc2082af3f3",
                    "name": "foodie"
                }
            ],
            "createdAt": "2026-05-08T08:12:05.306Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227900408-4.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=Se6w%2FMU3CSk6WGHkUCv5A086udXodh8mP9W2Gxrv3goyBi8DhDIV9WTltZXjUWOC5jNXtiUArIrOhYejHR8JLEcgtkPj6FUmi1ptUEuFa1V%2FQJ8IH1M6hXSiQUCXBpyL0oSHUKRRw3tpRWC5FSjw%2BgBjhY6vwhB0%2B4hw5oPKCyiJD2ZwR%2BDS1wGHwfIslXVp%2BwCYbuFXb2A26N3%2BR2dNvAVXUFp%2FyP252hJuJA4OsiqPAqR%2FaHzohVSVrSOrbTKtb1b7l59RsIIepIgvQj4SnwIve6CXHy9Z3Vk8EnpU4BZ7q0ZAH8tKmUWvHyyArH99Jnvmzq%2BjUOQIKOdYgDDxIg%3D%3D",
            "likeCount": 0,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9abb3c2ed13ff8559daf",
            "title": "HN Foods Authentic Desi Cuisine",
            "description": "Authentic Desi flavors served fresh at HN Foods Lahore.",
            "views": 10,
            "tags": [
                {
                    "_id": "69fb525bad8d4bc2082af3f7",
                    "name": "desi"
                },
                {
                    "_id": "69fb525bad8d4bc2082af3f6",
                    "name": "authentic"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                }
            ],
            "createdAt": "2026-05-08T08:11:39.416Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227877829-3.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=KdqDkcgqLJi0P%2BR25B%2FhPHErYe8FApzR%2B%2BClFPUKF1l9DrbFJrGAjLytfsjMu6bStL6RzVeZmDMzP0xW9%2B8C73%2F9UlPdRR5%2F0VEsFHxUPEsXQsFFo6GsedjDJPQLeN3eOTBHIVfWBzGolqcRc2XiMMWrMsvzjY8XhaGlmVYezI3NHFGQBRoYnvkNEAhUW5jVZopmYWfWlH1zEznYXV%2F9OjkbduXkEB1%2F4A4y3Wc168gS8KJVKyAlhycVuayA1KFqIi%2FnYyILb2v3vVeFVEUXok7JRdQ6yTpw6cZz8fFNTK%2FN9S2lCMszD0f4%2B7x4ceP7BJ5kOpbVhL%2BxWxtLmWCamg%3D%3D",
            "likeCount": 0,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9aa53c2ed13ff8559dad",
            "title": "The Best Gulab Jamun by Usman Sweets",
            "description": "Soft, syrupy Gulab Jamun from Usman Sweets Township Lahore — a dessert lover’s dream.",
            "views": 9,
            "tags": [
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5244ad8d4bc2082af3f3",
                    "name": "foodie"
                },
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                }
            ],
            "createdAt": "2026-05-08T08:11:17.534Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227868540-2.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=Q74BAOLJ6kqNVXZqNPStpptQNhEum0b3XQGCOtlVNWQoi%2BbRer7p%2BDURLEH0jDI8typOC0bwQFAI%2FRHjG1693jL1tXuuLC1chB78PLfvBDX6rgQ00ycp%2BXJMGKSa0AJCFlJ%2F0YlPiviLNpVBJ5GPGj%2F6N2OOVeXVmq2oB8MCEaGMNtdukhzw9MRoQxFXT%2BxwJpUjN9FhL6NRMU6O9f80%2FQqvMwOA16mbvRB3%2BFrFZ85tkvP4Dw5V%2B%2FRjBHSrE%2BsSr38lWczH6w7UpEO2mIA7PcXMtsTUKH3CG8CC6M1n6%2FKrV5A0cQImEDZ6ZlJMmRDdqVRjOpk2UxGCrIhvjUiIMA%3D%3D",
            "likeCount": 0,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        },
        {
            "_id": "69fd9a9c3c2ed13ff8559dab",
            "title": "Philadelphia Cheesesteak Sandwiches",
            "description": "Juicy beef and melted cheese — authentic Philly cheesesteak vibes captured in Lahore.",
            "views": 6,
            "tags": [
                {
                    "_id": "69fb5237ad8d4bc2082af3ed",
                    "name": "vlog"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ef",
                    "name": "trending"
                },
                {
                    "_id": "69fb5236ad8d4bc2082af3ea",
                    "name": "shorts"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3f0",
                    "name": "ytshorts"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3eb",
                    "name": "youtubeshorts"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ee",
                    "name": "food"
                },
                {
                    "_id": "69fb5237ad8d4bc2082af3ec",
                    "name": "lahore"
                }
            ],
            "createdAt": "2026-05-08T08:11:08.287Z",
            "user": {
                "_id": "69e1f767bf83c83874c9ddf8",
                "name": "MUHAMMAD MAISAB",
                "username": "@masab2005",
                "profilePhoto": "https://lh3.googleusercontent.com/a/ACg8ocJ6JwsmJJmRmN13bX3CCblg1obPdVDPG8wt5PDMpdS1BJircA=s96-c"
            },
            "videoUrl": "https://storage.googleapis.com/foodvice-838f6.firebasestorage.app/reels/1778227807289-1.mp4?GoogleAccessId=firebase-adminsdk-fbsvc%40foodvice-838f6.iam.gserviceaccount.com&Expires=1899226800&Signature=a9af2WBx6UFFt6OQxfB4p%2BuOsxtwJIgXbutkl6bz%2FvyEKxn5%2F676%2BzkndT3tszX%2BhfUwjXv%2Fvoq8SZkWx7vFsYWTbnn5BvoyjvS%2FxDCz9Y5EqNnnmXzA5sQZXKm%2BYFg9pSOar%2FsoBfauAh%2BP6Uunva%2FG0k2aFdDY7F38b4n2r5ONvrJpE%2FnEvClOfKRGPA9O3HBomxJwQoSjIvuzHiHqCKvtDaL0PdD03dVjmRhY0V9py5y%2B9662unNXhtysn259NSE5j97Q07DvkzJyBEXSEr3G0OOz4%2FKpfj5MMfViaiOAWYGRA%2FusnO7RPt7EC4ufnA8FyoPWyPDVOAv2CDbrQg%3D%3D",
            "likeCount": 0,
            "commentCount": 0,
            "saveCount": 0,
            "isLikedByUser": false,
            "isSavedByUser": false
        }
  ]
describe('cursor pagination', async () => {
    dotenv.config()
    await mongodbConfig.connectDB()
    const reelRepo=new ReelRepoImpl()
    const getReels = new GetRecentReels(reelRepo)

    it('returns correct first page with no cursor',async ()=>{
        const reels=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:10})
        expect(reels.data).toBeDefined()
    },10000)
    it('returns next page when cursor provided',async ()=>{
        const result=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:2,cursor:"eyJjcmVhdGVkQXQiOjE3NzgyMjc5NTQwMTh9"})
        expect(result.pagination).toMatchObject({
        "type": "cursor",
        "hasMore": true,
        "cursor": "eyJjcmVhdGVkQXQiOjE3NzgyMjc5Mzk2Mzd9",
        "limit": 2
    })
    })
    it('returns hasMore: false on last page',async ()=>{
        const reels=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:10})
        expect(reels.pagination.hasMore).toBeFalsy
    })
    it('returns empty array for empty collection',async ()=>{
        const reels=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:0})
        expect(reels.data).toHaveLength(0)
    })
    it('throws error for tampered cursor',async ()=>{
       
        await expect(getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:5,cursor:'@@@@...1234'})).rejects.toThrow('Failed to decode cursor')
    })
    it('caps limit at 100',async ()=>{
        const reels=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8",limit:200})
        expect(reels.pagination.limit).toBe(100)
    })
    it('defaults limit to 5 when not provided',async ()=>{
        const reels=await getReels.execute({userId:"69e1f767bf83c83874c9ddf8"})
        expect(reels.data.length).toBe(5)
    })
})