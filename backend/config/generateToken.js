import jwt from "jsonwebtoken";

const generateToken = (id,secretKey) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: "1d",
  });
};

export default generateToken
