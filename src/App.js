import React, { useState } from "react";
import "./App.css";
import { data } from "./data";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

function App() {
  const itemPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;

  // initializing the actualData with data coming from data.js file
  const [actualData, setActualData] = useState(data);

  // display data will contain only 10 data from starting index to endIndex
  let displayData = actualData.slice(startIndex, endIndex);

  // It will count the number of pages require according to data length.
  const pageCount = Math.ceil(actualData.length / itemPerPage);

  // array that will contain data index which will be deleted after pressing deleteSelected button
  const [dataToBeDeleted, setDataToBeDeleted] = useState([]);

  const [isDisabled, setIsDisabled] = useState(-1);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [show, setShow] = useState(false);

  // This function will help to go to the next page, specific page and previous page
  const handleChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // This function is useful when we perform search by the name, email and role
  const handleSearch = (searchFor) => {
    let searchValue = searchFor.toLowerCase();
    if (searchValue === "") {
      setActualData(data);
    }
    let searchProducts = data.filter(({ name, email, role }) => {
      return (
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        role.toLowerCase().includes(searchValue)
      );
    });
    setActualData(searchProducts);
  };

  // This function will use to search data. it will prevent onChange handler to make api request for every key press.
  const debounceSearch = (event, debounceTime) => {
    if (debounceTime) {
      clearTimeout(debounceTime);
    }
    setTimeout(() => {
      handleSearch(event.target.value);
    }, debounceTime);
  };

  // To select data that we want to deleted in batch
  const handleCheck = (e) => {
    if (e.target.checked) {
      setDataToBeDeleted([...dataToBeDeleted, e.target.value]);
    } else {
      alert("no");
    }
  };

  // To delete the data 
  const handleDelete = (dataToDelete) => {
    let newData = actualData.filter((data) => !dataToDelete.includes(data.id));
    setActualData(newData);
    setDataToBeDeleted([]);
  };

  // this function will perform edit operation 
  const handleEdit = (data) => {
    setShow(true);
    setIsDisabled(data.id);
    setEditData({
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  // once you edit the value of the data you press done button and this handler will be called.
  const handleEditDone = (data) => {
    let arr = [...actualData];
    arr[data.id - 1] = { data };
    setActualData(arr);
    setIsDisabled(-1)
    setShow(false);
  };

  return (
    <div className="App">
      <div className="search">
        <input
          type="text"
          placeholder="Search by name, email, role"
          onChange={(e) => {
            debounceSearch(e, 500);
          }}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((data, i) => {
            return (
              <tr
                className={`${
                  isDisabled === data.id ? "dataField-edit" : "dataField"
                }`}
              >
                <th>
                  <input
                    type="checkbox"
                    value={data.id}
                    onChange={(e) => {
                      handleCheck(e);
                    }}
                    checked={dataToBeDeleted.includes(data.id)}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    value={isDisabled === data.id ? editData.name : data.name}
                    disabled={isDisabled !== data.id}
                    onChange={(e) => {
                      setEditData({ ...editData, name: e.target.value });
                    }}
                  />
                </th>
                <th>
                  <input
                    type="email"
                    value={isDisabled === data.id ? editData.email : data.email}
                    disabled={isDisabled !== data.id}
                    onChange={(e) => {
                      setEditData({ ...editData, email: e.target.value });
                    }}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    value={isDisabled === data.id ? editData.role : data.role}
                    disabled={isDisabled !== data.id}
                    onChange={(e) => {
                      setEditData({ ...editData, role: e.target.value });
                    }}
                  />
                </th>
                <th className="deleteAndEdit">
                  <button>
                    {!show ? (
                      <BorderColorOutlinedIcon
                        onClick={() => {
                          handleEdit(data);
                        }}
                      />
                    ) : (
                      show &&
                      isDisabled === data.id && (
                        <DownloadDoneIcon
                          onClick={() => {
                            handleEditDone(data);
                          }}
                        />
                      )
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete([data.id]);
                    }}
                  >
                    <DeleteOutlinedIcon />
                  </button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="actionButtons">
        <div className="deleteButton">

        <button
          style={{ borderRadius: "5px", backgroundColor: "red" }}
          className=""
          onClick={() => {
            handleDelete(dataToBeDeleted);
          }}
          >
          Delete Selected
        </button>
          </div>
<div className="page-count-button">

        <button
          onClick={() => {
            let page = currentPage === 1 ? 5 : currentPage - 1;
            handleChange(page);
          }}
          style={{color:"#009879", padding:'5px'}}
          >
          <ArrowBackIosNewOutlinedIcon />
        </button>
        {Array.from({ length: pageCount }, (_, i) => {
          return (
            <button
            className={`${i + 1 === currentPage ? "active" : "non-active"}`}
            key={i}
            onClick={() => handleChange(i + 1)}
            >
              {i + 1}
            </button>
          );
        })}
        <button
          onClick={() => {
            handleChange((currentPage % 5) + 1);
          }}
          style={{color:"#009879", padding:'5px'}}
          >
          <ArrowForwardIosOutlinedIcon />
        </button>
            </div>
        <a style={{color:"#009879"}} href="https://github.com/RajultThakur" blank>
          <div style={{fontWeight:"bold"}}>Made by Rajul Thakur <span style={{color:"red", fontSize:"18px"}}>❤</span></div></a>
      </div>
    </div>
  );
}

export default App;
