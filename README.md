# Edusentia - uOttawa Course Review System
Project presentation: https://youtu.be/R-pi6GH-4dU 

|Name|student number|
|---|---|
|Selin Kararmaz|300163876|
|Glen Wang|300164126|
|Zijun Ye|300168065|

Course: CSI 3140 - WWW Structures, Techniques and Standards

### Background:
The primary focus of Edusentia is to help the students of the University of Ottawa in their education by providing them with a platform that allows them voice their opinions about the courses they have taken and providing insights into whether other students have positive, negative or neutral sentiments towards each course. In addition, the project can be utilized by the university staff and help them identify potential issues that need to be addressed to continuously offer high quality education.

### Description of project:
The scope of Edusentia consists of four main components. The first component is an application to store the student reviews, herein referred to as the Course Review Database. The second component is the sentiment analysis tool which will perform on the Course Review Database. The third component is the second database that will store the analysed customer reviews on each service, herein referred to as Analysed Course Review Database. The fourth component is the UI, which displays the content of the application and allows the user to interact with it.

Edusentia is not a subsystem of the University of Ottawa’s website and is not designed to work alongside it. It stores the student reviews done on the project website and stores them in a separate database. The database, stored inside the Course Review Database, is then used for sentiment analysis. The Analysed Customer Review Database is displayed on the project website.

### Prerequisites:
Ensure all proper dependencies and tools are installed
1. Python (Check by running `python3 -V`)
2. Angular (Check by running `ng v`)

### Running the program

Step 1: Have three instances of your terminal open. Make sure you are in the correct directory by direct to ```cd uO-ClassHub-ui```
*  Step 2  and Step 3 enable you to run the server side of the application. *

Step 2: 
  - Mac user execute command ```FLASK_APP=server.py flask run```
  - Windows / Linux user execute command ```py -m flask run``` or ```python server.py```
    
Step 3: execute command ```json-server --watch db.json```

Step 4: Have the third instance to execute the command `ng serve`. This will run the client side of the application.

Navigate to `http://localhost:4200/` and play around with the application! 
