import { useAuthState } from "react-firebase-hooks/auth";
import tw from "tailwind-styled-components";
import { auth } from "/firebase";

function Message({ user, message, showsTime, onClick }) {

  const [loggedUser] = useAuthState(auth)

  return (

    <Container onClick={onClick} loggeduser={user === loggedUser.email ? 1 : 0} >
      <p>{message.message}</p>
    </Container>

  )
}

export default Message

const Container = tw.div`
  flex
  relative
  py-1.5
  px-3
  rounded-[19px]
  bg-opacity-100
  w-max
  max-w-[66%]
  my-1
  ${p => p.loggeduser ? 'bg-[#2020f0] self-end text-white' : 'bg-gray-200'}
`;


