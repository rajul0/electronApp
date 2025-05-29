const PouchDB = require("pouchdb");
const bcrypt = require("bcryptjs");

const db = new PouchDB("users");

async function saveUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = `user:${username}`;

  try {
    const existingUser = await db.get(userId); // to check if user has registered
    const updatedUser = {
      ...existingUser,
      passwordHash,
    };
    await db.put(updatedUser);
  } catch (err) {
    if (err.status === 404) {
      await db.put({
        _id: userId,
        username,
        passwordHash,
      });
    } else {
      throw err;
    }
  }
}

async function getUser(username) {
  try {
    return await db.get(username);
  } catch (err) {
    return null;
  }
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { saveUser, getUser, verifyPassword };
