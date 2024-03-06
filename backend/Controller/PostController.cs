
using System.Security.Claims;
using backend.Model;
using backend.Repository;
using backend.Utilities.DTOs;
using backend.Utilities.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
  public static class PostController
  {

    public static void ConfigurePostController(this WebApplication app)
    {
      var posts = app.MapGroup("/posts");
      posts.MapGet("/{postId}", GetPostById);
      posts.MapGet("", GetPosts);
      posts.MapPost("", CreatePost);
      posts.MapPut("/{postId}", UpdatePost);
      posts.MapDelete("/{postId}", DeletePost);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> GetPostById(IPostRepository repository, int postId, [FromServices] IHttpContextAccessor httpContext)
    {
      var post = await repository.GetPost(postId);
      if (post == null)
      {
        return Results.NotFound();
      }
      return TypedResults.Ok(new PostDTO(post));
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> GetPosts(IPostRepository repository)
    {
      var posts = await repository.GetPosts();
      if (posts == null)
      {
        return Results.NotFound();
      }
      return TypedResults.Ok(PostDTO.FromRepository(posts));
    }

    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize]
    public static async Task<IResult> CreatePost(IPostRepository repository, CreatePostPayload payload, [FromServices] IHttpContextAccessor httpContext)
    {
      List<string> errors = new List<string>();
      if (string.IsNullOrEmpty(payload.Title))
      {
        errors.Add("Title is required");
      }
      if (string.IsNullOrEmpty(payload.Text))
      {
        errors.Add("Text is required");
      }
      if (errors.Count > 0)
      {
        return Results.BadRequest(new Error(Status.BadRequest, errors));
      }
      var accountId = GetAccountIdFromUser(httpContext);
      var createdPost = await repository.CreatePost(new Post
      {
        Title = payload.Title,
        Text = payload.Text,
      }, accountId);
      return Results.Created($"/posts/{createdPost.Id}", new PostDTO(createdPost));
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> UpdatePost(IPostRepository repository, int postId, UpdatePostPayload payload)
    {
      var post = await repository.GetPost(postId);
      if (post == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "Post not found"));
      }

      if (!string.IsNullOrEmpty(payload.Title))
      {
        post.Title = payload.Title;
      }

      if (!string.IsNullOrEmpty(payload.Text))
      {
        post.Text = payload.Text;
      }

      if (string.IsNullOrEmpty(post.Title) && string.IsNullOrEmpty(post.Text))
      {
        return Results.BadRequest(new Error(Status.BadRequest, "Title or Text is required"));
      }

      var updatedPost = await repository.UpdatePost(post);
      return TypedResults.Ok(new PostDTO(updatedPost));
    }

    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> DeletePost(IPostRepository repository, int postId)
    {
      var post = await repository.GetPost(postId);
      if (post == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "Post not found"));
      }

      await repository.DeletePost(postId);
      return Results.NoContent();
    }

    private static string GetAccountIdFromUser(IHttpContextAccessor httpContext)
    {
      var userId = httpContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      Console.WriteLine(userId);
      return userId;
    }

  }
}