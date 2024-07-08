import 'package:flutter/material.dart';

class AthleteDetails extends StatelessWidget {
  final Map<String, dynamic> athlete;

  const AthleteDetails({Key? key, required this.athlete}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0, // Removes the shadow
        title: Text(
          "Athlete Details",
          style: TextStyle(
            color: Colors.black87, // Text color of the title
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blueAccent, Colors.lightBlueAccent],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Column(
                children: [
                  Center(
                    child: CircleAvatar(
                      radius: 60,
                      backgroundColor: Colors.white,
                      child: CircleAvatar(
                        radius: 55,
                        backgroundImage: athlete['imageUrl'] != null
                            ? NetworkImage(
                                'http://192.168.0.101:5032/images/${athlete['imageUrl']}',
                              )
                            : null,
                        child: athlete['imageUrl'] == null
                            ? Icon(
                                Icons.person,
                                size: 60,
                              )
                            : null,
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    athlete['athleteName'] ?? 'Name not available',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Personal Information',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueAccent,
                ),
              ),
            ),
            SizedBox(height: 10),
            _buildDetailCard(Icons.cake, 'Date of Birth',
                _formatDate(athlete['dateOfBirth'])),
            _buildDetailCard(Icons.person_outline, 'Gender',
                athlete['gender'] ?? 'Gender not available'),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Location',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueAccent,
                ),
              ),
            ),
            SizedBox(height: 10),
            _buildDetailCard(Icons.location_city, 'City',
                athlete['city'] ?? 'City not available'),
            _buildDetailCard(Icons.location_on, 'State',
                athlete['state'] ?? 'State not available'),
            SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Professional Information',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueAccent,
                ),
              ),
            ),
            SizedBox(height: 10),
            _buildDetailCard(Icons.person_outline, 'Coach Name',
                athlete['coachName'] ?? 'Coach Name not available'),
            _buildDetailCard(Icons.category, 'Category',
                athlete['categoryName'] ?? 'Category Name not available'),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard(IconData icon, String label, String value) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 6,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(
              icon,
              size: 28,
              color: Colors.blueAccent,
            ),
            SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[700],
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) {
      return 'Date of Birth not available';
    }
    try {
      DateTime date = DateTime.parse(dateStr);
      return '${date.month}/${date.day}/${date.year}';
    } catch (e) {
      print('Error parsing date: $e');
      return 'Invalid Date';
    }
  }
}
