const methodnotallowed = (req, res) => {
  res.status(401).json({ message: "Method Not Allowed" });
};

module.exports = methodnotallowed;
