import tw from 'tailwind-styled-components'
import SearchIcon from '@material-ui/icons/Search'
import { useRef, useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'


const Search = () => {
  const [user] = useAuthState(auth)
  const [searchedWord, setSarchedWord] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {

  }, [searchedWord, user])


  return (
    <>
      <SearchWrap>
        <SearchElms>
          <SearchIcon />
          <SearchInput placeholder="Search not work but look cool" onChange={e => setSarchedWord(e.target.value)} />
        </SearchElms>
      </SearchWrap>

    </>
  )
}
export default Search

const SearchWrap = tw.div`
flex
items-center
p-5

`

const SearchInput = tw.input`
  outline-0
  flex-1
  bg-gray-100
  flex-grow
`

const SearchElms = tw.div`
flex
items-center
gap-1
bg-gray-100
py-2
px-4
rounded-lg
w-full
`