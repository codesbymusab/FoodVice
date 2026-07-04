const Reel = require("../models/Reels/ReelModel");
const ReelTagModel = require("../models/Reels/ReelTagModel");
const mongoose = require('mongoose');
const User = require('../models/User/UserModel')

class ReelRepoImpl {

  async getReels(
    userId,
    cursor,
    limit = 5,
    source = "all",
    tag = null,

  ) {


    const pipeline = [];


    if (source === "followers") {

      pipeline.push({
        $lookup: {
          from: "followers",
          let: { reelOwnerId: "$uid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followingId", "$$reelOwnerId"] },
                    { $eq: ["$followerId", new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: "followerMatch"
        }
      });

      pipeline.push({
        $match: {
          $expr: {
            $gt: [{ $size: "$followerMatch" }, 0]
          }
        }
      });
    }


    if (source === "savedRestaurants") {

      pipeline.push({
        $lookup: {
          from: "savedrestaurants",
          let: { reelRestaurantId: "$restaurantId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$restaurantId", "$$reelRestaurantId"] },
                    { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: "savedRestaurantMatch"
        }
      });

      pipeline.push({
        $match: {
          $expr: {
            $gt: [{ $size: "$savedRestaurantMatch" }, 0]
          }
        }
      });
    }


    if (source === "saved") {

      pipeline.push({
        $lookup: {
          from: "savedreels",
          let: { reelId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$reelId", "$$reelId"] },
                    { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: "savedMatch"
        }
      });

      pipeline.push({
        $match: {
          $expr: {
            $gt: [{ $size: "$savedMatch" }, 0]
          }
        }
      });
    }


    if (source === "user") {

      pipeline.push({
        $match: {
          uid: new mongoose.Types.ObjectId(userId)
        }
      });
    }


    pipeline.push({
      $lookup: {
        from: "reeltags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
      }
    });


    if (tag && tag !== 'All') {
      pipeline.push({
        $match: {
          "tags.name": {
            $regex: new RegExp(tag, "i")
          }
        }
      });
    }

    if(cursor){
      
      pipeline.push(
        {
          $match: { createdAt: {$lte: new Date(cursor.createdAt)}}
        }
      )
    }

    pipeline.push(

      { $sort: { createdAt: -1 } },

      { $limit: limit + 1 },

      
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },


      {
        $lookup: {
          from: "reellikes",
          localField: "_id",
          foreignField: "reelId",
          as: "likes"
        }
      },


      {
        $lookup: {
          from: "reelcomments",
          localField: "_id",
          foreignField: "rid",
          as: "comments"
        }
      },


      {
        $lookup: {
          from: "savedreels",
          localField: "_id",
          foreignField: "reelId",
          as: "saves"
        }
      },

      {
        $lookup: {
          from: "media",
          let: { reelId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ownerId", "$$reelId"] },
                    { $eq: ["$ownerType", "reel"] },
                    { $eq: ["$type", "video"] }
                  ]
                }
              }
            }
          ],
          as: "media"
        }
      },

      // COMPUTED
      {
        $addFields: {

          videoUrl: {
            $arrayElemAt: ["$media.url", 0]
          },

          likeCount: {
            $size: "$likes"
          },

          commentCount: {
            $size: "$comments"
          },

          saveCount: {
            $size: "$saves"
          },

          ...(userId
            ? {
              isLikedByUser: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$likes",
                        as: "like",
                        cond: {
                          $eq: [
                            "$$like.uid",
                            new mongoose.Types.ObjectId(userId)
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },

              isSavedByUser: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$saves",
                        as: "save",
                        cond: {
                          $eq: [
                            "$$save.uid",
                            new mongoose.Types.ObjectId(userId)
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
            : {
              isLikedByUser: false,
              isSavedByUser: false
            })
        }
      },

      // PROJECT
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          createdAt: 1,
          views: 1,

          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.profilePhoto": 1,

          tags: {
            _id: 1,
            name: 1
          },

          likeCount: 1,
          commentCount: 1,
          saveCount: 1,
          isLikedByUser: 1,
          isSavedByUser: 1
        }
      }
    );

    return await Reel.aggregate(pipeline);
  }


  async findRecent(limit = 10, userId) {

    return await Reel.aggregate([

      { $sort: { createdAt: -1 } },
      { $limit: limit },


      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },


      {
        $lookup: {
          from: "reeltags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      },


      {
        $lookup: {
          from: "reellikes",
          localField: "_id",
          foreignField: "reelId",
          as: "likes"
        }
      },


      {
        $lookup: {
          from: "reelcomments",
          localField: "_id",
          foreignField: "rid",
          as: "comments"
        }
      },


      {
        $lookup: {
          from: "savedreels",
          localField: "_id",
          foreignField: "reelId",
          as: "saves"
        }
      },

      {
        $lookup: {
          from: "media",
          let: { reelId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ownerId", "$$reelId"] },
                    { $eq: ["$ownerType", "reel"] },
                    { $eq: ["$type", "video"] }
                  ]
                }
              }
            }
          ],
          as: "media"
        }
      },

      {
        $addFields: {
          videoUrl: { $arrayElemAt: ["$media.url", 0] }
        }
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          commentCount: { $size: "$comments" },
          saveCount: { $size: "$saves" },
          isLikedByUser: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$likes",
                    as: "like",
                    cond: { $eq: ["$$like.uid", new mongoose.Types.ObjectId(userId)] }
                  }
                }
              },
              0
            ]
          },
          isSavedByUser: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$saves",
                    as: "save",
                    cond: { $eq: ["$$save.uid", new mongoose.Types.ObjectId(userId)] }
                  }
                }
              },
              0
            ]
          }
        }
      },


      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          createdAt: 1,
          views: 1,
          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.profilePhoto": 1,
          tags: { _id: 1, name: 1 },
          likeCount: 1,
          commentCount: 1,
          saveCount: 1,
          isLikedByUser: 1,
          isSavedByUser: 1
        }
      }
    ]);
  }


  async createReel({ title, description, tags, userId }) {

    const tagDocs = await Promise.all(
      tags.map(async tagName => {
        let tag = await ReelTagModel.findOne({ name: tagName });
        return tag._id;
      })
    );

    return await Reel.create({
      uid: userId,
      title,
      description,
      tags: tagDocs
    });
  }

  async getPopularTags(limit = 1) {


    return await Reel.aggregate([

      { $unwind: "$tags" },


      {
        $group: {
          _id: "$tags",
          usageCount: { $sum: 1 }
        }
      },


      {
        $lookup: {
          from: "reeltags",
          localField: "_id",
          foreignField: "_id",
          as: "tag"
        }
      },
      { $unwind: "$tag" },

      { $sort: { usageCount: -1 } },


      { $limit: limit },


      {
        $project: {
          _id: "$tag._id",
          name: "$tag.name",

        }
      }
    ]);
  }



  async getById(

    reelId,
    userId
  ) {


    const pipeline = [];



    pipeline.push(

      {
        $match: {
          _id: new mongoose.Types.ObjectId(reelId)
        },
      },
      { $sort: { createdAt: -1 } },

      { $limit: 1 },


      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },


      {
        $lookup: {
          from: "reellikes",
          localField: "_id",
          foreignField: "reelId",
          as: "likes"
        }
      },


      {
        $lookup: {
          from: "reelcomments",
          localField: "_id",
          foreignField: "rid",
          as: "comments"
        }
      },


      {
        $lookup: {
          from: "savedreels",
          localField: "_id",
          foreignField: "reelId",
          as: "saves"
        }
      },
      {
        $lookup: {
          from: "reeltags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      },


      {
        $lookup: {
          from: "media",
          let: { reelId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ownerId", "$$reelId"] },
                    { $eq: ["$ownerType", "reel"] },
                    { $eq: ["$type", "video"] }
                  ]
                }
              }
            }
          ],
          as: "media"
        }
      },

      // COMPUTED
      {
        $addFields: {

          videoUrl: {
            $arrayElemAt: ["$media.url", 0]
          },

          likeCount: {
            $size: "$likes"
          },

          commentCount: {
            $size: "$comments"
          },

          saveCount: {
            $size: "$saves"
          },

          ...(userId
            ? {
              isLikedByUser: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$likes",
                        as: "like",
                        cond: {
                          $eq: [
                            "$$like.uid",
                            new mongoose.Types.ObjectId(userId)
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },

              isSavedByUser: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$saves",
                        as: "save",
                        cond: {
                          $eq: [
                            "$$save.uid",
                            new mongoose.Types.ObjectId(userId)
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
            : {
              isLikedByUser: false,
              isSavedByUser: false
            })
        }
      },

      // PROJECT
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          videoUrl: 1,
          createdAt: 1,
          views: 1,
          tags: {
            _id: 1,
            name: 1
          },
          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.profilePhoto": 1,
          likeCount: 1,
          commentCount: 1,
          saveCount: 1,
          isLikedByUser: 1,
          isSavedByUser: 1
        }
      }
    );

    return await Reel.aggregate(pipeline);
  }

  async suggestAccounts(userId, limit = 5) {
    return await User.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      {
        $lookup: {
          from: "reellikes",
          localField: "_id",
          foreignField: "uid",
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "savedreels",
          localField: "_id",
          foreignField: "uid",
          as: "saves"
        }
      },
      {
        $lookup: {
          from: "reels",
          let: { likedIds: "$likes.reelId", savedIds: "$saves.reelId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $in: ["$_id", "$$likedIds"] },
                    { $in: ["$_id", "$$savedIds"] }
                  ]
                }
              }
            },
            { $project: { tags: 1 } }
          ],
          as: "userReels"
        }
      },
      { $unwind: "$userReels" },
      { $unwind: "$userReels.tags" },
      { $group: { _id: "$_id", tagSet: { $addToSet: "$userReels.tags" } } },

      {
        $lookup: {
          from: "users",
          pipeline: [
            {
              $lookup: {
                from: "reellikes",
                localField: "_id",
                foreignField: "uid",
                as: "likes"
              }
            },
            {
              $lookup: {
                from: "savedreels",
                localField: "_id",
                foreignField: "uid",
                as: "saves"
              }
            },
            {
              $lookup: {
                from: "reels",
                let: { likedIds: "$likes.reelId", savedIds: "$saves.reelId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          { $in: ["$_id", "$$likedIds"] },
                          { $in: ["$_id", "$$savedIds"] }
                        ]
                      }
                    }
                  },
                  { $project: { tags: 1 } }
                ],
                as: "otherReels"
              }
            },
            { $unwind: "$otherReels" },
            { $unwind: "$otherReels.tags" },
            { $group: { _id: "$_id", tagSet: { $addToSet: "$otherReels.tags" } } }
          ],
          as: "others"
        }
      },

      // Step 3: Compute overlap and join user info
      {
        $project: {
          others: {
            $map: {
              input: "$others",
              as: "o",
              in: {
                userId: "$$o._id",
                overlapCount: {
                  $size: { $setIntersection: ["$tagSet", "$$o.tagSet"] }
                }
              }
            }
          }
        }
      },
      { $unwind: "$others" },

      // Lookup user info for each suggested account
      {
        $lookup: {
          from: "users",
          localField: "others.userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },

      // Final projection
      {
        $project: {
          _id: "$others.userId",
          name: "$userInfo.name",
          profilePhoto: "$userInfo.profilePhoto",
          overlapCount: "$others.overlapCount"
        }
      },
      { $sort: { overlapCount: -1 } },
      { $limit: limit }
    ]);

  }



}


module.exports = ReelRepoImpl;