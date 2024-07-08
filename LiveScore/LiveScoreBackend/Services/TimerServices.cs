using System;
using System.Collections.Generic;
using System.Timers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace LiveScore.Services
{
    public class TimerServices : ITimerService
    {
        private readonly IHubContext<ScoreHub> _hubContext;
        private readonly ILogger<TimerServices> _logger;
        private readonly Dictionary<int, TimerInfo> _timers = new Dictionary<int, TimerInfo>();

        public event EventHandler<int> TimerElapsed;

        public TimerServices(IHubContext<ScoreHub> hubContext, ILogger<TimerServices> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        private async void OnTimerElapsed(object sender, ElapsedEventArgs e, int matchGroup)
        {
            if (_timers.TryGetValue(matchGroup, out var timerInfo))
            {
                if (timerInfo.IsRunning && timerInfo.TimeLeft > 0)
                {
                    timerInfo.TimeLeft--;
                    await _hubContext.Clients.Group(timerInfo.MatchGroup.ToString()).SendAsync("TimerUpdate", timerInfo.TimeLeft);
                }
                else if (timerInfo.TimeLeft <= 0)
                {
                    timerInfo.IsRunning = false;
                    timerInfo.Timer.Stop();
                    timerInfo.Timer.Dispose();
                    _timers.Remove(matchGroup);

                    await _hubContext.Clients.Group(timerInfo.MatchGroup.ToString()).SendAsync("TimerEnded");
                    TimerElapsed?.Invoke(this, matchGroup);
                    _logger.LogInformation($"Timer elapsed for matchGroup: {matchGroup}");
                }
            }
        }

        public void StartTimer(int matchGroup, int duration)
        {
            if (_timers.ContainsKey(matchGroup))
            {
                _timers[matchGroup].Timer.Stop();
                _timers.Remove(matchGroup);
            }

            var timer = new System.Timers.Timer(1000);
            var timerInfo = new TimerInfo
            {
                MatchGroup = matchGroup,
                TimeLeft = duration,
                IsRunning = true,
                Timer = timer
            };

            timer.Elapsed += (sender, e) => OnTimerElapsed(sender, e, matchGroup);
            timer.Start();

            _timers[matchGroup] = timerInfo;
        }

        public void StopTimer(int matchGroup)
        {
            if (_timers.TryGetValue(matchGroup, out var timerInfo))
            {
                timerInfo.Timer.Stop();
                timerInfo.IsRunning = false;
            }
        }

        public void PauseTimer(int matchGroup)
        {
            if (_timers.TryGetValue(matchGroup, out var timerInfo) && timerInfo.IsRunning)
            {
                timerInfo.Timer.Stop();
                timerInfo.IsRunning = false;
                timerInfo.PausedTime = DateTime.UtcNow;
                timerInfo.TimeLeftWhenPaused = timerInfo.TimeLeft;
            }
        }
        public void ResumeTimer(int matchGroup)
        {
            if (_timers.TryGetValue(matchGroup, out var timerInfo) && !timerInfo.IsRunning && timerInfo.PausedTime.HasValue)
            {
                // Just resume from where it was paused
                timerInfo.Timer.Start();
                timerInfo.IsRunning = true;
            }
        }

        public TimerInfo GetTimerInfo(int matchGroup)
        {
            _timers.TryGetValue(matchGroup, out var timerInfo);
            return timerInfo;
        }
    }

    public interface ITimerService
    {
        void StartTimer(int matchGroup, int duration);
        event EventHandler<int> TimerElapsed;
        void StopTimer(int matchGroup);
        void ResumeTimer(int matchGroup);
        void PauseTimer(int matchGroup);

        TimerInfo GetTimerInfo(int matchGroup);
    }

    public class TimerInfo
    {
        public int MatchGroup { get; set; }
        public int TimeLeft { get; set; }
        public bool IsRunning { get; set; }
        public System.Timers.Timer Timer { get; set; }
        public DateTime? PausedTime { get; set; } // New property to track pause time
        public int TimeLeftWhenPaused { get; set; }
    }
}
