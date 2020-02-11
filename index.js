// implement your API here
const express = require("express");

const Users = require("./data/db");

const server = express();

// middleware
// This is needed for POST and PUT/PATCH
// It teaches express how to read JSON from the body
server.use(express.json());

server.get("/", (request, response) => {
  response.json({ hello: "Web 26" });
});

// retrieve list of users
server.get("/api/users", (request, response) => {
  Users.find()
    .then(users => {
      response.status(200).json(users);
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      response.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// retrieve a single user by id
server.get("/api/users/:id", (request, response) => {
  Users.findById(request.params.id)
    .then(user => {
      response.status(200).json(user);
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      if (!Users.findById(request.params.id)) {
        response.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
      response.status(500).json({ errorMessage: "Oops" });
    });
});

// add a user
server.post("/api/users", (request, response) => {
  // user makes an axios.post call using (url, data, options)
  // the data will be in the body of the response
  const userInfo = request.body;
  Users.insert(userInfo)
    .then(user => {
      response.status(201).json(user);
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      if (!request.body.name || !request.body.bio) {
        response
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        response.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      }
    });
});

// delete a user
server.delete("/api/users/:id", (request, response) => {
  Users.remove(request.params.id)
    .then(removedUser => {
      response.status(200).json(removedUser);
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      response.status(500).json({ errorMessage: "Oops" });
    });
});

// update a user
server.put("/api/users/:id", (request, response) => {
  Users.update(request.params.id, request.body)
    .then(updatedUser => {
      response.status(200).json(updatedUser);
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      response.status(500).json({ errorMessage: "Oops" });
    });
});

const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));
