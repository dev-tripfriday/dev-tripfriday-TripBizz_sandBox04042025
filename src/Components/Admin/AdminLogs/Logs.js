import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../MyProvider"; // Ensure Firestore is correctly imported

function Logs() {
  const [logs, setLogs] = useState([]);
  const { id } = useParams(); // Get user ID from route parameters
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    const userLogsRef = db
      .collection("Accounts")
      .doc(id)
      .collection("userLogs")
      .orderBy("dateTime", "desc");
    // Ensure logs are ordered by timestamp

    // Fetch existing userLogs first
    userLogsRef.get().then((querySnapshot) => {
      const initialLogs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(initialLogs); // Set only unique logs initially
    });

    // Listen for new userLogs in real-time
    const unsubscribe = userLogsRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setLogs((prevLogs) => {
            // Check if the document is already in the state
            if (!prevLogs.some((log) => log.id === change.doc.id)) {
              return [...prevLogs, { id: change.doc.id, ...change.doc.data() }];
            }
            return prevLogs; // Avoid duplication
          });
        }
      });
    });

    return () => unsubscribe(); // Cleanup listener when unmounting
  }, [id]); // Ensure useEffect runs when `id` changes

  return (
    <div>
      <h2 className=" text-4xl font-bold text-center m-3">User Logs</h2>
      {logs.length ? (
        <div className="flex flex-col items-center">
          {logs.map((log) => (
            <button
              key={log.id}
              className="border border-gray-400 p-3 my-2 w-1/2 text-left"
              onClick={() => navigate(`logMessages/${log.id}`)} // Log the message when clicked
            >
              <p className="text-sm">threadId:{log.id}</p>
              <p className="text-lg font-semibold">
                {new Date(log.dateTime).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center">No logs found</p>
      )}
    </div>
  );
}

export default Logs;
