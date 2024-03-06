
using backend.Db;
using backend.Model;
using Microsoft.EntityFrameworkCore;
namespace backend.Repository
{
  public class PostRepository : IPostRepository
  {

    public readonly PostContext _context;

    public PostRepository(PostContext context)
    {
      _context = context;
    }
    public async Task<Post> CreatePost(Post post, string accountId)
    {
      post.Created = DateTime.UtcNow;
      post.Account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId);
      await _context.Posts.AddAsync(post);
      await _context.SaveChangesAsync();
      return post;
    }

    public async Task<Post> DeletePost(int id)
    {
      var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
      if (post != null)
      {
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return post;
      }
      throw new Exception("Post not found");
    }

    public async Task<IEnumerable<Comment>> GetComments(int postId)
    {
      var comments = _context.Comments
                .Include(c => c.Post)
                .ThenInclude(c => c.Account)
                .Where(c => c.PostId == postId);
      return await comments.ToListAsync();
    }

    public async Task<Post> GetPost(int id)
    {
      var post = await _context.Posts.Include(p => p.Account).FirstOrDefaultAsync(p => p.Id == id);
      if (post == null)
      {
        return null;
      }
      return post;
    }

    public async Task<IEnumerable<Post>> GetPosts()
    {
      return await _context.Posts.Include(p => p.Account).ToListAsync();
    }

    public async Task<Post> UpdatePost(Post post)
    {
      var postToUpdate = await _context.Posts.FirstOrDefaultAsync(p => p.Id == post.Id);
      if (postToUpdate != null)
      {
        postToUpdate.Title = post.Title;
        postToUpdate.Text = post.Text;
        postToUpdate.LastModified = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return postToUpdate;
      }
      throw new Exception("Post not found");
    }
  }
}