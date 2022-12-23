import styled from "styled-components";
import Head from "next/head";
import tw from "tailwind-styled-components"
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useState } from "react";


function Chat({ chat, messages }) {
  const [user] = useAuthState(auth)

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>

      {document.body.clientWidth > 640 && <Sidebar />}

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id)

  // prep the messages on the server
  const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

  const messages = messagesRes.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime()
    }))

  // prep the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat
    }
  }
}

const Container = tw.div`
  overflow-x-hidden
  h-screen
  w-screen
  flex
`;

const ChatContain = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar{
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ChatContainer = tw(ChatContain)`

  sm:relative 
  w-screen 
  sm:w-auto
`

const ResponsiveSidebar = tw(Sidebar)`
sm:block
hidden
`