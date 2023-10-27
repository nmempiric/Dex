import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

function Modal({ setModal, setDestToken, setSrcToken, modal }) {
  const [selectedToken, setSelectedToken] = useState("");
  const [search, setSearch] = useState("");
  const [newData, setNewData] = useState([]);

  // Fetch all tokens
  useEffect(() => {
    const fetchAllTokens = () => {
      const apiUrl = "http://localhost:3000/getalltokendetail";

      axios
        .get(apiUrl)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            if (data.tokenDetails) {
              setNewData(data.tokenDetails);
            } else {
              setNewData([]);
            }
          } else {
            console.log("Request failed with status:", response.status);
            setNewData([]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setNewData([]);
        });
    };

    fetchAllTokens();
  }, []);

  const handleItemClick = (token) => {
    console.log("token====", token);
    if (modal) {
      setSelectedToken(token);
      setDestToken(token);
    } else {
      setSelectedToken(token);
      setSrcToken(token);
    }
    setModal(false);
  };

  useEffect(() => {
    if (search === "") {
      setNewData(newData);
    } else {
      const filteredData = newData.filter(
        (tokenInfo) =>
          tokenInfo.Address === search ||
          tokenInfo.name.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredData.length > 0) {
        setNewData(filteredData);
      } else {
        setNewData([]);
      }
    }
  }, [search, newData]);

  return (
    <>
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
        {/* Modal */}
        <div className="bg-[#F1F2F3] dark:bg-gray-800 rounded-xl shadow-lg w-[20%]">
          {/* modal header */}
          <div className="border-b border-gray-700 px-4 py-4 text-center text-black">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold mb-3">Select Token</h3>
              <p onClick={() => setModal(false)}>
                <FaTimes />
              </p>
            </div>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className="px-5 py-2 text-black bg-[#F9F9F9] text-lg rounded-3xl border border-gray-600 outline-none"
              placeholder="Enter Address Of Token"
            />
          </div>
          {/* modal body */}
          <div className="p-5">
            {/* List of items */}
            {newData.length === 0 && (
              <p className="text-lg text-black items-center">
                No results found.
              </p>
            )}
            {newData.length !== 0 &&
              newData.map((token) => (
                <div
                  key={token.name}
                  onClick={() => handleItemClick(token.name)}
                  className={`flex items-center cursor-pointer p-1 mb-3 rounded-2xl ${
                    selectedToken === token.name
                      ? "bg-blue-500 text-black"
                      : "bg-gray-200"
                  }`}
                >
                  <img
                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png"
                    className="w-12 h-12 rounded-full mr-4"
                    alt="token-logo"
                  />
                  <div>
                    <p className="text-lg text-black">{token.name}</p>
                    <p
                      className="text-sm text-black"
                      style={{ marginLeft: "10px" }}
                    >
                      {token.symbol}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
