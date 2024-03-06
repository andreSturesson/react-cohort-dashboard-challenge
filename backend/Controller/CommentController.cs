
using backend.Model;
using backend.Repository;
using backend.Utilities.DTOs;
using backend.Utilities.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
  public static class CommentController
  {

    public static void ConfigureCommentController(this WebApplication app)
    {
      var comments = app.MapGroup("/comments");
      comments.MapGet("/{commentId}", GetCommentById);
      comments.MapGet("", GetComments);
      comments.MapPost("/{postId}", CreateComment);
      comments.MapDelete("/{commentId}", DeleteComment);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> GetCommentById(ICommentRepository repository, int commentId)
    {
      var comment = await repository.GetComment(commentId);
      if (comment == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "Comment not found"));
      }
      return TypedResults.Ok(new CommentDTO(comment));
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> GetComments(ICommentRepository repository)
    {
      var comments = await repository.GetComments();
      if (comments == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "Comments not found"));
      }
      return TypedResults.Ok(CommentDTO.FromRepository(comments));
    }

    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize]
    public static async Task<IResult> CreateComment(ICommentRepository repository, int postId, CreateCommentPayload payload)
    {
      Console.WriteLine("sadsad");
      List<string> errors = new List<string>();
      if (string.IsNullOrEmpty(payload.Text))
      {
        errors.Add("Text is required");
      }
      if (errors.Count > 0)
      {
        return Results.BadRequest(new Error(Status.BadRequest, errors));
      }
      var createdComment = await repository.CreateComment(new Comment
      {
        PostId = postId,
        Text = payload.Text,
      });

      return Results.Created($"/comments/{createdComment.Id}", new CommentDTO(createdComment));
    }


    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public static async Task<IResult> DeleteComment(ICommentRepository repository, int id)
    {
      var comment = await repository.GetComment(id);
      if (comment == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "Comment not found"));
      }
      await repository.DeleteComment(id);
      return Results.NoContent();
    }
  }
}