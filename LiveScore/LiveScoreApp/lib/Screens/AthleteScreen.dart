import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:livescoreapp/Screens/AthletesDetails.dart';

class AthleteScreen extends StatefulWidget {
  const AthleteScreen({Key? key}) : super(key: key);

  @override
  _AthleteScreenState createState() => _AthleteScreenState();
}

class _AthleteScreenState extends State<AthleteScreen> {
  List<dynamic>? _athletes;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchAthletes();
  }

  Future<void> _fetchAthletes() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final response = await http
          .get(Uri.parse('http://192.168.0.101:5032/api/Athletes/getAthelete'));
      if (response.statusCode == 200) {
        setState(() {
          _athletes = jsonDecode(response.body);
        });
      } else {
        throw Exception(
            'Failed to load athletes. Server responded with status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching athletes: $error');
      setState(() {
        _athletes = null;
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _refreshAthletes() async {
    await _fetchAthletes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0, // Removes the shadow
        title: Text(
          "Athlete List",
          style: TextStyle(
            color: Colors.black87, // Text color of the title
          ),
        ),
      ),
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(),
            )
          : _athletes != null
              ? _athletes!.isEmpty
                  ? Center(
                      child: Text(
                        'No athletes available',
                        style: TextStyle(fontSize: 20),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _refreshAthletes,
                      child: ListView.builder(
                        itemCount: _athletes!.length,
                        itemBuilder: (context, index) {
                          final athlete = _athletes![index];
                          final imageUrl = athlete['imageUrl'] != null
                              ? 'http://192.168.0.101:5032/images/${athlete['imageUrl']}'
                              : null;
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      AthleteDetails(athlete: athlete),
                                ),
                              );
                            },
                            child: Card(
                              elevation: 4,
                              margin: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(12.0),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 60,
                                      height: 60,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Colors.grey[200],
                                      ),
                                      child: ClipOval(
                                        child: imageUrl != null
                                            ? Image.network(
                                                imageUrl,
                                                fit: BoxFit.cover,
                                              )
                                            : Icon(Icons.person,
                                                size: 30,
                                                color: Colors.grey[600]),
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            athlete['athleteName'] ??
                                                'Name not available',
                                            style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          SizedBox(height: 4),
                                          Text(
                                            'Age: ${athlete['age'] ?? 'Unknown'}',
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Icon(Icons.arrow_forward_ios),
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
                    'Failed to load athletes',
                    style: TextStyle(fontSize: 20),
                  ),
                ),
    );
  }
}
