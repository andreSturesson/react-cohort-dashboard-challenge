
public record RegisterPayload(string Email, string Password, string FirstName, string LastName, string? ProfilePicture);

public record LoginPayload(string Email, string Password);

public record UpdateUserPayload(string? FirstName, string? LastName, string? ProfilePicture);

public record RefreshTokenPayload(string UserId, string RefreshToken);