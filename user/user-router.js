const bcrypt = require('bcryptjs');
const router = require("express").Router();
const restricted = require("../auth/restricted-middleware");
const User = require("./user-model.js");
const Compassion = require("../compassion/compassion-model.js");

// GET all users 
router.get("/", restricted, (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

// GET user info by ID
router.get("/:id", restricted, (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ message: "Unable to retrieve user profile with provided ID" });
    });
});

// Update user info by ID
router.post("/:id", restricted, (req, res) => {
  const id = req.params.id;
  const userUpdates = req.body;
  User.findById(id)
    .then(user => {
      if (user && (userUpdates.password === user.password)) {
        User.update(userUpdates, id).then(updates => {
          res.status(200).json({ message: "User profile updated", username: user.username, updated: userUpdates });
        });
      } 
      else if (user && (userUpdates.password !== user.password)) {
        const hash = bcrypt.hashSync(userUpdates.password, 10);
        userUpdates.password = hash; 
        User.update(userUpdates, id).then(updates => {
          res.status(200).json({ message: "User profile updated", username: user.username, updated: userUpdates });
        });
      } 
      else {
        res.status(401).json({ message: "Failed to locate user with provided ID", id });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update user, please check ID", err });
    });
});

// DELETE user
router.delete("/:id", restricted, (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      if (user) {
        User.remove(id)
        .then(remove => {
          res.status(200).json({ message: "User deleted", username: user.username })
        })
        .catch(err => {
          res.status(500).json({ message: "Failed to delete user", err })
        })
      }
      else {
        res.status(401).json({ message: "Failed to locate user with provided ID", id });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed To delete user, please check ID", err });
    });
});

//--------------------Compassions---------------------------------------//

// GET all user compassion by ID
router.get('/:id/compassions', restricted, (req, res) => {
  const id = req.params.id;
  User.findById(id)
  .then(user =>{
    
      if(user) {
        Compassion.findBy({userID: user.id}).then(compassions => {
            console.log("Compassions", compassions)
              res.status(200).json(compassions)
          })
          .catch(err => {
              res.status(401).json({message: `Failed to find compassions for: ${user.username}`})
          })
      } 
      else{
          res.status(401).json({message: `Failed To Find compassions With User ID: ${req.params.id} `})
      }
  })
  .catch(err => {
      res.status(500).json({message: 'Failed To get user compassions'})
  })
})

// GET individual user compassion by ID
router.get('/:userID/compassions/:compassionID', restricted, (req, res) => {
  const userID = req.params.userID;
  const compassionID = req.params.compassionID
  console.log("compassionID", compassionID)
  User.findById(userID)
  .then(user =>{
      if(user) {
        Compassion.findById(compassionID)
        .then(compassions => {
              res.status(200).json(compassions)
          })
          .catch(err => {
              res.status(401).json({message: `Failed to find compassions for: ${user.username}`})
          })
      } 
      else{
          res.status(401).json({message: `Failed To Find compassions With User ID: ${req.params.id} `})
      }
  })
  .catch(err => {
      res.status(500).json({message: 'Failed To get user compassions'})
  })
})

//POST new Post
router.post('/:userID/compassions/', (req, res) => {
  const userID = req.params.userID;
  User.findById(userID)
  .then(user => {
    if (user) {
      let newPost = req.body;
      Compassion.create(newPost)
      .then(newPost=>{
          res.status(200).json(newPost)
      })
      .catch(err => {
        res.status(500).json({message: 'Failed To Add New Post', postSent: newPost, err})
      })
    }
    else{
      res.status(401).json({message: `Failed To add compassions With User ID: ${req.params.id} `})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Failed To add user compassions'})
  })
})

//UPDATE post
router.post('/:userID/compassions/:compassionID', (req,res) => {
  const userID = req.params.userID;
  const compassionID = req.params.compassionID
  const updates = req.body;

  User.findById(userID)
  .then(user => {
    if (user) {
      Compassion.findById(compassionID)
      .then(post => {
        if(post) {
          Compassion.update(updates, compassionID)
          .then(updated =>{
              res.status(201).json({message: "Compassion post updated", id: post.id, updates})
          })
      }
        else {
          res.status(401).json({message: `Could not update post With ID: ${id}`})
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Failed to update post' });
      });
    }
    else{
      res.status(401).json({message: `Failed To update post With User ID: ${req.params.id} `})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Failed To update user post'})
  })
})

//DELETE post
router.delete('/:userID/compassions/:compassionID', (req, res) => {
  const userID = req.params.userID;
  const compassionID = req.params.compassionID

  User.findById(userID)
  .then(user => {
    if (user) {
      Compassion.findById(compassionID)
      .then(post => {
          if(post) {
              Compassion.remove(compassionID).then(removed =>{
                  res.status(200).json({ message: 'Post deleted', id: post.id});
              }).catch(err => {
                  res.status(500).json({message: `Failed to post w/ ID: ${id}`, err})
              })
          }
          else {
              res.status(401).json({message: `Failed to delete post w/ ID: ${id}`})
          }
      })
      .catch(err => {
          res.status(500).json({message: 'Failed to delete posts', err})
      })
    }
    else {
      res.status(401).json({message: `Failed To delete post With User ID: ${req.params.id} `})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Failed to delete user post'})
  })
});

module.exports = router;