import 'package:flutter/material.dart';
import 'package:livescoreapp/Screens/AthleteScreen.dart';
import 'package:livescoreapp/Screens/MListScreen.dart';
import 'package:livescoreapp/Screens/SearchScreen.dart';
import 'package:livescoreapp/Screens/SplashScreen.dart';
import 'package:livescoreapp/Screens/Winner.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

List<IconData> navIcons = [
  Icons.home,
  Icons.search,
  Icons.person,
  Icons.star,
];

List<String> navTitle = [
  "Home",
  "Search",
  "Players",
  "Winner",
];

int selectedIndex = 0;

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.secondary,
        title: Text(widget.title),
      ),
      body: _getBody(selectedIndex),
      bottomNavigationBar: _navBar(),
    );
  }

  Widget _navBar() {
    return Container(
      height: 65,
      margin: const EdgeInsets.only(
        right: 24,
        left: 24,
        bottom: 24,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 10,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(navIcons.length, (index) {
          return IconButton(
            onPressed: () {
              setState(() {
                selectedIndex = index;
              });
            },
            icon: Icon(
              navIcons[index],
              color: selectedIndex == index ? Colors.grey : Colors.blue,
            ),
          );
        }),
      ),
    );
  }

  Widget _getBody(int index) {
    switch (index) {
      case 0:
        return MListScreen();
      case 1:
        return SearchScreen();
      case 2:
        return AthleteScreen();
      case 3:
        return Winner();
      default:
        return Container();
    }
  }
}

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: SplashScreen(),
    routes: {
      '/home': (context) => const MyApp(),
    },
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'LiveScoreApp',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blue),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Live Score'),
    );
  }
}
