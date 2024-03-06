
using System.Collections.Generic;

namespace backend.Model
{
  public class Post
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public int Likes { get; set; }
    public int Dislikes { get; set; }

    public DateTime Created { get; set; }
    public DateTime LastModified { get; set; }
    public List<Comment> Comments { get; set; } = [];
    public virtual Account Account { get; set; } = null!;
  }
}