const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authenicateToken = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const JWT_SECRET =  "secret-key";


router.post("/login", async function (req, res) {
  try {
    const {username,passwd} = req.body;
    if(!username || !passwd){
      return res.status(400).json({
        success:false,
        error: "Username and password are required."
      });
    }
    const users = await User.findByUserName(username);

    if(!users || users.passwd !== passwd){
      return res.status(401).json({
        success:false,
        error: "Invalid username or password"
      });
    }
    const token = jwt.sign(
      {
        userID: users.userID,
        username: users.username,
        urole: users.urole
      },
      JWT_SECRET,
      {expiresIn: "30m"}
    );
    res.json({
      success: true,
      token:token
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Endpoint: GET /api/users - Find all users (READ)

router.use(authenicateToken);

router.get("/", async function (req, res){
 try{
  const users = await User.findAll();
  res.json({ success:true, data:users});
 }catch(error){
  res.status(500).json({success: false, error: error.message});
 }
});




// Endpoint: GET /api/users/:id - Find single user (READ)
router.get("/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: POST /api/users - Add new user (CREATE)
router.post("/", async function (req, res) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({success:true, data: user});

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: PUT /api/users/:id - Update user (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.delete(req.params.id);
    
    res.status(200).json({ success: true, message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
