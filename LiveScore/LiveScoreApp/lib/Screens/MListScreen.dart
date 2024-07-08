import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';
import 'MatchScorePage.dart';

class MListScreen extends StatefulWidget {
  const MListScreen({Key? key}) : super(key: key);

  @override
  _MListScreenState createState() => _MListScreenState();
}

class _MListScreenState extends State<MListScreen> {
  List<dynamic>? _matches;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchMatches();
  }

  Future<void> _fetchMatches() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final response = await http
          .get(Uri.parse('http://192.168.0.101:5032/api/Matchs/today'));
      if (response.statusCode == 200) {
        setState(() {
          _matches = jsonDecode(response.body);
        });
      } else {
        throw Exception(
            'Failed to load matches. Server responded with status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching matches: $error');
      setState(() {
        _matches = null;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0, // Removes the shadow
        title: Text(
          "Today's Matches",
          style: TextStyle(
            color: Colors.black87, // Text color of the title
          ),
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _matches != null
              ? _matches!.isEmpty
                  ? Center(
                      child: Text(
                        'No matches available',
                        style: TextStyle(fontSize: 20, color: Colors.grey),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _fetchMatches,
                      child: ListView.builder(
                        itemCount: _matches!.length,
                        itemBuilder: (context, index) {
                          final match = _matches![index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => MatchScorePage(
                                    matchId: match['mid'],
                                    matchGroup:
                                        match['matchGroup'] ?? 'defaultGroup',
                                  ),
                                ),
                              );
                            },
                            child: Card(
                              margin: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              elevation: 4,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        _buildPlayerInfo(
                                          imageUrl:
                                              'http://192.168.0.101:5032/images/${match['athleteRedImg']}',
                                          playerName:
                                              match['athleteRed'] ?? 'Unknown',
                                        ),
                                        _buildMatchStatus(
                                            match['matchStatus'] ?? 'Unknown'),
                                        _buildPlayerInfo(
                                          imageUrl:
                                              'http://192.168.0.101:5032/images/${match['athleteBlueImg']}',
                                          playerName:
                                              match['athleteBlue'] ?? 'Unknown',
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 12),
                                    _buildMatchInfoRow(
                                      'Date',
                                      _formatDate(match['matchDate']) +
                                          ' (${_formatTime(match['matchDate'])})',
                                    ),
                                    SizedBox(height: 8),
                                    _buildMatchInfoRow(
                                      'Tournament',
                                      match['tournament'] ?? 'Unknown',
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    )
              : Center(
                  child: Text(
                    'Failed to fetch matches',
                    style: TextStyle(fontFamily: 'Roboto', fontSize: 20),
                  ),
                ),
    );
  }

  Widget _buildPlayerInfo({
    required String imageUrl,
    required String playerName,
  }) {
    return Column(
      children: [
        CircleAvatar(
          radius: 40,
          backgroundColor: Colors.blue,
          backgroundImage: NetworkImage(imageUrl),
        ),
        SizedBox(height: 8),
        Text(
          playerName,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildMatchInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
        Text(
          value,
          style: TextStyle(fontSize: 16),
        ),
      ],
    );
  }

  Widget _buildMatchStatus(String status) {
    Color statusColor = _getStatusColor(status);
    return Container(
      padding: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.2),
        borderRadius: BorderRadius.circular(5),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          color: statusColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return Colors.green;
      case 'finished':
        return Colors.blue;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.black;
    }
  }

  String _formatDate(String? dateString) {
    try {
      final DateTime dateTime = DateTime.parse(dateString ?? '');
      return DateFormat.yMMMd().format(dateTime);
    } catch (e) {
      print('Error parsing date: $e');
      return 'Unknown';
    }
  }

  String _formatTime(String? dateString) {
    try {
      final DateTime dateTime = DateTime.parse(dateString ?? '');
      return DateFormat.Hm().format(dateTime);
    } catch (e) {
      print('Error parsing time: $e');
      return 'Unknown';
    }
  }
}
