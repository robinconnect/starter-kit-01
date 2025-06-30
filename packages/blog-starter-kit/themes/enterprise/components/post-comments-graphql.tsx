import { useEffect, useState } from 'react';
import { useAppContext } from './contexts/appContext';
import { Button } from './button';
import { ExternalArrowSVG, HashnodeSVG } from './icons';

interface Comment {
  id: string;
  content: {
    html: string;
  };
  author: {
    id: string;
    name: string;
    profilePicture?: string;
    username: string;
  };
  dateAdded: string;
  totalReactions: number;
}

interface CommentsResponse {
  post: {
    id: string;
    comments: {
      edges: Array<{
        node: Comment;
      }>;
      totalDocuments: number;
    };
  };
}

export const PostCommentsGraphQL = () => {
  const { post } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!post) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'robinconnect.hashnode.dev';
        
        const query = `
          query GetPostComments($host: String!, $slug: String!) {
            publication(host: $host) {
              post(slug: $slug) {
                id
                comments(first: 20) {
                  edges {
                    node {
                      id
                      content {
                        html
                      }
                      author {
                        id
                        name
                        profilePicture
                        username
                      }
                      dateAdded
                      totalReactions
                    }
                  }
                  totalDocuments
                }
              }
            }
          }
        `;

        const response = await fetch('https://gql.hashnode.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: {
              host,
              slug: post.slug,
            },
          }),
        });

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Failed to fetch comments');
        }

        const commentsData = data.data?.publication?.post?.comments?.edges || [];
        setComments(commentsData.map((edge: any) => edge.node));
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError(err instanceof Error ? err.message : 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [post]);

  if (!post) return null;

  const discussionUrl = `https://${process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'robinconnect.hashnode.dev'}/${post.slug}#comments`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-col gap-5 px-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        {loading && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            Loading...
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No comments yet. Be the first to start the conversation!
          </p>
        </div>
      )}

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.author.profilePicture ? (
                    <img
                      src={comment.author.profilePicture}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{comment.author.username}
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.dateAdded)}
                    </p>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: comment.content.html }}
                  />
                  {comment.totalReactions > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        {comment.totalReactions} reaction{comment.totalReactions !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Want to join the conversation? Head over to Hashnode to add your comment.
        </p>
        <Button
          as="a"
          href={discussionUrl}
          target="_blank"
          rel="noopener noreferrer"
          icon={<HashnodeSVG className="h-5 w-5 stroke-current" />}
          label="Comment on Hashnode"
          secondaryIcon={<ExternalArrowSVG className="h-4 w-4 stroke-current" />}
          className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40"
        />
      </div>
    </div>
  );
};
