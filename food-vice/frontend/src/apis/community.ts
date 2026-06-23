// Community API functions
export interface Media {
  _id: string;
  url: string;
  type: 'image' | 'video';
  ownerType: string;
  ownerId: string;
  uploadedBy: string;
  createdAt: string;
}
export interface Community {
  _id: string;
  name: string;
  description: string;
  guidelines: string[];
  coverPhoto?: string;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  isJoined?: boolean;
}

export interface CommunityMember {
  _id: string;
  userId: string;
  communityId: string;
  role: string;
}

export interface CreateCommunityData {
  name: string;
  description: string;
  guidelines: string[];
  category: string;
  coverPhoto?: File;
}

export const API_BASE = import.meta.env.VITE_API_BASE

export async function createCommunity(data: CreateCommunityData): Promise<Community> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('guidelines', JSON.stringify(data.guidelines));
  formData.append('category', data.category);

  if (data.coverPhoto) {
    formData.append('coverPhoto', data.coverPhoto);
  }

  const response = await fetch(`${API_BASE}/community`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to create community');
  }

  return response.json();
}

export async function getCommunities(searchName?: string): Promise<Community[]> {
  const url = searchName
    ? `${API_BASE}/community?name=${encodeURIComponent(searchName)}`
    : `${API_BASE}/community`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch communities');
  }

  return response.json();
}

export async function getJoinedCommunities(): Promise<Community[]> {
  const response = await fetch(`${API_BASE}/community/joined`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch joined communities');
  }

  return response.json();
}

export async function getCommunityById(id: string): Promise<Community> {
  const response = await fetch(`${API_BASE}/community/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch community');
  }

  return response.json();
}

export async function joinCommunity(communityId: string): Promise<CommunityMember> {
  const response = await fetch(`${API_BASE}/community/${communityId}/join`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to join community');
  }

  return response.json();
}

// Thread API functions
export interface Thread {
  _id: string;
  uid: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  communityId: string;
  title: string;
  content: string;
  views: number;
  likes: string[];
  dislikes: string[];
  media:{
    _id:string,
    url:string,
    type: 'image' | 'video',
  }[],
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  isLikedByUser?: boolean;
  isDislikedByUser?: boolean;
  topics?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ThreadComment {
  _id: string;
  uid: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  threadId: string;
  content: string;
  media?: Media[];
  likes?: string[];
  createdAt: string;
}

export interface CreateThreadData {
  communityId: string;
  title: string;
  content: string;
  topics?: string[];
  media?: File[];
}

export async function createThread(data: CreateThreadData): Promise<Thread> {
  const formData = new FormData();
  formData.append('communityId', data.communityId);
  formData.append('title', data.title);
  formData.append('content', data.content);

  if (data.topics && data.topics.length > 0) {
    formData.append('topics', JSON.stringify(data.topics));
  }

  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append(`media`, file);
    });
  }

  const response = await fetch(`${API_BASE}/thread`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to create thread');
  }

  return response.json();
}

export async function getThreadsByCommunity(communityId: string, searchQuery?: string, topicIds?: string[]): Promise<Thread[]> {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);
  if (topicIds && topicIds.length > 0) params.append('topics', topicIds.join(','));

  const url = `${API_BASE}/thread/community/${communityId}${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch threads');
  }

  return response.json();
}

export async function getAllThreads(searchQuery?: string, topicIds?: string[]): Promise<Thread[]> {
  const params = new URLSearchParams();
  if (searchQuery) params.append('search', searchQuery);
  if (topicIds && topicIds.length > 0) params.append('topics', topicIds.join(','));

  const url = `${API_BASE}/thread/community/all${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch threads');
  }

  return response.json();
}

export async function getThreadById(id: string): Promise<Thread> {
  const response = await fetch(`${API_BASE}/thread/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch thread');
  }

  return response.json();
}

export async function likeThread(threadId: string): Promise<Thread> {
  const response = await fetch(`${API_BASE}/thread/${threadId}/like`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to like thread');
  }

  return response.json();
}

export async function dislikeThread(threadId: string): Promise<Thread> {
  const response = await fetch(`${API_BASE}/thread/${threadId}/dislike`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to dislike thread');
  }

  return response.json();
}

export async function addComment(threadId: string, content: string, media?: File[]): Promise<ThreadComment> {
  const formData = new FormData();
  formData.append('content', content);

  if (media && media.length > 0) {
    media.forEach((file) => {
      formData.append('media', file);
    });
  }

  const response = await fetch(`${API_BASE}/thread/${threadId}/comment`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  return response.json();
}

export async function getComments(threadId: string): Promise<ThreadComment[]> {
  const response = await fetch(`${API_BASE}/thread/${threadId}/comments`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}

export async function toggleCommentLike(commentId: string): Promise<ThreadComment> {
  const response = await fetch(`${API_BASE}/thread/comment/${commentId}/like`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to toggle comment like');
  }

  return response.json();
}

export interface Topic {
  _id: string;
  name: string;
}

export async function getTopics(): Promise<Topic[]> {
  const response = await fetch(`${API_BASE}/topics`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  return response.json();
}