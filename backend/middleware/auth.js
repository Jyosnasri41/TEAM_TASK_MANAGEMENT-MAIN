const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) return res.status(401).json({ msg: "No token" });

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};