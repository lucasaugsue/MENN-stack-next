import React from 'react';
import Link from 'next/link';
import { ClientContext, ClientContextProvider } from '../context/ClientContext'; 
import styles from '../styles/Admin.module.css'; 

function Component() {
  const { apiRequest } = React.useContext(ClientContext);

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getUsers = () => {
    setLoading(true);
    apiRequest("GET", "/users/list")
      .then((res) => {
        setUsers(res);
        setLoading(false);
        // console.log("res", res);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        // showNotification({message: err.message, color: 'red', autoClose: true})
      });
  };

  const handleDelete = (userId) => {
    console.log(`Deleting user with ID ${userId}`);
  };

  const formatUserName = (name) => {
    return name.replace(/\s+/g, '-').toLowerCase();
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h2>Welcome to the Admin Area!</h2>
      <p>This area is connected to the Node.js API with MongoDB. You can create new users here.</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Link</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${index}-${user._id}`} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td>{user._id}</td>
                  <td>{user.nome}</td>
                  <td>
                    <Link 
                      href={`${window.location.origin}/user/${formatUserName(user.nome)}?id=${user._id}`}
                    >
                      <div>{formatUserName(user.nome)}</div>
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  return (
    <ClientContextProvider>
      <Component />
    </ClientContextProvider>
  );
}
