
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using backend.Model;
namespace backend.Utilities.DTOs
{
  public class CommentDTO
  {
    public int Id { get; set; }
    [Required]
    public string Text { get; set; } = null!;

    public DateTime Created { get; set; }
    public DateTime LastModified { get; set; }

    public int PostId { get; set; }

    public AccountDTO Account { get; set; } = null!;

    public CommentDTO(Comment comment)
    {
      Id = comment.Id;
      Text = comment.Text;
      Created = comment.Created;
      LastModified = comment.LastModified;
      PostId = comment.PostId;
      Account = new AccountDTO(comment.Post.Account);
    }

    public static ICollection<CommentDTO> FromRepository(IEnumerable<Comment> comments)
    {
      List<CommentDTO> commentDTOs = new List<CommentDTO>();
      foreach (var comment in comments)
      {
        commentDTOs.Add(new CommentDTO(comment));
      }
      return commentDTOs;
    }
  }
}