
namespace backend.Repository
{
  using System.Collections.Generic;
  using System.Threading.Tasks;
  using backend.Model;
  using Microsoft.AspNetCore.Identity;

  public interface ICommentRepository
  {
    Task<Comment> CreateComment(Comment comment);
    Task<Comment> GetComment(int id);
    Task<Comment> UpdateComment(Comment comment);
    Task<Comment> DeleteComment(int id);
    Task<IEnumerable<Comment>> GetComments();
  }
}
