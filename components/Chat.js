import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import tw from "tailwind-styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from '../utils/getRecipientEmail'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from "next/router";


function Chat({ id, users }) {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const recipientEmail = getRecipientEmail(users, user)
  const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)))

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return (
    <Container onClick={enterChat}>
      {recipient ?

        (<UserAvatar src={recipient?.photoURL} />)
        :
        (<UserAvatar>{recipientEmail[0]}</UserAvatar>)
      }
      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = tw.div`
flex
items-center
cursor-pointer
p-4
gap-4
break-all
hover:bg-gray-100

`;

const UserAvatar = tw(Avatar)``;