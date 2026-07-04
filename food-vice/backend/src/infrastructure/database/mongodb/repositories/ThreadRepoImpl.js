const Thread = require('../models/Community/ThreadModel');
const ThreadComment = require('../models/Community/ThreadCommentModel');

class ThreadRepoImpl {
  async create(threadData) {
    const thread = new Thread(threadData);
    return await thread.save();
  }

  async findByCommunity(communityId, searchQuery = '', topicIds = []) {
    let query = { communityId };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (topicIds.length > 0) {
      query.topics = { $in: topicIds };
    }

    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Thread.findById(id).populate('uid', 'name profilePhoto').populate('media', 'url type');
  }

  async toggleLike(threadId, userId) {
    const thread = await Thread.findById(threadId);
    if (!thread) return null;

    const likeIndex = thread.likes.indexOf(userId);
    const dislikeIndex = thread.dislikes.indexOf(userId);

    if (likeIndex === -1) {
      thread.likes.push(userId);
      // Remove from dislikes if present
      if (dislikeIndex !== -1) {
        thread.dislikes.splice(dislikeIndex, 1);
      }
    } else {
      thread.likes.splice(likeIndex, 1);
    }
    return await thread.save();
  }

  async toggleDislike(threadId, userId) {
    const thread = await Thread.findById(threadId);
    if (!thread) return null;

    const dislikeIndex = thread.dislikes.indexOf(userId);
    const likeIndex = thread.likes.indexOf(userId);

    if (dislikeIndex === -1) {
      thread.dislikes.push(userId);
      // Remove from likes if present
      if (likeIndex !== -1) {
        thread.likes.splice(likeIndex, 1);
      }
    } else {
      thread.dislikes.splice(dislikeIndex, 1);
    }
    return await thread.save();
  }

  async addComment(commentData) {
    const comment = new ThreadComment(commentData);
    return await comment.save();
  }

  async toggleCommentLike(commentId, userId) {
    const comment = await ThreadComment.findById(commentId);
    if (!comment) return null;

    const likeIndex = comment.likes.findIndex((id) => id.toString() === userId.toString());

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    return await comment.save();
  }

  async getComments(threadId) {
    return await ThreadComment.find({ threadId }).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: 1 });
  }

  async findAll(searchQuery = '', topicIds = []) {

    let query = {
      status:"approved"
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (topicIds.length > 0) {
      query.topics = { $in: topicIds };
    }



    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 });
  }

  async getPending(limit = 20, filters = {}) {
    const query = { status: filters.status || 'pending' };
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } }
      ];
    }
    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 }).limit(limit).lean();
  }

  async flagThread(threadId, userId, reason) {
    return await Thread.findByIdAndUpdate(
      threadId,
      {
        $push: {
          flags: {
            userId: userId,
            reason,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).lean();
  }

  async moderateThread(threadId, moderatorId, action, note) {
    const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'hidden';
    return await Thread.findByIdAndUpdate(
      threadId,
      {
        status,
        $push: {
          moderationNotes: {
            moderatorId,
            action,
            note,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).lean();
  }
}

module.exports = ThreadRepoImpl;
