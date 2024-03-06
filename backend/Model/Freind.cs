
namespace backend.Model
{
  using System;
  using System.Collections.Generic;

  public class Freind
  {
    public int Id { get; set; }
    public DateTime FriendsSince { get; set; }
    public bool IsAccepted { get; set; }
    public bool IsRequested { get; set; }
    public string FriendId { get; set; } = null!;
    public Account Friend { get; set; } = null!;

  }
}