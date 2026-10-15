import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [selectedFolder, setSelectedFolder] =
    useState("");

  const [folderName, setFolderName] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activities, setActivities] =
    useState([]);

  const [storageUsed, setStorageUsed] =
    useState(0);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [activeTab, setActiveTab] =
    useState("files");

    const [userName, setUserName] =
  useState("DriveSphere User");

const [notifications, setNotifications] =
  useState(true);

  // =========================
  // FETCH FILES
  // =========================

  const fetchFiles = async () => {

    try {

      const response =
        await fetch(
          "http://127.0.0.1:5000/files"
        );

      const data =
        await response.json();

      setFiles(data);

      let total = 0;

      data.forEach(file => {

        total += Number(
          file.size || 0
        );

      });

      setStorageUsed(
        total.toFixed(2)
      );

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // FETCH FOLDERS
  // =========================

  const fetchFolders = async () => {

    try {

      const response =
        await fetch(
          "http://127.0.0.1:5000/folders"
        );

      const data =
        await response.json();

      setFolders(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchFiles();
    fetchFolders();

  }, []);

  // =========================
  // UPLOAD FILE
  // =========================

  const uploadFile = async () => {

    if (!selectedFile) {

      alert("Select File");
      return;

    }

    if (!selectedFolder) {

      alert("Select Folder");
      return;

    }

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    formData.append(
      "folder",
      selectedFolder
    );

    try {

      await fetch(
        "http://127.0.0.1:5000/upload",
        {
          method: "POST",
          body: formData
        }
      );

      setActivities(prev => [

        {
          text:
            `Uploaded ${selectedFile.name}`,
          time:
            new Date().toLocaleTimeString()
        },

        ...prev

      ]);

      fetchFiles();

      alert(
        "File Uploaded Successfully"
      );

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // CREATE FOLDER
  // =========================

  const createFolder = async () => {

    if (!folderName) {

      alert(
        "Enter Folder Name"
      );

      return;

    }

    try {

      await fetch(
        "http://127.0.0.1:5000/create-folder",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name: folderName
          })
        }
      );

      setActivities(prev => [

        {
          text:
            `Created Folder ${folderName}`,
          time:
            new Date().toLocaleTimeString()
        },

        ...prev

      ]);

      fetchFolders();

      setFolderName("");

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // OPEN FOLDER
  // =========================

  const openFolder = (
    folderName
  ) => {

    setSelectedFolder(
      folderName
    );

    setActivePage(
      "files"
    );

  };

  // =========================
  // DOWNLOAD FILE
  // =========================

  const downloadFile = (
    file
  ) => {

    window.open(
      `http://127.0.0.1:5000/download/${file.folder}/${file.name}`,
      "_blank"
    );

  };

  // =========================
  // SHARE FILE
  // =========================

  const shareFile = (
    file
  ) => {

    const link =
      `http://127.0.0.1:5000/download/${file.folder}/${file.name}`;

    navigator.clipboard.writeText(
      link
    );

    alert(
      "Link Copied"
    );

  };

  // =========================
  // DELETE FILE
  // =========================

  const deleteFile = async (
    file
  ) => {

    try {

      await fetch(
        "http://127.0.0.1:5000/delete-file",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            folder:
              file.folder,

            filename:
              file.name

          })
        }
      );

      setActivities(prev => [

        {
          text:
            `Deleted ${file.name}`,
          time:
            new Date().toLocaleTimeString()
        },

        ...prev

      ]);

      fetchFiles();

      alert(
        "File Deleted"
      );

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // DELETE FOLDER
  // =========================

  const deleteFolder = async (
    folder
  ) => {

    try {

      await fetch(
        "http://127.0.0.1:5000/delete-folder",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            folder
          })
        }
      );

      fetchFolders();
      fetchFiles();

      alert(
        "Folder Deleted"
      );

    } catch (error) {

      console.log(error);

    }

  };
const maxStorage = 50000;

const storagePercent =
  ((storageUsed / maxStorage) * 100).toFixed(2);

const averageFileSize =
  files.length > 0
    ? (
        files.reduce(
          (sum, file) =>
            sum + Number(file.size || 0),
          0
        ) / files.length
      ).toFixed(2)
    : 0;

const largestFile =
  files.length > 0
    ? files.reduce((a, b) =>
        Number(a.size) >
        Number(b.size)
          ? a
          : b
      )
    : null;
  return (

<div className="home">

  {/* SIDEBAR */}

  <aside className="sidebar">

    <div className="logo">
      <h2>☁ DriveSphere</h2>
    </div>

    <ul className="sidebar-menu">

      <li onClick={() => setActivePage("dashboard")}>
        🏠 Dashboard
      </li>

      <li onClick={() => setActivePage("files")}>
        📁 My Files
      </li>

      <li onClick={() => setActivePage("folders")}>
        📂 Folders
      </li>

      <li onClick={() => setActivePage("uploads")}>
        📤 Uploads
      </li>

      <li onClick={() => setActivePage("analytics")}>
        📊 Analytics
      </li>

      <li onClick={() => setActivePage("settings")}>
        ⚙ Settings
      </li>

    </ul>

    <div className="storage-widget">

      <h4>Your Storage</h4>

      <div className="storage-bar">

        <div
          className="storage-fill"
          style={{
            width:
              `${Math.min(
                (storageUsed / 50000) * 100,
                100
              )}%`
          }}
        ></div>

      </div>

      <p>
        {storageUsed} KB Used
      </p>

    </div>

  </aside>

  {/* MAIN */}

  <div className="main-content">

    <div className="topbar">

      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <button
        className="upload-btn"
        onClick={() =>
          setActivePage("uploads")
        }
      >
        Add File
      </button>

    </div>

    <div className="page-header">

      <h1>My Drive</h1>

      <p>
        Manage all your folders and files
      </p>

    </div>

    {/* TABS */}

    <div className="tabs">

      <span
        className={
          activeTab === "files"
            ? "tab active-tab"
            : "tab"
        }
        onClick={() =>
          setActiveTab("files")
        }
      >
        Files
      </span>

      <span
        className={
          activeTab === "activities"
            ? "tab active-tab"
            : "tab"
        }
        onClick={() =>
          setActiveTab("activities")
        }
      >
        Activities
      </span>

      <span
        className={
          activeTab === "overview"
            ? "tab active-tab"
            : "tab"
        }
        onClick={() =>
          setActiveTab("overview")
        }
      >
        Overview
      </span>

    </div>

    {/* FOLDERS */}

    {(activePage === "dashboard" ||
      activePage === "folders") && (

      <>
        <div className="section-header">
          <h3>Folders</h3>
        </div>

        <div className="folder-grid">

          {folders.map(
            (folder, index) => (

              <div
                key={index}
                className="folder-card"
                onClick={() =>
                  openFolder(
                    folder.name
                  )
                }
              >

                <div className="folder-icon">
                  📁
                </div>

                <div>

                  <h4>
                    {folder.name}
                  </h4>

                  <small>
                    Folder
                  </small>

                </div>

                <button
                  onClick={(e) => {

                    e.stopPropagation();

                    deleteFolder(
                      folder.name
                    );

                  }}
                >
                  Delete
                </button>

              </div>

            )
          )}

          <div className="add-folder-card">

            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) =>
                setFolderName(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                createFolder
              }
            >
              + Create Folder
            </button>

          </div>

        </div>

      </>
    )}

    {/* FILES */}

    {(activePage === "dashboard" ||
      activePage === "files") && (

      <>
        <div className="section-header">
          <h3>Files</h3>
        </div>

        <div className="file-grid">

          {files

            .filter(file =>
              selectedFolder
                ? file.folder ===
                  selectedFolder
                : true
            )

            .filter(file =>
              file.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )

            .map(
              (
                file,
                index
              ) => (

                <div
                  key={index}
                  className="file-card"
                >

                  <div className="file-icon">
                    📄
                  </div>

                  <h4>
                    {file.name}
                  </h4>

                  <small>
                    {file.size}
                    KB
                  </small>

                  <p>
                    {file.folder}
                  </p>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "5px",
                      flexWrap:
                        "wrap"
                    }}
                  >

                    <button
                      onClick={() =>
                        downloadFile(
                          file
                        )
                      }
                    >
                      Download
                    </button>

                    <button
                      onClick={() =>
                        shareFile(
                          file
                        )
                      }
                    >
                      Share
                    </button>

                    <button
                      onClick={() =>
                        deleteFile(
                          file
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

        </div>

      </>
    )}

    {/* ANALYTICS */}

    {/* ANALYTICS */}

{activePage ===
  "analytics" && (

  <div
    className="activity-panel"
  >

    <h3>
      Analytics
    </h3>

    <p>
      Total Files:
      {files.length}
    </p>

    <p>
      Total Folders:
      {folders.length}
    </p>

    <p>
      Storage Used:
      {storageUsed}
      KB
    </p>

    <p>
      Storage Usage:
      {storagePercent}%
    </p>

    <p>
      Average File Size:
      {averageFileSize}
      KB
    </p>

    <p>
      Largest File:
      {largestFile
        ? `${largestFile.name} (${largestFile.size} KB)`
        : "No Files"}
    </p>

    <h4>
      File Types
    </h4>

    {[
      ...new Set(
        files.map(file =>
          file.name
            .split(".")
            .pop()
        )
      )
    ].map(type => (

      <p key={type}>
        {type.toUpperCase()} :
        {
          files.filter(
            file =>
              file.name
                .endsWith(type)
          ).length
        }
      </p>

    ))}

  </div>

)}

    {/* SETTINGS */}

    {/* SETTINGS */}

{activePage === "settings" && (

  <div className="activity-panel">

    <h3>Settings</h3>

    <div style={{ marginBottom: "15px" }}>
      <p>User Name</p>

      <input
        type="text"
        value={userName}
        onChange={(e) =>
          setUserName(e.target.value)
        }
        placeholder="Enter User Name"
      />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <p>Notifications</p>

      <button
        onClick={() =>
          setNotifications(!notifications)
        }
      >
        {notifications
          ? "Disable Notifications"
          : "Enable Notifications"}
      </button>
    </div>

    <div style={{ marginBottom: "15px" }}>
      <p>Activity History</p>

      <button
        onClick={() =>
          setActivities([])
        }
      >
        Clear Activities
      </button>
    </div>

    <div style={{ marginBottom: "15px" }}>
      <p>Drive Information</p>

      <p>Total Files: {files.length}</p>

      <p>Total Folders: {folders.length}</p>

      <p>Storage Used: {storageUsed} KB</p>
    </div>

  </div>

)}
  </div>

  {/* RIGHT PANEL */}

  <div className="right-panel">

    <div className="upload-card">

      <h3>
        Upload File
      </h3>

      <input
        type="file"
        onChange={(e) =>
          setSelectedFile(
            e.target.files[0]
          )
        }
      />

      <select
        value={selectedFolder}
        onChange={(e) =>
          setSelectedFolder(
            e.target.value
          )
        }
      >

        <option value="">
          Select Folder
        </option>

        {folders.map(
          (folder, index) => (

            <option
              key={index}
              value={folder.name}
            >
              {folder.name}
            </option>

          )
        )}

      </select>

      <button
        className="upload-file-btn"
        onClick={uploadFile}
      >
        Upload
      </button>

    </div>

    <div className="activity-panel">

      <h3>
        Recent Activity
      </h3>

      {activities.length ===
      0 ? (

        <div className="empty-box">
          No Activity Yet
        </div>

      ) : (

        activities.map(
          (
            activity,
            index
          ) => (

            <div
              key={index}
              className="activity-item"
            >

              <strong>
                {activity.text}
              </strong>

              <br />

              <small>
                {activity.time}
              </small>

            </div>

          )
        )

      )}

    </div>

    <div className="quick-stats">

      <div className="mini-card">

        <h4>
          Files
        </h4>

        <h2>
          {files.length}
        </h2>

      </div>

      <div className="mini-card">

        <h4>
          Folders
        </h4>

        <h2>
          {folders.length}
        </h2>

      </div>

    </div>

  </div>

</div>

  );

}

export default Home;