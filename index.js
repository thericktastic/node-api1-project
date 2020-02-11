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
    .then(singleUser => {
      console.log("This is singleUser in .get: ", singleUser.id);
      console.log("This is request.params.id in .get: ", request.params.id);
      if (singleUser.id !== Number(request.params.id)) {
        response.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      } else {
        response.status(200).json(singleUser);
      }
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      response
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

// add a user
server.post("/api/users", (request, response) => {
  if (!request.body.name || !request.body.bio) {
    response
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    // user makes an axios.post call using (url, data, options)
    // the data will be in the body of the response
    const userInfo = request.body;
    Users.insert(userInfo)
      .then(user => {
        response.status(201).json(user);
      })
      .catch(error => {
        console.log("You failed! Here's why: ", error);
        response.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

// delete a user
server.delete("/api/users/:id", (request, response) => {
  Users.remove(request.params.id)
    .then(removedUser => {
      if (!removedUser) {
        response.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      } else {
        response.status(200).json(removedUser);
      }
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      response
        .status(500)
        .json({ errorMessage: "The user could not be removed." });
    });
});

// update a user
server.put("/api/users/:id", (request, response) => {
  Users.update(request.params.id, request.body)
    .then(updatedUser => {
      if (!updatedUser) {
        response.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      } else {
        response.status(200).json(updatedUser);
      }
    })
    .catch(error => {
      console.log("You failed! Here's why: ", error);
      if (!request.body.name || !request.body.bio) {
        response
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        response.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      }
    });
});

const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));
