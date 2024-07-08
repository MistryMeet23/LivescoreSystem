using LiveScore.Data;
using LiveScore.Model.ViewModel;
using LiveScoring.Model;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LiveScore.Services
{
    public class ScoreHub : Hub
    {
        private readonly ITimerService _timerService;
        private readonly ApplicationDbContext _context;
        private readonly TempDbContext _tempDbContext;
        public ScoreHub(ITimerService timerService,  ApplicationDbContext context, TempDbContext tempDbContext)
        {
            _timerService = timerService;
            _context = context;
            _tempDbContext = tempDbContext;
        }

        private bool IsCoordinator(int matchGroup, int userId)
        {
            var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
            return match != null && match.MatchCoordinator == userId;
        }

        private bool IsReferee1(int matchGroup, int userId)
        {
            var match = _context.Matchss.FirstOrDefault(m => m.MatchGroup == matchGroup);
            return match != null && match.Referee1 == userId;
        }

        public async Task JoinGroup(string groupName)   
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task StartCountdown(int matchGroup, int duration)
        {
            _timerService.StartTimer(matchGroup, duration);
            await Clients.Group(matchGroup.ToString()).SendAsync("StartCountdown", duration);
        }

        public async Task StopCountdwn(int matchGroup)
        {
            _timerService.StopTimer(matchGroup);
            await Clients.Group(matchGroup.ToString()).SendAsync("StopCountdown");
        }

        public async Task PauseCountdown(int matchGroup)
        {
            _timerService.PauseTimer(matchGroup);
            await Clients.Group(matchGroup.ToString()).SendAsync("PauseCountdown");
        }

        // New method to resume the timer
        public async Task ResumeCountdown(int matchGroup)
        {
            _timerService.ResumeTimer(matchGroup);
            await Clients.Group(matchGroup.ToString()).SendAsync("ResumeCountdown");
        }

        // New method to get the last RefScore for the most recent entry
        public async Task GetLastRefScore(int matchGroup, object result)
        {
            await Clients.Group(matchGroup.ToString()).SendAsync("ReceiveLastRefScore", result);
        }
        public async Task GetTotalScore(int matchGroup)
        {
            var totalRedPoints = await _tempDbContext.TemporaryScores.SumAsync(ts => (ts.RedPoints ?? 0) + (ts.BluePanelty ?? 0));
            var totalBluePoints = await _tempDbContext.TemporaryScores.SumAsync(ts => (ts.BluePoints ?? 0) + (ts.RedPanelty ?? 0));
            var RedPanelty = await _tempDbContext.TemporaryScores.SumAsync(ts => ts.RedPanelty ?? 0);
            var BluePanelty = await _tempDbContext.TemporaryScores.SumAsync(ts => ts.BluePanelty ?? 0);

            await Clients.Group(matchGroup.ToString()).SendAsync("ReceiveTotalScore", new
            {
                totalRedPoints,
                totalBluePoints,
                RedPanelty,
                BluePanelty
            });
        }

        public async Task GetRounds(int matchGroup,int round)
        {
            await Clients.Group(matchGroup.ToString()).SendAsync("GetRounds", round);
        }

        public async Task SendRoundWinner(object roundswinner)
        {
            await Clients.All.SendAsync("ReceiveRoundWinner", roundswinner);
        }

    }
}
