import { Avatar, Button, IconButton } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat'
import * as EmailValidator from 'email-validator'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import tw from 'tailwind-styled-components'
import SearchIcon from '@material-ui/icons/Search'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'

function Sidebar() {
  const [user] = useAuthState(auth)
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
  const [chatsSnapshot] = useCollection(userChatRef)


  const createChat = () => {
    const input = prompt('Please enter an email address for the user you with to chat with')

    if (!input) return null;

    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      // we need to add the chat into the DB 'chats' collection
      db.collection('chats').add({
        users: [user.email, input],
      })
    }

  }

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      chat =>
        chat.data().users.find(
          user =>
            user === recipientEmail)?.length > 0)


  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>
      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
      {/* List of Chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebar

const Container = tw.div`
flex-[0.45]
border-r
border-gray-100
h-screen
min-w-[300px]
max-w-[350px]
overflow-y-scroll
`;

const Header = tw.div`
  flex
  sticky
  top-0
  bg-white
  z-[1]
  justify-between
  items-center
  p-4
  border-b
  h-20
  border-gray-100

`;

const UserAvatar = tw(Avatar)`
cursor-pointer
hover:opacity-80
`;

const IconsContainer = tw.div`

`;

const Search = tw.div`
flex
items-center
p-5

`

const SearchInput = tw.input`
  outline-0
  flex-1
`

const SidebarButton = tw(Button)`
  w-full

`