
using backend.Db;
using backend.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
  public class CommentRepository : ICommentRepository
  {
    public readonly PostContext _context;

    public CommentRepository(PostContext context)
    {
      _context = context;
    }

    public async Task<Comment> CreateComment(Comment comment)
    {
      comment.Created = DateTime.UtcNow;
      _context.Comments.Add(comment);
      await _context.SaveChangesAsync();
      comment.Post = await _context.Posts
          .Include(p => p.Account)
          .FirstOrDefaultAsync(p => p.Id == comment.PostId);
      Console.WriteLine(comment.Post);
      Console.WriteLine(comment.Post.Account);
      return comment;
    }


    public async Task<Comment> DeleteComment(int id)
    {
      var comment = await _context.Comments
          .FirstOrDefaultAsync(c => c.Id == id);
      if (comment != null)
      {
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return comment;
      }
      throw new Exception("Comment not found");
    }

    public async Task<Comment> GetComment(int id)
    {
      var comment = await _context.Comments
          .Include(c => c.Post)
          .ThenInclude(p => p.Account)
          .FirstOrDefaultAsync(c => c.Id == id);
      if (comment == null)
      {
        return null;
      }
      return comment;
    }

    public async Task<IEnumerable<Comment>> GetComments()
    {
      return await _context.Comments.Include(c => c.Post).ThenInclude(p => p.Account).ToListAsync();
    }

    public async Task<Comment> UpdateComment(Comment comment)
    {
      var commentToUpdate = await _context.Comments
          .Include(c => c.Post)
          .ThenInclude(p => p.Account)
          .FirstOrDefaultAsync(c => c.Id == comment.Id);
      if (commentToUpdate != null)
      {
        commentToUpdate.Text = comment.Text;
        commentToUpdate.LastModified = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return commentToUpdate;
      }
      throw new Exception("Comment not found");
    }
  }
}