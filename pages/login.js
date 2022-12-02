import tw from 'tailwind-styled-components'
import Head from 'next/head'
import { Button } from '@material-ui/core';
import { auth, provider } from '../firebase'

function Login() {

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png' />
        <Button variant='outlined' onClick={signIn}>Sign in with Google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login

const Container = tw.div`
grid
place-items-center
h-screen
bg-gray-100
`;
const LoginContainer = tw.div`
p-20
flex
items-center
flex-col
bg-white
rounded-[50px]
`

const Logo = tw.img`
w-32 
mb-16
h-32`;