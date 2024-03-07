# Use the official .NET Core SDK image as the base image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the remaining source code
COPY . ./

# Build the application in release mode
RUN dotnet build -c Release

# Publish the application to the "out" directory
RUN dotnet publish -c Release -o out

# Use the official .NET Core runtime image as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory in the container
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/out /app/published

# Expose the port that the application listens on
EXPOSE 5000

# Set the entry point for the container
ENTRYPOINT ["dotnet", "/app/published/backend.dll"]
