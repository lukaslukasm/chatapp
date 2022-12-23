import { Avatar } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import tw from 'tailwind-styled-components'
import { auth, db } from '../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Message from './Message';
import { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app';
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'
import { format } from 'date-fns'
import { useRef } from 'react';
import { createPicker } from 'picmo';


function ChatScreen({ chat, messages }) {


  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false)
  const [input, setInput] = useState('')
  const [user] = useAuthState(auth)
  const bottomElmRef = useRef(null)
  const router = useRouter()
  const [messageShowsTime, setMessageShowsTime] = useState(null)
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  )
  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  )

  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(chat.users, user)

  useEffect(() => {
    let time
    if (messageShowsTime)
      time = setTimeout(() => { setMessageShowsTime(null) }, 2000)
    return () => { clearTimeout(time) }
  }, [messageShowsTime])

  useEffect(() => {
    const rootElement = document.querySelector('.emojiButton');

    // Create the picker
    const picker = createPicker({ rootElement });

    // The picker emits an event when an emoji is selected. Do with it as you will!
    picker.addEventListener('emoji:select', event => {
      setShowEmojiKeyboard(false)
      setInput(prev => `${prev}${event.emoji}`)
    });

    picker.addEventListener('focusOut', event => {
      setShowEmojiKeyboard(false)
    })
  }, [])


  const scrollToBottom = () => {
    bottomElmRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <span key={message.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {message.id === messageShowsTime &&
            <Time>
              {format(message.data().timestamp?.toDate().getTime(), 'H:m')}
            </Time>
          }
          <Message
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime()
            }}
            showstime={messageShowsTime === message.id}
            onClick={() => setMessageShowsTime(prev => prev === message.id ? null : message.id)}
          />
        </span>
      ))
    }
    else
      return JSON.parse(messages).map(message =>
        <span key={message.id} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {message.id === messageShowsTime &&
            <Time>
              {Date(message.timestamp.toLocaleTimeString())}
            </Time>
          }
          <Message
            key={message.id}
            message={message}
            user={message.user}
            showstime={messageShowsTime === message.id}
            onClick={() => setMessageShowsTime(prev => prev === message.id ? null : message.id)
            }
          />
        </span>
      )

  }

  // update last seen
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('users').doc(user.uid).set({
      // lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }
    )
    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    })

    setInput('')
    scrollToBottom()
  }

  return (
    <Container>

      <div className={`fixed z-50 bottom-16 ${showEmojiKeyboard ? "block" : "hidden"}`}>
        <div className="emojiButton" />
      </div>

      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar />
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <ActivityInfo>
              {recipient?.lastSeen?.toDate() ? (
                <>
                  Last active: {' '}
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                </>
              ) : (
                'Offline'
              )}</ActivityInfo>
          ) : (
            <p>Loading...</p>
          )}


        </HeaderInformation>

      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={bottomElmRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon onClick={() => setShowEmojiKeyboard(prev => !prev)} />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}> Send Message</button>
      </InputContainer>
    </Container >
  )
}

export default ChatScreen

const Container = tw.div``;

const Input = tw.input`
flex-1
items-center
p-2
border-none
bg-gray-100
rounded-md
mx-4
`;

const InputContainer = tw.form`
flex
items-center
p-3
fixed
bottom-0
bg-white
z-[100]
`;

const ActivityInfo = tw.p`
text-gray-400
mt-1
`;

const MessageContainer = tw.div`
p-7
bg-stone-300
min-h-[90vh]
flex
flex-col
`;

const Header = tw.div`
sticky
bg-white
z-[100]
top-0
flex
p-3.5
items-center
border-b
border-gray-100
`;

const HeaderInformation = tw.div`
flex-1
ml-4
`;

const HeaderIcons = tw.div`flex gap-2`;

const IconButton = tw.div``;

const EndOfMessage = tw.div`
h-5
`;

const Time = tw.span`
  text-center
  text-sm
  text-gray-400
  w-full
  mb-1
  absolute
  left-0
  right-0
  -translate-y-[110%]
`