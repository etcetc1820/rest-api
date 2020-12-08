const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const secret = process.env.SECRET || "secret";
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: "Not authenticated.",
    });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = await jwt.verify(token, secret);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  if (!decodedToken) {
    return res.status(401).json({
      message: "Not authenticated.",
    });
  }

  req.userId = decodedToken.userId;
  next();
};
