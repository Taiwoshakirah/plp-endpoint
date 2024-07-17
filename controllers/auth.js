const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const signUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Username or password missing");
    return res
      .status(422)
      .json({
        success: false,
        message: "Please provide both username and password",
      });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      console.log("Username already exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("User registered successfully:", username);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
};

module.exports = { signIn, signUp };
