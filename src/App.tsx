import { Person, peopleData } from "./bigList"
import { FastContextProvider, createFastContext, useFastContext } from "./fastContext"


type ContextType = {
  firstName: string
  lastName: string
  age: string
}

type PeopleContextType = {
  selectedPerson: string
  people: Person[]
}

const context = createFastContext<ContextType | undefined>(undefined)
const peopleContext = createFastContext<PeopleContextType | undefined>(undefined)

function App() {

  return (
    <FastContextProvider fastContext={context}
      value={{ firstName: 'John', lastName: 'Doe', age: '42' }}
    >
      <FastContextProvider fastContext={peopleContext}
        value={{
          selectedPerson: '',
          people: peopleData
        }}>
        <Container>
          <DataForm />
        </Container>
      </FastContextProvider>
    </FastContextProvider>
  )
}

function Container(props: { children: React.ReactNode }) {
  console.log('Container render')
  return <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'lightblue',
    }}
  >{props.children}</div>
}

function DataForm() {
  console.log('DataForm render')
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'lightblue',
      }}
    >
      <div>
        <DataText label="First Name" dataKey="firstName" />
        <DataText label="Last Name" dataKey="lastName" />
        <DataText label="Age" dataKey="age" />
        <DataDisplay label="First Name" dataKey="firstName" />
        <DataDisplay label="Last Name" dataKey="lastName" />
        <DataDisplay label="Age" dataKey="age" />
      </div>
      <h2>People</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'lightblue',
          maxHeight: '500px',
          overflowY: 'scroll',
          border: '1px solid black',
        }}
      >
        <PeopleList />
      </div>
    </div>
  )
}

function DataDisplay<T extends keyof ContextType>(props: { label: string, dataKey: T }) {
  const [state] = useFastContext(context, (store) => store?.[props.dataKey])
  console.log('DataDisplay render', props.dataKey)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'lightblue',
      }}
    >
      <label>{props.label}</label>
      <div>{state}</div>
    </div>
  )
}

function DataText<T extends keyof ContextType>(props: { label: string, dataKey: T }) {
  const [state, setState] = useFastContext(context, (store) => store?.[props.dataKey])
  console.log('DataText render', props.dataKey)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'lightblue',
      }}
    >
      <label>{props.label}</label>
      <input
        value={state}
        onChange={(e) => setState({ [props.dataKey]: e.target.value })}
      />
    </div>
  )
}


function PeopleList() {
  const [state] = useFastContext(peopleContext, (store) => store?.people)
  console.log('PeopleList render')
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'lightblue',
      }}
    >
      {state?.map((person) => <PersonRow key={person.userId} person={person} />)}
    </div>
  )
}

function PersonRow(props: { person: Person }) {
  const [state, setState] = useFastContext(peopleContext, (store) => store?.selectedPerson === props.person.userId)
  console.log('PersonRow render', props.person.userId)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'lightblue',
      }}
    >
      <input
        type="radio"
        checked={state}
        onChange={() => setState({ selectedPerson: props.person.userId })}
      />
      <div>{props.person.name}</div>
      <div>{props.person.city}</div>
      <div>{props.person.age}</div>
    </div>
  )
}

export default App
