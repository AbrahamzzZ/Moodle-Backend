import { callMoodleApi } from '../utils/moodleClient.js';

export async function fetchForums(courseIds = []) {
  return callMoodleApi('mod_forum_get_forums_by_courses', {
    courseids: courseIds,
  });
}

export async function fetchForumDiscussions(forumId) {
  if (!forumId) {
    throw new Error('forumId es requerido');
  }

  return callMoodleApi('mod_forum_get_forum_discussions', {
    forumid: forumId,
  });
}

export async function addDiscussion(user, forumId, subject, message) {
  const result = await callMoodleApi(
    user.token,
    'mod_forum_add_discussion',
    {
      forumid: forumId,
      subject,
      message,
    }
  );

  return result;
}

export async function replyToPost(user, postId, message) {
  const result = await callMoodleApi(
    user.token,
    'mod_forum_add_discussion',
    {
      postid: postId,
      message,
    }
  );

  return result;
}
