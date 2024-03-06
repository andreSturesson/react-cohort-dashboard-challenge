
namespace backend.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;
  using backend.Model;
  public interface IPostRepository
  {
    Task<Post> CreatePost(Post post, string accountId);
    Task<Post> GetPost(int id);
    Task<Post> UpdatePost(Post post);
    Task<Post> DeletePost(int id);
    Task<IEnumerable<Post>> GetPosts();
    Task<IEnumerable<Comment>> GetComments(int postId);
  }
}