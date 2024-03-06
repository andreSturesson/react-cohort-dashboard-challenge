

using System;
using System.Collections.Generic;

namespace backend.Model
{
  public class Comment
  {
    public int Id { get; set; }
    public required string Text { get; set; }

    public DateTime Created { get; set; }
    public DateTime LastModified { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
  }
}