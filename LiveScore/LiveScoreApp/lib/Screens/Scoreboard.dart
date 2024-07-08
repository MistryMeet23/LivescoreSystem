import 'dart:convert';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:signalr_netcore/hub_connection.dart';
import 'package:signalr_netcore/hub_connection_builder.dart';

class Scoreboard extends StatefulWidget {
  @override
  _ScoreboardState createState() => _ScoreboardState();
}

class _ScoreboardState extends State<Scoreboard> {
  bool isLoading = true;
  bool hasError = false;
  Map<String, dynamic>? matchDetails;

  late HubConnection hubConnection;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    // Initialize SignalR connection and fetch initial data
    _initSignalR();
    _fetchMatchDetails();
    _startLiveScoreUpdates();
  }

  Future<void> _initSignalR() async {
    try {
      hubConnection = HubConnectionBuilder()
          .withUrl('http://192.168.71.181:5032/ScoreHub')
          .build();

      hubConnection.on('ReceiveScoreUpdate', _handleScoreUpdate);

      await hubConnection.start();
    } catch (e) {
      print('Error initializing SignalR: $e');
      setState(() {
        isLoading = false;
        hasError = true;
      });
    }
  }

  void _handleScoreUpdate(List<dynamic>? message) {
    if (message != null && message.isNotEmpty) {
      final data = message[0] as Map<String, dynamic>;
      setState(() {
        matchDetails = {
          'totalRedPoints': data['totalRedPoints'],
          'totalBluePoints': data['totalBluePoints'],
          'playerRedName': data['athleteRed'],
          'playerBlueName': data['athleteBlue'],
          'playerRedScore': data['redPoints'] - data['redPanelty'],
          'playerBlueScore': data['bluePoints'] - data['bluePanelty'],
          'playerRedImage': matchDetails?['playerRedImage'],
          'playerBlueImage': matchDetails?['playerBlueImage'],
        };
        isLoading = false;
      });
    }
  }

  Future<void> _fetchMatchDetails() async {
    setState(() {
      isLoading = true;
      hasError = false;
    });

    final url = 'http://192.168.71.181:5032/api/Matchs/GetMatchs';

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          matchDetails = {
            'totalRedPoints': data['totalRedPoints'],
            'totalBluePoints': data['totalBluePoints'],
            'playerRedName': data['athleteRed'],
            'playerBlueName': data['athleteBlue'],
            'playerRedImage': data['redImage'],
            'playerBlueImage': data['blueImage'],
          };
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
          hasError = true;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        hasError = true;
      });
    }
  }

  void _startLiveScoreUpdates() {
    _timer = Timer.periodic(Duration(seconds: 5), (timer) async {
      await _fetchLiveScores();
    });
  }

  Future<void> _fetchLiveScores() async {
    final url = 'http://192.168.0.101:5032/api/Scores/getTotalScore';

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          matchDetails = {
            ...matchDetails!,
            'totalRedPoints': data['totalRedPoints'],
            'totalBluePoints': data['totalBluePoints'],
            'playerRedScore': data['redPoints'] - data['redPanelty'],
            'playerBlueScore': data['bluePoints'] - data['bluePanelty'],
          };
        });
      } else {
        setState(() {
          hasError = true;
        });
      }
    } catch (e) {
      setState(() {
        hasError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Scoreboard'),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchMatchDetails,
        child: isLoading
            ? Center(
                child: CircularProgressIndicator(),
              )
            : hasError || matchDetails == null
                ? Container(
                    margin: const EdgeInsets.all(16.0),
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 10,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        'No match details available',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  )
                : ListView(
                    children: [
                      Card(
                        margin: const EdgeInsets.all(16.0),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        elevation: 10,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              const Text(
                                'Live Match',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 20),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  CircleAvatar(
                                    radius: 50,
                                    backgroundImage: NetworkImage(
                                        matchDetails!['playerRedImage']),
                                  ),
                                  const Text(
                                    'vs',
                                    style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  CircleAvatar(
                                    radius: 50,
                                    backgroundImage: NetworkImage(
                                        matchDetails!['playerBlueImage']),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Text(
                                    matchDetails!['playerRedName'] ??
                                        'Player Red',
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red,
                                    ),
                                  ),
                                  Text(
                                    matchDetails!['playerBlueName'] ??
                                        'Player Blue',
                                    style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.blue,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 15),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Text(
                                    'Score: ${matchDetails!['playerRedScore'] ?? 0}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                    ),
                                  ),
                                  Text(
                                    'Score: ${matchDetails!['playerBlueScore'] ?? 0}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 15),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Text(
                                    'Red Score: ${matchDetails!['totalRedPoints'] ?? 0}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                    ),
                                  ),
                                  Text(
                                    'Blue Score: ${matchDetails!['totalBluePoints'] ?? 0}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }

  @override
  void dispose() {
    _timer.cancel();
    hubConnection.stop();
    super.dispose();
  }
}
