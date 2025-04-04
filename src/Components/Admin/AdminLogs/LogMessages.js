import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../MyProvider";
function LogMessages() {
  const { id, docId } = useParams();
  const [logs, setLogs] = useState([]); // Get user ID from route parameters

  console.log(id, docId);
  useEffect(() => {
    if (!id) return;

    const userLogsRef = db
      .collection("Accounts")
      .doc(id)
      .collection("userLogs")
      .doc(docId)
      .collection("messages")
      .orderBy("timestamp", "asc");
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
  }, [id]);
  return (
    <div>
      <h2 className=" text-4xl font-bold text-center m-3">Log Messages</h2>
      {logs.length ? (
        <div className="flex flex-col items-center">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-400 p-3 my-2 w-1/2 text-left"
            >
              <p className="text-lg font-semibold">
                {new Date(log.timestamp).toLocaleString()}
              </p>
              <p className="text-sm">{log.message}</p>
              <p>{log.errorMessage ? `Error:${log.errorMessage}` : null}</p>
              {/* <p className="text-lg font-semibold">Message: {log.message}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No logs found</p>
      )}
    </div>
  );
}

export default LogMessages;
