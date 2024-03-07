
using backend.Model;

namespace backend.Utilities.DTOs
{

  public class PostDTO
  {
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Text { get; set; } = null!;
    public int Likes { get; set; }
    public int Dislikes { get; set; }
    public AccountDTO Account { get; set; } = null!;

    public PostDTO(Post post)
    {
      Id = post.Id;
      Title = post.Title;
      Text = post.Text;
      Likes = post.Likes;
      Dislikes = post.Dislikes;
      Account = new AccountDTO(post.Account);
    }

    public static ICollection<PostDTO> FromRepository(IEnumerable<Post> posts)
    {
      List<PostDTO> postDTOs = new List<PostDTO>();
      foreach (var post in posts)
      {
        postDTOs.Add(new PostDTO(post));
      }
      return postDTOs;
    }
  }
}