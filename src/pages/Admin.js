import React, { useState } from 'react';
import Link from 'next/link';
import Modal from 'react-modal';
import { ClientContext, ClientContextProvider } from '../context/ClientContext'; 
import styles from '../styles/Admin.module.css'; 

function Component() {
  const { apiRequest } = React.useContext(ClientContext);

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [createLoading, setCreateLoading] = useState(false); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUserName('');
  };

  const handleCreateUser = () => {
    setCreateLoading(true); 
    apiRequest("POST", "/users/create", { nome: newUserName })
      .then(() => {
        closeModal();
        getUsers();
      })
      .catch((err) => {
        console.error('Error creating user:', err);
      })
      .finally(() => {
        setCreateLoading(false); 
      });
  };

  const getUsers = () => {
    setLoading(true);
    apiRequest("GET", "/users/list")
      .then((res) => {
        setUsers(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  const handleDelete = (userId) => {
    setLoading(true); 
    apiRequest("DELETE", "/users/delete/" + userId)
      .then(() => {
        getUsers();
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
      })
      .finally(() => {
        setLoading(false); 
      });
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

      <div className={styles.createButtonContainer}>
        <button onClick={openModal} className={styles.createButton} disabled={createLoading}>
          {createLoading ? 'Creating...' : 'Create'}
        </button>
      </div>

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
                      href={`/user/${formatUserName(user.nome)}?id=${user._id}`}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen || false}
        onRequestClose={() => closeModal()}
        contentLabel="Create User Modal"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <h2>Create User</h2>
        <label>
          Name:
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </label>
        <button onClick={handleCreateUser} disabled={createLoading}>
          {createLoading ? 'Creating...' : 'Create'}
        </button>
        <button onClick={closeModal} disabled={createLoading}>
          Cancel
        </button>
      </Modal>

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
