import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ClientContext, ClientContextProvider } from '../../context/ClientContext'; 
import styles from '../../styles/User.module.css'; 

function UserProfile() {
  const params = useRouter().query;
  const { apiRequest } = React.useContext(ClientContext);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    if (params) {
      setLoading(true);
      apiRequest("GET", `/users/get-by-id/${params.id}`)
        .then((res) => {
          setUserData(res);
          setLoading(false);
          // console.log("User data:", res);
        })
        .catch((err) => {
          setLoading(false);
          // console.error("Error fetching user data:", err);
        });
    }
  }, [params]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found.</p>;
  }

  return (
    <div className={styles.userProfileContainer}>
      <h1>{`This is the user page for ${userData.nome}!`}</h1>
      <p>{`The ID is ${userData._id}.`}</p>
      <Link href="/">Return to home</Link>
    </div>
  );
}

export default function User() {
  return (
    <ClientContextProvider>
      <UserProfile />
    </ClientContextProvider>
  );
}
