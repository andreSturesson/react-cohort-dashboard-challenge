
using Microsoft.AspNetCore.Identity;

namespace backend.Model
{
  public class Account : IdentityUser
  {
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string ProfilePicture { get; set; } = null!;
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }

    public ICollection<Post> Posts { get; set; } = null!;
    public ICollection<Freind> Friends { get; set; } = null!;
  }
}