import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:signalr_netcore/signalr_client.dart' as signalr;

class MatchScorePage extends StatefulWidget {
  final int matchId;
  final int matchGroup;

  const MatchScorePage({
    Key? key,
    required this.matchId,
    required this.matchGroup,
  }) : super(key: key);

  @override
  _MatchScorePageState createState() => _MatchScorePageState();
}

class _MatchScorePageState extends State<MatchScorePage> {
  late Future<Map<String, dynamic>?> _matchDetails; // Changed to nullable map

  @override
  void initState() {
    super.initState();
    _matchDetails = _fetchMatchDetails();
    _initSignalRConnection();
  }

  Map<String, dynamic>? _liveScore = {
    'totalRedPoints': 0,
    'totalBluePoints': 0,
    'RedPenalty': 0,
    'BluePenalty': 0,
  };

  int _currentRound = 1;
  int _lastRound = 0;
  String? _roundWinner;

  late signalr.HubConnection _hubConnection;

  void _initSignalRConnection() async {
    _hubConnection = signalr.HubConnectionBuilder()
        .withUrl('http://192.168.0.101:5032/scorehub')
        .build();

    _hubConnection.on('ReceiveTotalScore',
        (List<Object?>? parameters) => _handleMatchScoreUpdate(parameters));

    _hubConnection.on('GetRounds', (List<Object?>? parameters) {
      if (parameters != null && parameters.isNotEmpty) {
        int round = parameters[0] as int;
        setState(() {
          if (round != _currentRound) {
            _currentRound = round;
            _resetScoresForNewRound();
          }
        });
        print('Received round: $round');
      }
    });

    _hubConnection.on('ReceiveRoundWinner', (List<Object?>? parameters) {
      if (parameters != null && parameters.isNotEmpty) {
        dynamic roundWinner = parameters[0];
        setState(() {
          _roundWinner = 'Round $_currentRound: $roundWinner';
        });
        print('Received round winner: $roundWinner');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_roundWinner!),
            duration: Duration(seconds: 3),
          ),
        );
      }
    });

    try {
      await _hubConnection.start();
      print('SignalR connection established.');
      await _hubConnection
          .invoke('JoinGroup', args: [widget.matchGroup.toString()]);
      await _hubConnection.invoke('GetTotalScore', args: [widget.matchGroup]);
      await _hubConnection
          .invoke('GetRounds', args: [widget.matchGroup, _currentRound]);
    } catch (error) {
      print('Error establishing SignalR connection: $error');
    }
  }

  void _resetScoresForNewRound() {
    setState(() {
      _liveScore = {
        'totalRedPoints': 0,
        'totalBluePoints': 0,
        'RedPenalty': 0,
        'BluePenalty': 0,
      };
    });
  }

  void _handleMatchScoreUpdate(List<Object?>? parameters) {
    if (parameters != null && parameters.isNotEmpty) {
      final Map<String, dynamic> scoreData =
          parameters[0] as Map<String, dynamic>;

      setState(() {
        _liveScore = {
          'totalRedPoints': scoreData['totalRedPoints'],
          'totalBluePoints': scoreData['totalBluePoints'],
          'RedPenalty': scoreData['redPanelty'],
          'BluePenalty': scoreData['bluePanelty'],
        };
      });
    }
  }

  Future<Map<String, dynamic>?> _fetchMatchDetails() async {
    try {
      final response = await http.get(Uri.parse(
          'http://192.168.0.101:5032/api/Matchs/GetMatchById/${widget.matchId}'));

      if (response.statusCode == 200) {
        final matchDetails = jsonDecode(response.body);

        // Assuming matchStatus is a key in matchDetails
        if (matchDetails['matchStatus'] == 'Live') {
          return matchDetails;
        } else {
          // If matchStatus is not Live, return null or empty map
          return null; // or return {}; depending on how you handle it
        }
      } else {
        throw Exception(
            'Failed to load match details. Server responded with status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching match details: $error');
      throw Exception('Failed to fetch match details');
    }
  }

  Future<void> _refreshMatchDetails() async {
    setState(() {
      _matchDetails = _fetchMatchDetails();
    });

    try {
      await _hubConnection.invoke('GetTotalScore', args: [widget.matchGroup]);
      await _hubConnection
          .invoke('GetRounds', args: [widget.matchGroup, _currentRound]);
    } catch (error) {
      print('Error refreshing SignalR data: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Live Score'),
        centerTitle: true,
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _refreshMatchDetails,
        child: FutureBuilder<Map<String, dynamic>?>(
          future: _matchDetails,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (snapshot.data == null) {
              return Center(
                  child: Text(
                      'Match is not live')); // Show message if match is not live
            } else {
              final matchDetails = snapshot.data!;
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.blueAccent, Colors.indigo],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        '${matchDetails['athleteRed']} vs ${matchDetails['athleteBlue']}',
                        style: TextStyle(
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    Expanded(
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius:
                              BorderRadius.vertical(top: Radius.circular(20)),
                        ),
                        child: SingleChildScrollView(
                          physics: AlwaysScrollableScrollPhysics(),
                          child: Column(
                            children: [
                              SizedBox(height: 20),
                              _buildTeamScores(matchDetails),
                              SizedBox(height: 20),
                              _buildScoreDetails('Red Penalty',
                                  _liveScore?['RedPenalty'] ?? 0),
                              SizedBox(height: 12),
                              _buildScoreDetails('Blue Penalty',
                                  _liveScore?['BluePenalty'] ?? 0),
                              SizedBox(height: 20),
                              Text(
                                'Round: $_currentRound',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(height: 20),
                              if (_roundWinner != null)
                                Column(
                                  children: [
                                    Text(
                                      'Round $_currentRound Winner:',
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black,
                                      ),
                                    ),
                                    SizedBox(height: 10),
                                    Text(
                                      _roundWinner!,
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green,
                                      ),
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }
          },
        ),
      ),
    );
  }

  Widget _buildTeamScores(Map<String, dynamic> matchDetails) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildTeamScore(
            '${matchDetails['athleteRed']}',
            _liveScore?['totalRedPoints'],
            _liveScore?['RedPenalty'],
            Colors.red),
        _buildTeamScore(
            '${matchDetails['athleteBlue']}',
            _liveScore?['totalBluePoints'],
            _liveScore?['BluePenalty'],
            Colors.blue),
      ],
    );
  }

  Widget _buildTeamScore(String team, int score, int penalty, Color color) {
    return Column(
      children: [
        Text(
          team,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        SizedBox(height: 8), // Adjust spacing between score and penalty
        Text(
          '$score',
          style: TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          'Penalty: $penalty', // Display penalty below the score
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildScoreDetails(String label, int score) {
    IconData iconData;
    Color iconColor;

    switch (label) {
      case 'Red Penalty':
        iconData = Icons.warning;
        iconColor = Colors.red;
        break;
      case 'Blue Penalty':
        iconData = Icons.warning;
        iconColor = Colors.blue;
        break;
      default:
        iconData = Icons.error;
        iconColor = Colors.black;
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [],
    );
  }

  @override
  void dispose() {
    _hubConnection.stop();
    super.dispose();
  }
}
