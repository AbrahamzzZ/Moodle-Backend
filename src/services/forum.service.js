import { callMoodleApi } from '../utils/moodleClient.js';
import { MOODLE_TOKENS } from '../config/moodleTokens.js';

export async function fetchForums(courseIds = []) {
  return callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'mod_forum_get_forums_by_courses',
    params: { courseids: courseIds },
  });
}

export async function fetchForumDiscussions(forumId) {
  return callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'mod_forum_get_forum_discussions',
    params: { forumid: forumId },
  });
}

export async function fetchDiscussionPosts(discussionId) {
  return callMoodleApi({
    token: MOODLE_TOKENS.admin,
    wsfunction: 'mod_forum_get_discussion_posts',
    params: { discussionid: discussionId },
  });
}

export async function replyToPost({ postId, message, token }) {
  return callMoodleApi({
    token,
    wsfunction: 'mod_forum_add_discussion_post',
    method: 'POST',
    params: {
      postid: Number(postId),
      message: message.replace(/<[^>]*>/g, ''),
      messageformat: 0, 
    },
  });
}

/*export async function replyToPost({ postId, message, token }) {
  if (!token) {
    throw new Error('Token de Moodle requerido');
  }

  return callMoodleApi({
    token,
    wsfunction: 'mod_forum_add_discussion_post',
    method: 'POST',
    params: {
      postid: postId,
      message,
      messageformat: 1,
    },
  });
}*/