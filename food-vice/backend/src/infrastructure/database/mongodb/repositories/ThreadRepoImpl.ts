// 
import IThreadRepository from '../../../../application/interfaces/repositories/ThreadRepository'
const Thread = require('../models/Community/ThreadModel');
const ThreadComment = require('../models/Community/ThreadCommentModel');

class ThreadRepoImpl implements IThreadRepository {
  async create(threadData:any): Promise<unknown> {
    const thread = new Thread(threadData);
    return await thread.save();
  }

  async findByCommunity(communityId:string, searchQuery = '', topicIds = []) {
    let query = { communityId };

    if (searchQuery) {
      (query as any).$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (topicIds.length > 0) {
      (query as any).topics = { $in: topicIds };
    }

    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 });
  }

  async findById(id:string) {
    return await Thread.findById(id).populate('uid', 'name profilePhoto').populate('media', 'url type');
  }

  async toggleLike(threadId:string, userId:string) {
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

  async toggleDislike(threadId:string, userId:string) {
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

  async addComment(commentData: any) {
    const comment = new ThreadComment(commentData);
    return await comment.save();
  }

  async toggleCommentLike(commentId: string, userId: string) {
    const comment = await ThreadComment.findById(commentId);
    if (!comment) return null;

    const likeIndex = comment.likes.findIndex((id:string) => id.toString() === userId.toString());

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    return await comment.save();
  }

  async getComments(threadId: string) {
    return await ThreadComment.find({ threadId }).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: 1 });
  }

  async findAll(searchQuery = '', topicIds = []) {

    let query = {
      status:"approved"
    };

    if (searchQuery) {
      (query as any).$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (topicIds.length > 0) {
      (query as any).topics = { $in: topicIds };
    }



    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 });
  }

  async getPending(limit = 20, filters = {}) {
    const query = { status: (filters as any).status || 'pending' };
    if ((filters as any).search) {
      (query as any).$or = [
        { title: { $regex: (filters as any).search, $options: 'i' } },
        { content: { $regex: (filters as any).search, $options: 'i' } }
      ];
    }
    return await Thread.find(query).populate('uid', 'name profilePhoto').populate('media', 'url type').sort({ createdAt: -1 }).limit(limit).lean();
  }

  async flagThread(threadId:string, userId:string, reason:string) {
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

  async moderateThread(threadId:string, moderatorId:string, action:string, note:string) {
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

export default ThreadRepoImpl;
