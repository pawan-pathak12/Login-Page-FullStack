# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY LoginDemoPage/*.csproj ./LoginDemoPage/
RUN dotnet restore "./LoginDemoPage/LoginDemoPage.csproj"

# Copy everything else and build
COPY . .
WORKDIR /src/LoginDemoPage
RUN dotnet publish -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "LoginDemoPage.dll"]
