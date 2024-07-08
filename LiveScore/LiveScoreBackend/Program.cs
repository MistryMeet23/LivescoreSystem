    using LiveScore.Data;
    using LiveScore.Services;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;

    var builder = WebApplication.CreateBuilder(args);

    //For Bcrypt Password
    var startup = new Startup(builder.Configuration);

    startup.ConfigureServices(builder.Services);

    // Configure services
    //builder.Services.AddCors(options => 
    //{
    //    options.AddPolicy("CorsPolicy", builder =>
    //    {
    //        builder.WithOrigins("http://localhost:5174", "http://localhost:5173", "http://192.168.107.106:5173/", "http://192.168.107.106:5174/")
    //               .AllowAnyMethod()
    //               .AllowAnyHeader()
    //               .AllowCredentials();
    //    });
    //});

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddMemoryCache();



    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddDbContext<TempDbContext>(options =>
           options.UseInMemoryDatabase("TemporaryScores"));

    builder.Services.AddTransient<IEmailSender, EmailSender>();
    builder.Services.AddTransient<IImageUploader, UploadImage>();

    // Add SignalR with detailed error options
    builder.Services.AddSignalR(options =>
    {
        options.EnableDetailedErrors = true;
    });

    builder.Services.AddSingleton< ITimerService ,TimerServices>();
    //builder.Services.AddHostedService<TimerServices>();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
            };
        });
    var app = builder.Build();

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseStaticFiles();
    //app.UseCors("CorsPolicy");
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHub<ScoreHub>("/scoreHub");

    app.Run();
