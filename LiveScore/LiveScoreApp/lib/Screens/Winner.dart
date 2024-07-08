import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Winner extends StatefulWidget {
  const Winner({Key? key}) : super(key: key);

  @override
  _WinnerState createState() => _WinnerState();
}

class _WinnerState extends State<Winner> {
  List<dynamic> winnerData = [];

  @override
  void initState() {
    super.initState();
    _fetchWinnerData();
  }

  Future<void> _fetchWinnerData() async {
    final apiUrl = 'http://192.168.0.101:5032/api/Common/todays-winners';

    try {
      var response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        var jsonData = jsonDecode(response.body);
        setState(() {
          winnerData = jsonData;
        });
      } else {
        print('Failed to load winner data');
      }
    } catch (e) {
      print('Error fetching winner data: $e');
    }
  }

  Future<void> _refreshData() async {
    await _fetchWinnerData();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSwatch(
          primarySwatch: Colors.blue,
        ).copyWith(
          secondary: Colors.amber,
        ),
        textTheme: TextTheme(
          bodyLarge: TextStyle(color: Colors.black87),
          bodyMedium: TextStyle(color: Colors.black54),
        ),
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0, // Removes the shadow
          title: Text(
            "Winner List",
            style: TextStyle(
              color: Colors.black87, // Text color of the title
            ),
          ),
        ),
        body: RefreshIndicator(
          onRefresh: _refreshData,
          child: _buildBody(),
        ),
        backgroundColor: Colors.blue[200],
      ),
    );
  }

  Widget _buildBody() {
    if (winnerData.isEmpty) {
      return Center(
        child: Text(
          'No winner today',
          style: TextStyle(fontSize: 24, color: Colors.black54),
        ),
      );
    } else {
      return ListView.builder(
        itemCount: winnerData.length,
        itemBuilder: (context, index) {
          return _buildWinnerCard(winnerData[index]);
        },
      );
    }
  }

  Widget _buildWinnerCard(dynamic winner) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 10, horizontal: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      elevation: 5,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.blue,
                  backgroundImage: winner['imageUrl'] != null
                      ? NetworkImage(
                      'http://192.168.0.101:5032/images/${winner['imageUrl']}')
                      : null,
                  child: winner['imageUrl'] == null
                      ? Icon(Icons.person, color: Colors.white, size: 30)
                      : null,
                ),
                SizedBox(width: 20),
                Expanded(
                  child: Text(
                    winner['winnerName'],
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Icon(Icons.emoji_events, color: Colors.amber, size: 30),
              ],
            ),
            Divider(height: 20, color: Colors.grey),
            _buildInfoRow(Icons.person, 'Athlete Red', winner['athleteRed']),
            _buildInfoRow(Icons.person, 'Athlete Blue', winner['athleteBlue']),
            _buildInfoRow(Icons.category, 'Category', winner['categoryName']),
            _buildInfoRow(Icons.sports, 'Tournament', winner['tournamentName']),
            _buildInfoRow(Icons.wc, 'Gender', winner['gender']),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String info) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          SizedBox(width: 10),
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black54,
            ),
          ),
          Spacer(),
          Text(
            info,
            style: TextStyle(
              fontSize: 16,
              color: Colors.black87,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
