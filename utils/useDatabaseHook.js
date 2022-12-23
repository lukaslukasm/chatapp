import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from "../firebase"

function useDatabaseHook(word, email) {
  const [chats, setChats] = useState()

  useEffect(() => {
    if (word) {
      setChats(db.collection('users'))
    }

  }, [word, email, chats])

  useEffect(() => {
    console.log(chats)
  }, [chats])

  return chats
}
export default useDatabaseHook