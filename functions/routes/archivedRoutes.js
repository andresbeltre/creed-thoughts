module.exports = app => {
  //function that populates the database
  app.get("/thoughts/populate", async (req, res) => {
    await db.populateDb() //this function lives in the database file
    res.status(201).json({ success: true, status: "Done, check database" })
  })

  app.post("/thoughts/new", async (req, res) => {
    try {
      const thought = {
        message: req.body.message,
        createdAt: Date.now()
      }
      await db.createThought(thought)
      return res.status(201).json({ success: true, thought: thought.message })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  })

  app.post("/thoughts/update", async (req, res) => {
    try {
      const thought = {
        message: req.body.message,
        updatedAt: Date.now()
      }
      await db.updateThought(req.body.uid, thought)
      return res.status(200).json({ success: true, thought })
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message })
    }
  })

  app.delete("/thoughts/delete", async (req, res) => {
    try {
      const thoughtID = {
        uid: req.body.uid,
        deteledAt: Date.now()
      }
      await db.deleteThought(req.body.uid)
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(404).json({ success: false, error: error.message })
    }
  })
}
