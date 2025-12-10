# Build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ./Backend.csproj Backend/

RUN dotnet restore "Backend/Backend.csproj"

COPY . /src/Backend

WORKDIR /src/Backend

# Publish

RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Run

FROM mcr.microsoft.com/dotnet/aspnet:10.0

ENV ASPNETCORE_URLS=http://+:5001

EXPOSE 5001

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Backend.dll"]