const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register ---
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//logiin ---

/* router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Credenciales incorrectas!");

    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(400).json("Credenciales incorrectas!");

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
}); */

/* router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "El usuario no está disponible" });
    }
    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(400).json("Credenciales incorrectas!");

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
}); */

router.post("/login", async (req, res) => {
  let responseSent = false;
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user && !responseSent) {
      responseSent = true;
      return res.status(400).json({ message: "Credenciales incorrectas!" });
    }

    const validate = await bcrypt.compare(req.body.password, user.password);
    if (!validate && !responseSent) {
      responseSent = true;
      return res.status(400).json({ message: "Credenciales incorrectas!" });
    }

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    if (!responseSent) {
      console.log("no se logeo")
      res.status(500).json(error);
    }
  }
});

module.exports = router;
