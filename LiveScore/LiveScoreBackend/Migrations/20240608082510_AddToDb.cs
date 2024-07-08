using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LiveScore.Migrations
{
    public partial class AddToDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Cid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    MinWeight = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    MaxWeight = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    MinAge = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    MaxAge = table.Column<int>(type: "int", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Cid);
                });

            migrationBuilder.CreateTable(
                name: "Coaches",
                columns: table => new
                {
                    CoachId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoachName = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CoachEmail = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    ContactNo = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    Experience = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Achievements = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coaches", x => x.CoachId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    role = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Viewerss",
                columns: table => new
                {
                    VId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    State = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Viewerss", x => x.VId);
                });

            migrationBuilder.CreateTable(
                name: "Admin",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Age = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    City = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    State = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Admin_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Athletes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AthleteName = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", maxLength: 101, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Height = table.Column<double>(type: "float", nullable: false),
                    Weight = table.Column<double>(type: "float", nullable: true),
                    City = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    State = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: false),
                    Coordinater = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Athletes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Athletes_Admin_Coordinater",
                        column: x => x.Coordinater,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Athletes_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Cid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Athletes_Coaches_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Coaches",
                        principalColumn: "CoachId");
                });

            migrationBuilder.CreateTable(
                name: "Tournaments",
                columns: table => new
                {
                    TId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TournamentName = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: false),
                    TournamentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TournamentCoordinator = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournaments", x => x.TId);
                    table.ForeignKey(
                        name: "FK_Tournaments_Admin_TournamentCoordinator",
                        column: x => x.TournamentCoordinator,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Matchss",
                columns: table => new
                {
                    MId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchStatus = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    MatchType = table.Column<string>(type: "nvarchar(101)", maxLength: 101, nullable: true),
                    MatchDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AthleteRed = table.Column<int>(type: "int", nullable: true),
                    AthleteBlue = table.Column<int>(type: "int", nullable: true),
                    NextMatchId = table.Column<int>(type: "int", nullable: true),
                    MatchGroup = table.Column<int>(type: "int", nullable: false),
                    Flag = table.Column<int>(type: "int", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    MatchCoordinator = table.Column<int>(type: "int", nullable: true),
                    Referee1 = table.Column<int>(type: "int", nullable: true),
                    Referee2 = table.Column<int>(type: "int", nullable: true),
                    Referee3 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matchss", x => x.MId);
                    table.ForeignKey(
                        name: "FK_Matchss_Admin_MatchCoordinator",
                        column: x => x.MatchCoordinator,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Admin_Referee1",
                        column: x => x.Referee1,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Admin_Referee2",
                        column: x => x.Referee2,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Admin_Referee3",
                        column: x => x.Referee3,
                        principalTable: "Admin",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Athletes_AthleteBlue",
                        column: x => x.AthleteBlue,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Athletes_AthleteRed",
                        column: x => x.AthleteRed,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Athletes_Flag",
                        column: x => x.Flag,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Cid",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matchss_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TId");
                });

            migrationBuilder.CreateTable(
                name: "Rounds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rounds = table.Column<int>(type: "int", maxLength: 11, nullable: false),
                    RoundTime = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    RedTotalScore = table.Column<int>(type: "int", nullable: true),
                    BlueTotalScore = table.Column<int>(type: "int", nullable: true),
                    RoundWinner = table.Column<int>(type: "int", nullable: true),
                    MatchId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rounds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rounds_Athletes_RoundWinner",
                        column: x => x.RoundWinner,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rounds_Matchss_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matchss",
                        principalColumn: "MId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Scores",
                columns: table => new
                {
                    ScoreId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RedPoints = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    BluePoints = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    RedPanelty = table.Column<int>(type: "int", nullable: true),
                    BluePanelty = table.Column<int>(type: "int", nullable: true),
                    ScoreTime = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Rounds = table.Column<int>(type: "int", nullable: true),
                    AthleteRed = table.Column<int>(type: "int", nullable: true),
                    AthleteBlue = table.Column<int>(type: "int", nullable: true),
                    MatchId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scores", x => x.ScoreId);
                    table.ForeignKey(
                        name: "FK_Scores_Athletes_AthleteBlue",
                        column: x => x.AthleteBlue,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Scores_Athletes_AthleteRed",
                        column: x => x.AthleteRed,
                        principalTable: "Athletes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Scores_Matchss_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matchss",
                        principalColumn: "MId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admin_RoleId",
                table: "Admin",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Athletes_CategoryId",
                table: "Athletes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Athletes_CoachId",
                table: "Athletes",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Athletes_Coordinater",
                table: "Athletes",
                column: "Coordinater");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_AthleteBlue",
                table: "Matchss",
                column: "AthleteBlue");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_AthleteRed",
                table: "Matchss",
                column: "AthleteRed");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_CategoryId",
                table: "Matchss",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_Flag",
                table: "Matchss",
                column: "Flag");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_MatchCoordinator",
                table: "Matchss",
                column: "MatchCoordinator");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_Referee1",
                table: "Matchss",
                column: "Referee1");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_Referee2",
                table: "Matchss",
                column: "Referee2");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_Referee3",
                table: "Matchss",
                column: "Referee3");

            migrationBuilder.CreateIndex(
                name: "IX_Matchss_TournamentId",
                table: "Matchss",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_Rounds_MatchId",
                table: "Rounds",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Rounds_RoundWinner",
                table: "Rounds",
                column: "RoundWinner");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_AthleteBlue",
                table: "Scores",
                column: "AthleteBlue");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_AthleteRed",
                table: "Scores",
                column: "AthleteRed");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_MatchId",
                table: "Scores",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_TournamentCoordinator",
                table: "Tournaments",
                column: "TournamentCoordinator");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rounds");

            migrationBuilder.DropTable(
                name: "Scores");

            migrationBuilder.DropTable(
                name: "Viewerss");

            migrationBuilder.DropTable(
                name: "Matchss");

            migrationBuilder.DropTable(
                name: "Athletes");

            migrationBuilder.DropTable(
                name: "Tournaments");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Coaches");

            migrationBuilder.DropTable(
                name: "Admin");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
