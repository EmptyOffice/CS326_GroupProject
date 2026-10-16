# CS326_GroupProject

| Name | GitHub Username |
| William Bae | willibae |
| Edelson Garcia | EmptyOffice |
| Alexandria Anderson | alexandriaan-hub |

Local Tennis Matchmaker in the Pioneer Valley area
- An application that connects tennis players in Amherst based on skill levels and schedule compatibility and also tracks court availability based on user input.
- This app addresses the frustrating process of finding well-matched hitting partners and the lack of visibility into public or campus court availability with the goals of fostering a more connected and active local community. 
- Recreational tennis players, junior athletes, and campus clubs in the area can benefit from this app.

Working agreement:
- We will communicate using Discord.
- "Done" for a PR means passing review from at least one teammate.
- We will resolve disagreements by discussing in person and voting at the end. 
- We will meet on Fridays at 1:20pm weekly. 

Instructions to run the server: 
- Clone the repository by entering the following into the terminal: 
    git clone https://github.com/EmptyOffice/CS326_GroupProject.git
- Change your directory in the terminal to the repository (...\CS326_GroupProject.git)
- Install express within the repository by entering the following into the terminal:
    npm install express
- Start the server by entering the following into the terminal:
    npm start
- Visit the server at http://localhost:3000
- To close the server, enter CTRL+C into the terminal

## System Architecture

### API Request Flow
Here is the path of how client requests like fetching or creating a profile flow through our application backend:

```text
Frontend (Browser) 
  ↓ (HTTP GET / POST '/profiles')
Routes (routes/profiles.js)
  ↓ (asyncHandler)
Controllers (controllers/profilesController.js)
  ↓ (request parsing & error handling)
Services (services/profilesService.js)
  ↓ (data validation & search filters)
Repositories (repositories/profilesRepository.js)
  ↓ (File I/O using fs/promises)
Database (profiles.json)

### Design Decisions

William Bae: For handling errors in our backend, I decided to return custom success and error objects (like `{ ok: true }` or `{ ok: false, error }`) from our service file rather than throwing standard JavaScript errors and using try/catch in the controller. While using try/catch is the standard way to handle errors in Node.js, returning an object is better for our specific code because it forces us to explicitly check if a function worked (`if (!result.ok)`) before sending a response to the user. Also, a normal catch block can sometimes accidentally hide system crashes like spelling mistakes by treating them as user errors. By returning an error object on purpose, we get information as to why a validation failed without hiding bigger bugs.