const db = require("../API/database")

module.exports = app => {
  app.get("/", (req, res) => {
    res.send("Hello, World!")
  })

  app.get("/thoughts/all", async (req, res) => {
    try {
      const thoughts = await db.getAllThoughts()
      return res
        .status(200)
        .json({ success: true, thoughts: thoughts.thoughts })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  })

  app.get("/thoughts/random", async (req, res) => {
    const thoughts = await db.getAllThoughts();
    let randomNum = Math.floor(Math.random() * 67);
    let randomThought = thoughts[randomNum];
    res.status(200).json({ success: true, thought: randomThought });
  })
}
