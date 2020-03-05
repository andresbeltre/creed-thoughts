const admin = require("firebase-admin")

module.exports.getAllThoughts = async () => {
  try {
    const THOUGHTS = []
    const thoughts = await admin
      .firestore()
      .collection("thoughts")
      .get()
    thoughts.forEach(thought => {
      THOUGHTS.push(thought.data())
    })
    return { success: true, thoughts: THOUGHTS }
  } catch (error) {
    console.error(`Error gettinga all Creed's Thoughts: ${error.message}`)
    return { success: false, error: error.message }
  }
}

module.exports.createThought = async obj => {
  try {
    const thought = await admin
      .firestore()
      .collection("thoughts")
      .add(obj)
    return { success: true, thought: obj }
  } catch (error) {
    console.error(`Error creating the first creedThought: ${error.message}`)
    return { success: false, error: error.message }
  }
}

module.exports.updateThought = async (uid, obj) => {
  try {
    const update = await admin
      .firestore()
      .collection("thoughts")
      .doc(uid)
      .update(obj)
    return { success: true, thought: obj }
  } catch (error) {
    console.error(`Error updating doc ${uid}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

module.exports.deleteThought = async uid => {
  try {
    const borra = await admin
      .firestore()
      .collection("thoughts")
      .doc(uid)
      .delete()
    return { success: true, thought: uid }
  } catch (error) {
    console.error(`Error deleting ${uid}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

module.exports.populateDb = async () => {
  let json = require("./thoughts.json")
  json = Array.from(json)
  try {
    json.forEach(async doc => {
      await admin
        .firestore()
        .collection("thoughts")
        .add({
          date: doc.date,
          url: doc.url,
          content: `${doc.content}`
        })
    })
  } catch (error) {
    console.error("Error populating database: ", error.message)
  }
  return
}
