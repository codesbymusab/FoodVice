const ThreadRepoImpl = require('../../infrastructure/database/mongodb/repositories/ThreadRepoImpl');
const MediaRepoImpl = require('../../infrastructure/database/mongodb/repositories/MediaRepoImpl');
const StorageServiceImpl = require('../../infrastructure/services/FirebaseStorage/StorageServiceImp');

const threadRepo = new ThreadRepoImpl();
const mediaRepo = new MediaRepoImpl();
const storageService = new StorageServiceImpl();

exports.createThread = async (req, res) => {
  try {


    const { communityId, title, content, topics } = req.body;
    


    let mediaIds = [];
    
    // Handle media uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await storageService.uploadFile(file, 'threads');
        const media = await mediaRepo.save({
          url,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video',
          ownerType: 'thread',
          ownerId: null,
          uploadedBy: req.userId
        });
        mediaIds.push(media._id);
      }
    }

    const threadData = {
      uid: req.userId,
      communityId,
      title,
      content,
      topics: topics ?? [],
      media: mediaIds 
    };

    const thread = await threadRepo.create(threadData);

    
    if (mediaIds.length > 0) {
      await require('mongoose').model('Media').updateMany(
        { _id: { $in: mediaIds } },
        { ownerId: thread._id }
      );
    }

    return res.status(201).json(thread);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getThreadsByCommunity = async (req, res) => {
  try {
    const { search, topics } = req.query;
    const topicIds = topics ? topics.split(',').filter(id => id) : [];
    const threads = await threadRepo.findByCommunity(req.params.communityId, search, topicIds);
    return res.status(200).json(threads);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllThreads = async (req, res) => {
  try {
    const { search, topics } = req.query;
    const topicIds = topics ? topics.split(',').filter(id => id) : [];
    const threads = await threadRepo.findAll(search,topicIds);
    return res.status(200).json(threads);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getThreadById = async (req, res) => {
  try {
    const thread = await threadRepo.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    return res.status(200).json(thread);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.likeThread = async (req, res) => {
  try {
    const thread = await threadRepo.toggleLike(req.params.id, req.userId);
    return res.status(200).json(thread);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.dislikeThread = async (req, res) => {
  try {
    const thread = await threadRepo.toggleDislike(req.params.id, req.userId);
    return res.status(200).json(thread);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    const comment = await threadRepo.toggleCommentLike(req.params.commentId, req.userId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    let mediaIds = [];

    // Handle media uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await storageService.uploadFile(file, 'comments');
        const media = await mediaRepo.save({
          url,
          type: file.mimetype.startsWith('image/') ? 'image' : 'video',
          ownerType: 'thread',
          ownerId: req.params.id, // Thread ID
          uploadedBy: req.userId
        });
        mediaIds.push(media._id);
      }
    }

    const commentData = {
      uid: req.userId,
      threadId: req.params.id,
      content,
      media: mediaIds
    };

    const comment = await threadRepo.addComment(commentData);
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await threadRepo.getComments(req.params.id);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
