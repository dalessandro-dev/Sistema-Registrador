import './style.css'
import { useEffect, useState, useRef} from 'react'
import api from './../../services/api.js'
import clsx from 'clsx'
import Select from 'react-select';
import Trash from './../../assets/trash.png'
import Pen from './../../assets/pen.png'
import ArrowBack from './../../assets/back.png'
import Load from './../../assets/load.gif'
import Computer from './../../assets/computer.png'
import NotFound from './../../assets/not-found.png'
import Void from './../../assets/void.png'

function Home() {
  const [users, setUsers] = useState([]) 
  const [active, setActive] = useState(false)
  const [idUserUpdate, setIdUserUpdate] = useState("")
  const [selected, setSelected] = useState(["name", "age", "email", "id"])
  const [activeError, setActiveError] = useState(false)
  const [activeSuccess, setActiveSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [alert, setAlert] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [voidData, setVoidData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const options = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'E-mail' },
    { value: 'age', label: 'Idade' },
  ];

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()
  const inputSearch = useRef()


  async function getUsers(search = "") {
    setLoading(true) 
    setUsers([])
    let usersFromApi
    search = search.trim()
    let uri = `/users?search=${search}`

    try {
      for (const filter of selected) {
        uri += `&field=${filter}`
      }

      usersFromApi = await api.get(uri)

      let dataLength = usersFromApi.data.length

      if (dataLength == 0 && search) {
        setNotFound(true)
      } else {
        setNotFound(false)
      }

      if (dataLength == 0) {
        setVoidData(true)
      } else {
        setVoidData(false)
      }

      setLoading(false)
      setUsers(usersFromApi.data)
    } catch(error) {
      setLoading(false)
      setError(true)

      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else if (error.request) {
        console.log("Erro: O servidor não está respondendo!")
        console.log(error.request)
      } else {
        console.log("Erro:", error.message)
      }
    }
  }


  async function postUsers(e) {
    e.preventDefault()

    try {
      await api.post("/users", {
        name: inputName.current.value.toUpperCase(),
        age:  Number(inputAge.current.value),
        email: inputEmail.current.value
      })

      alertMessage("success", "O usuário foi cadastrado com sucesso!")

      selectUserUpdate()

      getUsers()
    } catch(error) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data.message)
        alertMessage("error", "Erro: " + error.response.data.message)
      } else if (error.request) {
        console.log("Erro: O servidor não está respondendo!")
        console.log(error.request)
        alertMessage("error", "Erro: O servidor não está respondendo!")
      } else {
        console.log("Erro:", error.message)
        alertMessage("Erro:", error.message)
      }
    }
  }

  async function deleteUsers(id) {
    try {
      await api.delete(`/users/${id}`)

      alertMessage("success", "O usuário foi deletado com sucesso!")

      getUsers()
    } catch(error) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else if (error.request) {
        console.log("Erro: O servidor não está respondendo!")
        console.log(error.request)
      } else {
        console.log("Erro:", error.message)
      }
    }
  }

  async function updateUsers(e) {
    e.preventDefault()

    try {
      await api.put(`/users/${idUserUpdate}`, {
        name: inputName.current.value.toUpperCase(),
        age:  Number(inputAge.current.value),
        email: inputEmail.current.value
      })

      alertMessage("success", "O usuário foi atualizado com sucesso!")

      getUsers()

    } catch(error) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data.message)

        alertMessage("error", "Erro: " + error.response.data.message)
      } else if (error.request) {
        console.log("Erro: O servidor não está respondendo!")
        console.log(error.request)

        alertMessage("error", "Erro: O servidor não está respondendo!")
      } else {
        console.log("Erro:", error.message)

        alertMessage("Erro:", error.message)
      }
    }
  }

  const handleChange = (selectedOptions) => {
    const valuesSelected = selectedOptions.map(op => op.value)
    setSelected(valuesSelected)
  }

  function selectUserUpdate(userData = null){
    if (userData) {
      setActive(true)

      inputName.current.value = userData.name
      inputEmail.current.value = userData.email
      inputAge.current.value = userData.age

      setIdUserUpdate(userData.id)
    } else {
      inputName.current.value = ""
      inputEmail.current.value = ""
      inputAge.current.value = ""

      setIdUserUpdate("")

      setActive(false)
    }
  }

  function alertMessage(option, message) {
    if (option == "error") {
      setActiveError(true)
    } else if (option == "success") {
      setActiveSuccess(true)
    }

    setMessage(message)
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
  const alertTimer = setTimeout(() => {
    setAlert(true);
  }, 500);

  const resetTimer = setTimeout(() => {
    setActiveSuccess(false);
    setActiveError(false);
    setAlert(false);
  }, 4000);

  return () => {
    clearTimeout(alertTimer);
    clearTimeout(resetTimer);
  };

  }, [activeSuccess, activeError])

  return (
    <div className="alert-container">
      {(activeSuccess || activeError) && <div 
      className={clsx(activeSuccess && "alert-success", 
      activeError && "alert-danger", "alert", "alert-before", 
      alert && "alert-message")} 
      role="alert"> {message} 
      </div>}  
      <div className={clsx("container-main", (activeSuccess || activeError) && "h-with-alert")}>  
        <div className="shadow-lg register"> 
          <div className="header">
            {active && <button className="arrow-back bg-transparent border-0" onClick={() => selectUserUpdate()}> <img src={ArrowBack} /> </button>}
            <div className="title">
              <h1>{active ? <>Editar<br />Usuário</> : <>Registrar<br />Usuário</>} </h1>
            </div>
          </div>
          <div className="container-form">
            <form onSubmit={active ? updateUsers : postUsers}>
                <input name="name" type="text" className="form-control shadow-sm" id="floatingInputGroup2" placeholder="Nome" required ref={inputName} />
                <input name="email" type="email" className="form-control shadow-sm" id="floatingInputGroup2" placeholder="E-mail" required ref={inputEmail} />
                <input name="age" type="int" className="form-control shadow-sm" id="floatingInputGroup2" placeholder="Idade" required ref={inputAge} />
              
                <button type="submit" className="btn btn-primary">{active ? "Atualizar" : "Cadastrar"}</button>
            </form>
          </div>
        </div>
        <div className={clsx("div-search", (activeSuccess || activeError) && "h-with-alert")}>
          <div className="search-conteiner">
            <div className="search-bar">
              <input className="form-control mr-sm-2" type="search" placeholder="Digite o que deseja buscar..." aria-label="Search" ref={inputSearch}></input>
              <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => getUsers(inputSearch.current.value)}>Buscar</button>
            </div>
            <Select 
            className="select" 
            options={options} 
            isMulti
            onChange={handleChange} 
            noOptionsMessage={() => 'Nenhuma opção disponível'} 
            placeholder="Selecione os filtros que deseja aplicar..."
            />  
          </div>
          <div className="container-table">
            <table className="table">                
              <thead className="bg-dark radius-start radius-end teste">
                <tr className="th-start">
                <th scope="col" className="min-w radius-start bg-primary text-white">ID</th>
                <th scope="col" className="min-w bg-primary text-white">Nome</th>
                <th scope="col" className="min-w bg-primary text-white">E-mail</th>
                <th scope="col" className="min-w bg-primary text-white">Idade</th>
                <th scope="col" className="min-w bg-primary text-white">Editar</th>
                <th scope="col" className="min-w radius-end bg-primary text-white">Deletar</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                      <td scope="row">{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.age}</td>       
                      <td> 
                        <button onClick={() => selectUserUpdate(user)} className="btn">
                          <img className="icon" src={Pen}/>
                        </button> 
                      </td>
                      <td> 
                        <button onClick={() => deleteUsers(user.id)} className="btn">
                          <img className="icon" src={Trash}/>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>   
            {loading && <div className="div-load-error"><img className="icon" src={Load}/>Carregando...</div>}
            {error && <div className="div-load-error"> <img className="icon" src={Computer}/>Ops! Ocorreu um erro.</div>}
            {notFound && <div className="div-load-error"> <img className="icon" src={NotFound}/>Usuário não encontrado!</div>}
            {voidData && <div className="div-load-error"> <img className="icon" src={Void}/>Nenhum usuário foi cadastrado ainda.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home